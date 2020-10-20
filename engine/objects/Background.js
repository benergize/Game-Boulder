function Background(arg0, sprite = -1, tiled = true) {
	
	let argObj = typeof arg0 === "object";
	
	this.color = argObj ? arg0.color : arg0;
	this.colour = this.color;
	this.sprite = argObj ? arg0.sprite : sprite;
	this.tiled = argObj ? arg0.tiled : tiled;
	
	this.draw = function() {
		
		let currentRoom = GAME_ENGINE_INSTANCE.getCurrentRoom;
		let oldFill = engine.canvas.fillStyle;
		
		engine.canvas.fillStyle = this.color;
		engine.canvas.fillRect(0, 0, currentRoom.width, currentRoom.height);
		
		engine.canvas.fillStyle = oldFill;
		
		if(typeof this.sprite === "object") {
			
			if(this.tiled) {
				
				for(let x = 0; x < currentRoom.width / this.sprite.width; x += this.sprite.width) {
					
					for(let y = 0; y < currentRoom.height / this.sprite.height; y+= this.sprite.height) {
						
						engine.drawSprite(this.sprite, x, y);
					}
				}
			}
			else { engine.drawSprite(this.sprite, 0, 0); }
		}
	}
	
	return this;
}