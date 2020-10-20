engine = {
	
	canvas: document.querySelector("#canvas"),
	ctx: document.querySelector("#canvas").getContext("2d"),

	localFilter: function(input) {
		return input.replace("file:///","").replace(/\\/g,"/");
	}
};

["keydown","keyup","keypress","mousedown","mouseup","mousemove","contextmenu"].forEach(event=>{
	window.addEventListener(event, e=>{ 

		if(typeof GAME_ENGINE_INSTANCE === "undefined") { return false; }

		let croom = GAME_ENGINE_INSTANCE.getCurrentRoom(); 
		if(typeof croom === "object") { 

			croom.roomObjects.forEach(obj=>{ if(typeof obj[event] === "function") { 

				obj[event](e); 
			} });  
		}
	});

});
 