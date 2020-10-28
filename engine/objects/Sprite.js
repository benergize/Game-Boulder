function Sprite(arg0, fileName, sheetX = 0, sheetY = 0, sheetWidth = 16, sheetHeight = 16, drawWidth = 16, drawHeight = 16, animationSpeed=1, forceNewResource = false) {
	
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


	this.id = GAME_ENGINE_INSTANCE.generateID();
	
	
	this.draw = function(x, y) {
		
		let engine = GAME_ENGINE_INSTANCE.engine; 
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();

		try {

			if(x - croom.view.x <= croom.view.width + this.drawWidth && y - croom.view.y <= croom.view.height + this.drawHeight) {

				let xPos = Array.isArray(this.sheetX) ? this.sheetX[Math.round(this.frameX)] : this.sheetX;
				let yPos = Array.isArray(this.sheetY) ? this.sheetY[Math.round(this.frameY)] : this.sheetY;

				engine.ctx.drawImage(this.resource, xPos, yPos, this.sheetWidth, this.sheetHeight, x - croom.view.x, y-croom.view.y, this.drawWidth, this.drawHeight);

				if(Array.isArray(this.sheetX)) { this.frameX = this.frameX + this.speed > this.sheetX.length -1 ? 0 : this.frameX + this.speed; }
				if(Array.isArray(this.sheetY)) { this.frameY = this.frameY + this.speed > this.sheetY.length -1 ? 0 : this.frameY + this.speed; }
				
			}
		}

		catch(e) {
			console.error("Sprite error", e);
		}
	}

	GAME_ENGINE_INSTANCE.sprites.push(this);
	
	return this;
}