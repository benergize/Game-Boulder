function Sprite(arg0, fileName, sheetX = 0, sheetY = 0, sheetWidth = 16, sheetHeight = 16, drawWidth = 16, drawHeight = 16, forceNewResource = false) {
	
	let argObj = typeof arg0 === "object";
	
	let engine = GAME_ENGINE_INSTANCE.engine;
	
	this.name = arg0;
	this.fileName = argObj ? arg0.fileName : fileName;
	this.resource = engine.importResource(this.fileName, forceNewResource);
	
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
				engine.ctx.drawImage(this.resource, this.sheetX, this.sheetY, this.sheetWidth, this.sheetHeight, x - croom.view.x, y-croom.view.y, this.drawWidth, this.drawHeight);
				
			}
		}

		catch(e) {
			console.error("Sprite error",e);
		}
	}

	GAME_ENGINE_INSTANCE.sprites.push(this);
	
	return this;
}