/**
 * A jQuery plugin to create a sliding-tile puzzle from a <img> element. The
 * borders of individual tile elements can be styled via css - the can be
 * identified using the selector 'div.base > div.tile'.
 *
 * @requires jQuery.
**/
(function ($) {
    var baseTemplate = '<div class="base"></div>',
        tileTemplate = '<div class="tile"></div>';
    
    $.fn.slidingTile = function (options) {
        var $base = $(baseTemplate),
            image = this.prop('src'),
            width = this.width(),
            height = this.height();
        
        options = $.extend(true, {
            rows: 3,
            columns: 3,
            emptyPosition: {
                row: 0,
                col: 0
            }
        }, options);
        
        this.replaceWith($base);
        
        $base
            .width(width)
            .height(height)
            .css('position', 'absolute');
        
        for (var row = 0; row < options.rows; row++) {
            for (var col = 0; col < options.columns; col++) {
                // Calculate the background-position.
                var posX = width / options.columns * col,
                    posY = height / options.rows * row,
                    $tile,
                    border; // Obtained from stylesheet.
                
                if (row === options.emptyPosition.row && col === options.emptyPosition.col) {
                    $base.data('slidingtile', {
                        options: options,
                        emptyTile: {
                            row: row,
                            col: col
                        }
                    });
                    
                    continue;
                }
                
                $tile = $(tileTemplate).appendTo($base);
                
                $tile.css('position', 'absolute')
                    .css('left', posX + 'px')
                    .css('top', posY + 'px')
                    .css('background-image', 'url(' + image + ')')
                    .css('background-position', -posX + 'px ' + -posY + 'px')
                    .data('slidingtile', {
                        oPos: { // Original position of tile.
                            row: row,
                            col: col
                        },
                        cPos: { // Current position of tile.
                            row: row,
                            col: col
                        }
                    });
                
                border = $tile.outerWidth() - $tile.width();
                
                $tile.width(width / options.columns - border);
                
                border = $tile.outerHeight() - $tile.height();
                
                $tile.height(height / options.rows - border);
            }
        }
        
       updateClickHandlers($base);
    };
    
/**
 * Updates click-handlers for tiles, so that only tiles that are adjacent to
 * the empty space will move into it.
**/
    function updateClickHandlers($base) {
        var data = $base.data('slidingtile'),
            emptyRow = data.emptyTile.row,
            emptyCol = data.emptyTile.col;
        
        $base.children('.tile').each(function () {
            var $tile = $(this),
                data = $tile.data('slidingtile');
            
            $tile.off('click');
            
// An adjacent tile is either one row *or* one column from the empty tile, so
// we can identify them by taking the absolute values of the row and column
// displacements and find the sum of these two values. For adjacent tiles, this
// value will be equal to 1.
            if (Math.abs(data.cPos.row - emptyRow) + Math.abs(data.cPos.col - emptyCol) === 1) {
                $tile.click(function () {
                    moveTile($base, $(this));
                });
            }
        });
    }
    
/**
 * Moves a tile into the empty space, and updates the empty space to take the
 * loaction vacated by the moved tile.
**/
    function moveTile($base, $tile) {
        var baseData = $base.data('slidingtile'),
            options = baseData.options,
            emptyRow = baseData.emptyTile.row,
            emptyCol = baseData.emptyTile.col,
            tileData = $tile.data('slidingtile'),
            tileRow = tileData.cPos.row,
            tileCol = tileData.cPos.col;
        
        $base.data('slidingtile', {
            options: options,
            emptyTile: {
                row: tileRow,
                col: tileCol
            }
        });
        
        $tile
            .css('left', $base.width() / options.columns * emptyCol + 'px')
            .css('top', $base.height() / options.rows * emptyRow + 'px')
            .data('slidingtile', {
                cPos: {
                    row: emptyRow,
                    col: emptyCol
                }
        });
        
        updateClickHandlers($base);
    }
    
/**
 * Checks if all tiles are in their original positions.
 * 
 * @returns {Boolean} True if the puzzle has been solved, false if not.
**/
    function isSolved($base) {
        var result = true;
        
        $base.children('.tile').each(function (tile) {
            var data = $(tile).data('slidingtile');
            
            if (data.oPos.row === data.cPos.row && data.oPos.row === data.cPos.row) {
                result &= true;
            } else {
                result === false;
            }
        });
        
        return result;
    }
}(jQuery));
