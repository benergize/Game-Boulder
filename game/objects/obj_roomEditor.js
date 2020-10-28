var obj_roomEditor = new GameObject("obj_roomEditor");


obj_roomEditor.onmousedown = function(ev) {

	this.mousePressed = ev.button; 
	obj_roomEditor.mousemove(ev);
	console.log(ev);
}

obj_roomEditor.onmouseup = function(ev) {
	this.mousePressed = false; 
}

obj_roomEditor.onmousemove = function(ev) {

	if(this.mousePressed !== false) {

		 
		let croom = game.getCurrentRoom();

		let sx = Math.floor((ev.clientX+croom.view.x) / 32) * 32 - game.engine.canvas.offsetLeft;
		let sy = Math.floor((ev.clientY+croom.view.y) / 48) * 48 - game.engine.canvas.offsetTop;

		if(this.mousePressed == 0) {
			let ssx = document.querySelector("#tiles");
			console.log(game.getCurrentRoom().getTilesAt(sx,sy) );

			if(croom.getTilesAt(sx,sy).length === 0) {
				let ts = ssx.value == 'spr_water' ? spr_water : new Sprite('x',"game/sprites/tilese2.png",0 + (ssx.value * 33),0,32,48,32,48);

				game.getCurrentRoom().tiles.push(new Tile('t', ts, sx, sy, JSON.parse(ssx.selectedOptions[0].dataset.solid)))
			}
			else {
				//croom.getTilesAt(sx,sy)[0].sprite.sheetX = 0 + (ssx.value * 33)
			}
		}
		else if(this.mousePressed == 2) {

			let sx = Math.floor((ev.clientX+croom.view.x) / 32) * 32 - game.engine.canvas.offsetLeft;
			let sy = Math.floor((ev.clientY+croom.view.y) / 48) * 48 - game.engine.canvas.offsetTop;
			croom.getTilesAt(sx,sy)[0].destroy();
		}
	}
}

obj_roomEditor.oncontextmenu = function(ev) {
	ev.preventDefault();  
}