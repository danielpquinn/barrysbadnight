(function(window) {
	
	function Level(dataURL) {
		this.initialize(dataURL);
	}
	
	Level.prototype = new Container();

	// public properties:
	Level.prototype.tiles = new Container();
	
	// constructor:
	Level.prototype.Container_initialize = Level.prototype.initialize;
	Level.prototype.initialize = function(dataURL) {
		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = Level.prototype.handleDataLoaded;
		httpRequest.open('GET', dataURL);
		httpRequest.send();
	};
	
	Level.prototype.handleDataLoaded = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				Level.prototype.initLevel(httpRequest.responseText);
			} else {
				alert(httpRequest.status + ': There was a problem loading the level.');
			}
		}
	};
	
	Level.prototype.initLevel = function(levelData) {
		var json = JSON.parse(levelData),
			tileBmp,
			tilesBmp;
		this.levelData = json;

		for (var i = 0; i < Level.prototype.levelData.levelArray.length; i++) {
			for (var n = 0; n < Level.prototype.levelData.levelArray[0].length; n++) {
				switch (Level.prototype.levelData.levelArray[i][n]) {
				case 1:
					var tile = new Bitmap('images/tile.png');
					tile.x = n * TILESIZE;
					tile.y = i * TILESIZE;
					Level.prototype.tiles.addChild(tile);
					break;
				}
			}
		}

		tileBmp = new Bitmap('images/tile.png');
		tileBmp.image.onload = function() {
			Level.prototype.tiles.cache(0, 0, Level.prototype.levelData.levelArray[0].length * TILESIZE, Level.prototype.levelData.levelArray.length * TILESIZE);
			tilesBmp = new Bitmap(Level.prototype.tiles.cacheCanvas.toDataURL("image/png"));

			var _tilesBmpLoaded = function(e) {
				Level.prototype.addChild(tilesBmp);
				fireEvent('levelLoaded', document);
			};
			tilesBmp.image.onload = _tilesBmpLoaded;

		}
	};

	window.Level = Level;

}(window));