$(function(){
    
    //LOAD FIRST GROUP
    $.getJSON('TD-SocialMedia.json', function(res){
        var config = {};
        config.TD = res;
        //config.btn_ID_to_Toggle_Tile_Movement = 'btn_toggleTileDnD';
        //config.btn_ID_to_Toggle_Tile_Resize = 'btn_toggleTileResize';
        config.gridCapacityPerRow = 9;   //let's comment it out, becoz it's optional      
        
        $('#sec1 .tileContainer').tilify(config);
        //$('#tilesContainer').tilify(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    });
    
    
    //LOAD SECOND GROUP
    $.getJSON('TD-Group2.json', function(res){
        var config = {};
        config.TD = res;
        //config.btn_ID_to_Toggle_Tile_Movement = 'btn_toggleTileDnD';
        //config.btn_ID_to_Toggle_Tile_Resize = 'btn_toggleTileResize';
        config.gridCapacityPerRow = 9;   //let's comment it out, becoz it's optional      
        
        $('#sec2 .tileContainer').tilify(config);
        //$('#tilesContainer').tilify(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    });
    
    
    //LOAD THIRD GROUP
    $.getJSON('TD-Group3.json', function(res){
        var config = {};
        config.TD = res;
        //config.btn_ID_to_Toggle_Tile_Movement = 'btn_toggleTileDnD';
        //config.btn_ID_to_Toggle_Tile_Resize = 'btn_toggleTileResize';
        config.gridCapacityPerRow = 9;   //let's comment it out, becoz it's optional      
        
        $('#sec3 .tileContainer').tilify(config);
        //$('#tilesContainer').tilify(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    });
    
    
})