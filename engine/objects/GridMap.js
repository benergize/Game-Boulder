function GridMap(name, gridX=32, gridY=32, map = [], key={}) {

	this.name = name;
	this.gridX = gridX;
	this.gridY = gridY;
	this.map = map;
	this.key = key;

	this.generate = function() {

		let game = GAME_ENGINE_INSTANCE;
		let croom = game.getCurrentRoom()
		
		if(croom != -1) {
			
			for(let y = 0; y < map.length; y++) {

				for(let x = 0; x < map[y].length; x++) {

					let space = map[y][x];

					if(typeof key[space] !== 'undefined') {

						let obj = game.getObject(key[space]);

						if(typeof obj !== 'undefined') {

							let inst = new Instance(obj);

							inst.x = x * this.gridX;
							inst.y = y * this.gridY;

							croom.addObject(inst);
						}
					}
				}
			}
		}
	}

	this.id = GAME_ENGINE_INSTANCE.generateID();
	GAME_ENGINE_INSTANCE.gridMaps.push(this);

	return this;
}