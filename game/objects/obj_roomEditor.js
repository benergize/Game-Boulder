var obj_roomEditor = new GameObject();


obj_roomEditor.mousedown = function(ev) {

	if(ev.button != 2) { this.mousePressed = true; }
	console.log(ev);
}

obj_roomEditor.mouseup = function(ev) {
	
	if(ev.button != 2) { this.mousePressed = false; }
}

obj_roomEditor.mousemove = function(ev) {

	if(this.mousePressed) {
		let croom = game.getCurrentRoom();

		let sx = Math.floor((ev.clientX+croom.view.x) / 32) * 32 - game.engine.canvas.offsetLeft;
		let sy = Math.floor((ev.clientY+croom.view.y) / 48) * 48 - game.engine.canvas.offsetTop;

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

obj_roomEditor.contextmenu = function(ev) {
	ev.preventDefault();

	let croom = game.getCurrentRoom();

	let sx = Math.floor((ev.clientX+croom.view.x) / 32) * 32 - game.engine.canvas.offsetLeft;
	let sy = Math.floor((ev.clientY+croom.view.y) / 48) * 48 - game.engine.canvas.offsetTop;
	croom.getTilesAt(sx,sy)[0].destroy();
}