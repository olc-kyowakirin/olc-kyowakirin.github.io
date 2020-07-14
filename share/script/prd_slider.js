
// Product introduction slide
$.fn.slideComponent = function(){

var rtTime = 5000;
var htTime = 3500;
var lm ="/tw/share/images/loading.gif";
var ldImg = new Image();
ldImg.src = lm;
var thumbImg = [];
var ldCnt=0;
var cWidth=0;
var cHeight=0;
var agent = navigator.userAgent;
var oldIE = 0;
var indicator;

var pos =0;
var wd = 0;
var sw = 0;
var mx = 0;
var wx = 0;
var pgMax = 0;
var rInt;
var pInt;
var savHtml;
var htmlArr = [];
var instDr = "";
var tOut =[];
var tInt;
var addDur = 24;

$(function(){
	wd = $('.slideLayout').width();
	sw = $('.col_2').eq(0).width()+30;
	mx = $('.col_2').size();
	wx = Math.ceil(wd/sw);

	//mobiles flg
	if(agent.search(/MSIE 6.0/) != -1){
		oldIE = 6;
	} else if(agent.search(/MSIE 7.0/) != -1){
		oldIE = 7;
	} else if(agent.search(/MSIE 8.0/) != -1){
		oldIE = 8;
	}

	if($('.indicator').html() != null) {
		indicator = '.indicator';
	} else if($('.indicatorFull').html() != null) {
		indicator = '.indicatorFull';
	} else {
		indicator = '.indicatorFullPage';
	}

	$('.col_2').each(function(i){		//çÇÇ≥ÇåvéZ
		cWidth = $(this).width(); 
		if(cHeight < $(this).height()) cHeight = $(this).height();
		thumbImg[i] = $(this).find('img').attr('src');		//preLoad chekker
	});

	$(ldImg).imagesLoaded(function(){		//preLoad chekker
		$('.slideLayout').append('<img src="' + lm + '" width="32px" height="32px" class="loadingGif" alt="Loading...">');
		$('.loadingGif').css('left',Math.ceil($('.slideLayout').width()/2)-16 + 'px');
		$('.loadingGif').css('top',Math.ceil($('.slideLayout').height()/2)-48 + 'px');
		if(oldIE==false) $('.loadingGif').css('opacity','0').animate({opacity:0.75},{duration:200,easing:'swing'});

		jQuery.each(thumbImg, function(i) {
			$(this).imagesLoaded(function(){
				ldCnt++;
				if(ldCnt>= thumbImg.length) thumbRun();		//thumb LoadçœÇ›Ç≈ï\é¶é¿çs
			});
		});
	});

	$('.col_2').each(function(i){		//çÇÇ≥ÇåvéZ
		$(this).css('height',cHeight + 'px');
		$(this).removeClass('lastCol');

		if($(indicator + ' ul').html() != null) {
			htmlArr[i] = $(this).html();
			$(this).remove();
		}
	});

	$('.slider').css('height',cHeight + 'px');

	if($(indicator + ' ul').html() != null) {	//indicator eq page move
		pgMax = Math.ceil(mx/wx);
		rtTime = 6000+1000*wx;
		htTime = 4500;

		$(indicator + ' ul li').remove();
		for(var i=1; i<=pgMax; i++) {
			$(indicator + ' ul').append('<li><a href="javascript:void(0);" id="indicator_' + i + '">' + i.toString() + '</a></li>');
			$("#indicator_" + i).bind('mouseover',function(){
				var posx = parseInt($(this).attr('id').replace('indicator_',''));
				if(posx != pos) $(this).parent().addClass('current');
				autoPause();
			});
			$("#indicator_" + i).bind('mouseout',function(){
					clearTimeout(pInt);
				var posx = parseInt($(this).attr('id').replace('indicator_',''));
				if(posx != pos) $(this).parent().removeClass('current');
				autoPlay();
			});
			$("#indicator_" + i).bind('click',function(){
				var posx = parseInt($(this).attr('id').replace('indicator_',''));
				if(posx != pos) {
					clearTimeout(pInt);
					clearInterval(rInt);
					pos = posx
					slideRunPg();
				}

			});
		}
		
	} 

	if(oldIE ==7) {
		$('.slideLayout').css('height',cHeight +$(indicator).height()+48 + 'px');
		if(wx<6) {
			$(indicator).css('position','absolute');
			$(indicator).css('marginTop','0px');
			$(indicator).css('marginLeft','0px');
			$(indicator).css('top',cHeight+28 + 'px');
			$(indicator).css('left',$('.slideLayout').width()/2-$(indicator).width()/2 + 'px');
		} else {
			$(indicator).css('marginTop','0px');
		}
	} else if(wx<6) {
		$('.slideLayout').css('height',cHeight +$(indicator).height()+48 + 'px');
		$(indicator).css('position','absolute');
		$(indicator).css('marginTop',cHeight+28 + 'px');
		$(indicator).css('marginLeft',$('.slideLayout').width()/2-$(indicator).width()/2 + 'px');
	} else {
		$('.slideLayout').css('height',cHeight +$(indicator).height() + 'px');
	}

});

//jQuery.event.add(window, "load", function(){
function thumbRun() {

	if(oldIE !=0) $('.loadingGif').css('opacity','0'); 
	$('.loadingGif').animate({opacity:0},{duration:'normal',easing:'swing',complete:function(){
		$(".loadingGif").remove();
		//$('.slider').css('width',(sw*mx) + 'px').css('visibility','visible').css('opacity','0');
		$('.slider').css('width',(sw*mx) + 'px').css('visibility','visible');

		if(pgMax ==0) {
			
			if(oldIE ==0) {
			
			var tOutFix=0;
			$('.col_2').css('opacity','0');
			$('.col_2').each(function(i){
				$(this).stop().delay((i+1)*240/wx).animate({opacity:1},{duration:340+(i*80),easing:'swing',complete:function(){tOutFix++;}});
			});

			tInt = setInterval(function(){
				if(tOutFix>=$('.col_2').size()){
					clearInterval(tInt);
					if($('.col_2').size() >wx) {
						$(indicator).css('visibility','visible').css('opacity','0');
						$(indicator).animate({opacity:'1'},{duration:'fast',easing:'swing'});
						slideInit();
						autoSlide();
					} else {
						$('.col_2').eq($('.col_2').size()-1).addClass('lastCol');
						$(indicator).css('display','none');
					}

				}
			},10);
			
			} else {

			$('.slider').css('width',(sw*mx) + 'px').css('visibility','visible').css('opacity','0');
			$('.slider').animate({opacity:'1'},{duration:'normal',easing:'swing',complete:function(){
				if($('.col_2').size() >wx) {
					$(indicator).css('visibility','visible').css('opacity','0');
					$(indicator).animate({opacity:'1'},{duration:'fast',easing:'swing'});
					slideInit();
					autoSlide();
				} else {
					$('.col_2').eq($('.col_2').size()-1).addClass('lastCol');
					$(indicator).css('display','none');
				}

			}});
			
			}

		} else {
			$('.slider').css('opacity','1');
			pos =1;
			slideRunPg();
			
			if(pgMax > 1) {
				$(indicator).css('visibility','visible').css('opacity','0');
				$(indicator).animate({opacity:'1'},{duration:'normal',easing:'swing'});
				slideInit();
				autoSlide();
			} 
		}
	
	}});
}
//});


function slideInit() {

	$('.slide_left').bind('click',function(){slideClick('l')});
	$('.slide_right').bind('click',function(){slideClick('r')});

	$('.slide_left').bind('mouseover',function(){autoPause()});
	$('.slide_right').bind('mouseover',function(){autoPause()});
	$('.slide_left').bind('mouseout',function(){clearTimeout(pInt);autoPlay()});
	$('.slide_right').bind('mouseout',function(){clearTimeout(pInt);autoPlay()});

}

function slideClick(dr) {

	clearTimeout(pInt);
	clearInterval(rInt);

	if(pgMax ==0) {

		if(dr == 'l') {
			if(pos>1) {
				pos--;
			} else {
				pos = mx;
			}
		} else {
			if(pos<=(mx-wx)) {
				pos++;
			} else {
				pos =1;
				}
		}

		slideRun(pos,dr);
		
	} else {

		if(dr == 'l') {
			if(pos>1) {
				pos--;
			} else {
				pos = pgMax;
			}
		} else {
			if(pos<pgMax) {
				pos++;
			} else {
				pos =1;
			}
		}

		slideRunPg();
	}

}


function autoPause(){
	clearTimeout(pInt);
	clearInterval(rInt);
	pInt = setTimeout(function(){
		clearInterval(rInt);
	},250);
}

function autoPlay(){
	//if(rInt) clearInterval(rInt);
	pInt = setTimeout(function(){
		if(pgMax ==0) {
			slideRun(pos,'r');
		} else {
			if(pos<pgMax) {
				pos++;
			} else {
				pos =1;
			}
			slideRunPg();
		}
		autoSlide();
	},htTime);
}


function autoSlide(){
	clearInterval(rInt);
	rInt = setInterval(function(){
		if(pgMax ==0) {
			if(pos<=(mx-wx)) {
				pos++;
			} else {
				pos =1;
			}
			slideRun(pos,'r');
		} else {
			if(pos<pgMax) {
				pos++;
			} else {
				pos =1;
			}
			slideRunPg();
		
		}

	},rtTime);
		
}

function slideRun(pos,dr){
		
	var ap;
	var sp;

	if(dr=='l') {
		ap = 1
		sp =0;
	} else {
		ap = wx;
		sp = sw * -1;
	}

	if(instDr !="") slideRemove(instDr);

	if(dr=='l') {
		savHtml = $('.col_2').eq($('.col_2').size()-1).html();
		$('.col_2').eq(0).before('<div class="col_2">' + savHtml + '</div>');
		$('.col_2').eq(0).css('opacity','0');
		$('.slider').css('left', sw*-1 + 'px');
		ap =0;
	} else {
		savHtml = $('.col_2').eq(0).html();	
		$('.col_2').eq($('.col_2').size()-1).after('<div class="col_2">' + savHtml + '</div>');
		$('.col_2').eq(wx).css('opacity','0');
		$('.slider').css('left', '0px');
	}
		
	instDr = dr;
			
	$('.slider').stop().animate({left:sp + 'px'},{duration:420,easing:'swing',complete:function(){
		$('.col_2').eq(ap).css('opacity','0').css('marginTop','4px').stop().animate({opacity:1,marginTop:0},{duration:280,easing:'swing'});
		$('.col_2').find('a').each(function(){
			$(this).hover(
				function(){
					autoPause();
					$(this).find('img').css('opacity','0.75');
				},
				function(){
					clearTimeout(pInt);
					autoPlay();
					$(this).find('img').css('opacity','1');
				}
			);
					
		});				

		slideRemove(dr);

		$('.slider').css('left', '0px');
		$('.col_2').each(function(i){
			if(i<wx) {
				$(this).css('opacity','1').css('height',cHeight + 'px');
				$(this).find('img').css('opacity','1');
			} else {
				$(this).css('opacity','0').css('height',cHeight + 'px');
		}
		});
	}});
}

function slideRunPg(){

	//Original clear
	var sHtml = [];
	var tOutFix=0;
	var dCnt=0;

	$(indicator + ' ul li').each(function(i){
		if(((i+1)!=pos) && ($(this).hasClass('current') != -1)) {
			$(this).stop().animate({opacity:0.75},{duration:100,easing:'swing',complete:function(){$(this).removeClass('current')}});
		}
		if((i+1)==pos) {
			$(this).addClass('current').css('opacity','0.75').stop().animate({opacity:1},{duration:'slow',easing:'swing'});
		}
			
	});

	clearInterval(tInt);
	if($('.col_2').size() !=0) {
		$('.col_2').each(function(i){
			$(this).stop().delay((i+1)*210/wx).animate({opacity:0},{duration:300+(i*6),easing:'linear',complete:function(){tOutFix++;}});
		});
		
	}

	dCnt =0;
	tInt = setInterval(function(){
		if(tOutFix>=$('.col_2').size()){
			clearInterval(tInt);
			$('.slider').html('');
	
			for(var i=0; i<wx; i++) {
				if(((pos-1) * wx +i) < htmlArr.length) {
					dCnt++;
					$('.slider').append('<div class="col_2">' + htmlArr[(pos-1) * wx +i] + '</div>');
					if(oldIE !=0) {
						$('.col_2').eq(i).find('img').css('opacity','0').stop().delay((i+1)*220/wx).animate({opacity:1},{duration:330+(i*10)+addDur,easing:'swing'});
					} else {
						$('.col_2').eq(i).css('opacity','0').css('marginTop','4px').stop().delay((i+1)*220/wx).animate({opacity:1,marginTop:'0px'},{duration:330+(i*10)+addDur,easing:'swing'});
					}
					if(pgMax>1) {
						$('.col_2').eq(i).find('a').hover(
							function(){
								autoPause();
								$(this).find('img').css('opacity','0.75');
							},
							function(){
								clearTimeout(pInt);
								autoPlay();
								$(this).find('img').css('opacity','1');
							}
						);
						
					}

				}	
			}
			//addDur =0;
			
			if(dCnt<wx) $('.col_2').eq(0).css('marginLeft',((wx-dCnt-1)*(cWidth+30)/2) + cWidth/2 + 'px');
			
		}
		
	},10);

}

function slideRemove(dr){
	if(dr=='l') {
		$('.col_2').eq($('.col_2').size()-1).remove();
	} else {
		$('.col_2').eq(0).remove();
	}
		
	instDr="";
}

};

// $('img.photo',this).imagesLoaded(myFunction)
// execute a callback when all images have loaded.
// needed because .load() doesn't work on cached images

// mit license. paul irish. 2010.
// webkit fix from Oren Solomianik. thx!

// callback function is passed the last image to load
// as an argument, and the collection as `this`
$.fn.imagesLoaded = function(callback){
  var elems = this.filter('img'),
      len = elems.length,
      blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      
  elems.bind('load.imgloaded',function(){
      if (--len <= 0 && this.src !== blank){
        elems.unbind('load.imgloaded');
        callback.call(elems,this);
      }
  }).each(function(){
     // cached images don't fire load sometimes, so we reset src.
     if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = blank;
        this.src = src;
     }
  });

  return this;
};
//-- imagesLoaded end

document.write('<style>.slideLayout{position:relative;overflow:hidden;height:296px}</style>');
document.write('<style>.slider{position:absolute;left:0px;visibility:hidden;overflow:hidden;margin:0}</style>');
document.write('<style>.indicator,.indicatorFull,.indicatorFullPage{visibility:hidden}</style>');
document.write('<style>.loadingGif{position:absolute}</style>');

$().slideComponent();