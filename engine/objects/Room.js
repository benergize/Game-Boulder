function Room(arg0 = "", width = 1280, height = 720, roomObjects = [], tiles=[], background = new Background("gray")) {
	
	let argObj = typeof arg0 === "object";
	
	this.name = argObj ? arg0.name : arg0;
	this.width = argObj ? arg0.width : width;
	this.height = argObj ? arg0.height : height;
	this.background = argObj ? arg0.background : background;
	
	this.roomObjects = argObj ? arg0.roomObjects : roomObjects;
	this.tiles = argObj ? arg0.tiles : tiles;

	this.view = {x:0,y:0,width:640,height:480,obj:"player"};
	
	
	this.addObject = function(object) {
		
		object.roomIndex = this.name;
		return this.roomObjects.push(object);
	}
	
	this.getObject = function(ind) {
		
		if(typeof ind === "number") { return typeof this.roomObjects[ind] === "object" ? this.roomObjects[ind] : false; }
		else if(typeof ind === "string") {
			
			let filteredObject = this.roomObjects.filter(obj => { return obj.name === ind; })[0];
			
			return typeof filteredObject === "object" ? filteredObject : false;
		}
		else { return false; }
	}

	this.getTilesAt = function(x,y,solidOnly = false,width=0,height=0) {

		let tilesThere = [];
		this.tiles.forEach(tile=>{ 
			if(
				(
					(
						x >= tile.x && x < tile.x + tile.sprite.drawWidth && 
						y >= tile.y && y < tile.y + tile.sprite.drawHeight
					) ||
					(
						x + width >= tile.x && x + width < tile.x + tile.sprite.drawWidth &&
						y + height >= tile.y && y + height < tile.y + tile.sprite.drawHeight
					)
				) && 
				((tile.solid && solidOnly) || !solidOnly)
			) { tilesThere.push(tile); }
		});

		return tilesThere;
	}

	this.getObjectsAt = function(x,y,solidOnly = false,width=1,height=0) {

		let objsThere = [];
		this.roomObjects.forEach(obj=>{ if(obj.x == x && obj.y == y && ((obj.solid && solidOnly) || !solidOnly)) { tilesThere.push(tile); } });

		return objsThere;
	}
	
	this.draw = function() {

		let croom = game.getCurrentRoom();

		if(typeof this.background === "string") {
			let oldFill = engine.ctx.fillStyle;
			engine.ctx.fillStyle = this.background;
			engine.ctx.fillRect(0,0,croom.width,croom.height);
			engine.ctx.fillStyle = oldFill;
		}
		else {

			let bg = this.background;
			if(typeof bg.drawWidth !== "undefined" && typeof bg.drawHeight !== "undefined") {

				for(let x = 0; x < croom.width; x += bg.drawWidth) {

					for(let y = 0; y < croom.height; y += bg.drawHeight) {
						
						bg.draw(x,y);
					}
				}
			}
		}

		if(this.tiles.length > 0) {
			this.tiles.forEach(tile => { if(typeof tile === "object") { 
				tile.sprite.draw(tile.x, tile.y); 
				
			} });
		}

		if(typeof this.view.obj === "string" || this.view.obj === "object") {

			let obj = this.getObject(this.view.obj);
			this.view.x = obj.x - this.view.width/2;
			this.view.y = obj.y - this.view.height/2; 
		}

		return true;
	}
	
	return this;
}