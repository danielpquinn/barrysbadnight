$('document').ready(function() {

    var levelArray = [];
    lvlJSON = {},
    gridWidth = 0,
    gridHeight = 0,
    tileTypes = [],
    currType = '',
    mouseHeld = false,
    $typeButtons = $('#tile-type-buttons'),
    $grid = $('#grid'),
    $output = $('#output'),
    $messageBox = $('#message');

    levelArray = [];
    lvlJSON = {
        'width': 0,
        'height': 0,
        'startPos': [0, 0],
        'levelArray': levelArray
    }
    tileTypes = ['empty', 'tile', 'enemy', 'startposition'];
    currType = 0;

    function tileTypeButtons() {
        for(var i = 0; i < tileTypes.length; i++) {
            var typeButton = $('<button />');
            typeButton.text(tileTypes[i]);
            typeButton.bind('click', function() {
                currType = $typeButtons.children().index(this);
            });
            $typeButtons.append(typeButton);
        }
    }

    tileTypeButtons();

    $('#submit-grid').bind('click', function(e) {
        e.preventDefault();
        gridWidth = $('#grid-width').val();
        gridHeight = $('#grid-height').val();
        lvlJSON.width = gridWidth;
        lvlJSON.height = gridHeight;
        $messageBox.text('Grid dimensions: ' + gridWidth + 'x' + gridHeight);
        makeGrid(gridWidth, gridHeight);
    });

    function makeGrid(w,h) {
        for(var i = 0; i < h; i++) {
        		levelArray[i] = [];
            for(var n = 0; n < w; n++) {
            		levelArray[i].push(0);
                var tile = $('<div />');
                tile.addClass('square');
                $grid.append(tile);
            }
            var clear = $('<div />');
            clear.addClass('clear');
            $grid.append(clear);
        }
        $('.square').bind('mousedown', function() {
            $this = $(this);
            var clickedIndex = $('.square').index($this);
            var clickedRow = Math.floor(clickedIndex / gridWidth);
            var clickedCol = clickedIndex%gridWidth;
			levelArray[clickedRow][clickedCol] = currType;
            
            if(tileTypes[currType] === 'startposition') {
                levelArray[lvlJSON.startPos[0]][lvlJSON.startPos[1]] = 0;
                $('.startposition').removeClass('startposition');
                lvlJSON.startPos = [clickedRow, clickedCol];
            }

            for(var i = 0; i < tileTypes.length; i++) {
                $this.removeClass(tileTypes[i]);
            }

            $this.addClass(tileTypes[currType]);

            generateJSON();
            
            mouseHeld = true;

        });

        $('.square').bind('mouseup', function() {
            mouseHeld = false;
        });

        $('.square').bind('mouseenter', function() {
            $this = $(this);
            if(mouseHeld) {
                $this.mousedown();
            }
        });

    }
    
    $('#output-json').bind('click', function(e) {
        e.preventDefault();
        generateJSON();
    });
    
    function generateJSON() {
        $output.text(JSON.stringify(lvlJSON));
    }

});