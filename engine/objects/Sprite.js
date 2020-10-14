function Sprite(arg0, sheetX = 0, sheetY = 0, sheetWidth = 16, sheetHeight = 16, drawWidth = 16, drawHeight = 16) {
	
	let argObj = typeof arg0 === "object";
	
	try {
		this.fileName = argObj ? arg0.fileName : arg0;
		
		this.resource = document.createElement("img");
		this.resource.src = this.fileName;
		
	}
	catch(error) {
		
		console.error("Engine Error", error);
		return false;
	}
	
	this.sheetX = argObj ? arg0.sheetX : sheetX;
	this.sheetY = argObj ? arg0.sheetY : sheetY;
	this.sheetWidth = argObj ? arg0.sheetWidth : sheetWidth;
	this.sheetHeight = argObj ? arg0.sheetHeight : sheetHeight;
	this.drawWidth = argObj ? arg0.drawWidth : drawWidth;
	this.drawHeight = argObj ? arg0.drawHeight : drawHeight;
	
	
	this.draw = function(x, y) { 
		
		let croom = game.getCurrentRoom();
		engine.ctx.drawImage(this.resource, this.sheetX, this.sheetY, this.sheetWidth, this.sheetHeight, x - croom.view.x, y-croom.view.y, this.drawWidth, this.drawHeight);
	}
	
	return this;
}