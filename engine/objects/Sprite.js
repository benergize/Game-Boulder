function Sprite(arg0, sheetX = 0, sheetY = 0, sheetWidth = 16, sheetHeight = 16, drawWidth = 16, drawHeight = 16, forceNewResource = false) {
	
	let argObj = typeof arg0 === "object";
	let engine = GAME_ENGINE_INSTANCE.engine;
	
	try {
		this.fileName = argObj ? arg0.fileName : arg0;
		
		if(!forceNewResource) {

			let filteredResources = GAME_ENGINE_INSTANCE.resources.filter(res=>{ return res.src === this.fileName; });

			if(filteredResources.length > 0) {

				this.resource = filteredResources[0];
			}
			else { forceNewResource = true; }
		}

		//Do not change this to an else or else if.
		if(forceNewResource) {
			

			let newRes = document.createElement("img");
			newRes.src = this.fileName;
			GAME_ENGINE_INSTANCE.resources.push(newRes);

			this.resource = newRes;
		}

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

	this.id = GAME_ENGINE_INSTANCE.generateID();
	
	
	this.draw = function(x, y) { 
		
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		engine.ctx.drawImage(this.resource, this.sheetX, this.sheetY, this.sheetWidth, this.sheetHeight, x - croom.view.x, y-croom.view.y, this.drawWidth, this.drawHeight);
	}

	GAME_ENGINE_INSTANCE.sprites.push(this);
	
	return this;
}