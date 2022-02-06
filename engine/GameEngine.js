function GameEngine(canvas, fps=24) {
	
	this.rooms = [];
	this.sprites = [];
	this.resources = [];
	this.objects = [];
	this.sounds = [];
	this.tiles = [];
	this.backgrounds = [];
	this.gridMaps = [];

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

		let res = this.rooms.concat(this.sprites).concat(this.gridMaps).concat(this.resources).concat(this.objects).concat(this.sounds).concat(this.tiles).concat(this.backgrounds);
		return search === -1 ? res : res.filter(el=>{ return typeof search === "number" ? el.id === search : el.name === search; });
	}

	this.getSprite = function(search = "") {
		return typeof search === "object" ? search : 
			this.sprites.filter(spr=>{return typeof search === "number" ? spr.id === search : spr.name === search; })[0];
	}
	this.getRoom = function(search = "") {
		return typeof search === "object" ? search : 
			this.rooms.filter(roo=>{return typeof search === "number" ? roo.id === search : roo.name === search; })[0];
	}
	this.getObject = function(search = "") {
		return typeof search === "object" ? search : 
			this.objects.filter(obj=>{return typeof search === "number" ? obj.id === search : obj.name === search; })[0];
	}
	this.getGridMap = function(search = "") {
		return typeof search === "object" ? search : 
			this.gridMaps.filter(map=>{return typeof search === "number" ? map.id === search : map.name === search; })[0];
	}
	this.getSound = function(search = "") {
		return typeof search === "object" ? search : 
			this.sounds.filter(sou=>{return typeof search === "number" ? sou.id === search : sou.name === search; })[0];
	}

	this.keysHeld = {};
	this.mouseHeld = {};

	this.checkKey = function(key, ignoreCase=false) {

		if(typeof this.keysHeld[key] === 'undefined') { return false; }
		return this.keysHeld[key] || (ignoreCase && (this.keysHeld[key.toLowerCase()] || this.keysHeld[key.toUpperCase()]));
	}

	this.checkMouse = function(btn) {

		if(typeof this.mouseHeld[btn] === 'undefined') { return false; }
		return this.mouseHeld[btn];
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
		
	}


	this.begin = function() { 
		
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
	this.degToRad = function(deg) { return (-deg) * .01745329251 }
	this.radToDeg = function(rad) { return rad * 180/Math.PI; }//57.295827908797776; }
	this.getPointDirection = function(direction, distance) {
		
		var rad = this.degToRad(direction);//(-direction) * .01745329251;
		let x = (Math.cos(rad) * distance);
		let y = (Math.sin(rad) * distance);

		return [x,y];
	}
	this.getPointDir = this.getPointDirection;
	this.getDirectionFromPoints = function(x1,y1,x2,y2) {
		let d =  this.radToDeg(Math.atan2(y2-y1,x2-x1)); 
		return d < 0 ? d * -1 : 360 - d
	}

	this.snap = function(number,snapTo) { return Math.round(number/snapTo) * snapTo; }	
	this.random = function(min=0,max=1) { return (Math.random() * ((max)-min)) + min;  }
	this.irandom = function(min=0,max=1) { return Math.floor(Math.random() * ((max+1)-min)) + min;  }
	this.choose = function(array) {
		if(!Array.isArray(array)) { return false; }
		return array[Math.floor(Math.random()*array.length)];
	}

	this.engine = {};
	
	this.flipCoin = function(word=false) {
		return word ? ["heads","tails"][Math.round(Math.random())] : Math.round(Math.random());
	}
	this.coinToss = this.flipCoin;

	this.engine.MB_LEFT = 0;
	this.engine.MB_RIGHT = 2;
	this.engine.MB_MIDDLE = 1;

	this.engine.canvas = typeof canvas === "object" ? canvas : document.querySelector(canvas);
	this.engine.ctx = this.engine.canvas.getContext("2d");

	this.draw = {

		_ctx: function() { return GAME_ENGINE_INSTANCE.engine.ctx },
		setColor: function(color,fill) {

			if(color !== -1) { this._ctx()[fill ? "fillStyle" : "strokeStyle"] = color; }
		},
		rect: function(x, y, width, height, fill=true, color = -1) {

			let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
			this.setColor(color,fill); 
			this._ctx()[fill ? 'fillRect' : 'strokeRect'](-croom.view.x + x, -croom.view.y + y, width, height);
		},
		text: function(text, x, y, fill=true, color=-1) {

			let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
			this.setColor(color,fill); 
			this._ctx()[fill ? 'fillText' : 'strokeText'](text, -croom.view.x + x, -croom.view.y + y);
		},
		arc: function(x,y,startAngle,endAngle,counterClockWise) {
						
			let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
			this.setColor(color,false);

			ctx.beginPath();
			ctx.arc(-croom.view.x+x, -croom.view.y+y, GAME_ENGINE_INSTANCE.degToRad(startAngle), GAME_ENGINE_INSTANCE.degToRad(endAngle), counterClockWise);
			ctx.stroke();
		},
		ellipse: function(x,y,radiusX,radiusY,rotation,startAngle,endAngle,antiClockWise=false) {
			
			let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
			this.setColor(color,false);
			 

			this._ctx.beginPath();
			this._ctx.ellipse(-croom.view.x+ x, -croom.view.y+y, radiusX, radiusY, GAME_ENGINE_INSTANCE.degToRad(rotation), GAME_ENGINE_INSTANCE.degToRad(startAngle), GAME_ENGINE_INSTANCE.degToRad(endAngle),antiClockWise);
			this._ctx.endPath();
		},
		image: function(img,sx=0,sy=0,swidth=false,sheight=false,x=false,y=false,width=false,height=false) {

			let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
			this.setColor(color,false);
			 

			if(x === false && y === false && swidth === false && sheight === false) {
				this._ctx().drawImage(img,-croom.view.x + sx,-croom.view.y + sy);
			}
			else if(x === false && y === false) {
				this._ctx().drawImage(img,-croom.view.x + sx,-croom.view.y + sy,swidth,sheight);
			}
			else {
				this._ctx().drawImage(img,sx,sy,swidth,sheight,-croom.view.x+x,-croom.view.y+y,width===false?swidth:width,height===false?sheight:height);
			}
		},
		line: function(coordinates=[[]], width=1, color=-1) {

			
			let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
			this.setColor(color,false);
			
			this._ctx().beginPath();

			coordinates.forEach((coord,it)=>{

				if(coord.length === 2) {
					if(typeof coord[0] === 'number' && typeof coord[1] === 'number') {
						
						this._ctx()[it === 0 ? 'moveTo' : 'lineTo'](-croom.view.x + coord[0],-croom.view.y + coord[1]);
					}
				}
			});

			this._ctx().lineWidth = width;
			this._ctx().stroke();
		}


	};

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

			if(String(e.type).indexOf("mouse") == -1) { GAME_ENGINE_INSTANCE.keysHeld[e.key] = e.type == "keypress" || e.type == "keydown"; }
			else if(String(e.type).indexOf("move") == -1) { GAME_ENGINE_INSTANCE.mouseHeld[e.button] = e.type == "contextmenu" || e.type == "mousedown";  }
		}
 

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom(); 
		if(typeof croom === "object") { 

			croom.roomObjects.forEach(obj=>{ if(typeof obj["on" + event] === "function") { 

				
				let extraArgs = (e.type.indexOf("mouse")!==-1||e.type.indexOf('context')!==-1) ? {

					X: e.offsetX,
					Y: e.offsetY,
					button: e.button,
					buttonString: e.button == 0 ? "left" : 
									e.button == 1 ? "middle" : 
										e.button == 2 ? "right" : "?",
					over: GAME_ENGINE_INSTANCE.getIntersecting(obj.x+obj.collisionBox[0],obj.y+obj.collisionBox[1],
							obj.x+obj.collisionBox[0]+obj.collisionBox[2],obj.y+obj.collisionBox[1]+obj.collisionBox[3],e.x,e.y,e.x,e.y)
				
				} : {};

				obj["on" + event](e, extraArgs);
			}});  
		}
	});
});