(function(window) {
	function Level(dataURL) {
		this.initialize(dataURL);
	}
	Level.prototype = new Container();
	Level.prototype.tile = new Image(); // public properties:
	// constructor:
	Level.prototype.Container_initialize = Level.prototype.initialize;
	Level.prototype.initialize = function(dataURL) {
		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = Level.prototype.handleDataLoaded;
		httpRequest.open('GET', dataURL);
		httpRequest.send();
	}
	Level.prototype.handleDataLoaded = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				Level.prototype.initLevel(httpRequest.responseText);
			} else {
				alert('There was a problem loading the level.');
			}
		}
	}
	Level.prototype.initLevel = function(levelData) {
		var json = JSON.parse(levelData);
		this.levelData = json;
		for (var i = 0; i < Level.prototype.levelData.levelArray.length; i++) {
			for (var n = 0; n < Level.prototype.levelData.levelArray[0].length; n++) {
				switch (Level.prototype.levelData.levelArray[i][n]) {
				case 1:
					var tile = new Bitmap('images/tile.png');
					tile.x = n * TILESIZE;
					tile.y = i * TILESIZE;
					Level.prototype.addChild(tile);
				}
			}
		}
		fireEvent('levelLoaded', document);
	}
	window.Level = Level;
}(window));
