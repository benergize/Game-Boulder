function Sprite(arg0, fileName, sheetX = 0, sheetY = 0, sheetWidth = 16, sheetHeight = 16, drawWidth = 16, drawHeight = 16, animationSpeed=1, forceNewResource = false, onanimationend = -1) {
	
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
				//	engine.ctx.translate( x - croom.view.x, y - croom.view.y);
					//engine.ctx.translate(x,y);
					engine.ctx.scale(this.scaleX,this.scaleY);
				}
				engine.ctx.drawImage(this.resource, xPos, yPos, this.sheetWidth, this.sheetHeight, x*this.scaleX - croom.view.x, y*this.scaleY - croom.view.y, this.drawWidth*this.scaleX, this.drawHeight*this.scaleY);
 
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
}