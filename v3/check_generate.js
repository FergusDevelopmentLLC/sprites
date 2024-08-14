const fs = require('fs');
const Jimp = require('jimp');

// Load the JSON file
const spritesJson = JSON.parse(fs.readFileSync('generated/sprites.json', 'utf8'));

// Load the sprite sheet image
Jimp.read('generated/sprites.png')
  .then(spriteSheet => {
    // Loop through each key in the JSON
    Object.keys(spritesJson).forEach((key, index) => {
      const sprite = spritesJson[key];

      // Extract the described icon from the sprite sheet
      spriteSheet.clone()
        .crop(sprite.x, sprite.y, sprite.width, sprite.height)
        .writeAsync(`generated/icons/icon_${index + 1}_${key}.png`)
        .then(() => {
          console.log(`Rendered icon for ${key}: saved as icon_${index + 1}_${key}.png`);
        })
        .catch(err => {
          console.error(`Error rendering icon for ${key}:`, err);
        });
    });
  })
  .catch(err => {
    console.error('Error loading sprite sheet image:', err);
  });
