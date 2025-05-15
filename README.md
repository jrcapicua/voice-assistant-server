# Server – Voice Assistant Backend

This project is the backend for the Voice Assistant application. It is built with **Node.js**, **Express**, and **TypeScript**. It exposes endpoints to process audio and handle the voice assistant logic.

## Features

- RESTful API for voice processing.
- Audio file handling using Multer.
- Data validation with Zod.
- Integration with [groq-sdk](https://github.com/groq/groq-sdk) for advanced processing.
- Error handling middleware.

## Requirements

- Node.js >= 18.x
- npm >= 9.x

## Installation

```bash
npm install
```

## Available Scripts

- `npm run dev` – Starts the server in development mode with auto-reload.
- `npm run build` – Compiles the TypeScript project to JavaScript.
- `npm start` – Runs the server in production mode (requires prior build).

## Main Dependencies

- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer) (file handling)
- [groq-sdk](https://github.com/groq/groq-sdk) (voice processing)
- [zod-form-data](https://github.com/colinhacks/zod-form-data) (form validation)
- [CORS](https://github.com/expressjs/cors)

## Folder Structure

- `src/` – Main source code.
- `src/controllers/` – Route controllers.
- `src/routes/` – API route definitions.
- `src/middlewares/` – Custom middlewares.
- `src/schemas/` – Validation schemas.
- `src/utils/` – Utilities and external clients.
- `src/config/` – App configuration.

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The server will listen by default at [http://localhost:3000](http://localhost:3000).

3. For production:
   ```bash
   npm run build
   npm start
   ```

## Notes

- Make sure to configure any required environment variables in a `.env` file if needed.
- This backend is intended to be consumed by the frontend located in the `client/` folder.
