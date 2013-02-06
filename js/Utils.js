var WORKSHOP = WORKSHOP || {utils:{ }};
	WORKSHOP.utils = WORKSHOP.utils || {};//In case namespace created by another object hasn't instantiated a utils path

WORKSHOP.utils.CORE = (function(obj, _doc, _win){
	'use strict';
	// JSLint Directive: jslint nomen: true, white: true, browser: true ActiveXObject:false plusplus:true
	
	var me = obj;
	function EventDispatcher(){
		this._listeners = {};				
	}
	EventDispatcher.prototype = {
		constructor: EventDispatcher,
		addListener: function(type, listener){
			if (!(this._listeners[type])){
				this._listeners[type] = [];
			}
			this._listeners[type].push(listener);
		},
		dispatchEvent: function(event){
			if (typeof event === "string"){
				event = { type: event };
			}
			if (!event.target){
				try{event.target = this}catch(e){}
			}
			if (!event.type){
				throw new Error("Event object missing 'type' property.");
			}
			if (this._listeners[event.type] instanceof Array){
				var listeners = this._listeners[event.type], i, t;
				t = listeners.length;
				for (i=0; i<t; i++){
					listeners[i].call(this, event);
				}
			}
		},
		removeListener: function(type, listener){
			if (this._listeners[type] instanceof Array){
				var listeners = this._listeners[type], i, t;
				t = listeners.length;
				for (i=0; i<t; i++){
					if (listeners[i] === listener){
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}
	};
	function CustomEvent(_type, _params, _bubbles, _cancelable){
		this.type = _type;
		this.params = _params || {};
		this.bubbles = _bubbles || false;
		this.cancelable = _cancelable || false;
		
	/*	var evt = (_doc.createEvent) ? _doc.createEvent('Event') : new Event(this.type);
			evt.initEvent(this.type, true, false);
			evt.target = arguments.caller;			
		return evt;
	*/
	}
	CustomEvent.prototype = {
		COMPLETE : "onComplete"
	};
	//CustomEvent.prototype = new Event('Event');
	function Loader(){
		EventDispatcher.call(this);
		this.data;
	}
	Loader.prototype = new EventDispatcher();
	Loader.prototype.load = function(_path, _data, _header){
		var outgoingData = _data || '',
			header = _header ||  'application/x-www-form-urlencoded, multipart/form-data';
			this.request = this.getXmlHttpObject();
			this.request.open('POST', _path, true);
		if(!_win.XDomainRequest) {
			this.request.setRequestHeader("Content-type", header);
		}
		if( this.request ) {
			this.request.onreadystatechange = this.onLoaded.bind(this);
			this.request.send(outgoingData);
		}
	};
	Loader.prototype.onLoaded = function(e){
		if(this.request.readyState === 4){
			this.data = this.request.responseText;
			this.dispatchEvent( new CustomEvent(this.COMPLETE) );
		}
	};
	Loader.prototype.COMPLETE = 'onComplete';
	Loader.prototype.getXmlHttpObject = function() {
		var xhr = 0, PID, x, t;
		try {
			try { // Handles all major browser, except IE
				if ( "XMLHttpRequest" in _win ) { // IE8 won't allow hasOwnProperty()
					xhr = new XMLHttpRequest();
				} else { 
					PID = [
						"MSXML2.XMLHTTP.6.0",
						"MSXML2.XMLHTTP.5.0",
						"MSXML2.XMLHTTP.4.0",
						"MSXML2.XMLHTTP.3.0",
						"MSXML2.XMLHTTP.2.0",
						"Microsoft.XMLHTTP" ];
					t = PID.length;
					for ( x = 0; x < t; ++x ) { // Instance that will invoke IE browser to respond on the client request
						if (( xhr = new ActiveXObject( PID[ x ] ))) {
							break;
						}
					}
				}
			} catch( e1 ) { // for some other browsers that do not understand the two types of calls above
				xhr = _win.createRequest();
			}
		} catch( e ) { // invocation failed
			xhr = 0;
		} return xhr;
	};
// PUBLIC methods:
	me.parseXML = function(_xmlStr){
		var returnXML = false, xmlDoc;
		if (typeof _win.DOMParser !== "undefined") {
			returnXML = ( new _win.DOMParser() ).parseFromString(_xmlStr, "text/xml");
		} else if (typeof _win.ActiveXObject !== "undefined" &&
			   new _win.ActiveXObject("Microsoft.XMLDOM")) {				  
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(_xmlStr);
			returnXML = xmlDoc;
		} else {
			throw new Error("No XML parser found");
		}
		return returnXML;
	};
	me.buildHTMLElement = function(elementName, attrs, parent, txt){
		var ele = _doc.createElement(elementName);
		if(attrs){
			for(var prop in attrs){
				ele.setAttribute(prop, attrs[prop]);
			}
		}
		if(parent) parent.appendChild( ele );
		if(txt) ele.appendChild(_doc.createTextNode(txt));
		return ele;
	};
	me.setOpacity = function(obj, value){
		obj.style.opacity	= value;// Safari 1.2, newer Firefox and Mozilla, CSS3
		obj.style.filter	= "alpha(opacity:"+value*100+")";// IE/Win	
	};
	me.removeChildren = function(node){		
		if (node){
			while (node.hasChildNodes()) {
				this.removeChildren(node.firstChild);
				node.removeChild(node.firstChild);
			}
		}
	};
	me.isValidEmail = function(sEmail) {

	  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
	  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
	  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
	  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
	  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
	  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
	  var sDomain_ref = sAtom;
	  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
	  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
	  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
	  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
	  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
	  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string
	  
	  var reValidEmail = new RegExp(sValidEmail);	  
	  if (reValidEmail.test(sEmail)) {
		return true;
	  }
	  
	  return false;
	};
	me.isRFC822ValidEmail = me.isValidEmail;
	me.stopAllLoading = function(){
		if(_win.stop !== undefined){
			_win.stop();
		}else if(_doc.execCommand !== undefined){
			_doc.execCommand("Stop", false);
		}
	};
	me.debug = function(){
		var str = '', t = arguments.length, i=0;
		for(i; i<t; i++){
			str += '\n' + arguments[i];
		}
		try{
			console.log(str);
		}catch(e){}
	};
	var pageScrollID;
	var pageScrollLocation = {x:0,y:0};
	me.pageScrollTo = function(_x,_y){
		pageScrollLocation = {x:_x,y:_y};
		if(pageScrollID){
			clearInterval(pageScrollID);
		}
		pageScrollID = setInterval(animateScrolling, 1000/30);
	};
	function animateScrolling(){
		var y = _win.pageYOffset || _doc.body.scrollTop;
		var dy = (pageScrollLocation.y - y) * .234;
		
		if(Math.sqrt(dy*dy) < 1){
			_win.scrollTo(pageScrollLocation.x, pageScrollLocation.y);
			clearInterval(pageScrollID);
		}else{
			_win.scrollTo(0, y+dy);
		}
	};
	me.getLoader = function(){ return new Loader(); };	
	me.getCustomEvent = function(_type){ return new CustomEvent(_type); };
	me.isTouchEnabled = function() { return !!('ontouchstart' in _win) ? 1 : 0; };
	me.gaTrackingID;
	me.track = function(section){
		if(typeof me.gaTrackingID !== 'undefined' && me.gaTrackingID !== ''){
			try{
			var pageTracker = _gat._getTracker(me.gaTrackingID);
				pageTracker._trackPageview(section);
			} catch(err) {}
		}
	};
	me.onSubmit = function(data){
		
	};
	Function.prototype.bind = function(obj) {
		var method = this,
		temp = function() {
			return method.apply(obj, arguments);
		};
		return temp;
	};
	(function() {//requestAnimationFrame polyfill
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !_win.requestAnimationFrame; ++x) {
			_win.requestAnimationFrame = _win[vendors[x]+'RequestAnimationFrame'];
			_win.cancelAnimationFrame = 
			  _win[vendors[x]+'CancelAnimationFrame'] || _win[vendors[x]+'CancelRequestAnimationFrame'];
		}
	 
		if (!_win.requestAnimationFrame)
			_win.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = _win.setTimeout(function() { callback(currTime + timeToCall); }, 
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
	 
		if (!_win.cancelAnimationFrame)
			_win.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}());
	return me;
}(WORKSHOP.utils.CORE || {}, document, window));////(WORKSHOP.utils.CORE || {}));