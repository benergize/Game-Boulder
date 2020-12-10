function Instance(obj, limit = 25, _firstCall=true) {

	let target = typeof obj === "object" ? obj : GAME_ENGINE_INSTANCE.getEngineResources(obj)[0];
	
	try {

		if(limit <= 0) { throw "Recursed too many times."; }

		for(let prop in target) {
			let val = target[prop];

			if(typeof val === "number") { this[prop] = Number(val); }
			if(typeof val === "string") { this[prop] = String(val); } 
			if(typeof val === "function") { this[prop] = val; } 
			if(typeof val === "object") {
				if(Array.isArray(val)) {
					this[prop]=[];
					for(let i = 0; i < val.length; i++) {
						this[prop][i] = new Instance(val[i], limit-1, false);
					}
				}
				else {
					this[prop] = String(val.__proto__).indexOf("HTML") !== -1 ? val : new Instance(val, limit-1, false); 
				}
			}
		}
		this.id = GAME_ENGINE_INSTANCE.generateID();
	}
	catch(e) {
		console.error("Value copy failed", obj, e);
		return null;
	}

	return this;
}