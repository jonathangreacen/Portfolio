WORKSHOP.site.sections.CONTACT = (function (UTILS, _doc, _win){
	var me = {},
		title = 'Contact me',
		contactName = 'My Name',
		contactEmailAddress = 'hello@mysite.com',
		formCollectionLocation = 'send.php',
		defaultEmailAddress = 'Your email',
		name_txt,
		email_btn,
		contactForm,
		formSubject,
		formBody,
		formFrom,
		formButton,
		formResult,
		loader;
	
	function init(){
		
	};
	function parse(content, feedType){
		var section = document.getElementsByTagName('section')[0],
			buildHTMLElement = UTILS.buildHTMLElement,
			article = buildHTMLElement('article', {id:'Contact'}, section),
			hgroup = buildHTMLElement('div', {class:'hgroup'}, article),
			titleContainer = buildHTMLElement('h3', {class:'title',style:"color:#999999"}, hgroup, title),
			p, br, p2;
		p = buildHTMLElement('p', null, article);
		name_txt = buildHTMLElement('span', {style:'background-color:#FFFFFF;color:#333333;'}, p, contactName);
		br = buildHTMLElement('br', null, p);
		email_btn = buildHTMLElement('a', {href:'mailto:'+contactEmailAddress}, p, contactEmailAddress);
		
		article = buildHTMLElement('article', {id:'Contact Form'}, section);
		p = buildHTMLElement('p', null, article);
		
		buildHTMLElement('text', null, p, 'Or let me save you a step:');
		contactForm = buildHTMLElement('form', null, article);
		p = buildHTMLElement('p', null, contactForm);
		formSubject = buildHTMLElement('input', {type:'text',name:'subject',class:'basic_text_input',value:'Hello!',tabindex:1,maxlength:'50'}, p);
		br = buildHTMLElement('br', null, p);
		formBody = buildHTMLElement('textarea', {type:'text',name:'body',class:'basic_text_input',value:'I saw your site and...',tabindex:2,maxlength:'1000',cols:50,rows:5}, p, 'I saw your site and...');
		br = buildHTMLElement('br', null, p);
		formFrom = buildHTMLElement('input', {type:'text',name:'email',class:'basic_text_input',value:defaultEmailAddress,tabindex:3,maxlength:'50'}, p);
		br = buildHTMLElement('br', null, p);
		p2 = buildHTMLElement('p', {class:'link',style:'padding-left:5px;padding-top:10px;'}, p);
		formButton = buildHTMLElement('a', {tabindex:4}, p2, 'Send');
		formResult = buildHTMLElement('p', null, p);
		
		formButton.onclick 		= onContactSubmission;
		formSubject.onclick 	= formBody.onclick = formFrom.onclick = clearText;
		formSubject.description = formSubject.value;
		formBody.description 	= formBody.value;
		formFrom.description 	= formFrom.value;
	};
	function clearText(e){
		var obj = e.target,
			txt = obj.value;
		if(txt = obj.description){
			obj.value = '';					
			obj.onfocusout = obj.onblur = putTextBack;
		}
	};
	function putTextBack(e){
		var obj = e.target, 
			id 	= obj.id,
			txt = obj.value;
		if(txt == '' || txt == ' '){
			obj.value = obj.description;
		}
	};
	function onContactSubmission(){
		var msg = "Reaching out across the interwebs...";
		var address = formFrom.value;
		if(UTILS.isValidEmail(address) && address !== defaultEmailAddress){
			var data = 'subject=' + formSubject.value;
				data += '&body=' + formBody.value;
				data += '&from=' + address;
				
				formButton.style.display = 'none';
				
				loader = UTILS.getLoader();
				loader.load(formCollectionLocation, data, '');
				loader.addListener('onComplete', onSubmissionComplete);
		}else{
			msg = 'Please enter a valid email address';
		}
		formResult.style.display = 'block';
		formResult.innerHTML = msg;
	};
	function onSubmissionComplete(evt){
		formSubject.value 	= formBody.value = formFrom.value = '';
		formButton.style.display = 'none';				
		formResult.innerHTML = "Sent! Thanks for checking in.";
		
		setTimeout(enableForm, 3500);
	};
	function enableForm(){
		formSubject.value = formSubject.description;
		formBody.value = formBody.description;
		formFrom.value = formFrom.description;
		
		formResult.style.display = 'none';
		formButton.style.display = 'inline';
	};

	
	me.run = function(content, feedType){
		parse(content, feedType);
	};
	me.onPageScroll = function(){
		
	};
	me.destroy = function(){
		formSubject.onfocusout = formBody.onfocusout = formFrom.onfocusout = formSubject.onblur = formBody.onblur = formFrom.onblur = formSubject.onclick = formBody.onclick = formFrom.onclick = null;
	};
	init();
	return me;
	
}(WORKSHOP.utils.CORE, document, window));