var lvlArray;
var lvlJSON;
var grid;
var gridWidth;
var gridHeight;
var messageBox;
var tileTypes;
var typeButtons;
var currType;

$('document').ready(function() {

    lvlArray = [];
    lvlJSON = {
        'lvlArray': lvlArray
    }
    grid = $('#grid');
    tileTypes = ['empty', 'tile', 'enemy'];
    messageBox = $('#message');
    currType = 0;

    function tileTypeButtons() {
        typeButtons = $('#tile-type-buttons');
        for(var i = 0; i < tileTypes.length; i++) {
            var typeButton = $('<button />');
            typeButton.text(tileTypes[i]);
            typeButton.bind('click', function() {
                currType = typeButtons.children().index(this);
            });
            typeButtons.append(typeButton);
        }
    }
    
    tileTypeButtons();

    $('#submit-grid').bind('click', function(e) {
        e.preventDefault();
        gridWidth = $('#grid-width').val();
        gridHeight = $('#grid-height').val();
        messageBox.text('Grid dimensions: ' + gridWidth + 'x' + gridHeight);
        makeGrid(gridWidth, gridHeight);
    });
    
    function makeGrid(w,h) {
        for(var i = 0; i < h; i++) {
            lvlArray.push([]);
            for(var n = 0; n < w; n++) {
                lvlArray[i].push(0);
                var tile = $('<div />');
                tile.addClass('square');
                grid.append(tile);
            }
            var clear = $('<div />');
            clear.addClass('clear');
            grid.append(clear);
        }
        $('.square').bind('click', function() {
            $this = $(this);
            for(var i = 0; i < tileTypes.length; i++) {
                $this.removeClass(tileTypes[i]);
            }
            $this.addClass(tileTypes[currType]);
            var clickedIndex = $('.square').index($this);
            messageBox.text('Math.floor(clickedIndex / gridWidth): ' + Math.floor(clickedIndex / gridWidth) + ' clickedIndex: ' + clickedIndex + '\n' + ' clickedIndex%gridWidth: ' + clickedIndex%gridWidth);
            lvlArray[Math.floor(clickedIndex / gridWidth)][clickedIndex%gridWidth] = currType;
        });
    }
    
    $('#output-json').bind('click', function(e) {
        e.preventDefault();
        generateJSON();
    });
    
    function generateJSON() {
        $('#output').text(JSON.stringify(lvlJSON));
    }

});