WORKSHOP.site.sections.CONTACT = (function (UTILS, _doc, _win){
	var me = {},
		name_txt,
		email_btn,
		contactForm,
		formSubject,
		formBody,
		formFrom,
		formButton,
		formResult,
		loader,
		defaultEmailAddress_str,
		formCollectionLocation_str,
		formSubmissionInvalid_str,
		formSubmissionSending_str,
		formSubmissionSent_str;
		
	function init(){
		
	};
	function parse(content, feedType){
		if(feedType === 'xml'){
		var title 				= content.getElementsByTagName('title')[0].firstChild.data,
			config 				= content.getElementsByTagName('config')[0],
			sectionBody_str 	= config.getElementsByTagName('body')[0].firstChild.data,
			messageBody_str 	= config.getElementsByTagName('defaultMessageBodyValue')[0].firstChild.data,
			formHeader_str 	= config.getElementsByTagName('formHeader')[0].firstChild.data,
			contactName_str	 	= config.getElementsByTagName('contactName')[0].firstChild.data,
			contactEmail_str 	= config.getElementsByTagName('contactEmail')[0].firstChild.data,
			subject_str 		= config.getElementsByTagName('defaultEmailSubjectValue')[0].firstChild.data;
			//Saved locally for validation:
			defaultEmailAddress_str		= config.getElementsByTagName('defaultEmailValue')[0].firstChild.data;
			formCollectionLocation_str 	= config.getElementsByTagName('formCollectionLocation')[0].firstChild.data;
			formSubmissionInvalid_str 	= config.getElementsByTagName('formSubmissionInvalid')[0].firstChild.data;
			formSubmissionSending_str 	= config.getElementsByTagName('formSubmissionSending')[0].firstChild.data;
			formSubmissionSent_str 		= config.getElementsByTagName('formSubmissionSent')[0].firstChild.data;
		}
		var section = document.getElementsByTagName('section')[0],
			buildHTMLElement = UTILS.buildHTMLElement,
			article = buildHTMLElement('article', {id:'Contact'}, section),
			hgroup = buildHTMLElement('div', {class:'hgroup'}, article),
			titleContainer = buildHTMLElement('h3', {class:'title',style:"color:#0099FF"}, hgroup, title),
			sectionBody = buildHTMLElement('div', {class:'sectionBody'}, article),
			p, br, p2;
		p = buildHTMLElement('p', null, sectionBody, sectionBody_str);
		p = buildHTMLElement('p', null, sectionBody);
		
		name_txt = buildHTMLElement('span', {style:'background-color:#FFFFFF;color:#333333;'}, p, contactName_str);
		br = buildHTMLElement('br', null, p);
		email_btn = buildHTMLElement('a', {href:'mailto:'+contactEmail_str}, p, contactEmail_str);
		
		article = buildHTMLElement('article', {id:'Contact Form'}, section);
		p = buildHTMLElement('p', null, article);
		
		buildHTMLElement('text', null, p, formHeader_str);
		contactForm = buildHTMLElement('form', null, article);
		p = buildHTMLElement('p', null, contactForm);
		formSubject = buildHTMLElement('input', {type:'text',name:'subject',class:'basic_text_input',value:subject_str,tabindex:1,maxlength:'50'}, p);
		br = buildHTMLElement('br', null, p);
		formBody = buildHTMLElement('textarea', {type:'text',name:'body',class:'basic_text_input',value:messageBody_str,tabindex:2,maxlength:'1000',cols:50,rows:5}, p, messageBody_str);
		br = buildHTMLElement('br', null, p);
		formFrom = buildHTMLElement('input', {type:'text',name:'email',class:'basic_text_input',value:defaultEmailAddress_str,tabindex:3,maxlength:'50'}, p);
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
		if(txt === obj.description){
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
		var msg = formSubmissionSending_str,
			address = formFrom.value;
		if(UTILS.isValidEmail(address) && address !== defaultEmailAddress_str){
			var data = 'subject=' + formSubject.value;
				data += '&body=' + formBody.value;
				data += '&from=' + address;
				
				formButton.style.display = 'none';
				
				loader = UTILS.getLoader();
				loader.load(formCollectionLocation_str, data, '');
				loader.addListener('onComplete', onSubmissionComplete);
		}else{
			msg = formSubmissionInvalid_str;
		}
		formResult.style.display = 'block';
		formResult.innerHTML = msg;
	};
	function onSubmissionComplete(evt){
		formSubject.value 	= formBody.value = formFrom.value = '';
		formButton.style.display = 'none';
		formResult.innerHTML = formSubmissionSending_str;
		
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
	
})(WORKSHOP.utils.CORE, document, window);