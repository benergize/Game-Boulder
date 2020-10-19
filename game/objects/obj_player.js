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
	if(ev.key == "w") { this.moveIfEmpty(this.x,this.y-12) } 
	if(ev.key == "s") { this.moveIfEmpty(this.x,this.y+12) }  

} 

player.mousedown = function(ev) {

	if(ev.button != 2) { player.mousePressed = true; }
	console.log(ev);
}

player.mouseup = function(ev) {
	
	if(ev.button != 2) { player.mousePressed = false; }
}

player.mousemove = function(ev) {

	if(player.mousePressed) {
		let croom = game.getCurrentRoom();

		let sx = Math.floor((ev.clientX+croom.view.x) / 32) * 32;
		let sy = Math.floor((ev.clientY+croom.view.y) / 48) * 48;

		let ssx = document.querySelector("#tiles");
		console.log(game.getCurrentRoom().getTilesAt(sx,sy) );

		if(croom.getTilesAt(sx,sy).length === 0) {
			game.getCurrentRoom().tiles.push(new Tile(new Sprite("game/sprites/tilese2.png",0 + (ssx.value * 33),0,32,48,32,48), sx, sy,JSON.parse(ssx.selectedOptions[0].dataset.solid)))
		}
		else {
			croom.getTilesAt(sx,sy)[0].sprite.sheetX = 0 + (ssx.value * 33)
		}
	}
}

player.contextmenu = function(ev) {
	ev.preventDefault();

	let croom = game.getCurrentRoom();

	let sx = Math.floor((ev.clientX+croom.view.x) / 32) * 32;
	let sy = Math.floor((ev.clientY+croom.view.y) / 48) * 48;
	croom.getTilesAt(sx,sy)[0].destroy();
}