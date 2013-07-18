// Main application instantiates these section apps, never instantiated alone or prior to the main class
WORKSHOP.site.sections.WORK = (function (UTILS, _doc, _win){
	var me = {},
		get,
		nav,
		currentFocusedProject,
		initialized = false,
		slideshows = [];//for pause/restarting as a user scrolls a project into view

	me.name = 'PORTFOLIO';
		
	function init(){
		if(!initialized){
			get = function(name) {return (name.charAt(0) === '#') ?  _doc.getElementById(name.substring(1)) : name.charAt(0) === '.' ? _doc.getElementsByClassName(name.substr(1)) : _doc.getElementsByTagName(name) };
			(_win['addEventListener']) ? _win.addEventListener('resize', onResize, false) : _win.attachEvent('onresize', onResize);
			initialized = true;
		}
	};
	function parse(content, feedType){
		portfolioWorkContent = content;
		var projects = content.getElementsByTagName('item'),
			i = 0,
			t = projects.length,
			section = document.getElementsByTagName('section')[0],
			serializer = (typeof _win.XMLSerializer != "undefined") ? new XMLSerializer() : null,
			buildHTMLElement = UTILS.buildHTMLElement;
			
		for(; i<t; i++){
			var item, title, project_col, summary, description, descriptionFull, infoCouplets, j, l, imageData, imagePaths;	
				if(feedType === 'xml'){
					item = projects[i];
					title = item.getElementsByTagName('title')[0].firstChild.data;
					project_col = item.attributes.getNamedItem('color').value;
					summary = item.getElementsByTagName('summary')[0].firstChild.data;
					description = item.getElementsByTagName('description')[0].childNodes;
					descriptionFull = item.getElementsByTagName('description')[0];
					infoCouplets = item.getElementsByTagName('info');
					imageData = item.getElementsByTagName('images')[0].getElementsByTagName('img');
					j = 0;
					l = imageData.length;
					imagePaths = [];
					for(; j<l; j++){
						imagePaths.push( imageData[j].attributes.getNamedItem('src').value );
					}
				}else{} // or write parser for different data structure, JSON etc
				
				
		// Build the html elements and populate with above data
			var article = buildHTMLElement('article', {id:title}, section),
				images = buildHTMLElement('div', {class:'image_preview'}, article),
				hgroup = buildHTMLElement('div', {class:'hgroup'}, article),
				titleContainer = buildHTMLElement('h3', {class:'title',style:"color:"+project_col+";"}, hgroup, title),
				summaryContainer = buildHTMLElement('h4', {class:'summary'}, hgroup, summary),		
				projectDescription = buildHTMLElement('div', {class:'description'}, article),
				desc = '',
				ps = descriptionFull.getElementsByTagName('p'),
				l = ps.length,
				half = l/2,
				j = 0;
			for(; j<l; j++){
				var paragraph = (serializer !== null) ? serializer.serializeToString(ps[j]) : ps[j].xml;
				var column = projectDescription;
					column.insertAdjacentHTML("beforeEnd", paragraph);
			}
			
			// Project Credits/info
			l = infoCouplets.length;
			var infoContainer = buildHTMLElement('div', {class:'info'}, article),
				infoItem,
				infoCouplet,
				infoTitle;					
			for(j=0; j<l; j++){
				infoItem = infoCouplets[j];
				infoCouplet = buildHTMLElement('div', {class:'infoCouplet'}, infoContainer);
				infoTitle = document.createElement('h5');
				infoTitle.appendChild(document.createTextNode(infoItem.attributes.getNamedItem('type').value + " "));
				infoCouplet.appendChild(infoTitle);
				infoCouplet.appendChild(document.createTextNode(' ' + infoItem.firstChild.data));
			}
			
			// Images
			if(imagePaths.length > 0){
				var slideshow = new Slideshow(imagePaths);
					slideshow.init();
					slideshow.setContainer(images);
					slideshows.push( slideshow );
			}
			focusProjectInView();
		}
	};
	function focusProjectInView(pageY){
		var projects = get('article'),
			t = projects.length,
			i = 0,
			project,
			projectY,
			midPoint = _win.innerHeight / 2,
			_winY = pageY || _win.pageYOffset;
			
		for(i; i<t; i++){
			project = projects[i];
			projectY = project.offsetTop;			
			if(currentFocusedProject !== project && midPoint > projectY - _winY && midPoint < projectY + parseInt(project.offsetHeight, 10) - _winY){
				if(currentFocusedProject) {
					unhilightCurrentProject(projects);
				}
				currentFocusedProject = project;
				currentFocusedProject.setAttribute('class', 'hilighted');
				slideshows[i].run();
			}
		}
	};
	me.onPageScroll = focusProjectInView;
	function unhilightCurrentProject(_projects){
		var projects = _projects || get('article') || [],
			t = projects.length,
			i = 0;
		for(; i<t; i++){//Collections don't have the indexOf() function
			if(projects[i] == currentFocusedProject) slideshows[i].pause(); 
		}					
		currentFocusedProject.setAttribute('class', '');
		currentFocusedProject = null;
	};
	function onResize(){
		var t = slideshows.length,
			i = 0;
		for(; i<t; i++){
			slideshows[i].fixBackgroundHeight();
		}
	};
	me.run = function(content, feedType){
		parse(content, feedType);
	};
	me.destroy = function(){
		if(slideshows){
			while(slideshows.length > 0){
				var slideshow = slideshows.pop();
					slideshow.destroy();
			}
			slideshows = [];
		}
		currentFocusedProject = null;
	};
	
	
	// Helper Slideshow object
	function Slideshow(_images){
		this.frontImage;
		this.backImage;
		this.images = _images || [];
		this.container;
		this.index;
		this.timer;
		this.initialized = false;
		this.frontImageHolder;
		this.backImageHolder;
		this.running = false;
	};
	Slideshow.prototype = {
		DELAY:2750,
		useTimeout:true,
		init:function(){
			if(!this.initialized){
				this.index = 0;
				this.frontImage = new Image();
				this.frontImage.style.opacity = 0;
				this.frontImage.addEventListener("load", this.onNewImageLoaded.bind(this));
				
				this.backImage = new Image();
				this.backImage.addEventListener("load", this.onBackImageLoaded.bind(this));

				this.initialized = true;
				this.showFirstImage();
			}
		},
		showFirstImage:function(){
			if(this.initialized){
				this.running = true;
				this.loadNextImage();
				this.running = false;
			}
		},
		run:function(){
			this.frontImage.style.opacity = 0;
			this.running = true;
			this.loadNextImage();
			this.initializeTimer();
		},
		initializeTimer:function(){
			if(this.useTimeout){
				clearTimeout(this.timer);
				this.timer = setTimeout(this.copyFrontImageToBack.bind(this), this.DELAY);
			}else{
				clearInterval(this.timer);
				this.timer = setInterval(this.copyFrontImageToBack.bind(this), this.DELAY);
			}
		},
		pause:function(){
			this.running = false;
			clearInterval(this.timer);
			clearTimeout(this.timer);
			this.timer = false;
		},
		copyFrontImageToBack:function(){
			if(this.frontImage && this.frontImage.src != ''){ 
				this.backImage.src = this.frontImage.src;
			}
		},
		fixBackgroundHeight:function(){
			if(this.container) this.container.style.height = this.frontImage.height + 'px';
		},
		loadNextImage:function(){
			if(this.running){
				this.frontImage.src = this.images[this.index];
				this.index = (this.index + 1 < this.images.length) ? ++this.index : 0;
			}
		},
		onNewImageLoaded:function(){
			this.fixBackgroundHeight();
			this.frontImage.style.opacity = 1;
			if(this.useTimeout)this.initializeTimer();
		},
		onBackImageLoaded:function(){
			if(this.running){
				this.frontImage.style.opacity = 0;
				setTimeout(this.loadNextImage.bind(this), 200);
			}
		},
		setContainer:function(_container){
			if(!this.initialized) this.init();
			this.container = _container;
			this.container.appendChild( this.backImage );
			this.container.appendChild( this.frontImage );
		},
		destroy:function(){
			this.pause();
			this.container.removeChild( this.backImage );
			this.container.removeChild( this.frontImage );
			this.container = this.frontImage = this.backImage = null;
		}
	};
	
	init();		// auto initialize
	return me;
	
})(WORKSHOP.utils.CORE, document, window);
