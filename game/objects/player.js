var player = new GameObject(
	"player", 
	180, 180, 
	new Sprite("game/sprites/people.png",0,0,25,38,25,38),
	-1,
	-1,
	true,
	true,
	[0,24,24,14]
);


player.keyup = function(ev) {
	console.log(ev);

}

player.keydown = function(ev) {
	console.log(ev); 

	if(ev.key == "a") { this.moveIfEmpty(this.x-16,this.y) } 
	if(ev.key == "d") { this.moveIfEmpty(this.x+16,this.y) } 
	if(ev.key == "w") { this.moveIfEmpty(this.x,this.y-16) } 
	if(ev.key == "s") { this.moveIfEmpty(this.x,this.y+16) }  

} 

player.mouseup = function(ev) {

	console.log(game.getCurrentRoom().getTilesAt(Math.floor(ev.clientX / 32) * 32, Math.floor(ev.clientY / 48) * 48));
	game.getCurrentRoom().tiles.push(new Tile(spr_wall, Math.floor(ev.clientX / 32) * 32, Math.floor(ev.clientY / 48) * 48,true))

}
