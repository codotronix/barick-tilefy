$(function(){
    
    //LOAD FIRST GROUP
    $.getJSON('TD-Group1.json', function(res){
        var config = {};
        config.TD = res;
        config.btn_ID_to_Toggle_Tile_Movement = 'sec1Reposition';
        config.btn_ID_to_Toggle_Tile_Resize = 'sec1Resize';
        config.gridCapacityPerRow = 9;   //let's comment it out, becoz it's optional      
        
        $('#sec1 .tileContainer').tilefy(config);
        //$('#tilesContainer').tilefy(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    });
    
    
    //LOAD SECOND GROUP
    $.getJSON('TD-Group2.json', function(res){
        var config = {};
        config.TD = res;
        config.btn_ID_to_Toggle_Tile_Movement = 'sec2Reposition';
        config.btn_ID_to_Toggle_Tile_Resize = 'sec2Resize';
        config.gridCapacityPerRow = 9;   //let's comment it out, becoz it's optional      
        
        $('#sec2 .tileContainer').tilefy(config);
        //$('#tilesContainer').tilefy(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    });
    
    
    //LOAD THIRD GROUP
    $.getJSON('TD-Group3.json', function(res){
        var config = {};
        config.TD = res;
        config.btn_ID_to_Toggle_Tile_Movement = 'sec3Reposition';
        config.btn_ID_to_Toggle_Tile_Resize = 'sec3Resize';
        config.gridCapacityPerRow = 9;   //let's comment it out, becoz it's optional      
        
        $('#sec3 .tileContainer').tilefy(config);
        //$('#tilesContainer').tilefy(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    });
    
    
})