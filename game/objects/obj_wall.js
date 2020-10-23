function Obj_wall(x,y) {

	var wall = new GameObject("obj_wall",x,y,spr_wall);

	wall.solid = true;
	wall.collisionBox = [0,20,32,20];
	wall.ondraw = function() {
		spr_floor_shadow.draw(this.x,this.y+48);
		if(game.getCurrentRoom().getObjectsAt(this.x+1,this.y+51,false).map(n=>{return n.name;}).indexOf("obj_wall") != -1) {
			this.sprite = spr_ceiling;
		}
	}
	wall.depth = -y;


	return wall;
}