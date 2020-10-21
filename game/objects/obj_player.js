var obj_player = new GameObject(
	"obj_player", 
	180, 180, 
	new Sprite("spr_player","game/sprites/people.png",0,0,25,38,25,38),
	-1,
	-1,
	-1,
	true,
	true,
	[0,24,24,14]
);

 

obj_player.onkeydown = function(ev) {
	
	console.log(this); 

	let cr = game.getCurrentRoom();
	let cb = this.collisionBox;
	let prevPos = this.x + ',' + this.y;

	if(ev.key == "a" && cr.checkEmpty(-16 + this.x + cb[0], this.y + cb[1], true, cb[2], cb[3])) { this.x -= 16; } 
	if(ev.key == "d" && cr.checkEmpty( 16 + this.x + cb[0], this.y + cb[1], true, cb[2], cb[3])) { this.x += 16; } 
	if(ev.key == "w" && cr.checkEmpty( this.x + cb[0],-12 + this.y + cb[1], true, cb[2], cb[3])) { this.y -= 12; } 
	if(ev.key == "s" && cr.checkEmpty( this.x + cb[0], 12 + this.y + cb[1], true, cb[2], cb[3])) { this.y += 12; }  

	if(prevPos !== this.x + ',' + this.y) { 
		sou_footstep[Math.floor(Math.random()*sou_footstep.length)].play(.1); 

		let cols = cr.getObjectsAt(this.x,this.y,false,32,48);
		cols.forEach(obj=>{
			if(obj.name == "obj_pickup") { obj.destroy(); }
		}); 
	}


} 