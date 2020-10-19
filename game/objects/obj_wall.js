var wall = new GameObject("obj_wall",0,0,spr_wall);

wall.draw = function() {
	spr_floor_shadow.draw(this.x,this.y+48);
}