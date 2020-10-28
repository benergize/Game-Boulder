function Obj_Door(x,y,sprite = spr_door) {

	let door = new GameObject("obj_door",x,y,sprite);

	door.locked = false;
	door.opened = false;
	door.solid = true;

	door.open = function() {

		if(!this.locked) {
			if(!this.opened) {
				sou_door.play();
				this.sprite = spr_door_open;
				this.opened = true;
				this.solid = false;
			}
			return true;
		}
		else {

			//..if(obj_player.inventory.indexOf
		}
	}

	return door;
}

