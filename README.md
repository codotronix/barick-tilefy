# barick-tilefy
A Windows 8.1 Metro Style Responsive Web Plugin

<br/>

## Table of contents

* [Features Highlight](#features-highlight)
* [Demos and Samples](#demos-and-samples)
* [Dependencies](#dependencies)
* [How To Use](#how-to-use)
* [Contacts](#contacts)
* [Showcase Your Website](#showcase-your-website)
* [Copyright and license](#copyright-and-license)

<br/>

## Features Highlight

#### Drag to Move / Reposition Tiles
![Drag to Move / Reposition Tiles](img/help-gifs/RepositionTiles.gif)

#### Resize Tiles [4 sizes - Small, Medium, Big, Rectangle]
![Resize Tiles into any of the 4 available sizes](img/help-gifs/ResizeTiles.gif)

<br/>

## Demos and Samples
* [Vertical Scrollable Tiles Demo](http://barick.in)
* [Horizontally Scrollable Grouped Tiles Demo](http://codotronix.github.io/barick-tilefy/samples/horizontal-scroll-demo/)

<br/>

## Dependencies
"barick-tilefy" needs the following to work,
* [jquery](https://jquery.com/)
* [hand.js](https://handjs.codeplex.com/)

<br/>

## How To Use

* **Make the "Tile Descriptor" (TD)**<br/>

  A TD is a json object which has 2 properties,
  1. "tileOrder" - An array of tile IDs in the order you want them to be pickd up while being drawn on screen
  2. "tiles" - An object containing all tile objects as value corresponding to their unique IDs as key.
  
  So, a simple "Tile Descriptor" (TD) containing 3 tiles will simply look like,
```
{
  "tileOrder": ["id1", "id3", "id2"],
    
  "tiles": {
        "id1": {
            "id": "id1",
            "name": "Learn",
            "size": "medium",
            "iconType": "font",
            "icon": "fa fa-graduation-cap",
            "bgColor":"rgba(59, 89, 152, 0.7)"
        },
        "id2": {
            "id": "id2",
            "name": "Friends",
            "size": "small",
            "iconType": "font",
            "icon": "fa fa-users",
            "bgColor": "rgba(139, 120, 0, 0.7)"
        },
        "id3": {
            "id": "id3",
            "name": "Movies",
            "size": "rectangle",
            "iconType": "font",
            "icon": "fa fa-film",
            "bgColor": "rgba(142, 40, 140, 0.69)"
        }
  }
}

```
<br/>

* **Make a "config" Object** <br/>
  A "config" object contains various configuration options, regarding various operations on tile. A sample "config" object would be like this

```
  var config = {};
  config.TD = TD;                                               // MANDATORY
  config.btn_ID_to_Toggle_Tile_Movement = 'Your-HTML-Elem-ID';  //OPTIONAL
  config.btn_ID_to_Toggle_Tile_Resize = 'Another-HTML-Elem-ID'; //OPTIONAL
  config.gridCapacityPerRow = ANY_NUMBER;                       //OPTIONAL
```
<br/>
  1. config.TD: (Mandatory) This is the Tile Descriptor object we just made in the previous step.
  2. config.btn_ID_to_Toggle_Tile_Movement: (Optional) Provide the ID of the html element which you want user to use to toggle Tile Movement / Reposition functionality ON and OFF.
  3. config.btn_ID_to_Toggle_Tile_Resize: (Optional) Same as no. 2 but for Tile Resize functionality.
  4. config.gridCapacityPerRow: (Optional) This is a powerful configuration option. By this you can define the total number of grids (Small Tile) that can be placed in a row. The more the number the smaller will the size of tiles will be.
  **[Remember 1 grid = 1 Small Tile. So, Medium Tiles are 2x2 i.e 4 grids are required to place a small tile. Big Tiles are 4 grids wide and 4 grids high, so 4x4=16 grids are required to place a Big Tile.]**

<br/>

* **Finally, Call "tilefy()"** <br/>
Now that we are done with the configuration, here's the Final Step. Grab the ID of the DIV container where you want to show your tiles and call "tilefy" on it.

```
$('#ID_of_Your_Container_Div').tilefy(config);
```
<br/>

## Showcase Your Website
I would love to see how you are using this plugin. So, if you build something cool using this plugin and don't mind showing it off to the world, just contact me know in any of the following ways and I will showcase your site in my site.

<br/>

## Contacts:
* [Twitter](https://twitter.com/codotronix)
* [Facebook](https://www.facebook.com/codotronix)
* [LinkedIn](https://www.linkedin.com/in/sumanbarick)

<br/>

## Copyright and License
Code and documentation copyright 2016 Suman Barick. Code released under [the MIT license](https://github.com/codotronix/barick-tilefy/blob/master/LICENSE)
