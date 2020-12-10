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

		
		this.engine.ctx.clearRect(0,0,this.engine.canvas.width,this.engine.canvas.height);
		 

		room.draw();
		
		room.roomObjects.forEach(obj=>{
			
			if(obj.active) {
			
				obj.builtInPhysics();

				if(typeof obj.onstep === "function") { obj.onstep(); }
  
				if(obj.visible/* && obj.x >= room.view.x && obj.x <= room.view.x + room.view.width && obj.y >= room.view.y - && obj.y <= room.view.y + room.view.height*/) {

					if(typeof obj.ondraw === "function") { obj.ondraw(); }
					if(typeof obj.sprite === "object") { obj.sprite.draw(obj.x, obj.y); }
					
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
});