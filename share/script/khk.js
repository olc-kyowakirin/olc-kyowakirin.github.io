// JavaScript Document
$(function(){
     $('li.print a').click(function(){
          window.print();
          return false;
     });
});


$(document).ready(function() {
	$('.clearField').clearField();
});


// UA判定

init();

function init() {

	var ua = navigator.userAgent;
	var htmlClass = '';
	var matchArray = new Array();

	var mac     = new RegExp('Macintosh', "i");
	var win     = new RegExp('Windows', "i");
	var android = new RegExp('Android ([0-9]+)\.', "i");
	var msie    = new RegExp('MSIE ([0-9]+)\.', "i");
	var chrome   = new RegExp('Chrome\/([0-9]+)\.', "i");
	var firefox = new RegExp('Firefox\/([0-9]+).([0-9]+)', "i");
	var ios     = new RegExp('(iPhone|iPod|iPad).+ OS ([0-9]+)_.+ Safari', "i");
	var safari  = new RegExp('Version\/([0-9]+)\..+ Safari\/', "i");

	if (matchArray = ua.match(msie)) { //MSIE
		htmlClass = 'msie';
		htmlClass += ' msie' + matchArray[1];
	} else if (matchArray = ua.match(chrome)) { //chrome
		htmlClass = 'chrome';
		htmlClass += ' chrome' + matchArray[1];
	} else if (matchArray = ua.match(firefox)) { //Firefox
		htmlClass = 'firefox';
		htmlClass += ' firefox' + matchArray[1];
		if (matchArray[1] == 3) {
			htmlClass += matchArray[2];
		}
	} else if (matchArray = ua.match(android)) { //Android
		htmlClass = 'webkit';
		htmlClass += ' android' + matchArray[1];
	} else if (matchArray = ua.match(ios)) { //iOS
		htmlClass = 'safari';
		htmlClass += ' ios' + matchArray[2];
//		htmlClass += ' ' + matchArray[1].toLowerCase();
	} else if (matchArray = ua.match(safari)) { //Safari
		htmlClass = 'safari';
		htmlClass += ' safari' + matchArray[1];
	}

	if (htmlClass) {
		if (ua.match(mac)) {
			htmlClass += ' mac';
		} else if (ua.match(win)) {
			htmlClass += ' win';
		} else if (ua.match(android)) {
			htmlClass += ' android';
		} else {
			htmlClass += ' ios';
		}

		var element = document.getElementsByTagName('html');
		element[0].className = htmlClass;
	}
}


//styleswitcher

//Style Sheet Switcher version 1.1 Oct 10th, 2006
//Author: Dynamic Drive: http://www.dynamicdrive.com
//Usage terms: http://www.dynamicdrive.com/notice.htm

//Unofficial Update to fix Safari 5.1 glitch re: alternate stylesheets or the disabled property in regards to them
// See: http://www.dynamicdrive.com/forums/showthread.php?p=259199 for more info

var manual_or_random="manual" //"manual" or "random"
var randomsetting="3 days" //"eachtime", "sessiononly", or "x days (replace x with desired integer)". Only applicable if mode is random.

//////No need to edit beyond here//////////////

function getCookie(Name) { 
var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
if (document.cookie.match(re)) //if cookie found
return document.cookie.match(re)[0].split("=")[1] //return its value
return null
}

function setCookie(name, value, days) {
var expireDate = new Date()
//set "expstring" to either future or past date, to set or delete cookie, respectively
var expstring=(typeof days!="undefined")? expireDate.setDate(expireDate.getDate()+parseInt(days)) : expireDate.setDate(expireDate.getDate()-5)
document.cookie = name+"="+value+"; expires="+expireDate.toGMTString()+"; path=/";
}

function deleteCookie(name){
setCookie(name, "moot")
}


function setStylesheet(title, randomize){ //Main stylesheet switcher function. Second parameter if defined causes a random alternate stylesheet (including none) to be enabled
var i, cacheobj, altsheets=[""];
if(setStylesheet.chosen)
try{
document.getElementsByTagName('head')[0].removeChild(setStylesheet.chosen);
}catch(e){}
for(i=0; (cacheobj=document.getElementsByTagName("link")[i]); i++) {
if(cacheobj.getAttribute("rel").toLowerCase()=="alternate stylesheet" && cacheobj.getAttribute("title")) { //if this is an alternate stylesheet with title
cacheobj.disabled = true
altsheets.push(cacheobj) //store reference to alt stylesheets inside array
if(cacheobj.getAttribute("title") == title){ //enable alternate stylesheet with title that matches parameter
cacheobj.disabled = false //enable chosen style sheet
setStylesheet.chosen = document.createElement('link');//cloneNode(false);
setStylesheet.chosen.rel = 'stylesheet';
setStylesheet.chosen.type = 'text/css';
if(cacheobj.media)
setStylesheet.chosen.media = cacheobj.media;
setStylesheet.chosen.href = cacheobj.href;
document.getElementsByTagName('head')[0].appendChild(setStylesheet.chosen);
}
}
}
if (typeof randomize!="undefined"){ //if second paramter is defined, randomly enable an alt style sheet (includes non)
var randomnumber=Math.floor(Math.random()*altsheets.length)
altsheets[randomnumber].disabled=false
}
return (typeof randomize!="undefined" && altsheets[randomnumber]!="")? altsheets[randomnumber].getAttribute("title") : "" //if in "random" mode, return "title" of randomly enabled alt stylesheet
}



function chooseStyle(styletitle, days){ //Interface function to switch style sheets plus save "title" attr of selected stylesheet to cookie
if (document.getElementById){
setStylesheet(styletitle)
setCookie("mysheet", styletitle, days)
}
}

function indicateSelected(element){ //Optional function that shows which style sheet is currently selected within group of radio buttons or select menu
if (selectedtitle!=null && (element.type==undefined || element.type=="select-one")){ //if element is a radio button or select menu
var element=(element.type=="select-one") ? element.options : element
for (var i=0; i<element.length; i++){
if (element[i].value==selectedtitle){ //if match found between form element value and cookie value
if (element[i].tagName=="OPTION") //if this is a select menu
element[i].selected=true
else{ //else if it's a radio button
element[i].checked=true
}
break
}
}
}
}

if (manual_or_random=="manual"){ //IF MANUAL MODE
var selectedtitle=getCookie("mysheet")
if (document.getElementById && selectedtitle!=null) //load user chosen style sheet from cookie if there is one stored
setStylesheet(selectedtitle)
}
else if (manual_or_random=="random"){ //IF AUTO RANDOM MODE
if (randomsetting=="eachtime")
setStylesheet("", "random")
else if (randomsetting=="sessiononly"){ //if "sessiononly" setting
if (getCookie("mysheet_s")==null) //if "mysheet_s" session cookie is empty
document.cookie="mysheet_s="+setStylesheet("", "random")+"; path=/" //activate random alt stylesheet while remembering its "title" value
else
setStylesheet(getCookie("mysheet_s")) //just activate random alt stylesheet stored in cookie
}
else if (randomsetting.search(/^[1-9]+ days/i)!=-1){ //if "x days" setting
if (getCookie("mysheet_r")==null || parseInt(getCookie("mysheet_r_days"))!=parseInt(randomsetting)){ //if "mysheet_r" cookie is empty or admin has changed number of days to persist in "x days" variable
setCookie("mysheet_r", setStylesheet("", "random"), parseInt(randomsetting)) //activate random alt stylesheet while remembering its "title" value
setCookie("mysheet_r_days", randomsetting, parseInt(randomsetting)) //Also remember the number of days to persist per the "x days" variable
}
else
setStylesheet(getCookie("mysheet_r")) //just activate random alt stylesheet stored in cookie
} 
}


//toppage carousel to display
$(function(){
     $('#carousel #index1').css('float','left');	
     $('#carousel #index2').css('display','block');
     $('#carousel #index3').css('display','block');
     $('#index #latestNews').css('display','block');					
});

//Automatic display current for local navigation. 2012/10/15 addition
var lnOut = [];
if(decodeURI(location.href).indexOf('/about_us/')!=-1 || decodeURI(location.href).indexOf('/products/')!=-1 || decodeURI(location.href).indexOf('/research_and_development/')!=-1 || decodeURI(location.href).indexOf('/investors/')!=-1 || decodeURI(location.href).indexOf('/news_releases/')!=-1 || decodeURI(location.href).indexOf('/sustainability/')!=-1) {
	document.write('<style>div#localNavi{visibility:hidden}</style>');
	document.write('<style>div#localNavi ul li ul{display:none}</style>');
}
lnOut.naviControler = function() {

	var locat = decodeURI(location.href).replace(/https:\/\//,"");
	var loc = locat.split('/');
	var curloc = '';
	var matchFlg = false;

	loc.shift();

	if(loc.length>=3) {
		curloc = '/' + loc[loc.length-3] + '/' + loc[loc.length-2] + '/';
		verification(curloc);
		if(matchFlg == false){
			curloc = '/' + loc[loc.length-3] + '/';
			verification(curloc);
		}
	} else if(loc.length>=2) {
		curloc = '/' + loc[loc.length-2] + '/';
		verification(curloc);
	} else {
		curloc = '/' + loc[loc.length-1] + '/';
		verification(curloc);
	}
	
	function verification (txt) {
		if($('div#localNavi h2').find('a').attr('href').match(new RegExp(txt, "i"))) {
			$('div#localNavi h2').addClass("current");
			$('div#localNavi').css('visibility','visible');
			matchFlg = true;
		} else {
			$('div#localNavi ul li').each(function() {
				if($(this).find('a')){
					if($(this).find('a').attr('href').match(new RegExp(txt, "i"))) {
						$(this).addClass("current");
						if($(this).find('ul')) $(this).find('ul').css('display','block');
						if($(this).parent().parent().get(0).tagName == "LI") $(this).parent().css('display','block');
						$('div#localNavi').css('visibility','visible');
						matchFlg = true;
						return false;
					}
				}
			});
		
		}
	}
}
