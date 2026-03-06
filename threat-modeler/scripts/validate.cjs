const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: No file path provided.');
  process.exit(1);
}

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for bad control characters (like unescaped newlines in strings)
  const cleanedContent = content.replace(/[\x00-\x1F\x7F-\x9F]/g, (match) => {
    if (match === '\n') return '\\n';
    if (match === '\r') return '\\r';
    if (match === '\t') return '\\t';
    return '';
  });

  const parsed = JSON.parse(cleanedContent);
  
  if (!parsed.nodes || !parsed.edges) {
    throw new Error('Invalid Board JSON: Missing nodes or edges array.');
  }

  // Rewrite validated and cleaned JSON
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
  console.log(`Success: JSON validated and cleaned at ${filePath}`);
} catch (error) {
  console.error(`Validation Failed: ${error.message}`);
  process.exit(1);
}
