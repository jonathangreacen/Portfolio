var WORKSHOP = WORKSHOP || {site:{ sections:{}, vis:{} }};
	
WORKSHOP.site.MAIN = (function(doc,win){
			var me = {},
				head,
				body,
				graphic,
				graphicVis,
				graphicTrench,
				nav,
				navData,
				navBottom,
				sectionApplications,
				section,
				portfolio,
				currentSection,
				currentSectionApp,
				showNavTimer,
				showNavAnimationTimer,
				contentLoader,
				siteData,
				UTILS,
				initialized 	= false,
				content_path 	= 'data/work.xml',
				feedType 		= 'xml',
				AUTHOR 			= 'Jonathan Greacen',
				TITLE 			= "WORKSHOP | Portfolio of Jonathan Greacen",
				KEYWORDS 		= 'portfolio',
				DESCRIPTION 	= 'Portfolio of Interactive Development by Jonathan Greacen',
				LOGO_SM 		= 'images/WORKSHOP_small.png',
				LOGO_LG 		= 'images/WORKSHOP_large.png',
				trackingID 		= 'UA-37913008-1',
				logo_small,
				HEADER_SITE_TITLE = "portfolio of interface development by <a onclick=WORKSHOP.site.MAIN.launchSection('ABOUT')>jonathan greacen</a>",
				FOOTER_CONTENT = "<i>Year of the Snake,</i> <b>WORKSHOP DEVELOPMENT LLC</b>";
			
			
			function init(){
				// As I said in index.html, yeah the one with the single script tag, 
				//	bear with me here and consider this a proof-of-concept instead of
				// 	best practices. It's also fine to consider it "worst practices".
				if(!initialized){
					doc = document;
					head = doc.head;
					
					body = doc.createElement('body');
					doc.body = body;
					
					// Instantiate <head> elements into the DOM
					var charset = buildElement('meta', {charset:'utf-8'}, head),
						author = buildElement('meta', {name:'author', content:AUTHOR}, head),
						keywords = buildElement('meta', {name:'keywords', content:KEYWORDS}, head),
						description = buildElement('meta', {name:'description', content:DESCRIPTION}, head),					
						tileColorIE = buildElement('meta', {name:'msapplication-TileColor', content:'#F2FEF1'}, head),
						tileImageIE = buildElement('meta', {name:'msapplication-TileImage', content:LOGO_LG}, head),		
						title = buildElement('title', null, head, TITLE),
						link = buildElement('link', {href:'css/main.css', rel:'stylesheet', media:'screen,projection'}, head),
						_utils = buildElement('script', {type:'text/javascript',src:'js/Utils.js'}, head),
						drawing = buildElement('script', {type:'text/javascript',src:'js/Drawing.js'}, head),
						gaTracking = buildElement('script', {type:'text/javascript', async:true, src:'http://www.google-analytics.com/ga.js'},head),
						icon = buildElement('link', {rel:'icon', href:'favicon.ico', type:'image/x-icon'}, head),
						
					// And next the <body> elements
						site = buildElement('div', {id:'site'}, body),
						_graphicTrench = buildElement('div', {id:'graphicTrench'}, body),
							canvas = buildElement('canvas', {id:'graphic', width:'225', height:'999'}, _graphicTrench), 
							shadow = buildElement('div', {id:'dropoff_shadow'}, _graphicTrench),
						
						rightColumn = buildElement('div', {id:'right_column'}, site),
							main = buildElement('div', {id:'main'}, rightColumn),
							header = buildElement('header', null, main),
								_nav = buildElement('nav', {role:'navigation'}, header),
									navContents = buildElement('div', {id:'nav_contents'}, _nav),
										_logoSmall = buildElement('div', {id:'logo_small'}, navContents), 
										logoSmallImg = buildElement('img', {src:LOGO_SM}, _logoSmall),
										
										_navOptions = buildElement('ul', {id:'nav_options'}, navContents),
										_navBottom = buildElement('div', {id:'nav_bottom'}, _nav);
								
							logoLarge = buildElement('div', {id:'logo_large'}, header);
									logoLargeImg = buildElement('img', {src:LOGO_LG}, logoLarge),
								siteDesc = buildElement('div', {id:'site_desc'}, header), 
									siteDescP = buildElement('p', null, siteDesc),
							_section = buildElement('section', {role:'main'}, main),
									siteDescP.innerHTML = HEADER_SITE_TITLE,
								
							footer = buildElement('footer', null, rightColumn),
							footerContent = buildElement('p', null, footer);
							footerContent.innerHTML = FOOTER_CONTENT;
							
					//...and save these for later
					graphic 		= canvas;
					graphicTrench 	= _graphicTrench;
					nav 			= _nav;
					navOptions 		= _navOptions;
					navBottom 		= _navBottom;
					section 		= _section;
					logo_small 		= _logoSmall;
					win = window;
					
					//Subscribe to DOM events, don't ascribe them directly to object handlers, i.e. window.onload
					(win['addEventListener']) ? win.addEventListener('load', onPageReady, false) : win.attachEvent('onload', onPageReady);
					(win['addEventListener']) ? win.addEventListener('scroll', onScroll, false) : win.attachEvent('onscroll', onScroll);
					(win['addEventListener']) ? win.addEventListener('touchmove', onTouchMove, false) : win.attachEvent('touchmove', onTouchMove);
					(win['addEventListener']) ? win.addEventListener('touchend', onTouchEnd, false) : win.attachEvent('touchend', onTouchEnd);
					initialized = true;
				}
			};
			function loadContents(){
				var contentLoader = UTILS.getLoader();
					contentLoader.addListener(contentLoader.COMPLETE, onPortfolioContentsLoaded);
					contentLoader.load(content_path);
			};
			function onPortfolioContentsLoaded(evt){
				var xmlStr = evt.target.data;
				delete evt.target;
				siteData = UTILS.parseXML(xmlStr);
				buildNav();
				manageNav();
                
			};
			function buildNav(){
				var data = siteData.firstChild.childNodes,
					t = data.length,i = 0,
					li,	a, name, navObject, item,
					elements = [], node;
				navData = {};
				
				for(; i<t; i++){
					node = data[i];
					if(data[i].nodeType === 1){
						elements.push( node );
					}
				}
				t = elements.length;
				i = 0;
				
				for(; i<t; i++){
					item 			= elements[i];					
					navObject 		= new NavObject();
					navObject.id 	= item.nodeName;
					navObject.label = item.attributes.getNamedItem('label').value;
					navObject.application = item.attributes.getNamedItem('application').value;
					navObject.animationPath = item.attributes.getNamedItem('visualization').value;
					navObject.content = item;
					
					li = buildElement('li', {id:navObject.id}, navOptions);
					a = buildElement('a',null, li, navObject.label);
					li.onclick = onNavClick(navObject.id, navObject);
					
					navData[navObject.id] = navObject;
					navData[navObject.id.toLowerCase()] = navObject;
					navData[i] = navObject;					
				};
				sectionApplications = {};
				determineLandingSection();
				window.onpopstate = handlePopState.bind(me);				
			};
			function onNavClick(id, obj){
				return function(){
					launchSection(id, obj);
				}
			};
			function handlePopState(e){
				if(e && e.state) launchSection(navData[e.state.id].id, null, true)
			};
			function determineLandingSection(){
				var section,
					hash = window.location.href;
					links = hash.split('/'),
					t = links.length,
					section = links[t-1];
					
					//Default to first section if hash value is not a valid section
					section = (navData[section.toLowerCase()]) ? navData[section.toLowerCase()].id : navData[0].id;
				launchSection(section);
			};
			function launchSection(id, navObj, skipAddressUpdate){
				var prevSection = currentSection;
				navObj = navObj || navData[id];
				clearCurrentSection();
				currentSection = id;
				hilightNavCurrentSection();
				
				if(navObj.application != ''){
					if(typeof WORKSHOP.site.sections[id] === 'undefined'){
						// External App has not yet been loaded
						var script = buildElement('script', {type:'text/javascript', src:navObj.application}, head);
							script.onload = me.onAppLoaded.bind(me);
					}else{
						// External App is already loaded
						launchApplication(navObj);
					}
				}else{
					//Section will contain content solely from the XML. No associated JS application
					writeSectionContent();
				}
				//For use with the pageState event:
				if(!skipAddressUpdate) changePageAddress();
				UTILS.track( currentSection );
				UTILS.pageScrollTo(0,0);
				
				if(prevSection != currentSection) loadSectionGraphicAnimation();
			};
			me.launchSection = launchSection;
			
			function changePageAddress(section,url){
				section = section || currentSection;
				section = section.toLowerCase();
				url = url || currentSection;
				try{
			//		history.pushState({id:section}, document.title, section);
				}catch(error){
			//		window.location.hash = "#/" + section;
				}
			};
			function clearCurrentSection(){	
				if(currentSectionApp){
					currentSectionApp.destroy();
					currentSectionApp = null;
				}
				if(currentSection){
					clearSectionContents();
					var section = document.getElementById(currentSection);
						section.getElementsByTagName('a')[0].setAttribute('class', '');	
				}
			};
			me.onAppLoaded = function(e){
				e.target.onload = null;
				launchApplication();
			};
			function launchApplication(navObj){
				navObj = navObj || navData[currentSection];
				var id = navObj.id;
				
				currentSectionApp = WORKSHOP.site.sections[id];
				currentSectionApp.run(siteData.getElementsByTagName(id)[0], feedType);
			};
			function writeSectionContent(navObj){
				navObj = navObj || navData[currentSection];
				var index = 1,
					data = navData[currentSection].content,
					title = data.getElementsByTagName('title')[0].firstChild.data,
					color = data.getElementsByTagName('title')[0].attributes.getNamedItem('color').value,
					textBody =  data.getElementsByTagName('body')[0].childNodes[index].data,
					article = buildElement('article', {id:navObj.id}, section),//class:'hilighted',
					hgroup = buildElement('div', {class:'hgroup'}, article),
					titleContainer = buildElement('h3', {class:'title',style:"color:"+color}, hgroup, title),
					sectionBody = buildElement('div', {class:'sectionBody'}, article);
					sectionBody.innerHTML = textBody;
					//sectionBody.insertAdjacentHTML("afterbegin", body);
			};
			function clearSectionContents(){
				UTILS.removeChildren( section );
				UTILS.stopAllLoading();
				currentSectionApp = null;
			};
			function removeSuperfluousBodyTag(){
				//Some browsers will add another <body> tag on page load. This removes the redundant/empty one
				var html = doc.getElementsByTagName('html')[0],
					bodies = doc.getElementsByTagName('body');
				if(bodies.length > 1){
					html.removeChild( bodies[1] );
				};
			};
			function onPageReady(){	
				removeSuperfluousBodyTag();
				UTILS = WORKSHOP.utils.CORE;
				UTILS.gaTrackingID = trackingID;			
				loadContents();
				hilightNavCurrentSection();
				graphicTrench = document.getElementById('graphicTrench');				
			};
			function buildElement(elementName, attrs, parent, txt){
				var ele = doc.createElement(elementName);
				if(attrs){
					for(var prop in attrs){
						ele.setAttribute(prop, attrs[prop]);
					}
				}
				if(parent) parent.appendChild( ele );
				if(txt) ele.appendChild(doc.createTextNode(txt));
				return ele;
			};
			function hilightNavCurrentSection(){
				if(currentSection){
				var section = document.getElementById(currentSection);
					section.getElementsByTagName('a')[0].setAttribute('class', 'selected');
				}
			};
			function onScroll(){
				var yy = win.pageYOffset - 0;
				graphicTrench.style.top  = yy + 'px';
				managePageScroll(yy);
			};
			function onTouchStart(){
				nav.style.display = 'none';
			};
			function onTouchMove(){
				if(nav.style.display != 'none') nav.style.display = 'none';
				onScroll();
			};
			function onTouchEnd(){
				nav.style.display = 'inline-block';
			};
			function manageNav(){
				logo_small.style.display = 'none';
				logo_small.style.cursor	= 'pointer';
				logo_small.onclick = function(){ UTILS.pageScrollTo(0,0) };
			};
			function managePageScroll(_yy){		
				var yy = _yy || win.pageYOffset - 0;			
				if(currentSectionApp) currentSectionApp.onPageScroll(yy);
				
				if(yy > 30){
					nav.style.top = (yy - 80) + 'px';
					if(showNavTimer){
						clearTimeout(showNavTimer);
					}
					showNavTimer = setTimeout(showNav, 1000);
					logo_small.style.display = 'inline-block';
					if(nav_bottom.style.display != 'block') nav_bottom.style.display = 'block';
				}else{
					nav.style.top = 0 + 'px';
					clearTimeout(showNavTimer);
					clearInterval(showNavAnimationTimer);
					if(logo_small.style.display != 'none') logo_small.style.display = 'none';
					if(nav_bottom.style.display != 'none') nav_bottom.style.display = 'none';
				}
			};
			function showNav(){
				if(showNavAnimationTimer) clearInterval(showNavAnimationTimer);
				showNavAnimationTimer = setInterval(showNavAnimation, 1000/60);
			};
			function showNavAnimation(){
				var yy = parseInt(nav.style.top);
				var dy = (win.pageYOffset - yy) * .27;
				if(Math.sqrt(dy*dy) < 1){
					nav.style.top = win.pageYOffset + 'px';
					clearInterval(showNavAnimationTimer);
				}else{
					nav.style.top = (yy + dy) + 'px';
				}
			};		
			function loadSectionGraphicAnimation(){
				var animationPath = (currentSection && navData[currentSection].animationPath) ? navData[currentSection].animationPath : 'vis/universe.js';
				var script = buildElement('script', {type:'text/javascript', src:animationPath}, head);
					script.onload = initializeGraphicAnimation;
			};
			function initializeGraphicAnimation(){
				if(graphicVis) graphicVis.destroy();
				graphicVis = WORKSHOP.site.vis.NEWEST_LOADED_VISUALIZATION;
				graphicVis.init(graphic);
				onScroll();
			};
			
			function NavObject(){
				this.name = '';
				this.label = '';
				this.application = '';
				this.animationPath = '';
				this.content;//Raw source for this data object
			};
			
			init();
			
			return me;
})(document,window);