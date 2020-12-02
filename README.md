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
<thead>
<tr>
	<th ><strong>Type</strong></th>
	<th><strong>Property</strong></th>
	<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
	<tr>
		<td ><strong>EngineResource</strong></td>
		<td>GameEngine(String canvasSelector || Object HTMLCanvasElement, fps=24)</td>
		<td>ID selector for canvas, game FPS</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.rooms</td>
		<td>Array of all rooms in the game, accessible to the engine.</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.sprites</td>
		<td>Array of all registered sprites.</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.resources</td>
		<td>Array of all registered files</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.objects</td>
		<td>Array of all registered objects.</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.sounds</td>
		<td>Array of all registered sounds (EngineResources, not files)</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.tiles</td>
		<td>Array of all registered tiles</td>
	</tr>
	<tr>
		<td >array</td>
		<td>GameEngine.backgrounds</td>
		<td>Array of all registered backgrounds</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.generateID</td>
		<td>Generates a new unique ID</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.checkKey(String KeyEvent.type)</td>
		<td>Function to check if key is currently being held</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.addRoom(EngineResource Room)</td>
		<td>Function to add rooms to game registry. This is done automatically when a room is created.</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.getRoom(Number ID || String roomName)</td>
		<td>Get a room object from either an ID or name</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.getCurrentRoom()</td>
		<td>Gets the currently active game room</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.setCurrentRoom(Number ID || String roomName)</td>
		<td>Switches game to a room</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.importTiles(JSON tileData)</td>
		<td>Import tileset from JSON. Useful for designing rooms in-game</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.begin()</td>
		<td>Start the game loop</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.getIntersecting(x1,y1,x2,y2)</td>
		<td>Get if two rectangles are intersecting based on their coordinates</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.mDistance(Number x1, Number y1, Number x2, Number y2)</td>
		<td>Returns Manhattan distance given two sets of coordinates.</td>
	</tr>
	<tr>
		<td >function</td>
		<td>GameEngine.distance(Number x1, Number y1, Number x2, Number y2)</td>
		<td>Returns Pythagorean distance given two sets of coordinates.</td>
	</tr>
	<tr>
		<td >number</td>
		<td>GameEngine.currentRoom</td>
		<td>Array index of current active game room.</td>
	</tr>
	<tr>
		<td >number</td>
		<td>GameEngine.fps</td>
		<td>Framerate at which the game will run</td>
	</tr>
	<tr>
		<td >object</td>
		<td>GameEngine.debug</td>
		<td>Debug flags</td>
	</tr>
	<tr>
		<td >object</td>
		<td>GameEngine.engine</td>
		<td>Object containing utilities and canvas data</td>
	</tr>
	<tr>
		<td >object</td>
		<td>GameEngine.engine.ctx</td>
		<td>Reference to 2D context. Can be used to draw to the canvas natively.</td>
	</tr>
	<tr>
		<td >object</td>
		<td>GameEngine.engine.importResource(String fileName, forceNewResource=false)</td>
		<td>Adds a file resource to the game's resource registry. This is mainly called internally.</td>
	</tr>
	<tr>
		<td >string</td>
		<td>GameEngine.status</td>
		<td>Current gamestate</td>
	</tr>
<tr><td colspan="3" class="divider"> </td></tr>
</tbody>
<tbody>
<tr>
<td ><strong>EngineResource</strong></td>
<td>GameObject(String name, Number x=0, Number y=0, EngineResource Sprite=-1, Function onstep=-1, Function ondraw=-1, Boolean visible=true, Boolean active=true, Array collisionBox=false || Boolean collisionBox=false, Number depth=0)</td>
<td>Building block of game interactivity.</td>
</tr>
<tr>
<td >array</td>
<td>GameObject.collisionBox</td>
<td>Coordinates to use when checking for collisions. Defaults to sprite width/height or 16x16 if no sprite is specified.<br/>collisionBox entries are [x,y,width,height].</td>
</tr>
<tr>
<td >boolean</td>
<td>GameObject.visible</td>
<td>Whether the object should draw a sprite and perform its draw event</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onstep()</td>
<td>Custom event to execute every game step (frame)</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.ondraw()</td>
<td>Custom event to execute every game draw (frame)</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.ondestroy()</td>
<td>Custom event to execute when the GameObject is destroyed via destroy()</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onkeypress(KeyboardEvent ev)</td>
<td>Custom event to handle key presses. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onkeyup(KeyboardEvent ev)</td>
<td>Custom event to handle key releases. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onkeydown(KeyboardEvent ev)</td>
<td>Custom event to handle key downs. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onmousedown(KeyboardEvent ev)</td>
<td>Custom event to handle mouse presses. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onmouseup(KeyboardEvent ev)</td>
<td>Custom event to handle mouse releases. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.onmousemove(KeyboardEvent ev)</td>
<td>Custom event to handle mouse movement. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.oncontextmenu(KeyboardEvent ev)</td>
<td>Custom event to handle right clicks. This recieves input events from native JavaScript event listeners. The first argument provides the data from the event.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.generatePath(Number x, Number y, Number gridWidth, number gridHeight)</td>
<td>Generate a path to a given location on a certain grid, avoiding solid objects. Note that this is an extremely performance-heavy function and should only be called when needed. Using a larger gridWidth/gridHeight decreases the performance cost, but lowers the path resolution..</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.pathStep(Number speed=0)</td>
<td>Take a step to/towards the next step in the path generated by generatePath(). A speed of 0 will make the object jump to its next coordinate. A non-zero speed will make the object execute moveTowardsPoint() towards its next path coordinate.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.moveTowardsPoint(Number x, Number y, Number speed)</td>
<td>Move towards given coordinates, ignoring objects in the way</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.moveInDirection(Number direction, Number speed)</td>
<td>Move at a given speed in a given direction (degrees)</td>
</tr>
	
<tr>
<td >function</td>
<td>GameObject.snapToGrid(Number gridWidth=room.gridWidth, Number gridHeight=room.gridHeight)</td>
<td>Snaps the GameObject's x and y coordinates to a specified grid.</td>
</tr>

<tr>
<td >function</td>
<td>GameObject.setDepth(Number z=0)</td>
<td>Set the position in the draw order (z-index)</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.destroy()</td>
<td>Remove this object from the current room</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.deactivate()</td>
<td>Prevent this object from performing any of its actions or drawing without removing it from the room.</td>
</tr>
<tr>
<td >function</td>
<td>GameObject.activate()</td>
<td>Reactivate the object</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.x</td>
<td>X coordinate of object in room</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.y</td>
<td>Y coordinate of object in room</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.sprite</td>
<td>EngineResource Sprite to draw at the GameObject's position in the room</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.hspeed</td>
<td>Horizontal speed</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.vspeed</td>
<td>Vertical speed</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.friction</td>
<td>Friction to apply to object's movements</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.gravity</td>
<td>Gravity to apply to object</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.gravityDirection</td>
<td>Direction of gravity to apply</td>
</tr>
<tr>
<td >number</td>
<td>GameObject.id</td>
<td>Internal unique ID</td>
</tr>
<tr>
<td >object</td>
<td>GameObject.path</td>
<td>Path generated by generatePath()</td>
</tr>
<tr>
<td >string</td>
<td>GameObject.name</td>
<td>String used to identify the object in a room</td>
</tr>
<tr><td colspan="3" class="divider"> </td></tr>
</tbody>
<tbody>
<tr>
	<td ><strong>EngineResource</strong></td>
	<td>Room</td>
<td></td>
</tr>
<tr>
	<td >array</td>
	<td>roomObjects</td>
	<td>All objects currently in the room</td>
</tr>
<tr>
	<td >array</td>
	<td>Room.tiles</td>
	<td>All tiles currently in the room</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.addObject(EngineResource GameObject, Boolean copy=false, sortDepth=true)</td>
	<td>Adds an object to this room. Specifying that it should be a copy will create a shallow copy of the object. It is recommended you create constructor functions for objects that need instances. sortDepth will cause the room to adjust the depth order according to the new object's depth. If the object's depth doesn't matter, setting sortDepth to false will slightly improve performance.</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.getObject(String objectName || Number ID)</td>
	<td>Get an object in the room given an ID or object name. If there are multiple objects with the name, it will return the first in the room array.</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.getObjects(String objectName)</td>
	<td>Get instances of an object in the room given an object name.</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.getTilesAt(Number x, Number y, Boolean solidOnly = false, Number width = 1, Number height = 1)</td>
	<td>Get all tiles at a given location</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.getObjectsAt(Number x, Number y, Boolean solidOnly = false, Number width = 1, Number height = 1)</td>
	<td>Get all objects at a given location</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.getAllAt(Number x, Number y, Boolean solidOnly = false, Number width = 1, Number height = 1)</td>
	<td>Get all objects and tiles at a given location</td>
</tr>
<tr>
	<td >function</td>
	<td>Room.checkEmpty(Number x, Number y, Boolean solidOnly = false, Number width = 1, Number height = 1)</td>
	<td>Check if there is anything at a given location</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.width</td>
	<td>Playable room width</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.height</td>
	<td>Playable room height</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.gridX</td>
	<td>Grid X dimension</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.gridY</td>
	<td>Grid Y dimension</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.view.x</td>
	<td>X to start drawing from</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.view.y</td>
	<td>Y to start drawing from</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.view.width</td>
	<td>Width of view to draw to</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.view.height</td>
	<td>Height of view to draw to</td>
</tr>
<tr>
	<td >number</td>
	<td>Room.id</td>
	<td>Internal unique ID</td>
</tr>
<tr>
	<td >object</td>
	<td>Room.background</td>
	<td>EngineResource Background to draw behind room</td>
</tr>
<tr>
	<td >object</td>
	<td>Room.view</td>
	<td>Object containing variables related to how the room is displayed on the canvas</td>
</tr>
<tr>
	<td >string</td>
	<td>Room.name</td>
	<td>String used to identify the object in a room</td>
</tr>
<tr>
	<td >string</td>
	<td>Room.view.objectName</td>
	<td>Object to follow with view</td>
</tr>
<tr><td colspan="3" class="divider"> </td></tr>

</tbody>
<tbody>
<tr>
<td ><strong>EngineResource</strong></td>
<td>Sprite(String spriteName, Number sheetX = 0, Number sheetY = 0, Number sheetWidth = 16, Number sheetHeight=16, Number drawWidth=16, Number drawHeight=16, Number animationSpeed = 1, Boolean forceNewResource=false)</td>
<td>An image loaded from an image file used to draw tiles, objects, and backgrounds. Sprites can be from sheets, or use entire images. They can be animated, or still.</td>
</tr>
<tr>
<td >boolean</td>
<td>Sprite.resource</td>
<td>File resource from image</td>
</tr>
<tr>
<td >function</td>
<td>Sprite.draw(Number x, Number y)</td>
<td>Draws the sprite. This is usually called automatically.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.speed</td>
<td>Animation speed, if applicable</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.sheetX</td>
<td>X to start taking sprite from. This is primarily for sprite sheets where the sprite you want to draw may not be at position 0,0. For animations, specify an array of X positions.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.sheetY</td>
<td>Y to start taking sprite from. This is primarily for sprite sheets where the sprite you want to draw may not be at position 0,0. For animations, specify an array of Y positions.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.sheetWidth</td>
<td>Width of sprite on the sheet. This is primarily for sprite sheets where the sprite you want to draw may be smaller than the entire sheet.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.sheetHeight</td>
<td>Height of sprite on the sheet. This is primarily for sprite sheets where the sprite you want to draw may be smaller than the entire sheet.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.drawWidth</td>
<td>Actual width to draw sprite in room. This will scale the sprite.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.drawHeight</td>
<td>Actual height to draw sprite in room. This will scale the sprite.</td>
</tr>
<tr>
<td >number</td>
<td>Sprite.id</td>
<td>Internal unique ID</td>
</tr>
<tr>
<td >string</td>
<td>Sprite.name</td>
<td>String used to identify the sprite</td>
</tr>
<tr>
<td >string</td>
<td>Sprite.fileName</td>
<td>Location of file containing image or images</td>
</tr>
<tr><td colspan="3" class="divider"> </td></tr>
</tbody>
<tbody>
	<tr>
		<td ><strong>EngineResource</strong></td>
		<td>Background(String color, EngineResource Sprite=-1, Boolean tiled=true)</td>
		<td>An image or color to be drawn in a room behind all objects and tiles.</td>
	</tr>
	<tr>
		<td >string</td>
		<td>Background.color</td>
		<td>Color to draw to in room, if no sprite is present.</td>
	</tr>
	<tr>
		<td >string</td>
		<td>Background.colour</td>
		<td>Alias of color for our friends across the pond.</td>
	</tr>
	<tr>
		<td >number</td>
		<td>Background.sprite</td>
		<td>EngineResource Sprite to draw in room, either tiled or not.</td>
	</tr>
	<tr>
		<td >boolean</td>
		<td>Background.tiled</td>
		<td>Whether or not to tile the sprite in the room, if it is not larger than the room.</td>
	</tr>
	<tr>
		<td >function()</td>
		<td>Background.draw</td>
		<td>Draw the background. This is usually called automatically.</td>
	</tr>
<tr><td colspan="3" class="divider"> </td></tr>
</tbody>
<tbody>
	<tr>
		<td ><strong>EngineResource</strong></td>
		<td>Tile(String name, EngineResource Sprite=EngineResource Sprite(), Number x=0, Number y=0, Boolean solid=false, Array properties=[])</td>
		<td>Decorative element to be drawn in a room. Like an object, these can be pathable, but they cannot have scripts or events attached to them.</td>
	</tr>
	<tr>
		<td >array</td>
		<td>Tile.properties</td>
		<td>Properties to help identify this tile. Useful for water or terrain properties.</td>
	</tr>
	<tr>
		<td >boolean</td>
		<td>Tile.solid</td>
		<td>Whether this tile should affect pathfinding</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Tile.destroy()</td>
		<td>Remove this tile from the current room.</td>
	</tr>
	<tr>
		<td >number</td>
		<td>Tile.x</td>
		<td>X coordinate of tile in room</td>
	</tr>
	<tr>
		<td >number</td>
		<td>Tile.y</td>
		<td>Y coordinate of tile in room</td>
	</tr>
	<tr>
		<td >number</td>
		<td>Tile.id</td>
		<td>Internal unique ID</td>
	</tr>
	<tr>
		<td >object</td>
		<td>Tile.sprite</td>
		<td>EngineResource Sprite to draw at the Tiles position in the room</td>
	</tr>
	<tr>
		<td >string</td>
		<td>Tile.name</td>
		<td>String used to identify the object in a room</td>
	</tr>
	<tr><td colspan="3" class="divider"> </td></tr>
</tbody>
<tbody>
	<tr>
		<td ><strong>EngineResource</strong></td>
		<td>Sound(String soundName, String fileName, Number volume=1,Boolean forceNewResource=false)</td>
		<td>EngineResource to play audio in game.</td>
	</tr>
	<tr>
		<td >boolean</td>
		<td>Sound.resource</td>
		<td>JS file resource from sound</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.play(Number volume)</td>
		<td>Plays the sound</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.loop()</td>
		<td>Plays the sound, looping on completion</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.pause()</td>
		<td>Pauses the sound, retaining its current playback position</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.stop()</td>
		<td>Stops playing the sound, losing its current playback position</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.seek(Number time)</td>
		<td>Seeks to a point in the sound</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.setVolume(Number volume)</td>
		<td>Set the volume at which to play the sound</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.mute()</td>
		<td>Mutes the sound, remembering previous volume</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.unmute()</td>
		<td>Unmutes the sound, returning its playback to its previous volume</td>
	</tr>
	<tr>
		<td >function</td>
		<td>Sound.setSpeed(Number speed)</td>
		<td>Sets the speed at which to play the sound</td>
	</tr>
	<tr>
		<td >number</td>
		<td>Sound.id</td>
		<td>Internal unique ID</td>
	</tr>
	<tr>
		<td >string</td>
		<td>Sound.name</td>
		<td>String used to identify the Sound</td>
	</tr>
	<tr>
		<td >string</td>
		<td>Sound.fileName</td>
		<td>Location of file containing sound</td>
	</tr>
</tbody>
</table>

## How do I get in touch with the guy who made this?

The bat signal, or ben@benergize.com.
