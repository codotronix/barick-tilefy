(function(){
    tile_plugins.weatherNow = tile_plugins.weatherNow || {};
    var plugin = tile_plugins.weatherNow;
    //the container
    var pluginContainer = $('#weatherNow .plugin');
    var yahooLogoUrl = "https://poweredby.yahoo.com/white.png";
    
    plugin.setTemp = function (data) {
        plugin.temp = data.query.results.channel.item.condition.temp;
        populateTile(plugin.temp);        
    };
    
    function populateTile (temp) {
         //"img/yahooLogo/purple_retina.png";
                
        var h = '<div style="display:table; color:white; width:100%; height:100%;">'
            +       '<div style="display:table-cell; vertical-align:middle;">'
            +           '<div style="font-size:50px; border-right: 2px solid #FFF; display:inline-block; padding-right: 10px;"> ' + temp + '&deg;F </div>'
            +           '<div style="display:inline-block; padding-left: 10px; font-size: 20px;">Kolkata</div>'
            +       '</div>'
            +       '<div style="position:absolute; top:0; left:0; right: 0;"><img style="" src="' + yahooLogoUrl + '"/></div>'
            +   '</div>';
    
        pluginContainer.html(h);
    };
    
    
    if (plugin.temp) {
        populateTile (plugin.temp);
    } 
    else {
        var scriptQuery = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='kolkata, india')&format=json&callback=tile_plugins.weatherNow.setTemp"
    
        $.getScript(scriptQuery);
    }    
    
})()