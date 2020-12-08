function GameObject(arg0, x = 0, y = 0, sprite = -1, step = -1, draw = -1, destroy = -1, visible = true, active = true, collisionBox = false, depth = 0) {
	
	let argObj = typeof arg0 === "object";
	
	this.name = argObj ? arg0.name : arg0;
	this.x = argObj ? arg0.x : x;
	this.y = argObj ? arg0.y : y;
	this.xstart = x;
	this.ystart = y;
	this.xprevious = x;
	this.yprevious = y;

	this.sprite = argObj ? arg0.sprite : sprite;

	this.depth = depth;
	
	this.visible = argObj ? arg0.visible : visible;
	this.active = argObj ? arg0.active : active;
	
	this.onstep = argObj ? arg0.step : step;
	this.ondraw = argObj ? arg0.draw : draw;
	this.ondestroy = argObj ? arg0.destroy : destroy;
	
	this.hspeed = 0;
	this.vspeed = 0;
	this.friction = 0;
	this.gravity = 0;
	this.gravityDirection = 0;

	this.collisionBox = collisionBox === false ? typeof this.sprite === "object" ? [0,0,this.sprite.drawWidth,this.sprite.drawHeight] : [0,0,16,16] : collisionBox;
	
	this.id = GAME_ENGINE_INSTANCE.generateID();

	this.getCoordinates = function(object=true) {
		
		let coords = {
			x1: this.x + this.collisionBox[0], 
			y1: this.y + this.collisionBox[1], 
			x2: this.x + this.collisionBox[0] + this.collisionBox[2], 
			y2: this.y + this.collisionBox[1] + this.collisionBox[3]
		};
		return object ? coords : [coords.x1, coords.y1, coords.x2, coords.y2] ;
	}

	this.getCoords = this.getCoordinates;

	this.builtInPhysics = function() {

		let hcols = this.getCollisions(true, this.hspeed);
		let vcols = this.getCollisions(true, 0, this.vspeed);

		if(hcols.length > 0 && this.hspeed !== 0) { 
			this.x = this.hspeed < 0 ? 
				(hcols[0].getCoords().x2 - this.collisionBox[0]) + 1 : 
				-1 + (hcols[0].getCoords().x1 - (this.collisionBox[2]-this.collisionBox[0]))+(this.x-this.getCoords().x1)*2; 
			this.hspeed = 0; 
		}
		else { this.x += this.hspeed; }

		if(vcols.length > 0 && this.vspeed !== 0) { 
			this.y = this.vspeed < 0 ? 
				(vcols[0].getCoords().y2-this.collisionBox[1]) + 1 :
				-1 + (vcols[0].getCoords().y1 - (this.collisionBox[3]+this.collisionBox[1])); 
			this.vspeed = 0;  
		}
		else { this.y += this.vspeed;}

		if(this.x != this.xprevious) { this.xprevious = this.x; }
		if(this.y != this.yprevious) { this.yprevious = this.y; }
		
		this.hspeed = Math.abs(this.hspeed) <= this.friction ? 0 : this.hspeed - (this.friction * (Math.abs(this.hspeed)/this.hspeed));
		this.vspeed = Math.abs(this.vspeed) <= this.friction ? 0 : this.vspeed - (this.friction * (Math.abs(this.vspeed)/this.vspeed));
		
	}

	this.getCollisions = function(solidOnly=false, offsetX = 0, offsetY = 0) {
		
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		let coords = this.getCoords();

		let x1 = coords.x1 + offsetX;
		let x2 = coords.x2 + offsetX;
		let y1 = coords.y1 + offsetY;
		let y2 = coords.y2 + offsetY;

		return croom.getAllAt(x1,y1,solidOnly,x2-x1,y2-y1);
	}

	this.generateDepthPath = function(startX, startY, destX, destY, weightedNodes, struckNodes = []) {
		
		//Starting wherever we are in the breadth search
		let path = [[startX+","+startY]];

		for(let panic = 0; panic < 90; panic++) {

			let currentCoords = path[path.length-1];
			let currentNode = weightedNodes[currentCoords];
			if(typeof currentNode != "undefined") { 
				
				//If we're here, return the path we took to get here.
				if(currentCoords == destX+","+destY) { return [true, path]; }

				//The only viable nodes for this search are ones that A. haven't been struck in other searches,
				//and B. are closer than the current node
				let viable = currentNode.exits.filter(adjacentNode=>{ /**/ 
					return struckNodes.indexOf(adjacentNode) === -1 &&
					weightedNodes[adjacentNode].dist <= currentNode.dist &&
					path.indexOf(adjacentNode) === -1; 
				});

				//If there are viable nodes
				if(viable.length > 0) {

					//Go to the closest one
					let lowest = viable.sort( (a, b)=>{ return weightedNodes[a].dist - weightedNodes[b].dist; })[0];
					//console.log('lowest',lowest);
					path.push(lowest);
				}
				else {

					//Otherwise, return that it was a bust.
					return [false,path];
				}
			}
			else {
				//console.log('lost in space at ' + currentCoords);
			}
		}

		return [false, 'panicked'];
	}
	
	this.generatePath = function(dx,dy,gridX,gridY) {

		function Path(oldPath, oldWeight = 0, newNode = -1) {

			this.path = newNode == -1 ? oldPath : oldPath.concat(newNode);
			this.weight = oldWeight;

			if(newNode !== -1) {
				
				let newCoords = newNode.split(","); 
				this.weight += mapNodes[newCoords[0]+','+newCoords[1]]//Math.sqrt(Math.abs(destX - newCoords[0])**2 + Math.abs(destY - newCoords[1])**2)
			}
			
			return this;
		}

		let startX = Math.round(this.x / gridX);
		let startY = Math.round(this.y / gridY);

		let destX = Math.round(dx / gridX);
		let destY = Math.round(dy / gridY); 

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
 
		//let mapNodes = croom.mapNodes;

		let mapNodes = {};
		for(let i in croom.mapNodes) {

			let coords = i.split(",");
			mapNodes[i] = {
				exits: Array.from(croom.mapNodes[i].exits),
				dist: Math.abs(coords[0] - destX) + Math.abs(coords[1] - destY)//Math.sqrt(Math.abs(coords[0] - destX)**2 + Math.abs(coords[1] - destY)**2)
			};
		}

		let allPaths = [new Path([startX + "," + startY])];
		let masterPath = [];
		let victoryPath = {path:-1,weight:-1};

		let pathsActive = false;

		for(let panic = 0; panic < 50; panic++) {

			let newPaths = []; 
			let shortest = {dist:9999999,index:-1}; 

			for(let i = 0; i < allPaths.length; i++) {

				let pathObj = allPaths[i];
				let path = pathObj.path;

				if(path.length < victoryPath.path.length || (path.length === victoryPath.path.length && path.weight < victoryPath.weight) || victoryPath.path === -1) {

					let currentNode = path[path.length-1]; 

					if(typeof mapNodes[currentNode] !== "undefined") { 


						if(currentNode === (destX + "," + destY)) {

							victoryPath = pathObj;
							pathsActive = false;
							break;
							
						}

						else {


							mapNodes[currentNode].exits.forEach(exit=>{

								if(typeof mapNodes[exit] != "undefined" && path.indexOf(exit) === -1 && masterPath.indexOf(exit) === -1) {

									pathsActive = true;
									let newPath = new Path(path, pathObj.weight, exit);
									newPaths.push(newPath);
									if(mapNodes[exit].dist < shortest.dist) { shortest.dist = mapNodes[exit].dist; shortest.index = newPaths.length-1; }
									masterPath.push(exit);
								}
								
							});

						}
					}
				}
			}
			

			if(shortest.index !== -1) {

				let shortestPath = newPaths[shortest.index];
				let coords = shortestPath.path[shortestPath.path.length-1].split(",");
				let depthPath = this.generateDepthPath(coords[0],coords[1],destX,destY,mapNodes,masterPath);
				
				if(depthPath[0]) { 
					newPaths[shortest.index].path = shortestPath.path.concat(depthPath[1].slice(1));
				}


			}
			
			

			
			if(!pathsActive) { break; }
			else { 
				allPaths = Array.from(newPaths);  
			}
		}

		this.path = {path: Array.isArray(victoryPath.path) ? victoryPath.path.slice(1) : -1,gridX:gridX,gridY:gridY};

		return victoryPath;
	}

	this.path = {path:[],gridX:32,gridY:32};

	this.wrap = function(wrapX = true, wrapY = true) {
		let wrapped = 0;
		let x1 = this.x + this.collisionBox[0];
		let x2 = this.x + this.collisionBox[0] + this.collisionBox[2];
		let y1 = this.y + this.collisionBox[1];
		let y2 = this.y + this.collisionBox[1] + this.collisionBox[3];
		if(wrapX) {
			if(x1 > GAME_ENGINE_INSTANCE.getCurrentRoom().width) { this.x = -(this.collisionBox[0] + this.collisionBox[2]); }
			else if(x2 < 0) { this.x = GAME_ENGINE_INSTANCE.getCurrentRoom().width; }
			wrapped++;
		}
		if(wrapY) {
			if(y1 > GAME_ENGINE_INSTANCE.getCurrentRoom().height) { this.y = -(this.collisionBox[1] + this.collisionBox[3]);; }
			else if(y2 < 0) { this.y = GAME_ENGINE_INSTANCE.getCurrentRoom().height; }
			wrapped++;
		}
		return wrapped;
	}

	this.pathStep = function(speed=0) {

		if(this.path.path.length === 0 || this.path.path === -1) { return false; }

		//console.log(this.path);

		let path = this.path.path;
		let thisStep = path[0].split(","); 

		let dest = [thisStep[0] * this.path.gridX, thisStep[1] * this.path.gridY];

		if(speed === 0) {
			this.x = dest[0];
			this.y = dest[1];
		}
		else {

			this.moveTowardsPoint(dest[0],dest[1],speed);
		}

	//	console.log(Math.abs(this.x - dest[0]) + Math.abs(this.y - dest[1]));
  
		let roughDist = Math.sqrt((Math.abs(this.x - dest[0]) ** 2) + (Math.abs(this.y - dest[1]) ** 2));
 
		if(roughDist < speed || speed == 0) { this.path.path = this.path.path.slice(1); }
		if(this.path.path.length === 0) { this.x = dest[0]; this.y = dest[1]; }

		return true;
	}

	this.moveTowardsPoint = function(x, y, speed) {
		
		let distance = Math.sqrt(((x - this.x)**2) + ((y - this.y)**2));

		if(distance > 0){
			this.x += ((x - this.x) * speed) / distance;
			this.y += ((y - this.y) * speed) / distance;

			return true;
		}
		return false;
	}

	this.moveInDirection = function(direction, speed) {
		 
		var rad = (-direction) * .01745329251;
		this.x = this.x + (Math.cos(rad) * speed);
		this.y = this.y + (Math.sin(rad) * speed);
		return true
 
	}

	this.setDepth = function(depth=0) {

		this.depth = depth;

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom();
		if(croom) {
			croom.sortDepth();
		}
	}
	
	this.destroy = function() {
 
		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom()

		let newObjArray = croom.roomObjects.filter(obj=>{ return obj.id !== this.id; });
		croom.roomObjects = newObjArray;

		if(typeof this.ondestroy === 'function') { this.ondestroy(); }

		return delete this;
	}

	this.deactivate = function() { return this.active = false; }
	this.activate = function() { return this.active = true; }

	this.snapToGrid = function(width=-1,height=-1) {

		if(width === -1) { width = GAME_ENGINE_INSTANCE.getCurrentRoom().gridX; }
		if(height === -1) { height = GAME_ENGINE_INSTANCE.getCurrentRoom().gridY; }

		if(width <= 0 || height <= 0) { console.error("Must snap to at least 1x1 grid."); return false; }
		
		this.x = Math.round(this.x/width) * width;
		this.y = Math.round(this.y/height) * height;

		return true;
	}
	
	GAME_ENGINE_INSTANCE.objects.push(this);
	
	return this;
}