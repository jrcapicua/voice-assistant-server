import { Router } from "express";
import { upload } from "../middlewares/multerConfig";
import { handleVoice } from "../controllers/voiceController";

const router = Router();

router.post("/", upload.single("audio"), handleVoice);

export default router;
