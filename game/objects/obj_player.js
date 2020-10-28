var obj_player = new GameObject(
	"obj_player", 
	128, 240, 
	new Sprite("spr_player","game/sprites/people.png",0,0,25,38,25,38),
	-1,
	-1,
	-1,
	true,
	true,
	[0,24,24,14],
	-1
);

obj_player.inventory = {
	contents: [],
	getItems: function(mapOnly=false) {

		if(mapOnly) { return this.contents.map(obj=>{ return this.name; }); }
		else { return this.contents; }
	},
	addItem: function(item) {
		
		if(typeof item !== "object") { return false; }

		this.contents.push(item);
		return true;
	},
	getItem: function(item) {
 
		for(let i = 0; i < this.contents.length; i++) {

			if(this.contents[i][typeof item === "string" ? "name" : "id"] === item) { return item; }
		}

		return false;
	},
	removeItem: function(item) {

		let newInvArray = this.contents.filter(obj=>{ return this.obj[typeof item === "string" ? "name" : "id"] != item; });
		this.contents = newInvArray;
	}
};
obj_player.inventory.push = obj_player.inventory.addItem;

/*
obj_player.onstep = function() {

	
	let cr = game.getCurrentRoom();
	let cb = this.collisionBox;
	let prevPos = this.x + ',' + this.y;

	if(game.checkKey("a" )&& cr.checkEmpty(-16 + this.x + cb[0], this.y + cb[1], true, cb[2], cb[3])) { this.x -= 16; } 
	if(game.checkKey("d") && cr.checkEmpty( 16 + this.x + cb[0], this.y + cb[1], true, cb[2], cb[3])) { this.x += 16; } 
	if(game.checkKey("w" )&& cr.checkEmpty( this.x + cb[0],-12 + this.y + cb[1], true, cb[2], cb[3])) { this.y -= 12; } 
	if(game.checkKey ("s") && cr.checkEmpty( this.x + cb[0], 12 + this.y + cb[1], true, cb[2], cb[3])) { this.y += 12; }  
}*/


obj_player.onkeydown = function(ev) {
	
	console.log(this); 

	let cr = game.getCurrentRoom();
	let cb = this.collisionBox;
	let prevPos = this.x + ',' + this.y;

	if(ev.key == "a" && cr.checkEmpty(-16 + this.x + cb[0], this.y + cb[1], true, cb[2], cb[3])) { this.x -= 16; } 
	if(ev.key == "d" && cr.checkEmpty( 16 + this.x + cb[0], this.y + cb[1], true, cb[2], cb[3])) { this.x += 16; } 
	if(ev.key == "w" && cr.checkEmpty( this.x + cb[0],-12 + this.y + cb[1], true, cb[2], cb[3])) { this.y -= 12; } 
	if(ev.key == "s" && cr.checkEmpty( this.x + cb[0], 12 + this.y + cb[1], true, cb[2], cb[3])) { this.y += 12; }  

	if(ev.key=="e"/*prevPos !== this.x + ',' + this.y*/) { 
		sou_footstep[Math.floor(Math.random()*sou_footstep.length)].play(.1); 

		//this.setDepth(-1*this.y);

		let cols = cr.getObjectsAt(this.x,this.y,false,32,48);
		cols.forEach(obj=>{
			if(obj.name == "obj_pickup") { obj.destroy(); }
			if(obj.name == "obj_door") { obj.open(); }
		}); 
	}


} 