$(document).ready(function () {

    var $stage = $('#stage'),
      $createStage = $('#create-stage'),
      $createStageSubmit = $createStage.find('submit'),
      $jsonOutput = $('#json-output'),
      $addOrRemove = $('#add-or-remove'),
      stageWidth = 0,
      stageHeight = 0,
      tileSize = 10,
      level = [],
      createStage,
      onStageMouseMove,
      addOrRemove = 'add';

    $addOrRemove.on('change', function () {
      addOrRemove = this.value;
    });

    $createStage.on('submit', function (e) {
      e.preventDefault();
      var values = $createStage.serializeArray();

      stageWidth = values[0].value;
      stageHeight = values[1].value;

      createStage(stageWidth, stageHeight);
    });

    $stage.on('mousedown', function (e) {
      swapTile(e);
      $stage.on('mouseenter', 'div', swapTile);
    });

    $(document).on('mouseup', function (e) {
      $stage.off('mouseenter', 'div', swapTile);
    });

    swapTile = function (e) {
      var $targ = $(e.target);
      switch(addOrRemove) {
        case 'add':
          level[$targ.parent().index()][$targ.index()] = 1;
          $targ.removeClass().addClass('tile normal');
          break;
        case 'remove':
          level[$targ.parent().index()][$targ.index()] = 0;
          $targ.removeClass().addClass('tile');
          break;
        case 'addSlopeRight':
          level[$targ.parent().index()][$targ.index()] = 2;
          $targ.removeClass().addClass('tile slope-right');
          break;
        case 'addSlopeLeft':
          level[$targ.parent().index()][$targ.index()] = 3;
          $targ.removeClass().addClass('tile slope-left');
          break;
      }
      $jsonOutput.val(JSON.stringify(level));
    }

    createStage = function (w, h) {
      var i = 0;

      $stage.css({
        'width': w * tileSize + 'px',
        'height': h * tileSize + 'px',
        'border': '1px solid #333'
      });

      for (i; i < h; i++) {
        var $row = $('<div />'),
          row = [],
          j = 0;
        $stage.append($row);
        level.push(row);

        for (j; j < w; j++) {
          var $tile = $('<div />');
          row.push(0);
          $tile.css({
            'width': tileSize + 'px',
            'height': tileSize + 'px',
            'left': j * tileSize + 'px',
            'top': i * tileSize + 'px'
          }).addClass('tile');
          $row.append($tile);
        }
      }
      console.log(level);
      $createStage.detach();
    }

});