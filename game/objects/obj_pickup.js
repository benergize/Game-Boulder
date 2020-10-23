function Obj_Pickup(x,y,sprite = new Sprite("spr_pickup","game/sprites/tilese2.png",396,0, 32,48,32,48)) {

	let pickup = new GameObject("obj_pickup",x,y,sprite);

	pickup.ondestroy = function() {
		sou_foundSomethingSm.play();
		return true;
	}

	return pickup;
}

