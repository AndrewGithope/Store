const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY is not defined!');
  process.exit(1);
}

try {
  let content = fs.readFileSync(envPath, 'utf8');
  content = content.replace(/geminiApiKey:\s*['"].*?['"]/, `geminiApiKey: '${apiKey}'`);
  fs.writeFileSync(envPath, content);
  console.log('SUCCESS: API key injected!');
} catch (err) {
  console.error('ERROR reading or writing environment file:', err);
  process.exit(1);
}