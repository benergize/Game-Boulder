function GameEngine(canvas, fps=24) {
	
	this.rooms = [];
	this.sprites = [];
	this.resources = [];
	this.objects = [];
	this.sounds = [];
	this.tiles = [];
	this.backgrounds = [];

	this.currentRoom =  -1;
	this.status = "active";
	this.fps = fps;

	this.timing = {fps:fps, currentTime:0, lastUpdate:0};

	this.debug = { showCBoxes: false };

	this.registry = 0;

	this.generateID = function() {
		this.registry++;
		return this.registry;
	};

	this.getEngineResources = function(search = -1) {

		let res = this.rooms.concat(this.sprites).concat(this.resources).concat(this.objects).concat(this.sounds).concat(this.tiles).concat(this.backgrounds);
		return search === -1 ? res : res.filter(el=>{ return typeof search === "number" ? el.id === search : el.name === search; });
	}

	this.getSprite = function(search = "") {
		return typeof search === "object" ? search : 
			this.sprites.filter(spr=>{return typeof search === "number" ? spr.id === search : spr.name === search; })[0];
	}

	this.keysHeld = {};

	this.checkKey = function(key) {

		if(typeof this.keysHeld[key] === 'undefined') { return false; }
		return this.keysHeld[key];
	}
	
	this.update = function(test) {

		let self = this; 
		requestAnimationFrame(function() { self.update(); });

		this.timing.currentTime = Date.now();

		if(this.timing.currentTime - this.timing.lastUpdate > 1000/this.timing.fps || this.timing.lastUpdate === 0) {
			this.timing.lastUpdate = this.timing.currentTime;
		}
		else { return false; }
		

		
		let room = this.rooms[this.currentRoom];
	
		if(typeof room === "undefined") { return false; }

		
		//this.engine.ctx.clearRect(0,0,this.engine.canvas.width,this.engine.canvas.height);
		 

		room.draw();
		
		room.roomObjects.forEach(obj=>{
			
			if(obj.active) {
			
				obj.builtInPhysics();

				if(typeof obj.onstep === "function") { obj.onstep(); }
  
				if(obj.visible) {

					if(typeof obj.ondraw === "function") { obj.ondraw(); }
					if(typeof obj.sprite === "object" && !obj.getOutsideView()) { obj.sprite.draw(obj.x, obj.y); }
					
					if(this.debug.showCBoxes) { this.engine.ctx.strokeRect(-room.view.x + obj.x+obj.collisionBox[0], -room.view.y + obj.y+obj.collisionBox[1], obj.collisionBox[2],obj.collisionBox[3]); }
				}
			}
			
		});

		if(this.debug.drawGrid) {

			for(let x = 0; x < room.width; x += room.gridX) {

				for(let y = 0; y < room.height; y += room.gridY) {

					this.engine.ctx.strokeRect(-room.view.x+x,-room.view.y+y,room.gridX,room.gridY);
				}
			}
		}
 
	},

	this.addRoom = function(room) {

		if(typeof room !== "object") { return false; }

		this.rooms.push(room);
	}
	
	this.getRoom = function(ind) { 

		this.rooms.forEach(roo=>{
			if(roo[typeof ind === "string" ? "name" : "id"] === ind) { return roo; }
		});
	},
	
	this.getCurrentRoom = function() {
		
		return typeof this.rooms[this.currentRoom] !== "undefined" ? this.rooms[this.currentRoom] : false;
	},

	this.setCurrentRoom = function(ind) {

		let newRoom = -1;

		if(typeof ind === "number" && typeof this.rooms[ind] === "object") { newRoom = ind; }
		else if(typeof ind === "string") {
			for(let i = 0; i < this.rooms.length; i++) { if(this.rooms[i].name === ind) { newRoom = i; } }
		}
		else if(typeof ind === "object") {
			for(let i = 0; i < this.rooms.length; i++) { if(this.rooms[i].id === ind.id) { newRoom = i; } }
		}
		
		if(newRoom !== -1) { 
			this.currentRoom = newRoom;  
			this.rooms[this.currentRoom].roomStart();
			return true; 
		}
		else { return false; }
	}
	
	this.importTiles = function(tiles) {

		let croom = this.getCurrentRoom();

		tiles.forEach(tile=>{

			for(let i = 0; i < this.sprites.length; i++) {

				let ref = this.sprites[i];
				let sprite = tile.sprite;
				let props = ["fileName", "sheetX", "sheetY", "sheetWidth", "sheetHeight", "drawWidth", "drawHeight"];
				let match = true;

				props.forEach(prop=>{
					if(ref[prop] !== sprite[prop]) { match = false; }
				});

				if(match) { tile.sprite = this.sprites[i]; break; }
			}

			tile.sprite = new Sprite(tile.sprite.fileName,tile.sprite.sheetX,tile.sprite.sheetY,tile.sprite.sheetWidth,tile.sprite.sheetHeight,tile.sprite.drawWidth,tile.sprite.drawHeight);
			this.addSprite(tile.sprite);

			croom.tiles.push(tile);
		});
		//{"sprite":{"fileName":"game/sprites/tilese2.png","resource":{},"sheetX":0,"sheetY":0,"sheetWidth":32,"sheetHeight":48,"drawWidth":32,"drawHeight":48,"id":38},"x":288,"y":240,"solid":true,"properties":[],"id":39}
	}


	this.begin = function() { 
		//setInterval(fn=>{this.update();}, 1000 / this.fps); 
		let self = this;
		requestAnimationFrame(function() { self.update(); });
	}

	this.getIntersecting = function(ax1,ay1,ax2,ay2,bx1,by1,bx2,by2) {

		return (
			(
				((ax1 >= bx1 && ax1 <= bx2) || (ax2 >= bx1 && ax2 <= bx2) || (ax2 <= bx1 && ax2 >= bx2) || (ax1 <= bx1 && ax2 >= bx2)) && 
				((ay1 >= by1 && ay1 <= by2) || (ay2 >= by1 && ay2 <= by2) || (ay1 <= by1 && ay2 >= by2) || (ay1 <= by1 && ay2 >= by2))
			)
		);
	}

	this.mDistance = function(x1,y1,x2,y2) {
		return Math.abs(x1-x2) + Math.abs(y1-y2);
	}
	this.distance = function(x1,y1,x2,y2,precise=true) {
		return precise?(Math.sqrt((Math.abs(x1-x2)**2) + (Math.abs(y1-y2)**2))):this.mDistance(x1,y1,x2,y2);
	}
	this.getPointDirection = function(direction, distance) {
		
		var rad = (-direction) * .01745329251;
		let x = (Math.cos(rad) * distance);
		let y = (Math.sin(rad) * distance);

		return [x,y];
	}
	this.getPointDir = this.getPointDirection;

	this.snap = function(number,snapTo) { return Math.round(number/snapTo) * snapTo; }	
	this.random = function(min=0,max=1) { return (Math.random() * ((max)-min)) + min;  }
	this.irandom = function(min=0,max=1) { return Math.floor(Math.random() * ((max+1)-min)) + min;  }


	this.engine = {};
	this.engine.canvas = typeof canvas === "object" ? canvas : document.querySelector(canvas);
	this.engine.ctx = this.engine.canvas.getContext("2d");

	this.engine.workingCanvas = document.createElement("canvas");
	this.engine.workingCtx = this.engine.workingCanvas.getContext("2d");

	this.engine.localFilter = function(input) {
		return typeof input === "string" ? input.replace("file:///","").replace(/\\/g,"/") : false;
	}

	this.engine.ris = function(input, fallback) {

		return typeof input !== "undefined" ? input : fallback;
	}

	this.engine.importResource = function(fileName, forceNewResource = false) {
		
		let resource;
		fileName = GAME_ENGINE_INSTANCE.engine.localFilter(fileName);

		try {
			
			if(!forceNewResource) {
	
				let filteredResources = GAME_ENGINE_INSTANCE.resources.filter(res=>{ return res.src === fileName; });
	
				if(filteredResources.length > 0) {
	
					resource = filteredResources[0];
				}
				else { forceNewResource = true; }
			}
	
			//Do not change this to an else or else if.
			if(forceNewResource) {
				
	
				if(fileName.match(/\.(png|tiff|bmp|jpg|jpeg|gif|jpg2000|jpeg2000|raw|webm|svg|tga|apng|ico)/i) != null) {
					
					resource = document.createElement("img");
					resource.src = fileName;
				}
				else if(fileName.match(/\.(wav|mp3|ogg|midi|mid|flac|wma|m3u)/i) != null) {

					resource = new Audio(fileName);
				}
				else { return false; }


				GAME_ENGINE_INSTANCE.resources.push(resource);
			}

			return resource;
	
		}
		catch(error) {
			
			console.error("Engine Error", error);
			return false;
		}
	}
	

	window.GAME_ENGINE_INSTANCE = this;

	return this;
};
 
["keydown","keyup","keypress","mousedown","mouseup","mousemove","contextmenu"].forEach(event=>{
	window.addEventListener(event, e=>{ 
 
		if(typeof GAME_ENGINE_INSTANCE === "undefined") { return false; }

		if(typeof e.type != "undefined") {

			GAME_ENGINE_INSTANCE.keysHeld[e.key] = e.type == "keypress" || e.type == "keydown";
		}

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom(); 
		if(typeof croom === "object") { 

			croom.roomObjects.forEach(obj=>{ if(typeof obj["on" + event] === "function") { 

				let local = (e.type.indexOf("mouse")!==-1||e.type.indexOf('context')!==-1) && GAME_ENGINE_INSTANCE.getIntersecting(obj.x+obj.collisionBox[0],obj.y+obj.collisionBox[1],
					obj.x+obj.collisionBox[0]+obj.collisionBox[2],obj.y+obj.collisionBox[1]+obj.collisionBox[3],e.x,e.y,e.x,e.y);
					obj["on" + event](e,local);
			} });  
		}
	});
});function Background(arg0, sprite = -1, tiled = true) {
	
	let argObj = typeof arg0 === "object";
	
	this.color = argObj ? arg0.color : arg0;
	this.colour = this.color;
	this.sprite = argObj ? arg0.sprite : sprite;
	this.tiled = argObj ? arg0.tiled : tiled;
	
	this.draw = function() {
		
		let currentRoom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		let engine = GAME_ENGINE_INSTANCE.engine;
		let oldFill = engine.ctx.fillStyle;
		
		engine.ctx.fillStyle = this.color;
		engine.ctx.fillRect(0, 0, currentRoom.width, currentRoom.height);
		
		engine.ctx.fillStyle = oldFill;
		
		if(typeof this.sprite === "object") {
			
			if(this.tiled) {
				
				for(let x = 0; x < currentRoom.width; x += this.sprite.drawWidth) {
					
					for(let y = 0; y < currentRoom.height; y += this.sprite.drawHeight) {
						
						this.sprite.draw(x, y);
					}
				}
			}
			else { this.sprite.draw(0, 0); }
		}
	}

	GAME_ENGINE_INSTANCE.backgrounds.push(this);
	
	return this;
}function GameObject(arg0, x = 0, y = 0, sprite = -1, step = -1, draw = -1, destroy = -1, visible = true, active = true, collisionBox = false, depth = 0) {
	
	let argObj = typeof arg0 === "object";
	
	this.name = argObj ? arg0.name : arg0;
	this.x = argObj ? arg0.x : x;
	this.y = argObj ? arg0.y : y;
	this.xstart = x;
	this.ystart = y;
	this.xprevious = x;
	this.yprevious = y;

	this.sprite = argObj ? arg0.sprite : sprite;

	this.depth = depth;
	
	this.visible = argObj ? arg0.visible : visible;
	this.active = argObj ? arg0.active : active;
	
	this.onstep = argObj ? arg0.step : step;
	this.ondraw = argObj ? arg0.draw : draw;
	this.ondestroy = argObj ? arg0.destroy : destroy;
	
	this.hspeed = 0;
	this.vspeed = 0;
	this.friction = 0;
	this.gravity = 0;
	this.gravityDirection = 0;
	this.fallSpeed = 0;
	this.terminalVelocity = 24;

	this.collisionBox = collisionBox === false ? typeof this.sprite === "object" ? [0,0,this.sprite.drawWidth,this.sprite.drawHeight] : [0,0,16,16] : collisionBox;
	
	this.id = GAME_ENGINE_INSTANCE.generateID();

	this.getCoordinates = function(object=true) {
		
		let coords = {
			x1: this.x + this.collisionBox[0], 
			y1: this.y + this.collisionBox[1], 
			x2: this.x + this.collisionBox[0] + this.collisionBox[2], 
			y2: this.y + this.collisionBox[1] + this.collisionBox[3]
		};
		return object ? coords : [coords.x1, coords.y1, coords.x2, coords.y2] ;
	}

	this.getCoords = this.getCoordinates;

	this.builtInPhysics = function() {

		//Gather H&V collisions at a distance of the speed we're going
		let hcols = this.getCollisions(this.hspeed, 0, true);
		let vcols = this.getCollisions(0, this.vspeed, true);

		//If there are collisions horizontally and we're moving
		if(hcols.length > 0 && this.hspeed !== 0) { 

			//Snap collision box to collision box.
			this.x = this.hspeed < 0 ? 
				(hcols[0].getCoords().x2 - this.collisionBox[0]) + 1 : 
				-1 + (hcols[0].getCoords().x1 - (this.collisionBox[2]-this.collisionBox[0]))+(this.x-this.getCoords().x1)*2; 

			//Stop!
			this.hspeed = 0; 
		}

		//Otherwise, go horizontally
		else { this.x += this.hspeed; }

		//If there are collisions vertically and we're moving
		if(vcols.length > 0 && this.vspeed !== 0) { 
			
			//Snap collision box to collision box.
			this.y = this.vspeed < 0 ? 
				(vcols[0].getCoords().y2-this.collisionBox[1]) + 1 :
				-1 + (vcols[0].getCoords().y1 - (this.collisionBox[3]+this.collisionBox[1])); 

			//Stop!
			this.vspeed = 0;  
		}

		//Otherwise, go horizontally
		else { this.y += this.vspeed;}

		//Set a new xprevious and yprevious if we've moved.
		if(this.x != this.xprevious) { this.xprevious = this.x; }
		if(this.y != this.yprevious) { this.yprevious = this.y; }
		
		//-- -- -- Begin Gravity -- -- --//
		
		//Get the next point we'll be based on our gravity direction and present fallSpeed
		//NOTE THAT getPointDir RETURNS AN OFFSET, NOT THE ABSOLUTE X AND Y COORDS
		let coord = GAME_ENGINE_INSTANCE.getPointDir(this.gravityDirection, this.fallSpeed);
 
		//Get any collisions at that coordinate
		let gcol = this.getCollisions(coord[0],coord[1], true);

		//If we're under the effects of gravity
		if(this.gravity != 0) {

			//If there are no collisions
			if(gcol.length <= 0) {
				
				//Increase our fallSpeed, keeping it below terminalVelocity
				this.fallSpeed = Math.min(this.terminalVelocity, this.fallSpeed + this.gravity);

				//And move us to the new coordinate offset.
				this.x += coord[0];
				this.y += coord[1];

				//Apply drag, (coords are a delta, so this is really subtracting from the speed)
				this.hspeed += coord[0];
				this.vspeed += coord[1];

				//Apply minified friction
				this.hspeed = Math.abs(this.hspeed) <= this.friction ? 0 : this.hspeed - (this.friction/4 * (Math.abs(this.hspeed)/this.hspeed));
				this.vspeed = Math.abs(this.vspeed) <= this.friction ? 0 : this.vspeed - (this.friction/4 * (Math.abs(this.vspeed)/this.vspeed));
			}

			//If there are collisions...
			else {

				//Move us to the solid object in the direction of gravity
				this.moveContactSolid(this.gravityDirection,-1); 

				//Stop our fall
				this.fallSpeed = 0;   

				//Apply friction
				this.hspeed = Math.abs(this.hspeed) <= this.friction ? 0 : this.hspeed - (this.friction * (Math.abs(this.hspeed)/this.hspeed));
				this.vspeed = Math.abs(this.vspeed) <= this.friction ? 0 : this.vspeed - (this.friction * (Math.abs(this.vspeed)/this.vspeed));
		
			}
		}
		else {
			
			//Set fallSpeed to zero in case gravity was just on and it's now stopped.
			this.fallSpeed = 0;
			
			//Apply friction
			this.hspeed = Math.abs(this.hspeed) <= this.friction ? 0 : this.hspeed - (this.friction * (Math.abs(this.hspeed)/this.hspeed));
			this.vspeed = Math.abs(this.vspeed) <= this.friction ? 0 : this.vspeed - (this.friction * (Math.abs(this.vspeed)/this.vspeed));
			
		}
	}

	this.moveContactSolid = function(dir,maxDist=-1) {

		if(maxDist === -1) { maxDist = Math.max(GAME_ENGINE_INSTANCE.getCurrentRoom().height,GAME_ENGINE_INSTANCE.getCurrentRoom().width); }
		let lastCoord = [this.x,this.y];

		for(let dist = 0; dist < maxDist; dist++) {

			let coord = GAME_ENGINE_INSTANCE.getPointDir(dir,dist);
			if(this.getCollisions(coord[0],coord[1],true).length > 0) {
				this.x += lastCoord[0];
				this.y += lastCoord[1];
				return dist;
			}
			lastCoord = coord;
		}
		return false;
		
	}

	this.getCollisions = function(offsetX = 0, offsetY = 0,solidOnly=false) {

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		let coords = this.getCoords();

		let x1 = coords.x1 + offsetX;
		let x2 = coords.x2 + offsetX;
		let y1 = coords.y1 + offsetY;
		let y2 = coords.y2 + offsetY;

		return croom.getAllAt(x1,y1,solidOnly,x2-x1,y2-y1,[this.id]);
	}

	this.getOutsideRoom = function() {
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		let coords = this.getCoords();

		if(coords.x2 < 0 || coords.x1 > croom.width || coords.y2 < 0 || coords.y1 > croom.height) {
			return true;
		}
		else {
			return false;
		}
	}

	this.getOutsideView = function() {
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		let view = croom.view;
		let coords = this.getCoords();

		if(coords.x2 < view.x || coords.x1 > view.x+view.width || coords.y2 < view.y || coords.y1 > view.y+view.height) {
			return true;
		}
		else {
			return false;
		}
	}

	this.generateDepthPath = function(startX, startY, destX, destY, weightedNodes, struckNodes = []) {
		
		//Starting wherever we are in the breadth search
		let path = [[startX+","+startY]];

		for(let panic = 0; panic < 90; panic++) {

			let currentCoords = path[path.length-1];
			let currentNode = weightedNodes[currentCoords];
			if(typeof currentNode != "undefined") { 
				
				//If we're here, return the path we took to get here.
				if(currentCoords == destX+","+destY) { return [true, path]; }

				//The only viable nodes for this search are ones that A. haven't been struck in other searches,
				//and B. are closer than the current node
				let viable = currentNode.exits.filter(adjacentNode=>{ /**/ 
					return struckNodes.indexOf(adjacentNode) === -1 &&
					weightedNodes[adjacentNode].dist <= currentNode.dist &&
					path.indexOf(adjacentNode) === -1; 
				});

				//If there are viable nodes
				if(viable.length > 0) {

					//Go to the closest one
					let lowest = viable.sort( (a, b)=>{ return weightedNodes[a].dist - weightedNodes[b].dist; })[0];
					//console.log('lowest',lowest);
					path.push(lowest);
				}
				else {

					//Otherwise, return that it was a bust.
					return [false,path];
				}
			}
			else {
				//console.log('lost in space at ' + currentCoords);
			}
		}

		return [false, 'panicked'];
	}
	
	this.generatePath = function(dx,dy,gridX,gridY) {

		function Path(oldPath, oldWeight = 0, newNode = -1) {

			this.path = newNode == -1 ? oldPath : oldPath.concat(newNode);
			this.weight = oldWeight;

			if(newNode !== -1) {
				
				let newCoords = newNode.split(","); 
				this.weight += mapNodes[newCoords[0]+','+newCoords[1]]//Math.sqrt(Math.abs(destX - newCoords[0])**2 + Math.abs(destY - newCoords[1])**2)
			}
			
			return this;
		}

		let startX = Math.round(this.x / gridX);
		let startY = Math.round(this.y / gridY);

		let destX = Math.round(dx / gridX);
		let destY = Math.round(dy / gridY); 

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
 
		//let mapNodes = croom.mapNodes;

		let mapNodes = {};
		for(let i in croom.mapNodes) {

			let coords = i.split(",");
			mapNodes[i] = {
				exits: Array.from(croom.mapNodes[i].exits),
				dist: Math.abs(coords[0] - destX) + Math.abs(coords[1] - destY)//Math.sqrt(Math.abs(coords[0] - destX)**2 + Math.abs(coords[1] - destY)**2)
			};
		}

		let allPaths = [new Path([startX + "," + startY])];
		let masterPath = [];
		let victoryPath = {path:-1,weight:-1};

		let pathsActive = false;

		for(let panic = 0; panic < 50; panic++) {

			let newPaths = []; 
			let shortest = {dist:9999999,index:-1}; 

			for(let i = 0; i < allPaths.length; i++) {

				let pathObj = allPaths[i];
				let path = pathObj.path;

				if(path.length < victoryPath.path.length || (path.length === victoryPath.path.length && path.weight < victoryPath.weight) || victoryPath.path === -1) {

					let currentNode = path[path.length-1]; 

					if(typeof mapNodes[currentNode] !== "undefined") { 


						if(currentNode === (destX + "," + destY)) {

							victoryPath = pathObj;
							pathsActive = false;
							break;
							
						}

						else {


							mapNodes[currentNode].exits.forEach(exit=>{

								if(typeof mapNodes[exit] != "undefined" && path.indexOf(exit) === -1 && masterPath.indexOf(exit) === -1) {

									pathsActive = true;
									let newPath = new Path(path, pathObj.weight, exit);
									newPaths.push(newPath);
									if(mapNodes[exit].dist < shortest.dist) { shortest.dist = mapNodes[exit].dist; shortest.index = newPaths.length-1; }
									masterPath.push(exit);
								}
								
							});

						}
					}
				}
			}
			

			if(shortest.index !== -1) {

				let shortestPath = newPaths[shortest.index];
				let coords = shortestPath.path[shortestPath.path.length-1].split(",");
				let depthPath = this.generateDepthPath(coords[0],coords[1],destX,destY,mapNodes,masterPath);
				
				if(depthPath[0]) { 
					newPaths[shortest.index].path = shortestPath.path.concat(depthPath[1].slice(1));
				}


			}
			
			

			
			if(!pathsActive) { break; }
			else { 
				allPaths = Array.from(newPaths);  
			}
		}

		this.path = {path: Array.isArray(victoryPath.path) ? victoryPath.path.slice(1) : -1,gridX:gridX,gridY:gridY};

		return victoryPath;
	}

	this.path = {path:[],gridX:32,gridY:32};

	this.wrap = function(wrapX = true, wrapY = true) {
		let wrapped = 0;
		let x1 = this.x + this.collisionBox[0];
		let x2 = this.x + this.collisionBox[0] + this.collisionBox[2];
		let y1 = this.y + this.collisionBox[1];
		let y2 = this.y + this.collisionBox[1] + this.collisionBox[3];
		if(wrapX) {
			if(x1 > GAME_ENGINE_INSTANCE.getCurrentRoom().width) { this.x = -(this.collisionBox[0] + this.collisionBox[2]); }
			else if(x2 < 0) { this.x = GAME_ENGINE_INSTANCE.getCurrentRoom().width; }
			wrapped++;
		}
		if(wrapY) {
			if(y1 > GAME_ENGINE_INSTANCE.getCurrentRoom().height) { this.y = -(this.collisionBox[1] + this.collisionBox[3]);; }
			else if(y2 < 0) { this.y = GAME_ENGINE_INSTANCE.getCurrentRoom().height; }
			wrapped++;
		}
		return wrapped;
	}

	this.pathStep = function(speed=0) {

		if(this.path.path.length === 0 || this.path.path === -1) { return false; }

		//console.log(this.path);

		let path = this.path.path;
		let thisStep = path[0].split(","); 

		let dest = [thisStep[0] * this.path.gridX, thisStep[1] * this.path.gridY];

		if(speed === 0) {
			this.x = dest[0];
			this.y = dest[1];
		}
		else {

			this.moveTowardsPoint(dest[0],dest[1],speed);
		}

	//	console.log(Math.abs(this.x - dest[0]) + Math.abs(this.y - dest[1]));
  
		let roughDist = Math.sqrt((Math.abs(this.x - dest[0]) ** 2) + (Math.abs(this.y - dest[1]) ** 2));
 
		if(roughDist < speed || speed == 0) { this.path.path = this.path.path.slice(1); }
		if(this.path.path.length === 0) { this.x = dest[0]; this.y = dest[1]; }

		return true;
	}

	this.moveTowardsPoint = function(x, y, speed) {
		
		let distance = Math.sqrt(((x - this.x)**2) + ((y - this.y)**2));

		if(distance > 0){
			this.x += ((x - this.x) * speed) / distance;
			this.y += ((y - this.y) * speed) / distance;

			return true;
		}
		return false;
	}

	this.moveInDirection = function(direction, speed) {
		 
		let os = GAME_ENGINE_INSTANCE.pointDirection(direction,speed);
		this.x = this.x + os[0];
		this.y = this.y + os[1];
		return true;
 
	}

	this.setDepth = function(depth=0) {

		this.depth = depth;

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		if(croom) {
			croom.sortDepth();
		}
	}

	this.setSprite = function(spr, frameX = -1, frameY=-1, speed=false, scaleX=false, scaleY=false, overRide=false) {

		spr = GAME_ENGINE_INSTANCE.getSprite(spr);
		if(typeof spr === "undefined") { console.warn("EngineResource Sprite not found matching ", spr); return false; }

		if(this.sprite.name != spr.name || overRide) {
			this.sprite = spr;
			this.sprite.setFrame(frameX === -1 ? this.sprite.frameX : frameX, frameY === -1 ? this.sprite.frameY : frameY);
			this.sprite.speed = speed === false ? this.sprite.speed : speed;
			this.sprite.scaleX = scaleX === false ? this.sprite.scaleX : scaleX;
			this.sprite.scaleY = scaleY === false ? this.sprite.scaleY : scaleY;
		}
		return true;
		
	}
	
	this.destroy = function() {
 
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom()

		let newObjArray = croom.roomObjects.filter(obj=>{ return obj.id !== this.id; });
		croom.roomObjects = newObjArray;

		if(typeof this.ondestroy === 'function') { this.ondestroy(); }

		return delete this;
	}

	this.deactivate = function() { return this.active = false; }
	this.activate = function() { return this.active = true; }

	this.snapToGrid = function(width=-1,height=-1) {

		if(width === -1) { width = GAME_ENGINE_INSTANCE.getCurrentRoom().gridX; }
		if(height === -1) { height = GAME_ENGINE_INSTANCE.getCurrentRoom().gridY; }

		if(width <= 0 || height <= 0) { console.error("Must snap to at least 1x1 grid."); return false; }
		
		this.x = Math.round(this.x/width) * width;
		this.y = Math.round(this.y/height) * height;

		return true;
	}
	
	GAME_ENGINE_INSTANCE.objects.push(this);
	
	return this;
}function Instance(obj, limit = 25, _firstCall=true) {

	let target = typeof obj === "object" ? obj : GAME_ENGINE_INSTANCE.getEngineResources(obj)[0];
	
	try {

		if(limit <= 0) { throw "Recursed too many times."; }

		for(let prop in target) {
			let val = target[prop];

			if(typeof val === "number") { this[prop] = Number(val); }
			if(typeof val === "string") { this[prop] = String(val); } 
			if(typeof val === "function" || typeof val === "boolean") { this[prop] = val; } 
			if(typeof val === "object") {
				if(Array.isArray(val)) {
					this[prop]=[];
					for(let i = 0; i < val.length; i++) { 
						this[prop][i] = typeof val[i] === "object" ? new Instance(val[i], limit-1, false) : val[i];
					}
				}
				else {
					this[prop] = String(val.__proto__).indexOf("HTML") !== -1 ? val : new Instance(val, limit-1, false); 
				}
			}
		}
		
		
	}
	catch(e) {
		console.error("Value copy failed", obj, e);
		return null;
	}

	if(_firstCall) { this.id = GAME_ENGINE_INSTANCE.generateID(); }

	return this;
}function Sprite(arg0, fileName, sheetX = 0, sheetY = 0, sheetWidth = 16, sheetHeight = 16, drawWidth = 16, drawHeight = 16, animationSpeed=1, forceNewResource = false, onanimationend = -1) {
	
	let argObj = typeof arg0 === "object";
	
	let engine = GAME_ENGINE_INSTANCE.engine;
	
	this.name = arg0;
	this.fileName = argObj ? arg0.fileName : fileName;
	this.resource = engine.importResource(this.fileName, forceNewResource);

	this.frameX = 0;
	this.frameY = 0;
	this.speed = animationSpeed;

	this.sheetX = argObj ? arg0.sheetX : sheetX;
	this.sheetY = argObj ? arg0.sheetY : sheetY;
	this.sheetWidth = argObj ? arg0.sheetWidth : sheetWidth;
	this.sheetHeight = argObj ? arg0.sheetHeight : sheetHeight;
	this.drawWidth = argObj ? arg0.drawWidth : drawWidth;
	this.drawHeight = argObj ? arg0.drawHeight : drawHeight;
	this.animated = Array.isArray(this.sheetX) || Array.isArray(this.sheetY);
	this.framesX = (Array.isArray(this.sheetX) ? this.sheetX.length : 0);
	this.framesY = (Array.isArray(this.sheetY) ? this.sheetY.length : 0);
	this.frames = Math.max(this.framesX,this.framesY);
	this.frame = 0;
	this.onanimationend = onanimationend;
	this.scaleX = 1;
	this.scaleY = 1;
	this.workingResource = this.resource;
	this.lastDrawScaled = false;

	this.id = GAME_ENGINE_INSTANCE.generateID();

	if(Array.isArray(this.sheetX) && Array.isArray(this.sheetY)) { if(this.sheetX.length !== this.sheetY.length) { console.warn("Warning: (X,Y) frame count mistmatch in " + this.name + "."); } }
	
	this.draw = function(x, y) {
		
		let engine = GAME_ENGINE_INSTANCE.engine; 
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();

		try {

			if(x - croom.view.x <= croom.view.width + this.drawWidth && y - croom.view.y <= croom.view.height + this.drawHeight) {

				let xPos = Array.isArray(this.sheetX) ? this.sheetX[Math.round(this.frameX)] : this.sheetX;
				let yPos = Array.isArray(this.sheetY) ? this.sheetY[Math.round(this.frameY)] : this.sheetY;

				if(this.scaleX != 1 || this.scaleY != 1) {
					engine.ctx.save();
					engine.ctx.translate(x-croom.view.x,y-croom.view.y);
					//engine.ctx.translate(x,y);
					engine.ctx.scale(this.scaleX, this.scaleY); x = croom.view.x; y = croom.view.y;
				}
				engine.ctx.drawImage(this.resource, xPos, yPos, this.sheetWidth, this.sheetHeight, (x - croom.view.x)*(this.scaleX/Math.abs(this.scaleX)), (y - croom.view.y)*(this.scaleY/Math.abs(this.scaleY)), this.drawWidth*this.scaleX, this.drawHeight*this.scaleY);
 
				if(this.scaleX != 1 || this.scaleY != 1) {
					engine.ctx.restore();
				}
				if(this.animated && this.speed > 0) { 

					if(
						((Array.isArray(this.sheetX) &&  (this.frameX+this.speed) >= this.sheetX.length-1) || !Array.isArray(this.sheetX)) &&
						((Array.isArray(this.sheetY) &&  (this.frameY+this.speed) >= this.sheetY.length-1) || !Array.isArray(this.sheetY)) &&
						typeof this.onanimationend === "function"
					) {
						this.onanimationend();
					}
					
					if(Array.isArray(this.sheetX)) { this.frameX = this.frameX + this.speed > this.sheetX.length -1 ? 0 : this.frameX + this.speed; }
					if(Array.isArray(this.sheetY)) { this.frameY = this.frameY + this.speed > this.sheetY.length -1 ? 0 : this.frameY + this.speed; }
					
					this.frame = this.frameX + this.frameY;

				}
			}
		}

		catch(e) {
			console.error("Sprite error", e);
		}
	}
	this.setFrame = function(frameX=0,frameY=0) {

		this.frameX = frameX;
		this.frameY = frameY;
		this.frame = frameX + frameY;
		return this.frame;
	}

	GAME_ENGINE_INSTANCE.sprites.push(this);
	
	return this;
}function Room(arg0, width = 1280, height = 720, gridX=32, gridY=32, roomObjects = [], tiles=[], background = new Background("gray")) {
	
	let argObj = typeof arg0 === "object";
	let engine = GAME_ENGINE_INSTANCE.engine;
	
	this.name = argObj ? arg0.name : arg0;
	this.width = argObj ? arg0.width : width;
	this.height = argObj ? arg0.height : height;
	this.background = argObj ? arg0.background : background;

	//Mainly used for pathfinding
	this.gridX = gridX;
	this.gridY = gridY;
	
	this.roomObjects = argObj ? arg0.roomObjects : roomObjects;
	this.tiles = argObj ? arg0.tiles : tiles;

	this.view = { x: 0, y: 0, width: this.width, height: this.height, obj: false};
	
	this.id = GAME_ENGINE_INSTANCE.generateID();

	this.roomStart = function() { 
		this.roomObjects.forEach(obj=>{
			if(typeof obj['onroomstart'] === 'function') { obj.onroomstart(); } 
		});
	}

	this.sortDepth = function() {

		let newList = this.roomObjects.sort((a,b)=>{ return b.depth - a.depth; });
		this.roomObjects = newList;
		return true;
	}

	this.addObject = function(object,copy=false,sort=true,renewNodes=false) {
		 
		this.roomObjects.push(copy ? Object.assign({},object) : object);

		if(sort) { this.sortDepth(); }

		return true;
	}
	
	this.getObject = function(ind=-1) {

		if(typeof ind === "object") { return ind; }

		for(let i = 0; i < this.roomObjects.length; i++) {
			let obj = this.roomObjects[i];
			if(obj[typeof ind === "string" ? "name" : "id"] === ind) { return obj; }
		}
		
		return false;
	}

	this.getObjects = function(ind=-1) {
		
		let objects = [];

		this.roomObjects.forEach(obj=>{

			if(Array.isArray(ind)) {
				if(ind.indexOf(obj.name) !== -1 || ind.indexOf(obj.id) !== -1) { objects.push(obj); } 
			}

			else if(obj[typeof ind === "string" ? "name" : "id"] === ind) { objects.push(obj); }
		});
		
		return objects;
	}

	this.getTilesAt = function(x,y,solidOnly = false,width=1,height=1) {

		let tilesThere = [];
		this.tiles.forEach(tile=>{  

			if( 
				((tile.solid && solidOnly) || !solidOnly) &&
				GAME_ENGINE_INSTANCE.getIntersecting(
					tile.x,
					tile.y,
					tile.x + tile.sprite.drawWidth-1,
					tile.y + tile.sprite.drawHeight-1,
					x, y, x + width, y + height)
			) 
			{ tilesThere.push(tile); }
		});

		return tilesThere;
	}

	this.getObjectsAt = function(x,y,solidOnly = false,width=1,height=1,ignore=[]) {
		
		//console.log(ignore);
		if(!Array.isArray(ignore)) { ignore = [ignore]; }
		
		let objsThere = [];
		this.roomObjects.forEach(obj=>{ 

			let cb = obj.collisionBox;
			
			if( 
				ignore.indexOf(obj.id) == -1 && ignore.indexOf(obj.name) == -1 && 
				obj.active && ((obj.solid && solidOnly) || !solidOnly) &&
				GAME_ENGINE_INSTANCE.getIntersecting(
					obj.x + cb[0],
					obj.y + cb[1],
					obj.x + cb[0] + cb[2],
					obj.y + cb[1] + cb[3],
					x, y, x + width, y + height)
			) 
			{ objsThere.push(obj); }

		});

		return objsThere;
 
	}

	this.getAllAt = function(x,y,solidOnly = false,width=1,height=1,ignore=[]) {

		return this.getObjectsAt(x,y,solidOnly,width,height,ignore).concat(this.getTilesAt(x,y,solidOnly,width,height));
	}

	this.checkEmpty = function(x, y, solidOnly=false, width=1, height=1) {

		return this.getObjectsAt(x, y, solidOnly, width, height)
		 .concat(this.getTilesAt(x, y, solidOnly, width, height)).length === 0;
	}
	
	this.draw = function() { 

		if(typeof this.view.obj === "string" || this.view.obj === "object") {

			let obj = this.getObject(this.view.obj);
			if(typeof obj === 'object') {
				this.view.x = Math.min(Math.max(obj.x - this.view.width/2,0), this.width - this.view.width);
				this.view.y =  Math.min(Math.max(obj.y - this.view.height/2,0), this.height - this.view.height);
			}
		}
		
		if(typeof this.background === "string") {
			let oldFill = engine.ctx.fillStyle;
			engine.ctx.fillStyle = this.background;
			engine.ctx.fillRect(0,0,this.width,this.height);
			engine.ctx.fillStyle = oldFill;
		}
		else if(typeof this.background === "object") {

			this.background.draw();
		}

		if(this.tiles.length > 0) {

			this.tiles.forEach(tile => { 
				if(typeof tile === "object") { 
				
					//if(tile.x >= this.view.x - tile.sprite.drawWidth && tile.x <= this.view.x + this.view.width && tile.y >= this.view.y - tile.sprite.drawHeight && tile.y <= this.view.y + this.view.height) {
						
						tile.sprite.draw(tile.x, tile.y); 
					//}
				} 
			});
		}

		

		return true;
	}

	this.generateNodes = function() {
		
		let mapNodes = {};

		let gridX = this.gridX;
		let gridY = this.gridY;

		let gridWidth = Math.round(this.width/this.gridX);
		let gridHeight = Math.round(this.height/this.gridY);

		let map = [];

		for(let x = 0; x < gridWidth; x++) {

			map[x] = [];
  
			for(let y = 0; y < gridHeight; y++) {
				
				map[x][y] = this.getAllAt(x*gridX,y*gridY,true).length > 0 ? "A" : " ";

				
				let newNode = {exits:[]};

				//px/py are to make sure we're not generating a path that goes outside the room
				for(let px = -1; px < 2; px++) {

					for(let py = -1; py < 2; py++) {
 
						if(this.getAllAt(1+(x + px) * gridX, 1+(y + py) * gridY, true,0,0).length == 0 && x+px >= 0 && y+py >= 0 && (px+x + py+y != 0 || px+x==0 || py+y==0)) { 
							newNode.exits.push((x+px) + "," + (y+py)); 
							
						} 
					}
				}

				mapNodes[x+","+y] = (newNode);
			}
		} 

		this.mapNodes = mapNodes;
		this.map = map;
	}

	this.generateNodes();

	GAME_ENGINE_INSTANCE.rooms.push(this);
	
	return this;
}function Tile(arg0, sprite = new Sprite(), x = 0, y = 0, solid = false, properties = []) {
	
	this.name = arg0;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.solid = solid;
	this.properties = properties;

	this.id = GAME_ENGINE_INSTANCE.generateID();

	this.destroy = function() {

		console.log(this,this.id);
		let newTileArray = GAME_ENGINE_INSTANCE.getCurrentRoom().tiles.filter(tile=>{ return tile.id !== this.id; });
		GAME_ENGINE_INSTANCE.getCurrentRoom().tiles = newTileArray;

		return delete this;
	}

	GAME_ENGINE_INSTANCE.tiles.push(this);

	return this;
}function Sound(arg0, fileName, volume = 1, forceNewResource = false) {

	let engine = GAME_ENGINE_INSTANCE.engine;

	this.name = arg0;
	this.fileName = fileName;
	this.resource = engine.importResource(fileName, forceNewResource);

	this.resource.volume = volume;
	this.prevVolume = volume;

	this.play = function(vol=this.prevVolume) {

		this.prevVolume = this.resource.volume;
		this.resource.volume = vol;
		this.resource.play();
		this.resource.volume = this.prevVolume;

		return true;
	}
	this.loop = function() {

		this.resource.loop = true;
		this.resource.play();

		return true;
	}
	this.pause = function() {
		this.resource.pause();
		this.resource.loop = false;

		return true;
	}
	this.stop = function() {

		this.pause();
		this.resource.currentTime = 0;
		
		return true;
	}
	this.seek = function(time = 0) {

		this.resource.currentTime = time;
		return true;
	}
	this.setVolume = function(vol = 1) {
		this.resource.volume = vol;
		return true;
	}
	this.mute = function() {

		this.prevVolume = this.resource.volume;
		this.resource.volume = 0;
		return true;
	}
	this.unmute = function() {

		if(this.resource.volume === 0) {
			this.resource.volume = this.prevVolume;
			return true;
		}
		return false;
	}
	this.setSpeed = function(speed = 1) {

		this.resource.playbackRate = speed;
	}


	
	this.id = GAME_ENGINE_INSTANCE.generateID();

	GAME_ENGINE_INSTANCE.sounds.push(this);

	return this;
}