function Sound(arg0, volume = 1, forceNewResource = false) {

	let argObj = typeof arg0 === "object";

	try {

		this.fileName = argObj ? arg0.fileName : arg0;
		
		if(!forceNewResource) {

			let filteredResources = game.resources.filter(res=>{ return engine.localFilter(res.src) == engine.localFilter(this.fileName); });

			if(filteredResources.length > 0) {

				this.resource = filteredResources[0];
			}
			else { forceNewResource = true; }
		}

		//Do not change this to an else or else if.
		if(forceNewResource) {
			
			let newRes = new Audio(this.fileName);
			game.resources.push(newRes);

			this.resource = newRes;
		}

	}
	catch(error) {
		
		console.error("Engine Error", error);
		return false;
	}

	this.resource.volume = volume;
	this.prevVolume = volume;

	this.play = function(vol=this.prevVolume) {

		this.prevVolume = this.resource.volume;
		this.resource.volume = vol;
		this.resource.play();
		this.resource.volume = this.prevVolume;

		return true;
	}
	this.loop = function() {

		this.resource.loop = true;
		this.resource.play();

		return true;
	}
	this.pause = function() {
		this.resource.pause();
		this.resource.loop = false;

		return true;
	}
	this.stop = function() {

		this.pause();
		this.resource.currentTime = 0;
		
		return true;
	}
	this.seek = function(time = 0) {

		this.resource.currentTime = time;
		return true;
	}
	this.setVolume = function(vol = 1) {
		this.resource.volume = vol;
		return true;
	}
	this.mute = function() {

		this.prevVolume = this.resource.volume;
		this.resource.volume = 0;
		return true;
	}
	this.unmute = function() {

		if(this.resource.volume === 0) {
			this.resource.volume = this.prevVolume;
			return true;
		}
		return false;
	}
	this.setSpeed = function(speed = 1) {

		this.resource.playbackRate = speed;
	}


	
	this.id = game.generateID();

	game.sounds.push(this);

	return this;
}