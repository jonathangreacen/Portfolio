WORKSHOP.site.vis.BROWNIAN = (function(){
		var total_movers = 400,
			movers 		= [],
			me = {},
			_w, _h, c,
			context,
			center,
			animationID,
			clearID,
			centerID;
			
		
		me.init = function(_c){
			(window['addEventListener']) ? window.addEventListener('resize', resetCanvasHeight, false) : window.attachEvent('onresize', resetCanvasHeight);
			c = _c;
			canvas = _c;
			canvas.style.cursor = 'auto';
			_w = c.width;
			_h = c.height;
			context = canvas.getContext('2d');
			center 		= {x:_w/2, y:_h, vx:0, vy:0};
			run();
		};
		function run(){
			buildMovers(total_movers);
			var rate 			= 1000/30;
			animationID = setInterval(draw, rate);
			clearID = setInterval(whiteOut, rate);
			centerID = setInterval(recenter, 850);
		};
		function draw(){
			context.strokeStyle = '#beebba';
			context.lineWidth = 1;
			context.beginPath();
			for(var i=0;i<movers.length; i++){
				var m = movers[i];
					m.move();
				   
					context.moveTo(m.lastX, m.lastY);
					context.lineTo(m.x, m.y);
					m.lastX = m.x;
					m.lastY = m.y;
					if(m.x > _w || m.y > _h || m.x < 0 || m.y < 0){
						removeMover( m );
						buildMovers(1);
					}
			}
			context.closePath()
			context.stroke();        
		};
		function resetCanvasHeight(){
			_h = c.height;
		};
		function whiteOut(){				
			context.fillStyle ='rgba(' + 0xf2 + ',' + 0xfe + ',' + 0xf1 + ',.05)';					
			context.beginPath();
			context.fillRect(0,0,_w,_h);
			context.closePath();
			context.fill();				
		};
		function recenter(){
			center.x = Math.random() * _w;
			center.y = Math.random() * _h;
		};
		function getMouseXY(evt){
			center.x = evt.pageX;
			center.y = evt.pageY;
		};
		function buildMovers(n){
			for(var i=0; i<n; i++){
				var m = new Mover();
					m.x = center.x
					m.y = center.y
					m.lastX = m.x;
					m.lastY = m.y;
					m.power = Math.random() * 5 + .5;
					m.color = Math.round(Math.random() * 0xFFFFFF);
					
					m.vx = 0;
					m.vy = 0;
					movers.push( m );                            
			}
		};
		function removeMover( m ){
			var index = 0;
			for(var i=0; i<movers.length; i++){
				var m2 = movers[i];
				if(m == m2){
					movers.splice(i,1);
					break;
				}
			}
		};
		function Mover(){
			this.x;
			this.y;
			this.vx;
			this.vy;
			this.lastX;
			this.lastY;
			this.power;
			this.color;
			this.move = function(){                        
				this.vx += (Math.random() - Math.random())*this.power;
				this.vy += (Math.random() - Math.random())*this.power;
				
				this.x += this.vx;
				this.y += this.vy;
			}
		};
		me.destroy = function(){
			clearInterval(animationID);
			clearInterval(clearID);
			clearInterval(centerID);
			(window['removeEventListener']) ? window.removeEventListener('resize', resetCanvasHeight, false) : window.detachEvent('onresize', resetCanvasHeight);
		};
		WORKSHOP.site.vis.NEWEST_LOADED_VISUALIZATION = me;
		return me;
})();