# API Configuration - COGNIX

**COGNIX - AI Assistant powered by Kriszz**

## Current Setup

Your OpenRouter API key is securely configured in the application at:
```
src/config/api.js
```

## API Key Details
- **Service**: OpenRouter
- **Key**: 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
- **Status**: Active and configured

## To Update the API Key

If you need to change the API key in the future:

1. Open `src/config/api.js`
2. Update the `OPENROUTER_API_KEY` value
3. Save the file - the app will hot-reload automatically

## Available Models

The application supports multiple AI models:
- GPT-3.5 Turbo (default)
- GPT-4
- GPT-4 Turbo
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku
- Gemini Pro
- Llama 3 70B
- Mixtral 8x7B

Users can select their preferred model from the settings panel.

## Security Notes

- The API key is embedded in the application code
- For production deployment, consider using environment variables
- Keep the `src/config/api.js` file secure and don't commit it to public repositories
- Add `src/config/api.js` to `.gitignore` if sharing the code publicly

## Cost Management

- Different models have different costs per token
- Monitor your usage at: https://openrouter.ai/activity
- Set spending limits in your OpenRouter dashboard
