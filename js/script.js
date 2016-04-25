$.getJSON('data/TM.json', function(res){
    $('#tilesContainer').tilify(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    
    $('#startBtn').click(function(ev){
        ev.stopPropagation();
        $('#startMenu').toggle();
    });
    
    
    
})