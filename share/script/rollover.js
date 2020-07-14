//default functions

//rollOverImages
function rollOver() {
	var aPreLoad = new Array();
	var sTempSrc;
	var aImages = document.getElementsByTagName('img');
	for (var i = 0; i < aImages.length; i++) {
		if (aImages[i].className == 'rollover') {
			var src = aImages[i].getAttribute('src');
			var ftype = src.substring(src.lastIndexOf('.'), src.length);
			var hsrc = src.replace(ftype, '_o'+ftype);
			
			aImages[i].setAttribute('hsrc', hsrc);
			
			aPreLoad[i] = new Image();
			aPreLoad[i].src = hsrc;
			
			aImages[i].onmouseover = function() {
			sTempSrc = this.getAttribute('src');
			this.setAttribute('src', this.getAttribute('hsrc'));
		}
		
		aImages[i].onmouseout = function() {
			if (!sTempSrc) sTempSrc = this.getAttribute('src').replace('_o'+ftype, ftype);
				this.setAttribute('src', sTempSrc);
			}
		}
	}
	var aInput = document.getElementsByTagName('input');
	for (var i = 0; i < aInput.length; i++) {
		if (aInput[i].className == 'rollover') {
			var src = aInput[i].getAttribute('src');
			var ftype = src.substring(src.lastIndexOf('.'), src.length);
			var hsrc = src.replace(ftype, '_o'+ftype);
			
			aInput[i].setAttribute('hsrc', hsrc);
			
			aPreLoad[i] = new Image();
			aPreLoad[i].src = hsrc;
			
			aInput[i].onmouseover = function() {
			sTempSrc = this.getAttribute('src');
			this.setAttribute('src', this.getAttribute('hsrc'));
		}
		
		aInput[i].onmouseout = function() {
			if (!sTempSrc) sTempSrc = this.getAttribute('src').replace('_o'+ftype, ftype);
				this.setAttribute('src', sTempSrc);
			}
		}
	}
}


//function default javascripts
onload = function() {
	if (!document.getElementById) return
	rollOver();
}