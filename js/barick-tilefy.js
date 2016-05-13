/*!
 * barick-tilefy v1.0.0 (https://github.com/codotronix/barick-tilefy)
 * Copyright 2016 Suman Barick
 * Licensed under the MIT license
 */


/*
*
* tilefy(config) takes the config object, Where,
*
* config.TD = (Required) Tile Descriptor JSON, containing tileOrder array and tiles object
* config.btn_ID_to_Toggle_Tile_Movement = (Optional) id of a button/element to bind the toggle tile move event
* config.btn_ID_to_Toggle_Tile_Resize = (Optional) id of a button/element to bind the toggle tile resize
* config.gridCapacityPerRow = (Optional) total number of smallest tile a row should hold
*
*/

var tile_plugins = {};

(function($) {
    
    $.fn.tilefy = function(config) {
        
        return this.each(function() { //ANONYM FUNC_1 START
        var thisContainer = this;
            var container = $(this);
            var containerWidth = container.width();
            var tileOrder = config.TD.tileOrder,             //The order in which tiles should be drawn
            tiles = config.TD.tiles,
            grids = {},                 //grids are smallest square unit of a tile, 1 grid = 1 small tile
            gridsPerRow = 0,            //no of grids in a row
            page_Width_Class = 'xs',    // possible values = xs, sm, md, lg
            small_tile_size = 0,
            medium_tile_size = 0,
            big_tile_size = 0,
            clearSpaceDivPosition = 200,  //max vertical point (y px) where tile ends + clearSpaceDivPosition
            tileMovementAllowed = false,
            tileResizeAllowed = false,
            colorCodes = ["#632F00", "#B01E00", "#C1004F", "#4617B4", "#008287", "#199900", "#00C13F", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF", "#000", "#00A3A3", "#FE7C22"];
            
            //console.log(tiles);
            
            //$(this).text(customText);
            
            init();
            
            function init () {
                calculateWidths();
                //noBigTileInXS();
                makeGrids();        
                mapTilesToGrid();
                drawTiles();
                setStyles();
                wakeUpLive();
                bindDragAndDrop();
                enableTileResize();
            }
            
            function reTilefy () {
                resetGrids();
                mapTilesToGrid();
                drawTiles();
                setStyles();
            }
            
            
            /*
            * This function will make the Full HTML and put them in container on which tilefy was called
            */
            function drawTiles () {
                var htm = '';
                container.addClass('barick-tiles-container ' + page_Width_Class);
                var tile;
                for(var i in tiles) {
                    tile = tiles[i];
                    htm += '<div id="' +tile.id+ '" class="tile ' + tile.size + '" style="top:' + tile.top + 'px; left:' +tile.left+ 'px;" data-gridid="' +tile.gridId+ '" >'
                                + '<a class="tileInnerContainer" target="_blank" href="' +(tile.link || 'javascript:void(0)')+ '" style="background: ' +tile.bgColor+ ';" >';
                    
                    if (tile.iconType == 'font') {
                        htm += '<span class="fontIcon ' +tile.icon+ '"></span>';
                    }
                    else if (tile.iconType == 'live') {
                        htm += '<div class="live">';
                            
                        if (tile.liveImgUrls != undefined) {
                            htm += '<img  class="fontImg" src="' +tile.liveImgUrls[0]+ '" />';
                        }
                        
                        if (tile.liveTxts != undefined) {
                            htm += '<span class="liveTxt" style="color:' +tile.fontColor+ '">' +tile.liveTxts[0]+ '</span>';
                        }
                        
                        htm += '</div>';
                    }
                    else if (tile.iconType == 'plugin') {
                        htm += '<div class="plugin"></div>';
                    }
                    
                    
                    
                    //add the tile name
                    htm += '<label class="name">' +tile.name+ '</label>';
                    
                    //add the tile mask to catch click on tile resize
                    //htm += '<div class="tileMask"></div>';
                                        
                   
                    //close the opening <a> and <div>
                    htm += '</a></div>';
                }
                
                //add the clearSpaceDiv
                htm += '<div style="position:absolute; left: 10px; right: 10px; height: 60px; top: ' +(clearSpaceDivPosition) + 'px" ></div>';
                
                container.html(htm);
                
                loadPlugins();
            }
            
            
            /*
            * Once drawTiles has finished preparing the DOM, it will call the loadPlugins
            */
            function loadPlugins () {
                //console.log('inside loadPlugins');
                for (var i in tiles) {
                    if(tiles[i].iconType == 'plugin') {
                        
//                        console.log('outside timeout callback '+pathToPlugin);
//                        setTimeout(function(){
//                            console.log('inside timeout callback '+pathToPlugin);
                        tile_plugins[tiles[i].id] = tile_plugins[tiles[i].id] || {};
                        
                        //if the plugin initFunc is available eval it, or load it
                        if (tile_plugins[tiles[i].id].initFunc) {
                            eval(tile_plugins[tiles[i].id].initFunc);
                        } else {
                            fetchPlugin(tiles[i].id);
                        }
                            
//                        }, 100);
                    }
                }
            }
            
            
            /*
            * Fetch the plugin from server for the first time and save it
            */
            function fetchPlugin (tileID) {
                var pathToPlugin = 'tile_plugins/' + tileID + '/index.js';
                $.getScript(pathToPlugin, function( data, textStatus, jqxhr ) {
                    tile_plugins[tileID].initFunc = data;
//                  console.log( data ); // Data returned
//                  console.log( textStatus ); // Success
//                  console.log( jqxhr.status ); // 200
//                  console.log( "Load was performed." );

                });
            }
            
            
            /*
            * Once the DOM for tile is ready, this function will set the styles
            */
            function setStyles () {
                //set Tile Sizes
                $('.tile.small').css({
                    "width": small_tile_size,
                    "height": small_tile_size
                });
                
                $('.tile.medium').css({
                    "width": medium_tile_size,
                    "height": medium_tile_size
                });
                
                $('.tile.big').css({
                    "width": big_tile_size,
                    "height": big_tile_size
                });
                
                $('.tile.rectangle').css({
                    "width": big_tile_size,
                    "height": medium_tile_size
                });
                
                //Set fontIcon sizes
                $('.tile .fontIcon').each(function(){
                    var ht = $(this).closest('.tile').height();
                    
                    $(this).css({
                        "font-size": (ht / 2) + 'px',
                        "margin-top": (ht / 8) + 'px'
                    });
                });
            }
            
            
            /*
            * Wake the live tiles up
            */            
            function wakeUpLive () {
                
                var animationClasses = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp", "rotateIn", "rollIn", "zoomIn"];
                
                var txtAnimations = ["fadeIn"];
                
                $('.tile .live').each(function(){
                    var tileId = $(this).closest('.tile').attr('id');
                    var liveImgUrls = tiles[tileId].liveImgUrls;
                    var liveTxts = tiles[tileId].liveTxts;
                    
                    //live img
                    if (liveImgUrls != undefined && liveImgUrls.length>1) {
                        var imgIndx = 0;
                        var noOfImgs = liveImgUrls.length;
                        var animateClass = '';                        
                        var waitTime = 2500 + Math.round(Math.random() * (5000 / noOfImgs));
                                                                           
                        function nxtImg () {
                            if (!tileMovementAllowed && !tileResizeAllowed) {
                                imgIndx = (imgIndx + 1) % noOfImgs;
                                animateClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
                                $('#'+tileId).find('.fontImg').attr('src', liveImgUrls[imgIndx]).removeClass().addClass('fontImg animated '+animateClass);
                            }
                            setTimeout(nxtImg, waitTime);
                        }
                        
                        nxtImg();
                    }
                    
                    //live txt
                    if (liveTxts != undefined && liveTxts.length>1) {
                        var txtIndx = 0;
                        var noOfTxts = liveTxts.length;
                        var animateClass = '';                        
                        var waitTime = 2500 + Math.round(Math.random() * (5000 / noOfTxts));
                                                                           
                        function nxtTxt () {
                            if (!tileMovementAllowed && !tileResizeAllowed) {
                                txtIndx = (txtIndx + 1) % noOfTxts;
                                animateClass = txtAnimations[Math.floor(Math.random() * txtAnimations.length)];
                                $('#'+tileId).find('.liveTxt').text( liveTxts[txtIndx]).removeClass().addClass('liveTxt animated '+animateClass);
                            }
                            setTimeout(nxtTxt, waitTime);
                        }
                        
                        nxtTxt();
                    }
                });
            }
            
                        
            /*
            * calculate height and width of the tiles depending on the tiles_container width
            */
            function calculateWidths () {        
                var scrollBarWidth = 20;                                    //17px for scrollbar
                //var tiles_Container_width = $('.tiles-container').width() - scrollBarWidth;
                var tiles_Container_width = containerWidth - scrollBarWidth;
                page_Width_Class = 'xs';
                var all_Possible_Width_Classes = 'xs sm md lg';        
                gridsPerRow = config.gridCapacityPerRow || 12;
                small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);        

                if (tiles_Container_width >= 1200) {            
                    page_Width_Class = 'lg';
                    gridsPerRow = config.gridCapacityPerRow || 16;
                    small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);
                } 
                else if (tiles_Container_width >= 992) {
                    page_Width_Class = 'md';
                    gridsPerRow = config.gridCapacityPerRow || 12;
                } 
                else if (tiles_Container_width >= 768) {
                    page_Width_Class = 'sm';
                    gridsPerRow = config.gridCapacityPerRow || 12;
                } 
                else {
                    page_Width_Class = 'xs';   
                    gridsPerRow = config.gridCapacityPerRow || 4;
                    small_tile_size = Math.floor((tiles_Container_width + scrollBarWidth) / gridsPerRow);
                }

                medium_tile_size = small_tile_size * 2;
                big_tile_size = small_tile_size * 4;
            }

            /*
            * In Mobile, all big tiles should be converted to medium
            */
            function noBigTileInXS () {
                if(page_Width_Class == "xs") {
                    for(var i in tiles) {
                        tiles[i].size = (tiles[i].size == "big") ? "medium" : tiles[i].size;
                    }
                }
            }

            /*
            * makeGrids will make the grids i.e. divide the page into smallest squares
            */
            function makeGrids () {
                //let's calculate total filling capacity in terms of smallest squares or grids
                fillCapacity = 0;
                for (var i in tiles) {
                    if (tiles[i].size == "small") {
                        fillCapacity += 1;
                    } else if (tiles[i].size == "medium") {
                        fillCapacity += 4;
                    } else if (tiles[i].size == "rectangle") {
                        fillCapacity += 8;
                    }else if (tiles[i].size == "big") {
                        fillCapacity += 16;
                    }
                }

                //let's make total no grids be multiple gridsPerRow
                //Doubling the grids
                var totalGrids = gridsPerRow * Math.ceil(fillCapacity/gridsPerRow) * 2;

                //Let's make the grids
                grids = {};
                var gridX = 0;
                var gridY = 1;
                for (var i = 1; i <= totalGrids; i++) {
                    gridX++;

                    if(gridX > gridsPerRow) {
                        gridX = 1;
                        gridY++;
                    }

                    var grid = {};
                    grid.indX = gridX;
                    grid.indY = gridY;
                    grid.id = gridX + "x" + gridY;
                    grid.occupiedBy = "none";
                    grid.top = (gridY - 1) * small_tile_size;
                    grid.left = (gridX - 1) * small_tile_size;
                    grid.type = '';     //if any tile starts on it, then type=startGrid

                    grids[grid.id] = grid;
                }
            }  

            /*
            * This function will reset the Grids
            */
            function resetGrids () {
                for(var key in grids) {
                    grids[key].occupiedBy = "none";
                    grids[key].type = '';
                }
            }    

            /*
            * this function will loop thru tiles, send each tile to placeTileOnGrid(tile) 
            * and will receive the starting grid id and will store that grid id on that tile object
            * We also calculate a clearSpaceDivPosition bottom all the tiles, since tiles are position absolute
            * there is nothing to push the browser scroll so that all the ttiles are visible
            *
            * Edit 1: send the tiles as per their order defined in tileOrder
            */
            function mapTilesToGrid () {
                clearSpaceDivPosition = 0;
                var tileID = '';
                for (var j in tileOrder) {
                    //console.log("sending for tile id="+tiles[i].id);
                    tileID = tileOrder[j];
                    gridId = placeTileOnGrid (tiles[tileID]);
                    tiles[tileID].gridId = gridId;

                    tiles[tileID].width = (tiles[tileID].size == "small") ? small_tile_size : ((tiles[tileID].size == "medium") ? medium_tile_size : big_tile_size);
                    tiles[tileID].height = (tiles[tileID].size == "small") ? small_tile_size : ((tiles[tileID].size == "big") ? big_tile_size : medium_tile_size);            
                    tiles[tileID].bgColor = tiles[tileID].bgColor || colorCodes[Math.floor(Math.random()*colorCodes.length)];
                    tiles[tileID].top = grids[gridId].top;
                    tiles[tileID].left = grids[gridId].left;
                    //console.log('top='+tiles[tileID].top+" ... height="+tiles[tileID].height+" total="+(tiles[tileID].top+tiles[tileID].height));
                    clearSpaceDivPosition = ((tiles[tileID].top+tiles[tileID].height) > clearSpaceDivPosition) ? (tiles[tileID].top+tiles[tileID].height) : clearSpaceDivPosition; 
                }

                //config.TD.clearSpaceDivPosition = clearSpaceDivPosition;
            }

            /*
            * This function will loop thru the grid in grids
            * looking for a vacant grid where it can place the tile
            * if the place is of q^2 size, it will also have to look more (q-1) cells on right
            * and (q-1) cells on right
            * once found, the tileId should be stored on all the applicable grids
            */
            function placeTileOnGrid(tile) {        
                for(var key in grids) {
                    if (grids[key].occupiedBy == "none") {
                       if (tile.size == "small") {
                           grids[key].occupiedBy = tile.id;
                           grids[key].type = 'startGrid';
                           //console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                           return(key);
                       } else {
                           if (canItHoldTile(grids[key].id, tile.size)) {
                               markGridsOccupied(grids[key].id, tile.size, tile.id);
                               grids[key].type = 'startGrid';
                               return(key);
                           }
                       }
                    }
                }
                console.log('No Grid Avaialble for Tile id='+tile.id);
            }

            /*
            * This function will take a gridId and examine
            * that grid can be an elligible starting grid for
            * a given tile size
            */    
            function canItHoldTile(gridId, tileSize) {
                var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
                var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle

                var startX = grids[gridId].indX;
                var startY = grids[gridId].indY;
                var uptoX = startX + (x-1);
                var uptoY = startY + (y-1);
                var key = '';
                var innerLoopFailed = false;
                for (var i = startX; i <= uptoX; i++) {
                    for (var j = startY; j <= uptoY; j++) {
                        key = i + "x" + j;
                        if(grids[key] == undefined || typeof(grids[key]) == undefined || grids[key].occupiedBy != "none") {
                            innerLoopFailed = true;
                            break;
                        }                
                    }
                    if(innerLoopFailed) {
                        break;
                    }            
                }
                return !innerLoopFailed;
            }

            /*
            * this function will mark all the grids occupied
            * by a medium or big tile
            */
            function markGridsOccupied (gridId, tileSize, tileId) {
                var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
                var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle

                var startX = grids[gridId].indX;
                var startY = grids[gridId].indY;
                var uptoX = startX + (x-1);
                var uptoY = startY + (y-1);
                var key = '';
                for (var i = startX; i <= uptoX; i++) {
                    for (var j = startY; j <= uptoY; j++) {
                        key = i + "x" + j;
                        grids[key].occupiedBy = tileId;
                    }
                }
            }
            
            
            /*
            * Inside this function all the things related to tile movement will be done
            * Since lots of binding to tiles will be here, if we delegate the binding 
            * thru body, this function only needs to be called once, i.e. in init
            */
            function bindDragAndDrop () {
                var tile_Being_Dragged_ID = null;
                var tile_to_be_shifted_ID = null;
                var drag_in_progress = false;
                var iniMX = 0, iniMY = 0; //initial mouseX and mouseY when drag Starts
                
                
                //whenever a tile recieves a mousedown, assume dragging start
                container.on('pointerdown', '.tile', function(ev){ //console.log('drag start');console.log(ev);
                    if(!container.hasClass('movementMode')) {return;}
//                    ev.stopPropagation();
                    ev.preventDefault();
                    if(drag_in_progress) {return;}
                    tile_Being_Dragged_ID = $(this).attr('id');                    
//                    tile_Being_Dragged_ID = $(ev.target).closest('.tile').attr('id');                    
                    drag_in_progress = true;
                    iniMX = ev.pageX;
                    iniMY = ev.pageY;
                    container.find('.tile').removeClass('being-dragged');
                    $(this).addClass('being-dragged');
                });
                
                
                //whenever body recieves a mouseup, assume dragging end
                $('body').on('pointerup', function(ev){ //console.log('drag end'); console.log(ev);
                    //ev.stopPropagation();
                    if(!drag_in_progress) {return;}
                    drag_in_progress = false;
                    $('body').trigger('click');
                    
                    //bring the tile_Being_Dragged_ID before tile_to_be_shifted_ID in tileOrder
                    if (tile_to_be_shifted_ID != null && tile_Being_Dragged_ID != null) {
                        var newTileOrder = [];
                        for (var i in tileOrder) {
                            if (tileOrder[i] == tile_Being_Dragged_ID) {
                                continue;
                            } 
                            else if (tileOrder[i] == tile_to_be_shifted_ID) {
                                newTileOrder.push(tile_Being_Dragged_ID);
                                newTileOrder.push(tile_to_be_shifted_ID);
                            } else {
                                newTileOrder.push(tileOrder[i]);
                            }
                        }
                        
                        //sometimes false triggering causes data loss
                        if(newTileOrder.length != tileOrder.length) {
                            console.log("length mismatch... Hence this order cannot be taken...");
                            console.log('current tile order');console.log(tileOrder);
                            console.log('new tile order');console.log(newTileOrder);
                            //debugger;
                            
                        } else {
                            tileOrder = newTileOrder;
                        }                        
                    }
                    
                    reTilefy();                    
                    
                    tile_Being_Dragged_ID = null;
                    tile_to_be_shifted_ID = null;
                    $('.tile').removeClass('being-dragged');
                });
                
                //if the pointer goes out of current tile container, trigger a pointerup
                container.on('pointerout', function(ev) {
                   $('body').trigger('pointerup');
                });
                
                //while dragging the tile should move with mouse
                $('body').on('pointermove', function (ev) {
                    ev.stopPropagation();
                    if(!tileMovementAllowed || !drag_in_progress || tile_Being_Dragged_ID == null) {
                        return;
                    }
                    
                    //get mouse pointer displacement
                    var diffX = ev.pageX - iniMX;
                    var diffY = ev.pageY - iniMY;
                    iniMX = ev.pageX;
                    iniMY = ev.pageY;
                    
                    var tileLeft = parseInt($('#'+tile_Being_Dragged_ID).css('left'));
                    var tileTop = parseInt($('#'+tile_Being_Dragged_ID).css('top'));
                    var newTop = tileTop + diffY;
                    var newLeft = tileLeft + diffX;
                    
                    for (var i in tiles) {
                        if(tile_Being_Dragged_ID != tiles[i].id && Math.abs(tiles[i].left - tileLeft) < small_tile_size && Math.abs(tiles[i].top - tileTop) < small_tile_size) {
                            //console.log(tiles[i].id + " can be moved...");
                            container.find('.tile').removeClass('shift-effect');
                            tile_to_be_shifted_ID = tiles[i].id;
                            $('#' + tile_to_be_shifted_ID).addClass('shift-effect');
                            break;
                        }
                    }
                    
                    //apply the new top and left
                    $('#'+tile_Being_Dragged_ID).css({
                        "top": newTop,
                        "left": newLeft
                    });
                });
                
                $('#'+config.btn_ID_to_Toggle_Tile_Movement).on('click', function(){
                    checkTileDNDPermission();
                });
                
                //first tie it doesnot have any of the classes off/on, so it will set to off
                function checkTileDNDPermission () {
                    $('.tileResizeMenu').remove();
                    if(!$('#'+config.btn_ID_to_Toggle_Tile_Movement).hasClass('on')) {
                        $('#'+config.btn_ID_to_Toggle_Tile_Movement).removeClass('off').addClass('on');
                        tileMovementAllowed = true;
                        container.addClass('movementMode').removeClass('resizeMode');
                        //tile resize and movement are mutually exclusive
                        tileResizeAllowed = false;
                        $('#'+config.btn_ID_to_Toggle_Tile_Resize).removeClass('on').addClass('off');
                    } else {
                        $('#'+config.btn_ID_to_Toggle_Tile_Movement).removeClass('on').addClass('off');
                        tileMovementAllowed = false;
                        container.removeClass('movementMode');
                        reTilefy(); //to correct any anomaly during tile movement
                    }
                }
                
                //Initial / first time check, comment this out if first time on/off class is given in html
                //checkTileDNDPermission();
            }
            
            
            /*
            * This function enables tile resize, and binds it to config.btn_ID_to_Toggle_Tile_Resize
            */
            function enableTileResize () {
                function checkTileResizePermission () {
                    $('.tileResizeMenu').remove();
                    if(!$('#'+config.btn_ID_to_Toggle_Tile_Resize).hasClass('on')) {
                        $('#'+config.btn_ID_to_Toggle_Tile_Resize).removeClass('off').addClass('on');
                        tileResizeAllowed = true;
                        container.addClass('resizeMode').removeClass('movementMode');
                        //tile resize and movement are mutually exclusive
                        tileMovementAllowed = false;
                        $('#'+config.btn_ID_to_Toggle_Tile_Movement).removeClass('on').addClass('off');
                        reTilefy(); //to correct any anomaly during tile movement
                    } else {
                        $('#'+config.btn_ID_to_Toggle_Tile_Resize).removeClass('on').addClass('off');
                        tileResizeAllowed = false;
                        container.removeClass('resizeMode');
                    }
                }
                
                //Initial / first time check, comment this out if first time on/off class is given in html
                //checkTileResizePermission();
                
                $('#'+config.btn_ID_to_Toggle_Tile_Resize).on('click', function(){
                    checkTileResizePermission();
                });
                
                //Let's create a Tile Resize Menu
                var tileResizeMenu = '<ul class="tileResizeMenu">'
                                    +   '<li>Small</li>'
                                    +   '<li>Medium</li>'
                                    +   '<li>Big</li>'
                                    +   '<li>Rectangle</li>'
                                    +'</ul>';
                
                //click on tile to open resize menu
                container.on('click', '.tile', function(ev){
                    if(!container.hasClass('resizeMode')) {return;}
                    $('.tileResizeMenu').remove();
                    var top = parseInt($(this).css('top')) + 20;
                    var left = parseInt($(this).css('left')) + 20;
                    $(tileResizeMenu).attr('data-tileID', $(this).attr('id')).css({
                        "top": top,
                        "left": left
                    }).appendTo(container);
                    //$(container).append(tileResizeMenu);
                });
                
                
                //click on a size to resize tile
                container.on('click', '.tileResizeMenu li', function (ev) {
                    var chosenSize = $(this).text().toLowerCase();
                    var tileID = $(this).closest('.tileResizeMenu').attr('data-tileID');
                    
                    //resize only if a different size is chosen
                    if(tiles[tileID].size != chosenSize) {
                        tiles[tileID].size = chosenSize;
                        reTilefy();
                    }
                });
                
                
            }
            
            
            //Prevent Tile Anchors from Firing if tile movement or resize is enabled
            $('body').on('click', '.tile a', function(ev){
                if(tileMovementAllowed || tileResizeAllowed) {
                    ev.preventDefault();
                }
            });
            
            
            
        }); //ANONYM FUNC_1 END
    }   //END OF Tilefy
}(jQuery));