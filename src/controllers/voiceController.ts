import { groq } from "../utils/groqClient";
import { formSchema } from "../schemas/formSchema";
import { Request, Response } from "express";

export const handleVoice = async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(2, 10);
  console.time(`transcribe ${requestId}`);

  try {
    const formData = new FormData();
    if (req.file) {
      const file = new File([req.file.buffer], req.file.originalname, {
        type: req.file.mimetype,
      });
      formData.set("audio", file);
    }
    if (req.body.messageHistory) {
      formData.set("messageHistory", req.body.messageHistory);
    }
    if (req.body.ttsEnabled) {
      formData.set("ttsEnabled", req.body.ttsEnabled);
    }

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      console.error("Invalid request data:", JSON.stringify(result.error));
      res.status(400).json({ error: "Invalid request data" });
    }

    const { audio, messageHistory, ttsEnabled = true } = result.data!;

    let transcript = "";
    let userInput = "";

    if (audio) {
      // Audio flow: transcribe
      const transcriptionFile = new File([audio], "audio.wav", {
        type: "audio/wav",
      });

      const transcriptionResult = await groq.audio.transcriptions.create({
        file: transcriptionFile,
        model: "whisper-large-v3-turbo",
        language: 'en',
        temperature: 0.0,
      });

      transcript = transcriptionResult.text.trim();
      if (!transcript) {
        res.status(400).json({ error: "No speech detected in audio" });
        return;
      }
      userInput = transcript;
      console.timeEnd(`transcribe ${requestId}`);
    } else {
      // Text flow: use last message from history
      if (!messageHistory || !Array.isArray(messageHistory) || messageHistory.length === 0) {
        res.status(400).json({ error: "No input provided" });
        return;
      }
      // Find the last user message
      const lastUserMsg = [...messageHistory].reverse().find((m: any) => m.role === "user");
      if (!lastUserMsg) {
        res.status(400).json({ error: "No user message found" });
        return;
      }
      userInput = lastUserMsg.content;
      transcript = ""; // No transcript
    }

    console.time(`llm ${requestId}`);

    const cleanedMessageHistory = (messageHistory || []).map(
      ({ role, content }: { role: string; content: string }) => ({ role, content })
    );

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are a helpful voice AI assistant.
          - Keep responses short, concise and to the point.
          - Today's date is ${new Date().toISOString().split("T")[0]}.`,
        },
        ...cleanedMessageHistory,
        { role: "user", content: userInput },
      ],
    });

    const responseText = completion.choices[0].message.content || "";
    console.timeEnd(`llm ${requestId}`);

    const skipAudio = req.header("X-Skip-Audio") === "true" || !ttsEnabled;
    if (skipAudio || !audio) {
      // If there is no audio, or if TTS is skipped, respond with text only
      res.json({ transcript, response: responseText, audioUrl: null });
      return;
    }

    // Only generate TTS if there is audio and it is not skipped
    console.time(`tts ${requestId}`);
    const ttsResponse = await groq.audio.speech.create({
      model: "playai-tts",
      voice: "Fritz-PlayAI",
      input: responseText,
      response_format: "wav",
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    console.timeEnd(`tts ${requestId}`);

    // Validar tamaño del audio generado
    if (audioBuffer.byteLength <= 100) {
      console.error("TTS audio buffer too small, possible synthesis failure.");
      res.json({ transcript, response: responseText, audioUrl: null });
      return;
    }

    console.log("Transcript:", transcript)
    console.log("Response:", responseText)

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.byteLength.toString(),
      "X-Transcript": encodeURIComponent(transcript),
      "X-Response": encodeURIComponent(responseText),
      "Access-Control-Expose-Headers": "X-Transcript, X-Response"
    });

    res.send(audioBuffer);
  } catch (err) {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
