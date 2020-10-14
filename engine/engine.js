engine = {
	
	canvas: document.querySelector("#canvas"),
	ctx: document.querySelector("#canvas").getContext("2d")

};

["keydown","keyup","keypress","mousedown","mouseup","mousemove"].forEach(event=>{
	window.addEventListener(event, e=>{ 

		let croom = game.getCurrentRoom(); 
		if(typeof croom === "object") { 
		
		//	console.log(croom.roomObjects);
			//console.log(event);
			croom.roomObjects.forEach(obj=>{ if(typeof obj[event] === "function") { 

				//e.preventDefault();

				obj[event](e); 
			} });  
		}
	});

});
 