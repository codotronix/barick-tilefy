(function(){
    tile_plugins.tileOfTime = tile_plugins.tileOfTime || {};
    
    //cancel any previous timer countdown
    if(tile_plugins.tileOfTime.timeoutVar != undefined) {
        clearTimeout(tile_plugins.tileOfTime.timeoutVar);
    }
    
    //the container
    var pluginContainer = $('#tileOfTime .plugin');
    
    //let's create a time container
    var h = '<div style="display:table; color:white; width:100%; height:100%;">'
            +      '<div style="display:table-cell; vertical-align:middle; font-size:50px;" class="timeContainer"></div>'
            + '</div>';
    
    pluginContainer.html(h);
    
    
    function updateTime () {
        if(!pluginContainer.closest('.tiles-container').hasClass('resizeMode') && !pluginContainer.closest('.tiles-container').hasClass('movementMode')) {
            var t = new Date();
            var timeTxt = ("0" + t.getHours()).slice(-2) + ':' + ("0" + t.getMinutes()).slice(-2) + ':' + ("0" + t.getSeconds()).slice(-2);
            //console.log('updating time....');
            pluginContainer.find('.timeContainer').text(timeTxt);
        }
        
        tile_plugins.tileOfTime.timeoutVar = setTimeout(updateTime, 1000);
    }
    
    updateTime();
})()