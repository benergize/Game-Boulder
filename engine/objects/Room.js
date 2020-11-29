function Room(arg0, width = 1280, height = 720, gridX=32, gridY=32, roomObjects = [], tiles=[], background = new Background("gray")) {
	
	let argObj = typeof arg0 === "object";
	let engine = GAME_ENGINE_INSTANCE.engine;
	
	this.name = argObj ? arg0.name : arg0;
	this.width = argObj ? arg0.width : width;
	this.height = argObj ? arg0.height : height;
	this.background = argObj ? arg0.background : background;

	//Mainly used for pathfinding
	this.gridX = gridX;
	this.gridY = gridY;
	
	this.roomObjects = argObj ? arg0.roomObjects : roomObjects;
	this.tiles = argObj ? arg0.tiles : tiles;

	this.view = { x: 0, y: 0, width: this.width, height: this.height, obj: false};
	
	this.id = GAME_ENGINE_INSTANCE.generateID();

	this.roomStart = function() { 
		this.roomObjects.forEach(obj=>{
			if(typeof obj['onroomstart'] === 'function') { obj.onroomstart(); } 
		});
	}

	this.sortDepth = function() {

		let newList = this.roomObjects.sort((a,b)=>{ return b.depth - a.depth; });
		this.roomObjects = newList;
		return true;
	}

	this.addObject = function(object,copy=false,sort=true,renewNodes=false) {
		 
		this.roomObjects.push(copy ? Object.assign({},object) : object);

		if(sort) { this.sortDepth(); }

		return true;
	}
	
	this.getObject = function(ind) {

		for(let i = 0; i < this.roomObjects.length; i++) {
			let obj = this.roomObjects[i];
			if(obj[typeof ind === "string" ? "name" : "id"] === ind) { return obj; }
		}
		
		return false;
	}

	this.getObjects = function(ind) {
		
		let objects = [];

		if(typeof ind === "object") { return ind; }

		this.roomObjects.forEach(obj=>{
			if(obj[typeof ind === "string" ? "name" : "id"] === ind) { objects.push(obj); }
		});
		
		return objects;
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

	this.getAllAt = function(x,y,solidOnly = false,width=1,height=1) {

		return this.getObjectsAt(x,y,solidOnly,width,height).concat(this.getTilesAt(x,y,solidOnly,width,height));
	}

	this.checkEmpty = function(x, y, solidOnly=false, width=1, height=1) {

		return this.getObjectsAt(x, y, solidOnly, width, height)
		 .concat(this.getTilesAt(x, y, solidOnly, width, height)).length === 0;
	}
	
	this.draw = function() { 

		if(typeof this.view.obj === "string" || this.view.obj === "object") {

			let obj = this.getObject(this.view.obj);
			if(typeof obj === 'object') {
				this.view.x = Math.min(Math.max(obj.x - this.view.width/2,0), this.width - this.view.width);
				this.view.y =  Math.min(Math.max(obj.y - this.view.height/2,0), this.height - this.view.height);
			}
		}
		
		if(typeof this.background === "string") {
			let oldFill = engine.ctx.fillStyle;
			engine.ctx.fillStyle = this.background;
			engine.ctx.fillRect(0,0,this.width,this.height);
			engine.ctx.fillStyle = oldFill;
		}
		else if(typeof this.background === "object") {

			this.background.draw();
		}

		if(this.tiles.length > 0) {

			this.tiles.forEach(tile => { 
				if(typeof tile === "object") { 
				
					//if(tile.x >= this.view.x - tile.sprite.drawWidth && tile.x <= this.view.x + this.view.width && tile.y >= this.view.y - tile.sprite.drawHeight && tile.y <= this.view.y + this.view.height) {
						
						tile.sprite.draw(tile.x, tile.y); 
					//}
				} 
			});
		}

		

		return true;
	}

	this.generateNodes = function() {
		
		let mapNodes = {};

		let gridX = this.gridX;
		let gridY = this.gridY;

		let gridWidth = Math.round(this.width/this.gridX);
		let gridHeight = Math.round(this.height/this.gridY);

		let map = [];

		for(let x = 0; x < gridWidth; x++) {

			map[x] = [];
  
			for(let y = 0; y < gridHeight; y++) {
				
				map[x][y] = this.getAllAt(x*gridX,y*gridY,true).length > 0 ? "A" : " ";

				
				let newNode = {exits:[]};

				//px/py are to make sure we're not generating a path that goes outside the room
				for(let px = -1; px < 2; px++) {

					for(let py = -1; py < 2; py++) {
 
						if(this.getAllAt(1+(x + px) * gridX, 1+(y + py) * gridY, true,0,0).length == 0 && x+px >= 0 && y+py >= 0 && (px+x + py+y != 0 || px+x==0 || py+y==0)) { 
							newNode.exits.push((x+px) + "," + (y+py)); 
							
						} 
					}
				}

				mapNodes[x+","+y] = (newNode);
			}
		} 

		this.mapNodes = mapNodes;
		this.map = map;
	}

	this.generateNodes();

	GAME_ENGINE_INSTANCE.rooms.push(this);
	
	return this;
}