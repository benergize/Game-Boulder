game = {
	
	rooms: [],
	currentRoom: -1,
	status: "active",
	fps: 24,
	debug: { showCBoxes: false },
	
	update: function() {
		
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
	
	begin: function() { setInterval(fn=>{this.update();}, 1000 / this.fps); }
};