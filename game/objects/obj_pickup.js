function Obj_Pickup(x,y,sprite = new Sprite("spr_pickup","game/sprites/tilese2.png",172,64,19,23,19,23)) {

	let pickup = new GameObject("obj_pickup",x,y,sprite);

	pickup.ondestroy = function() {
		sou_foundSomethingSm.play();
		return true;
	}

	return pickup;
}

