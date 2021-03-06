class Utils {
  // retrieve custom properties of Tiled object
  static RetrieveCustomProperties(object) {
    if (object.properties) { //Check if the object has custom properties
      if (Array.isArray(object.properties)) { //Check if from Tiled v1.3 and above
        object.properties.forEach(function (element) { //Loop through each property
          this[element.name] = element.value; //Create the property in the object
        }, object); //Assign the word "this" to refer to the object
      } else {  //Check if from Tiled v1.2.5 and below
        for (var propName in object.properties) { //Loop through each property
          object[propName] = object.properties[propName]; //Create the property in the object
        }
      }
      delete object.properties; //Delete the custom properties array from the object
    }
    return object; //Return the new object w/ custom properties
  }
  static FindPoint(map, layer, type, name) {
    var loc = map.findObject(layer, function (object) {
      if (object.type === type && object.name === name) {
        return object;
      }
    });
    return loc
  }
  static FindPoints(map, layer, type) {
    var locs = map.filterObjects(layer, function (object) {
      if (object.type === type) {
        return object
      }
    });
    return locs
  }
  /** 
   * @param {Phaser.Scene} scene
   * @param {number} tileWidth
   * @param {number} tileHeight
   * @param {Array.<Array.<number>>} grid
   * @param {Array.<number>} acceptableTiles
  */
  static ShowEasyStarMapping(scene, tileWidth, tileHeight, grid, acceptableTiles) {
    for (let y = 0; y < grid.length; y++) {
      let col = []
      for (let x = 0; x < grid[y].length; x++) {
        for (let a = 0; a < acceptableTiles.length; a++) {
          if (grid[y][x] == acceptableTiles[a]) {
            let marker = scene.add.graphics()
            marker.lineStyle(3, 0x00FF00, 1)
            marker.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
            break
          }
        }
      }
    }
  }
}