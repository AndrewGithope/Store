const fs = require('fs');
const path = './src/environments/environment.ts';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY is not defined in environment variables!');
  process.exit(1);
}

try {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/geminiApiKey:\s*['"].*?['"]/, `geminiApiKey: '${apiKey}'`);
  fs.writeFileSync(path, content);
  console.log('SUCCESS: API key injected into environment.ts successfully!');
} catch (err) {
  console.error('ERROR reading or writing environment file:', err);
  process.exit(1);
}