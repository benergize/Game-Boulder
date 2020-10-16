game = {
	
	rooms: [],
	sprites: [],
	objects: [],

	currentRoom: -1,
	status: "active",
	fps: 24,

	timing: {fps:24, currentTime:0, lastUpdate:0},

	debug: { showCBoxes: false },

	registry: 0,
	generateID: function() {
		this.registry++;
		return this.registry;
	},
	
	update: function(test) {

		let self = this; 
		requestAnimationFrame(function() { self.update(); });

		this.timing.currentTime = Date.now();

		if(this.timing.currentTime - this.timing.lastUpdate > this.timing.fps || this.timing.lastUpdate === 0) {
			this.timing.lastUpdate = this.timing.currentTime;
		}
		else { return false; }
		
		engine.ctx.fillRect(0,0,engine.canvas.width,engine.canvas.height);

		//console.log(this.rooms);
		let room = this.rooms[this.currentRoom];
	
		if(typeof room === "undefined") { return false; }
		
		room.draw();
		
		room.roomObjects.forEach(obj=>{
			
			if(obj.active) {
			
				if(typeof obj.step === "function") { obj.step(); }
				
				if(obj.visible) {
					if(typeof obj.draw === "function") { obj.draw(); }
					if(typeof obj.sprite === "object") { obj.sprite.draw(obj.x, obj.y); }
					
					if(game.debug.showCBoxes) { engine.ctx.strokeRect(obj.x+obj.collisionBox[0],obj.y+obj.collisionBox[1], obj.collisionBox[2],obj.collisionBox[3]); }
				}
			}
			
		});
	},
	
	getRoom: function(ind) {
		
		if(typeof ind === "number") { return typeof this.rooms[ind] === "object" ? this.rooms[ind] : false; }
		else if(typeof ind === "string") {
			
			let filteredRoom = rooms.filter(room => { return room.name === ind; })[0];
			
			return typeof filteredRoom === "object" ? filterRoom : false;
		}
		else { return false; }
	},
	
	getCurrentRoom: function(ind) {
		
		return typeof this.rooms[this.currentRoom] !== "undefined" ? this.rooms[this.currentRoom] : false;
	},

	addSprite: function(sprite) {
	
		return this.sprites.push(sprite);
	},
	
	importTiles: function(tiles) {

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
	},

	begin: function() { 
		//setInterval(fn=>{this.update();}, 1000 / this.fps); 
		let self = this;
		requestAnimationFrame(function() { self.update(); });
	}
};
 