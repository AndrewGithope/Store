const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'src', 'environments', 'environment.ts');

// Забираем ключ и жестко вычищаем ВСЕ пробелы и переносы строк
const rawKey = process.env.GEMINI_API_KEY || '';
const cleanKey = rawKey.replace(/\s+/g, '').trim();

if (!cleanKey) {
  console.error('ERROR: GEMINI_API_KEY is empty!');
  process.exit(1);
}

const fileContent = `export const environment = {
  production: true,
  geminiApiKey: '${cleanKey}'
};
`;

try {
  fs.writeFileSync(envPath, fileContent, 'utf8');
  console.log('SUCCESS: Clean API key injected without spaces!');
} catch (err) {
  console.error('ERROR writing environment file:', err);
  process.exit(1);
}