const fs = require('fs');

// Function to read icons from icons.txt
function readIconsFromFile() {
  try {
    const data = fs.readFileSync('icons.txt', 'utf8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  } catch (err) {
    console.error('Error reading icons.txt:', err);
    return [];
  }
}

// Function to generate GeoJSON based on the icons array
function generateGeoJSON(icons) {

  const startX = -100.32798463778342;
  const startY = 31.838664510901136;
  const deltaX = 0.072; // Approx 5 miles in longitude
  const deltaY = -0.045; // Approx 5 miles in latitude
  const maxX = -94.55324627398436;

  let x = startX;
  let y = startY;

  const features = [];

  icons.forEach(icon => {
    features.push({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [x, y]
      },
      "properties": {
        "icon": icon
      }
    });

    x += deltaX;
    if (x > maxX) {
      x = startX;
      y += deltaY;
    }
  });

  return {
    "type": "FeatureCollection",
    "features": features
  };
}

// Read icons from icons.txt
const icons = readIconsFromFile();

// Generate the GeoJSON
const geojson = generateGeoJSON(icons);

// Write the GeoJSON to a file
fs.writeFile('points.geojson', JSON.stringify(geojson, null, 2), (err) => {
  if (err) {
    console.error('Error writing GeoJSON file:', err);
  } else {
    console.log('GeoJSON file has been written to points.geojson');
  }
});
