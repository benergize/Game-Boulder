function Tile(sprite = new Sprite(), x = 0, y = 0, solid = false, properties = []) {
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.solid = solid;
	this.properties = properties;

	this.id = GAME_ENGINE_INSTANCE.generateID();

	this.destroy = function() {

		console.log(this,this.id);
		let newTileArray = GAME_ENGINE_INSTANCE.getCurrentRoom().tiles.filter(tile=>{ return tile.id !== this.id; });
		GAME_ENGINE_INSTANCE.getCurrentRoom().tiles = newTileArray;

		return delete this;
	}

	GAME_ENGINE_INSTANCE.tiles.push(this);

	return this;
}