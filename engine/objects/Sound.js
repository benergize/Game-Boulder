function Sound(arg0, fileName, volume = 1, forceNewResource = false) {

	let engine = GAME_ENGINE_INSTANCE.engine;

	this.name = arg0;
	this.fileName = fileName;
	this.resource = engine.importResource(fileName, forceNewResource);

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


	
	this.id = GAME_ENGINE_INSTANCE.generateID();

	GAME_ENGINE_INSTANCE.sounds.push(this);

	return this;
}