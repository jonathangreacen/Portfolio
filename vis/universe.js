WORKSHOP.site.vis.LOGARITHMIC_UNIVERSE = (function LogarithmicUniverse(){
	var ctx,
		canvas,
		width,
		height,
		animationTimer,
		launchTimer,
		releaseTimer,
		dim,
		dim_log,
		xOff,
		yOff,
		running,
		arrow_data,
		loader,
		arrows = [],
		me = {};
		
	me.init = function(_c){
		canvas = _c;
		ctx = canvas.getContext('2d');
		width = canvas.width;
		height = canvas.height;
		canvas.style.backgroundColor = '#F2FEF1';
		dim = 1000;
		dim_log = Math.log(dim);
		running = false;
		xOff = width+10;
		yOff = 200;
		arrows = [];
		
		arrow_data = new Image();
		arrow_data.onload = onArrowDataLoaded;
		arrow_data.src = 'images/arrow_3.png';
	};
	function onArrowDataLoaded(e){
		if(arrow_data) arrow_data.onload = null;
		(window['addEventListener']) ? window.addEventListener('resize', resetCanvasHeight, false) : window.attachEvent('onresize', resetCanvasHeight);
		launchArrows();
		update();
	};
	function resetCanvasHeight(){
		canvas.height = window.innerHeight
	};
	function pauseArrowLaunch(){
		clearInterval(launchTimer);
		clearInterval(releaseTimer);
		canvas.onclick = launchArrows; // OR to automatically respawn: launchTimer = setTimeout(launchArrows, 5000);
		canvas.style.cursor='pointer';
		running = false;
	};
	function launchArrows(){
		if(!running){
			running = true;
			if(launchTimer)  clearInterval(launchTimer);
			if(releaseTimer) clearInterval(releaseTimer);
			launchTimer = setTimeout(pauseArrowLaunch, Math.random()*1550 + 2000);
			releaseTimer = setInterval(release , 6);
		}
	};
	var count = 0;
	function release(){
		var s = 1+4*(dim_log - Math.log(1+Math.random()*dim));
		var arrow = new Arrow();
			arrow.x = Math.round(xOff + Math.random()*20 - Math.random()*20);
			arrow.y = Math.round(yOff + Math.random()*20 - Math.random()*20);
			arrow.scale = s;
			arrow.speed = s;
			arrow.width = arrow.height = s * 5;
			arrow.rotation = Math.random()*Math.PI + Math.PI/2;//*(s*360);
			arrow.resetVelocity();
		arrows.push(arrow);
	};
	function update(){
		var t = arrows.length,
			i = 0,
			arrow,
			removeIndex,
			arrowsToRemove = [];
			
		for(; i<t; i++){
			arrow = arrows[i];
			arrow.x += arrow.vx;
			arrow.y += arrow.vy;
			if(running === false){
				arrow.power *= .977;		
				arrow.vx *= arrow.power;
				arrow.vy *= arrow.power;		
			}else if(arrow.power < 1){
				arrow.power += .08;
				arrow.resetVelocity();
			}
				
			if(arrow.x < 0 || arrow.y < 0 || arrow.x > width+20 || arrow.y > height){
				arrowsToRemove.push(arrow);
			}
		}
		
		window.cancelAnimationFrame(animationTimer);
		animationTimer = window.requestAnimationFrame(update);
		draw();
		t = arrowsToRemove.length;
		for(i=0; i<t; i++){
			arrow = arrowsToRemove[i];
			removeIndex = arrows.indexOf(arrow);
			arrows.splice(removeIndex,1);
		}
	};
	function draw(){
		canvas.height = canvas.height;
		var t = arrows.length,
			i = 0,
			w = arrow_data.width,
			h = arrow_data.height,
			arrow;
			
		for(; i<t; i++){
			arrow = arrows[i];
			ctx.translate(arrow.x,arrow.y);
			ctx.rotate(arrow.rotation);
			ctx.drawImage(arrow_data, 0, 0, w, h, 0, 0, arrow.width, arrow.height);
			ctx.rotate(-arrow.rotation);
			ctx.translate(-arrow.x, -arrow.y);
		}		
	};
	function destroy(){
		running = false;
		arrow_data = null;
		arrows = null;
		cancelAnimationFrame(animationTimer);
		clearInterval(launchTimer);
		clearInterval(releaseTimer);
		if(canvas) canvas.onclick = null;
		(window['removeEventListener']) ? window.removeEventListener('resize', resetCanvasHeight, false) : window.detachEvent('onresize', resetCanvasHeight);
	};
	me.destroy = destroy;
	function Arrow(){
		this.x;
		this.y;
		this.angle;
		this.scale;
		this.speed;
		this.rotation;
		this.vx;
		this.vy;
		this.power = 1;
		this.count;
		
		this.resetVelocity = function(){
			this.vx = (Math.cos(this.rotation) * this.speed) * this.power;
			this.vy = (Math.sin(this.rotation) * this.speed) * this.power;
		};
	};
	WORKSHOP.site.vis.NEWEST_LOADED_VISUALIZATION = me;
	return me;
})();