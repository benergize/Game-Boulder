function Tile(sprite = new Sprite(), x = 0, y = 0, solid = false, properties = []) {
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.solid = solid;
	this.properties = properties;

	this.id = game.generateID();

	this.destroy = function() {

		console.log(this,this.id);
		let newTileArray = game.getCurrentRoom().tiles.filter(tile=>{ return tile.id !== this.id; });
		game.getCurrentRoom().tiles = newTileArray;

		return delete this;
	}

	return this;
}