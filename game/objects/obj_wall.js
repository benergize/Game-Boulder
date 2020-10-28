function Obj_wall(x,y) {

	var wall = new GameObject("obj_wall",x,y,new Sprite('c',"game/sprites/tiles.png",254,32,32,48,32,48));

	wall.solid = true;
	//wall.collisionBox = [0,20,32,20];
	wall.ondraw = function() {
		//spr_floor_shadow.draw(this.x,this.y+48);
		game.engine.ctx.fillStyle = 'rgba(0,0,0,.5)';
		game.engine.ctx.fillRect(this.x-game.getCurrentRoom().view.x,this.y+48-game.getCurrentRoom().view.y,32,12);
		if(game.getCurrentRoom().getObjectsAt(this.x+1,this.y+51,false).map(n=>{return n.name;}).indexOf("obj_wall") != -1) {
			this.sprite = spr_ceiling_cave;
		}
	}
	wall.depth = -y;


	return wall;
}