function GameObject(arg0, x = 0, y = 0, sprite = -1, step = -1, draw = -1, visible = true, active = true, collisionBox = false) {
	
	let argObj = typeof arg0 === "object";
	
	this.name = argObj ? arg0.name : arg0;
	this.x = argObj ? arg0.x : x;
	this.y = argObj ? arg0.y : y;
	this.sprite = argObj ? arg0.sprite : sprite;
	this.step = argObj ? arg0.step : step;
	this.draw = argObj ? arg0.draw : draw;
	this.visible = argObj ? arg0.visible : visible;
	this.active = argObj ? arg0.active : active;
	
	this.hspeed = 0;
	this.vspeed = 0;
	this.friction = 0;
	this.gravity = 0;
	this.gravityDirection = 0;

	this.collisionBox = collisionBox === false ? typeof this.sprite === "object" ? [0,0,this.sprite.drawWidth,this.sprite.drawHeight] : [0,0,16,16] : collisionBox;
	
	this.builtInPhysics = function() {
		this.x += this.hspeed;
		this.y += this.vspeed;
		
		this.hspeed = this.hspeed != 0 ? this.hspeed + (-1 * Math.abs(this.hspeed - this.friction)) : this.hspeed;
		this.vspeed = this.vspeed != 0 ? this.vspeed + (-1 * Math.abs(this.hspeed - this.friction)) : this.vspeed;
	}
	
	this.moveTowardsPoint = function(x, y, speed) {
		
	}

	this.moveIfEmpty = function(x,y,solidOnly=true) {

		let objs = game.getCurrentRoom().getObjectsAt(x + this.collisionBox[0], y + this.collisionBox[1], solidOnly, this.collisionBox[2], this.collisionBox[3]);
		let tiles = game.getCurrentRoom().getTilesAt(x + this.collisionBox[0], y + this.collisionBox[1], solidOnly, this.collisionBox[2], this.collisionBox[3]);

		if(objs.length === 0 && tiles.length === 0) { this.x = x; this.y = y; return true; }
		else { return false; }
	}
	
	this.deactivate = function() { return this.active = false; }
	this.activate = function() { return this.active = true; }
	
	
	return this;
}