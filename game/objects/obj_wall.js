function Obj_wall(x,y) {

	var wall = new GameObject("obj_wall",x,y,spr_wall);

	wall.solid = true;
/*	wall.ondraw = function() {
		spr_floor_shadow.draw(this.x,this.y+48);
	}*/
//	wall.depth = 1;

	return wall;
}