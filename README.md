# Ben's JS Game Engine

Welcome to BJGE (pronounced 'Bee Gee')! This is a very easy to use WIP JS game engine. This project is inspired by <a href = 'https://gamemaker.nl'>GameMaker</a> and <a href = 'http://alstaffieri.com/gamemaker.html'>GameMaker</a>. There's no documentation right now, but when BJGE is further along, I'll write one and put out some videos. A very simple demo of the engine can be found <a href = 'https://github.com/benergize/Rogue-Renewal'>here</a>.

## How to use

Download BJGE.min.js and import it with a script tag (`<script src = '/path/to/BJGE.min.js'></script>`).

Create an instance of the engine with `var game = new GameEngine("#canvas",24);`.

### Boilerplate

```
    <canvas id = 'canvas'></canvas>
    <script src 'BJGE.min.js'></script>
    
    <script>
        //Create a new instance of the engine using the canvas above, running at 24 fps
        var game = new GameEngine("#canvas",24);
    </script>
```

## Reference

This is an incomplete reference, but what's here is accurate and should be enough to get started.

<table>
<thead><tr><th>Type</th><th>Property</th><th>Expects</th><th>Description</th></tr></thead>

<tbody><tr>
        <td> <b>EngineResource</b></td><td>GameEngine</td><td>ID selector for canvas, game FPS</td><td></td>
    </tr><tr>
        <td>array</td><td>GameEngine.rooms</td><td></td><td>Array of all rooms in the game, accessible to the engine.</td>
    </tr><tr>
        <td> array</td><td>GameEngine.sprites</td><td></td><td>Array of all registered sprites.</td>
    </tr><tr>
        <td> array</td><td>GameEngine.resources</td><td></td><td>Array of all registered files</td>
    </tr><tr>
        <td> array</td><td>GameEngine.objects</td><td></td><td>Array of all registered objects.</td>
    </tr><tr>
        <td> array</td><td>GameEngine.sounds</td><td></td><td>Array of all registered sounds (EngineResources, not files)</td>
    </tr><tr>
        <td> array</td><td>GameEngine.tiles</td><td></td><td>Array of all registered tiles</td>
    </tr><tr>
        <td> array</td><td>GameEngine.backgrounds</td><td></td><td>Array of all registered backgrounds</td>
    </tr><tr>
        <td> number</td><td>GameEngine.currentRoom</td><td></td><td>Array index of current active game room.</td>
    </tr><tr>
        <td> string</td><td>GameEngine.status</td><td></td><td>Current gamestate</td>
    </tr><tr>
        <td> number</td><td>GameEngine.fps</td><td></td><td>Framerate at which the game will run</td>
    </tr><tr>
        <td> object</td><td>GameEngine.timing</td><td></td><td>Object that tracks framerate related variables</td>
    </tr><tr>
        <td> object</td><td>GameEngine.debug</td><td></td><td>Debug flags</td>
    </tr><tr>
        <td> number</td><td>GameEngine.registry</td><td></td><td>Used to track unique IDs for resource registration</td>
    </tr><tr>
        <td> function</td><td>GameEngine.generateID</td><td></td><td>Generates a new unique ID</td>
    </tr><tr>
        <td> object</td><td>GameEngine.keysHeld</td><td></td><td>Object tracking all currently held keys</td>
    </tr><tr>
        <td> function</td><td>GameEngine.checkKey</td><td>JS key event key type</td><td>Function to check if key is currently being held</td>
    </tr><tr>
        <td> function</td><td>GameEngine.update</td><td></td><td>Function that controls all game logic. Should not be modified.</td>
    </tr><tr>
        <td> function</td><td>GameEngine.addRoom</td><td>EngineResource Room</td><td>Function to add rooms to game registry. This is done automatically when a room is created.</td>
    </tr><tr>
        <td> function</td><td>GameEngine.getRoom</td><td>String room name || String room ID</td><td>Get a room object from either an ID or name</td>
    </tr><tr>
        <td> function</td><td>GameEngine.getCurrentRoom</td><td></td><td>Gets the currently active game room</td>
    </tr><tr>
        <td> function</td><td>GameEngine.setCurrentRoom</td><td>String room name || String room ID</td><td>Switches game to a room</td>
    </tr><tr>
        <td> function</td><td>GameEngine.importTiles</td><td>JSON</td><td>Import tileset from JSON. Useful for designing rooms in-game</td>
    </tr><tr>
        <td> function</td><td>GameEngine.begin</td><td></td><td>Start the game loop</td>
    </tr><tr>
        <td> function</td><td>GameEngine.getIntersecting</td><td></td><td>Get if two rectangles are intersecting based on their coordinates</td>
    </tr><tr>
        <td> object</td><td>GameEngine.engine</td><td></td><td></td>
    </tr><tr>
        <td> </td><td></td><td></td><td></td>
    </tr><tr>
        <td> <b>EngineResource</b></td><td>GameObject</td><td></td><td></td>
    </tr><tr>
        <td> string</td><td>GameObject.name</td><td></td><td>String used to identify the object in a room</td>
    </tr><tr>
        <td> number</td><td>GameObject.x</td><td></td><td>X coordinate of object in room</td>
    </tr><tr>
        <td> number</td><td>GameObject.y</td><td></td><td>Y coordinate of object in room</td>
    </tr><tr>
        <td> number</td><td>GameObject.sprite</td><td></td><td>EngineResource Sprite to draw at the GameObject's position in the room</td>
    </tr><tr>
        <td> boolean</td><td>GameObject.visible</td><td></td><td>Whether the object should draw a sprite and perform its draw event</td>
    </tr><tr>
        <td> number</td><td>GameObject.onstep</td><td></td><td>Custom event to execute every game step (frame)</td>
    </tr><tr>
        <td> number</td><td>GameObject.ondraw</td><td></td><td>Custom event to execute every game draw (frame)</td>
    </tr><tr>
        <td> number</td><td>GameObject.ondestroy</td><td></td><td>Custom event to execute when the GameObject is destroyed via destroy()</td>
    </tr><tr>
        <td> number</td><td>GameObject.hspeed</td><td></td><td>Horizontal speed</td>
    </tr><tr>
        <td> number</td><td>GameObject.vspeed</td><td></td><td>Vertical speed</td>
    </tr><tr>
        <td> number</td><td>GameObject.friction</td><td></td><td>Friction to apply to object's movements</td>
    </tr><tr>
        <td> number</td><td>GameObject.gravity</td><td></td><td>Gravity to apply to object</td>
    </tr><tr>
        <td> number</td><td>GameObject.gravityDirection</td><td></td><td>Direction of gravity to apply</td>
    </tr><tr>
        <td> array</td><td>GameObject.collisionBox</td><td>[x,y,width,height]</td><td>Coordinates to use when checking for collisions. Defaults to sprite width/height or 16x16 if no sprite is specified</td>
    </tr><tr>
        <td> number</td><td>GameObject.id</td><td></td><td>Internal unique ID</td>
    </tr><tr>
        <td> function</td><td>GameObject.generatePath</td><td></td><td>Generate a path to a given location on a certain grid, avoiding solid objects</td>
    </tr><tr>
        <td> object</td><td>GameObject.path</td><td></td><td>Path generated by generatePath()</td>
    </tr><tr>
        <td> function</td><td>GameObject.pathStep</td><td></td><td>Take a step to/towards the next step in the path generated by generatePath()</td>
    </tr><tr>
        <td> function</td><td>GameObject.moveTowardsPoint</td><td></td><td>Move towards given coordinates, ignoring objects in the way</td>
    </tr><tr>
        <td> function</td><td>GameObject.moveInDirection</td><td></td><td>Move at a given speed in a given direction</td>
    </tr><tr>
        <td> function</td><td>GameObject.setDepth</td><td></td><td>Set the position in the draw order (z-index)</td>
    </tr><tr>
        <td> function</td><td>GameObject.destroy</td><td></td><td>Remove this object from the current room</td>
    </tr><tr>
        <td> function</td><td>GameObject.deactivate</td><td></td><td>Prevent this object from performing any of its actions or drawing without removing it from the room.</td>
    </tr><tr>
        <td> function</td><td>GameObject.activate</td><td></td><td>Reactivate the object</td>
    </tr><tr>
        <td> </td><td></td><td></td><td></td>
    </tr><tr>
        <td> <b>EngineResource</b></td><td>Room</td><td></td><td></td>
    </tr><tr>
        <td> string</td><td>Room.name</td><td></td><td>String used to identify the object in a room</td>
    </tr><tr>
        <td> number</td><td>Room.width</td><td></td><td>Playable room width</td>
    </tr><tr>
        <td> number</td><td>Room.height</td><td></td><td>Playable room height</td>
    </tr><tr>
        <td> object</td><td>Room.background</td><td></td><td>EngineResource Background to draw behind room</td>
    </tr><tr>
        <td> number</td><td>Room.gridX</td><td></td><td>Grid X dimension</td>
    </tr><tr>
        <td> number</td><td>Room.gridY</td><td></td><td>Grid Y dimension</td>
    </tr><tr>
        <td> array</td><td>roomObjects</td><td></td><td>All objects currently in the room</td>
    </tr><tr>
        <td> array</td><td>Room.tiles</td><td></td><td>All tiles currently in the room</td>
    </tr><tr>
        <td> object</td><td>Room.view</td><td></td><td></td>
    </tr><tr>
        <td> number</td><td>Room.view.x</td><td></td><td>X to start drawing from</td>
    </tr><tr>
        <td> number</td><td>Room.view.y</td><td></td><td>Y to start drawing from</td>
    </tr><tr>
        <td> number</td><td>Room.view.width</td><td></td><td>Width of view to draw to</td>
    </tr><tr>
        <td> number</td><td>Room.view.height</td><td></td><td>Height of view to draw to</td>
    </tr><tr>
        <td> string</td><td>Room.view.objectName</td><td></td><td>Object to follow with view</td>
    </tr><tr>
        <td> number</td><td>Room.id</td><td></td><td>Internal unique ID</td>
    </tr><tr>
        <td> function</td><td>Room.addObject</td><td></td><td>Adds an object to the current room.</td>
    </tr><tr>
        <td> function</td><td>Room.getObject</td><td></td><td>Get an object in the room given an ID or object name. If there are mutiple objects with the name, it will return the first in the room array.</td>
    </tr><tr>
        <td> function</td><td>Room.getObjects</td><td></td><td>Get objects in the room given an object name.</td>
    </tr><tr>
        <td> function</td><td>Room.getTilesAt</td><td></td><td>Get all tiles at a given location</td>
    </tr><tr>
        <td> function</td><td>Room.getObjectsAt</td><td></td><td>Get all objects at a given location</td>
    </tr><tr>
        <td> function</td><td>Room.getAllAt</td><td></td><td>Get all objects and tiles at a given location</td>
    </tr><tr>
        <td> function</td><td>Room.checkEmpty</td><td></td><td>Check if there is anything at a given location</td>
    </tr><tr>
        <td> </td><td></td><td></td><td></td>
    </tr><tr>
        <td> <b>EngineResource</b></td><td>Sprite</td><td></td><td></td>
    </tr><tr>
        <td> string</td><td>Sprite.name</td><td></td><td>String used to identify the sprite</td>
    </tr><tr>
        <td> string</td><td>Sprite.fileName</td><td></td><td>Location of file containing image or images</td>
    </tr><tr>
        <td> boolean</td><td>Sprite.resource</td><td></td><td>JS file resource from image</td>
    </tr><tr>
        <td> number</td><td>Sprite.speed</td><td></td><td>Animation speed, if applicable</td>
    </tr><tr>
        <td> number</td><td>Sprite.sheetX</td><td></td><td>X to start taking sprite from. This is primarily for sprite sheets where the sprite you want to draw may not be at position 0,0. For animations, specify an array of X positions.</td>
    </tr><tr>
        <td> number</td><td>Sprite.sheetY</td><td></td><td>Y to start taking sprite from. This is primarily for sprite sheets where the sprite you want to draw may not be at position 0,0. For animations, specify an array of Y positions.</td>
    </tr><tr>
        <td> number</td><td>Sprite.sheetWidth</td><td></td><td>Width of sprite on the sheet. This is primarily for sprite sheets where the sprite you want to draw may be smaller than the entire sheet.</td>
    </tr><tr>
        <td> number</td><td>Sprite.sheetHeight</td><td></td><td>Height of sprite on the sheet. This is primarily for sprite sheets where the sprite you want to draw may be smaller than the entire sheet.</td>
    </tr><tr>
        <td> number</td><td>Sprite.drawWidth</td><td></td><td>Actual width to draw sprite in room. This will scale the sprite.</td>
    </tr><tr>
        <td> number</td><td>Sprite.drawHeight</td><td></td><td>Actual height to draw sprite in room. This will scale the sprite.</td>
    </tr><tr>
        <td> number</td><td>Sprite.id</td><td></td><td>Internal unique ID</td>
    </tr><tr>
        <td> function</td><td>Sprite.draw</td><td></td><td>Draws the sprite. This is usually called automatically.</td>
    </tr><tr>
        <td> </td><td></td><td></td><td></td>
    </tr><tr>
        <td> <b>EngineResource</b></td><td>Background</td><td></td><td></td>
    </tr><tr>
        <td> string</td><td>Background.color</td><td></td><td>Color to draw to in room, if no sprite is present.</td>
    </tr><tr>
        <td> string</td><td>Background.colour</td><td></td><td>Alias of color for our friends across the pond.</td>
    </tr><tr>
        <td> number</td><td>Background.sprite</td><td></td><td>EngineResource Sprite to draw in room, either tiled or not.</td>
    </tr><tr>
        <td> boolean</td><td>Background.tiled</td><td></td><td>Whether or not to tile the sprite in the room, if it is not larger than the room.</td>
    </tr><tr>
        <td> function</td><td>Background.draw</td><td></td><td>Draw the background. This is usually called automatically.</td>
    </tr><tr>
        <td> </td><td></td><td></td><td></td>
    </tr><tr>
        <td> <b>EngineResource</b></td><td>Tile</td><td></td><td></td>
    </tr><tr>
        <td> string</td><td>Tile.name</td><td></td><td>String used to identify the object in a room</td>
    </tr><tr>
        <td> object</td><td>Tile.sprite</td><td></td><td>EngineResource Sprite to draw at the Tiles position in the room</td>
    </tr><tr>
        <td> number</td><td>Tile.x</td><td></td><td>X coordinate of tile in room</td>
    </tr><tr>
        <td> number</td><td>Tile.y</td><td></td><td>Y coordinate of tile in room</td>
    </tr><tr>
        <td> boolean</td><td>Tile.solid</td><td></td><td>Whether this tile should affect pathfinding</td>
    </tr><tr>
        <td> array</td><td>Tile.properties</td><td></td><td>Properties to help identify this tile. Useful for water or terrain properties.</td>
    </tr><tr>
        <td> number</td><td>Tile.id</td><td></td><td>Internal unique ID</td>
    </tr><tr>
        <td> function</td><td>Tile.destroy</td><td></td><td>Remove this tile from the current room.</td>
    </tr><tr>
        <td> </td><td></td><td></td><td></td>
    </tr><tr>
        <td> <b>EngineResource</b></td><td>Sound</td><td></td><td></td>
    </tr><tr>
        <td> string</td><td>Sound.name</td><td></td><td>String used to identify the Sound</td>
    </tr><tr>
        <td> string</td><td>Sound.fileName</td><td></td><td>Location of file containing sound</td>
    </tr><tr>
        <td> boolean</td><td>Sound.resource</td><td></td><td>JS file resource from sound</td>
    </tr><tr>
        <td> function</td><td>Sound.play</td><td></td><td>Plays the sound</td>
    </tr><tr>
        <td> function</td><td>Sound.loop</td><td></td><td>Plays the sound, looping on completion</td>
    </tr><tr>
        <td> function</td><td>Sound.pause</td><td></td><td>Pauses the sound, retaining its current playback position</td>
    </tr><tr>
        <td> function</td><td>Sound.stop</td><td></td><td>Stops playing the sound, losing its current playback position</td>
    </tr><tr>
        <td> function</td><td>Sound.seek</td><td></td><td>Seeks to a point in the sound</td>
    </tr><tr>
        <td> function</td><td>Sound.setVolume</td><td></td><td>Set the volume at which to play the sound</td>
    </tr><tr>
        <td> function</td><td>Sound.mute</td><td></td><td>Mutes the sound, remembering previous volume</td>
    </tr><tr>
        <td> function</td><td>Sound.unmute</td><td></td><td>Unmutes the sound, returning its playback to its previous volume</td>
    </tr><tr>
        <td> function</td><td>Sound.setSpeed</td><td></td><td>Sets the speed at which to play the sound</td>
    </tr><tr>
        <td> number</td><td>Sound.id</td><td></td><td>Internal unique ID</td>
    </tr><tr> 
    </tr></tbody></table>
    
## How do I get in touch with the guy who made this?

The bat signal, or ben@benergize.com.
