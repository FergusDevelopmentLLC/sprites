const fs = require('fs');

// Constants for input and output paths
const INPUT_SPRITES_JSON = 'generated/satellite-streets-v11/sprite.json'; // Update this path if needed
const OUTPUT_ICONS_TXT = 'generated/satellite-streets-v11/icons/icons.txt';

// Read the JSON file
fs.readFile(INPUT_SPRITES_JSON, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Extract the keys
  const keys = Object.keys(jsonData);

  // Write the keys to a file, each on a new line
  fs.writeFile(OUTPUT_ICONS_TXT, keys.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('File written successfully.');
  });
});
