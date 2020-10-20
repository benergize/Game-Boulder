function Room(arg0, width = 1280, height = 720, roomObjects = [], tiles=[], background = new Background("gray")) {
	
	let argObj = typeof arg0 === "object";
	let engine = GAME_ENGINE_INSTANCE.engine;
	
	this.name = argObj ? arg0.name : arg0;
	this.width = argObj ? arg0.width : width;
	this.height = argObj ? arg0.height : height;
	this.background = argObj ? arg0.background : background;
	
	this.roomObjects = argObj ? arg0.roomObjects : roomObjects;
	this.tiles = argObj ? arg0.tiles : tiles;

	this.view = { x: 0, y: 0, width: this.width, height: this.height, obj: false};
	
	this.id = GAME_ENGINE_INSTANCE.generateID();


	this.addObject = function(object,copy=false) {
		 
		return this.roomObjects.push(copy ? Object.assign({},object) : object);
	}
	
	this.getObject = function(ind) {
		
		if(typeof ind === "number") { return typeof this.roomObjects[ind] === "object" ? this.roomObjects[ind] : false; }
		else if(typeof ind === "string") {
			
			let filteredObject = this.roomObjects.filter(obj => { return obj.name === ind; })[0];
			
			return typeof filteredObject === "object" ? filteredObject : false;
		}
		else { return false; }
	}

	this.getTilesAt = function(x,y,solidOnly = false,width=1,height=1) {

		let tilesThere = [];
		this.tiles.forEach(tile=>{  

			if( 
				((tile.solid && solidOnly) || !solidOnly) &&
				GAME_ENGINE_INSTANCE.getIntersecting(
					tile.x,
					tile.y,
					tile.x + tile.sprite.drawWidth-1,
					tile.y + tile.sprite.drawHeight-1,
					x, y, x + width, y + height)
			) 
			{ tilesThere.push(tile); }
		});

		return tilesThere;
	}

	this.getObjectsAt = function(x,y,solidOnly = false,width=1,height=1) {


		let objsThere = [];
		this.roomObjects.forEach(obj=>{ 

			let cb = obj.collisionBox;

			if( 
				obj.active && ((obj.solid && solidOnly) || !solidOnly) &&
				GAME_ENGINE_INSTANCE.getIntersecting(
					obj.x + cb[0],
					obj.y + cb[1],
					obj.x + cb[0] + cb[2],
					obj.y + cb[1] + cb[3],
					x, y, x + width, y + height)
			) 
			{ objsThere.push(obj); }

		});

		return objsThere;
 
	}

	this.checkEmpty = function(x, y, solidOnly=false, width=1, height=1) {

		return this.getObjectsAt(x, y, solidOnly, width, height)
		 .concat(this.getTilesAt(x, y, solidOnly, width, height)).length === 0;
	}
	
	this.draw = function() { 

		if(typeof this.background === "string") {
			let oldFill = engine.ctx.fillStyle;
			engine.ctx.fillStyle = this.background;
			engine.ctx.fillRect(0,0,this.width,this.height);
			engine.ctx.fillStyle = oldFill;
		}
		else {

			let bg = this.background;
			if(typeof bg.drawWidth !== "undefined" && typeof bg.drawHeight !== "undefined") {

				for(let x = 0; x < this.width; x += bg.drawWidth) {

					for(let y = 0; y < this.height; y += bg.drawHeight) {
						
						bg.draw(x,y);
					}
				}
			}
		}

		if(this.tiles.length > 0) {

			this.tiles.forEach(tile => { if(typeof tile === "object") { 
				
				if(tile.x >= this.view.x - tile.sprite.drawWidth && tile.x <= this.view.x + this.view.width && tile.y >= this.view.y - tile.sprite.drawHeight && tile.y <= this.view.y + this.view.height) {
					
					tile.sprite.draw(tile.x, tile.y); 
				}
			} });
		}

		if(typeof this.view.obj === "string" || this.view.obj === "object") {

			let obj = this.getObject(this.view.obj);
			if(typeof obj === 'object') {
				this.view.x = Math.min(Math.max(obj.x - this.view.width/2,0), this.width - this.view.width);
				this.view.y =  Math.min(Math.max(obj.y - this.view.height/2,0), this.height - this.view.height);
			}
		}

		return true;
	}
	
	return this;
}