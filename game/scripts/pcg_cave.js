function pcg_cave() {

	lines = [];
	points = [];
	for(let f = 0; f < 25; f++) {
		
		let x1 = Math.floor(Math.floor(Math.random()*1280)/32)*32;
		let x2 =  Math.floor(Math.floor(Math.random()*1280)/32)*32;
		let y1 =  Math.floor(Math.floor(Math.random()*720)/48)*48;
		let y2 =  y1;
	
		lines.push([x1,y1,x2,y2]);
	}
	
	for(let f = 0; f < 25; f++) {
		
		let x1 = Math.floor(Math.floor(Math.random()*1280)/32)*32;
		let x2 = x1;
		let y1 =  Math.floor(Math.floor(Math.random()*720)/48)*48;
		let y2 =  Math.floor(Math.floor(Math.random()*720)/48)*48;
	
		lines.push([x1,y1,x2,y2]);
	}
	lines.forEach(line=>{
		let x = line[0];
		let y = line[1];let f= 0;
		while((x != line[2] || y != line[3]) && f < 50) {
			x += 32 * (x==line[2] ? 0 : (line[2] > line[0] ? 1 : -1));
			y += 48 * (y==line[3] ? 0 : (line[3] > line[1] ? 1 : -1));
			points.push(x+","+y);
			points.push(x+","+(y+1));
			points.push((x+1)+","+y);
			f++;
		}
	});
	
	for(let x = 0; x < 1280; x += 32) {
		for(let y = 0; y < 720; y+=48){ 
			if(points.indexOf(x+","+y) == -1) {
				room1.roomObjects.push(new Obj_wall(x,y))
			}
		}
	}
	
	obj_player.x = lines[0][0];
	obj_player.y = lines[0][1]-48;
	obj_player.setDepth(-9999);
	
}