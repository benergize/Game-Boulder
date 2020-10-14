function Tile(sprite = new Sprite(), x = 0, y = 0, solid = false, properties = []) {
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.solid = solid;
	this.properties = properties;

	return this;
}