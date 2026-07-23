const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY is missing!');
  process.exit(1);
}

// Перезаписываем файл целиком, а не через replace
const fileContent = `export const environment = {
  production: true,
  geminiApiKey: '${apiKey.trim()}'
};
`;

try {
  fs.writeFileSync(envPath, fileContent, 'utf8');
  console.log('SUCCESS: API key injected securely!');
} catch (err) {
  console.error('ERROR writing environment file:', err);
  process.exit(1);
}