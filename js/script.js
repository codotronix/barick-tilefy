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
    
    $('#wallpaperModal li').on('click', function(){
        $('#wallpaperModal li').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.btn_Cancel').on('click', function(){
        closeModal($(this).closest('.modal'));
    });
    
    $('#btn_ApplyWallpaper').on('click', function(){
        var imgSrc = $('#wallpaperModal li.selected img').attr('src');
        //console.log(imgSrc);
        if(imgSrc != undefined){
            var bg = 'url(' + imgSrc + ') 0 0 no-repeat cover';
            $('body').css({
                'background-image': 'url(' + imgSrc + ')'
            });
            $('.mask, #wallpaperModal').hide();
        }
    });
    
    
    function closeModal(modalElem) {
        modalElem.hide();
        $('.mask').hide();
    }
    
    
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