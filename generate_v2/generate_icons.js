const fs = require('fs');
const { basemap } = require('./constants');

// Constants for input and output paths
const INPUT_SPRITES_JSON = `generated/${basemap}/sprite.json`;
const OUTPUT_ICONS_TXT = `generated/${basemap}/icons/icons.txt`;

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
