function Tile(arg0, sprite = new Sprite(), x = 0, y = 0, solid = false, properties = []) {
	
	this.name = arg0;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.solid = solid;
	this.properties = properties;

	this.id = GAME_ENGINE_INSTANCE.generateID();
	
	if(typeof this.sprite == "string") { this.sprite = GAME_ENGINE_INSTANCE.getSprite(this.sprite); }

	this.destroy = function() {

		console.log(this,this.id);
		let newTileArray = GAME_ENGINE_INSTANCE.getCurrentRoom().tiles.filter(tile=>{ return tile.id !== this.id; });
		GAME_ENGINE_INSTANCE.getCurrentRoom().tiles = newTileArray;

		return delete this;
	}

	GAME_ENGINE_INSTANCE.tiles.push(this);

	return this;
}