$(function(){    
    $.getJSON('data/TM.json', function(res){
        $('#tilesContainer').tilify(res, 'btn_toggleTileDnD', 'btn_toggleTileResize');
    })
    
    $('#startBtn').click(function(ev){
        ev.stopPropagation();
        $('#startMenu').toggle();
    });
    
    $('#btn_ChangeWallpaper').on('click', function(){
        showWallpaperModal();
    });
    
    function showWallpaperModal () {
        $('.mask').show();
        
        var winWid = $(window).width();
        
        var modalWidth = 300;
        
        if (winWid > 992) {
            modalWidth = 800;
        } 
        else if (winWid > 767) {
            modalWidth = 500;
        }
        
        var offset = (winWid - modalWidth) / 2;
        var itemWid = (modalWidth - 17) / 4;
        
        $('#wallpaperModal li').css({
            'height': itemWid + 'px',
            'width': itemWid + 'px'
        });
        
        $('#wallpaperModal').css({
            'left': offset + 'px',
            'width': modalWidth + 'px'
        }).show();
    }
})