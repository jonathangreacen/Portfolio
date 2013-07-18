WORKSHOP.site.vis.LOGARITHMIC_UNIVERSE = (function LogarithmicUniverse(){
	var canvas,context,colors,rows,cols,w,h,animationID,endpoints,drawing,running,me={},alpha=0;
		
	me.init = function(_c){
		(window['addEventListener']) ? window.addEventListener('resize', resetCanvasHeight, false) : window.attachEvent('onresize', resetCanvasHeight);
		canvas = _c;
		canvas.width = 161;
		canvas.height = document.height;
		context = canvas.getContext('2d');
		canvas.style.cursor = 'auto';
		rows = 11;
		cols = 3;
		w = canvas.width / cols;
		h = canvas.height / rows;
		drawing = WORKSHOP.utils.DRAWING;
		
		var fragments = (rows + cols)*4;
		if(!colors){
			endpoints = [0x80B6CC, 0xD22B0D, 0xFFFF99, 0x287961 ];//0x111111,0xFFFFFF];
			colors = drawing.colorGrade(endpoints[0], endpoints[1], fragments);
			colors = drawing.colorGrade(endpoints[1], endpoints[2], fragments, colors);
			colors = drawing.colorGrade(endpoints[2], endpoints[3], fragments, colors);
			colors = drawing.colorGrade(endpoints[3], endpoints[2], fragments, colors);
			colors = drawing.colorGrade(endpoints[2], endpoints[1], fragments, colors);
			colors = drawing.colorGrade(endpoints[1], endpoints[0], fragments, colors);
		}
		resetCanvasHeight();
		running = true;
		animationID = setInterval(me.draw, 66);
	};
	me.draw = function(){
		var i, j, x, y,
			color;					
			context.strokeStyle = 'rgba(0,0,0,.044)';
			context.lineWidth = 1;
			context.globalAlpha = alpha;
			alpha += .08;
			alpha = (alpha < 1) ? alpha : 1;
		for(i=0; i<cols; i++){		
			x = i * w;
			for(j=0; j<rows; j++){
				y = j * h;
				color = '#' + colors[i + j].toString(16);
				
				context.fillStyle = color;
				context.beginPath();
				context.rect(x, y, w, h);
				context.closePath();
				context.stroke();
				context.fill();
			}
		}
		//colors.push( colors.shift() );
		colors.unshift( colors.pop() );
	};
	function resetCanvasHeight(){
		canvas.height = window.innerHeight;
		w = canvas.width / cols;
		h = canvas.height / rows;
	};	
	function destroy(){
		context.globalAlpha = 1;
		running = false;
		clearInterval(animationID);
		(window['removeEventListener']) ? window.removeEventListener('resize', resetCanvasHeight, false) : window.detachEvent('onresize', resetCanvasHeight);
		if(canvas) canvas.onclick = null;
	};
	me.destroy = destroy;
	WORKSHOP.site.vis.NEWEST_LOADED_VISUALIZATION = me;
	return me;
})();