import { zfd } from "zod-form-data";

export const formSchema = zfd.formData({
  audio: zfd.file().optional(),
  messageHistory: zfd.text()
    .transform((val: string) => {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    })
    .optional(),
  ttsEnabled: zfd.text()
    .transform((val: string) => val === "true")
    .optional(),
});
