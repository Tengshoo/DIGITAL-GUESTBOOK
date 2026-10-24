const fs = require('fs');

const content = fs.readFileSync('C:/Users/User/.gemini/antigravity-ide/brain/ec3af5c6-b574-4cba-939a-990b175e6138/.system_generated/steps/1193/content.md', 'utf8');

const startMarker = 'data-page="';
const startIndex = content.indexOf(startMarker);
const jsonStart = startIndex + startMarker.length;
const jsonEnd = content.indexOf('">', jsonStart);
const rawEscaped = content.substring(jsonStart, jsonEnd);
const unescaped = rawEscaped
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#039;/g, "'");

const parsed = JSON.parse(unescaped);
const layouts = parsed.props.event.camera.photobooth.layouts;

layouts.forEach((l) => {
  console.log('ID:', l.id, 'Name:', l.name);
  console.log('Text blocks count:', (l.text_blocks || []).length);
  if (l.text_blocks && l.text_blocks.length > 0) {
    console.log(JSON.stringify(l.text_blocks, null, 2));
  }
});
