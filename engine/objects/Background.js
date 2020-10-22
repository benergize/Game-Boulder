function Background(arg0, sprite = -1, tiled = true) {
	
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
}