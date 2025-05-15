import Groq from "groq-sdk";
import config from '../config/config';

export const groq = new Groq({
  apiKey: config.groqApiKey,
});