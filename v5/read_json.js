const fs = require('fs');

// Read the JSON file
fs.readFile('generated/sprites.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Extract the keys
  const keys = Object.keys(jsonData);

  // Write the keys to a file, each on a new line
  fs.writeFile('icons.txt', keys.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('File written successfully.');
  });
});
