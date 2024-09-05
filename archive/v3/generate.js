const fs = require('fs');
const svgToImg = require('svg-to-img');

// Read the JSON file
const styles = JSON.parse(fs.readFileSync('wells_styles.json', 'utf8'));

// SVG generation functions
const SVG_TRIANGLE = (style) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-${
    0.2222222222222222 * style.width
  } -${0.2222222222222222 * style.width} ${1.444444444444444 * style.width} ${
    1.444444444444444 * style.width
  }" height="${style.height}" width="${style.width}">
        <polygon points="${style.width / 2},0 ${style.width},${
    style.height
  } 0,${style.height}" fill="${style.fill_color}" stroke="${
    style.stroke_color
  }" stroke-width="${style.stroke_width}" stroke-linejoin="round" />
      </svg>`;
};

const SVG_SQUARE = (style) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-${
    0.2222222222222222 * style.width
  } -${0.2222222222222222 * style.width} ${1.444444444444444 * style.width} ${
    1.444444444444444 * style.width
  }" height="${style.height}" width="${style.width}">
        <rect width="${style.width}" height="${style.height}" fill="${
    style.fill_color
  }" stroke="${style.stroke_color}" stroke-width="${
    style.stroke_width
  }" stroke-linejoin="round" />
      </svg>`;
};

const SVG_CIRCLE = (style) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-${
    0.2222222222222222 * style.width
  } -${0.2222222222222222 * style.width} ${1.444444444444444 * style.width} ${
    1.444444444444444 * style.width
  }" height="${style.height}" width="${style.width}">
        <circle cx="${style.width / 2}" cy="${style.height / 2}" r="${
    Math.min(style.width, style.height) / 2
  }" fill="${style.fill_color}" stroke="${style.stroke_color}" stroke-width="${
    style.stroke_width
  }" stroke-linejoin="round" />
      </svg>`;
};

const SVG_STAR_7PT = (style) => {
  return `<svg width="${style.height}" height="${style.width}" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="${style.fill_color}" d="M62.6279 28.2189L50.4186 1L38.7907 28.2189L10.8837 19.3432L24.8372 47.1538L1 63.7219L28.907 69.6391L26.5814 101L50.4186 79.6982L74.8372 101L72.5116 69.6391L101 63.7219L76.5814 47.1538L91.1163 19.3432L62.6279 28.2189Z" />
    <path stroke="${style.stroke_color}" stroke-linejoin="round" d="M62.6279 28.2189L50.4186 1L38.7907 28.2189L10.8837 19.3432L24.8372 47.1538L1 63.7219L28.907 69.6391L26.5814 101L50.4186 79.6982L74.8372 101L72.5116 69.6391L101 63.7219L76.5814 47.1538L91.1163 19.3432L62.6279 28.2189Z" />
    <path stroke="${style.stroke_color}" stroke-width="${style.stroke_width}" stroke-opacity="1" stroke-linejoin="round" d="M62.6279 28.2189L50.4186 1L38.7907 28.2189L10.8837 19.3432L24.8372 47.1538L1 63.7219L28.907 69.6391L26.5814 101L50.4186 79.6982L74.8372 101L72.5116 69.6391L101 63.7219L76.5814 47.1538L91.1163 19.3432L62.6279 28.2189Z" />
</svg>`;
};

// Function to generate SVG sprite sheet and JSON mapping
const generateSpriteSheet = (styles, scaleFactor = 1) => {
  let svgContent = '';
  let currentY = 0;
  let currentRowHeight = 0;

  // JSON structure to hold positions and sizes
  const jsonMapping = {};

  // Group styles by shape type
  const groupedStyles = styles.reduce((acc, style) => {
    acc[style.shape] = acc[style.shape] || [];
    acc[style.shape].push(style);
    return acc;
  }, {});

  // Function to add shapes to the sprite sheet and update JSON mapping
  const addShapes = (shapeType) => {
    if (!groupedStyles[shapeType]) return;

    let currentX = 0;

    groupedStyles[shapeType].forEach((style, index) => {
      // Check if we need to start a new row
      if (
        index > 0 &&
        (style.width !== groupedStyles[shapeType][index - 1].width ||
          style.height !== groupedStyles[shapeType][index - 1].height)
      ) {
        currentY += currentRowHeight;
        currentX = 0;
        currentRowHeight = 0;
      }

      const scaledWidth = style.width * scaleFactor;
      const scaledHeight = style.height * scaleFactor;

      let svgElement;
      switch (style.shape) {
        case 'circle':
          svgElement = SVG_CIRCLE({
            ...style,
            width: scaledWidth,
            height: scaledHeight,
          });
          break;
        case 'square':
          svgElement = SVG_SQUARE({
            ...style,
            width: scaledWidth,
            height: scaledHeight,
          });
          break;
        case 'triangle':
          svgElement = SVG_TRIANGLE({
            ...style,
            width: scaledWidth,
            height: scaledHeight,
          });
          break;
        case 'star-7pt':
          svgElement = SVG_STAR_7PT({
            ...style,
            width: scaledWidth,
            height: scaledHeight,
          });
          break;
        default:
          throw new Error(`Unknown shape type: ${style.shape}`);
      }

      // Append the SVG element to the main content
      svgContent += `<g transform="translate(${currentX}, ${currentY})">${svgElement}</g>`;

      // Add each matching_src_attributes as a key in the JSON mapping
      style.matching_src_attributes.forEach((attribute) => {
        jsonMapping[attribute] = {
          width: scaledWidth,
          height: scaledHeight,
          x: currentX,
          y: currentY,
          pixelRatio: scaleFactor,
        };
      });

      currentX += scaledWidth;
      currentRowHeight = Math.max(currentRowHeight, scaledHeight);
    });

    currentY += currentRowHeight;
  };

  // Add each shape type to the sprite sheet
  addShapes('circle');
  addShapes('square');
  addShapes('triangle');
  addShapes('star-7pt');

  const totalWidth = Math.max(
    ...Object.values(groupedStyles).map((group) =>
      group.reduce((sum, s) => sum + s.width * scaleFactor, 0)
    )
  );

  const totalHeight = currentY;

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}">${svgContent}</svg>`;

  return { svgString, jsonMapping };
};

// Generate sprite sheet and JSON mapping
const { svgString: svgString1x, jsonMapping: jsonMapping1x } = generateSpriteSheet(styles, 1);
const { svgString: svgString2x, jsonMapping: jsonMapping2x } = generateSpriteSheet(styles, 2);

// Write the SVG and JSON to files for 1x
fs.writeFileSync('generated/sprites.svg', svgString1x, 'utf8');
fs.writeFileSync('generated/sprites.json', JSON.stringify(jsonMapping1x, null, 2), 'utf8');

// Write the SVG and JSON to files for 2x
fs.writeFileSync('generated/sprites@2x.svg', svgString2x, 'utf8');
fs.writeFileSync('generated/sprites@2x.json', JSON.stringify(jsonMapping2x, null, 2), 'utf8');

// Convert SVG to PNG for 1x
svgToImg
  .from(svgString1x)
  .toPng({
    path: 'generated/sprites.png',
  })
  .then(() => {
    console.log('Sprite sheet converted to PNG successfully!');
  })
  .catch((err) => {
    console.error('Error converting SVG to PNG:', err);
  });

// Convert SVG to PNG for 2x
svgToImg
  .from(svgString2x)
  .toPng({
    path: 'generated/sprites@2x.png',
  })
  .then(() => {
    console.log('Sprite sheet @2x converted to PNG successfully!');
  })
  .catch((err) => {
    console.error('Error converting SVG to PNG @2x:', err);
  });
