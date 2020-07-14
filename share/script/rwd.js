// JavaScript Document


// viewport

$(function(){
	
  // UA for smartphone
  var ua = navigator.userAgent;
  
  /* for smartphone, iPhone, Android  */
  if(
	(ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) || // android smartphone
	(ua.indexOf('iPhone') > 0) // iPhone
	)
  {
	  var meta = document.createElement('meta');
	  meta.setAttribute('name', 'viewport');
	  meta.setAttribute('content', 'width=width=device-width, initial-scale=1.0');
	  $('head').append(meta);
  }

});


// globalNavi current

$(function(){
	var url = location.pathname.split("/")[1];
	var gNav = $('#globalNavi ul.mega li.flag a:not(.megamenu a)');

	gNav.each(function(){
		if( $(this).attr('href').split("/")[1] == url ) {
			$(this).parents('li.flag').addClass('current');
			$('img:not(.megamenu a)', this).attr('src', $('img:not(.megamenu a)', this).attr('src').replace(/^(.+)(\.[a-z]+)$/, '$1_on$2'));
		};
	});
});


// SP search

$(function(){
   $('.spNav#search').click(function(){
	   $('body').addClass('overlaySearch');
	   $('.overlaySearch .formArea form').css('height', $(document).height() + 'px');
   });
   
   $('.formArea form .btnClose').click(function(){
	   $('body').removeClass('overlaySearch');
   });
   
});


// SP menu

$(function(){
	
	$('.spNav#menu').click(function(){
		$('body').toggleClass('overlayMenu');
		$('.overlayMenu #globalNavi').css('height',$(document).height() + 'px');
		$('#globalNavi ul li.mm-item a').removeClass('mm-item-link');
		$('.mm-js-shadow').remove();
		
		$('.overlayMenu #globalNavi ul li.mmItem a:not(.megamenu a)').each(function(){
            var cateTopTxt = $(this).children('span').text();
			var cateTopUrl = $(this).attr('href');
			
			//$(this).siblings('div').find('.megamenuInner ul').prepend('<li class=' + '"cateTop"' + '><a href=' + '"' + cateTopUrl + '">' + cateTopTxt + ' Top' + '</a></li>');
			
			$(this).siblings('div').find('.megamenuInner.aboutus ul').prepend('<li class=' + '"cateTop"' + '><a href=' + '"' + '/about_us/index.html' + '">' + cateTopTxt + ' Top' + '</a></li>');
			$(this).siblings('div').find('.megamenuInner.research ul').prepend('<li class=' + '"cateTop"' + '><a href=' + '"' + '/research_and_development/index.html' + '">' + cateTopTxt + ' Top' + '</a></li>');
			$(this).siblings('div').find('.megamenuInner.responsibility ul').prepend('<li class=' + '"cateTop"' + '><a href=' + '"' + '/sustainability/index.html' + '">' + cateTopTxt + ' Top' + '</a></li>');
			
			$(this).attr('href', 'javascript: void(0);');
			
		});
	});
	
	$('#globalNavi ul li.mmItem a span').click(function(){
		$(this).parent('a').siblings('div').slideToggle('fast');
		$(this).toggleClass('open');
	});
	
	$('#globalNavi .btnClose').click(function(){
		$('#globalNavi ul li.mmItem a span').removeClass('open');
		$('#globalNavi .megamenu .megamenuInner ul li.cateTop').remove();
		$('body').removeClass('overlayMenu');
		
		$('#globalNavi ul li.mmItem:nth-child(1) a:not(.megamenu a)').attr('href', '/about_us/index.html');
		$('#globalNavi ul li.mmItem:nth-child(3) a:not(.megamenu a)').attr('href', '/research_and_development/index.html');
		$('#globalNavi ul li.mmItem:nth-child(4) a:not(.megamenu a)').attr('href', '/responsibility/index.html');
	});
   
});


// img modal

$(function(){
	
	var imgModal = $('img.modalImg');
	imgModal.each(function () {
		$(this).after('<span class=' + '"' + 'btnModal' + '"' + '>+ zoom</span>');
	});
	
    $('.btnModal').click(function(){
		var imgModalURL = $(this).siblings('img.modalImg').attr('src');
		$('body').prepend('<div class=' + '"' + 'overlayModal' + '"' + '><div class=' + '"' + 'modal' + '"' + '><span>' + 'close' + '</span><img src=' + '"' + imgModalURL + '"' + '></div></div>');
		$('.overlayModal').css('height', $(document).height() + 'px');
		var ScrTop = $(document).scrollTop();
		var imgHeight = $('.overlayModal .modal img').height();
		$('.overlayModal .modal img, .overlayModal .modal span').css('top', $(window).height() / 2 + ScrTop);
		$('.overlayModal .modal span').css('margin-top', - imgHeight / 2 - 50);
		$('.overlayModal, .modal, .modal span, .modal img').fadeIn(350);
    });
	
    $('body').on('click', '.overlayModal, .modal, .modal span', function(){
        $('.overlayModal, .modal, .modal span, .modal img').remove();
    });
	
});


// news img 

$(function(){
	fluidImg();
});

function fluidImg() { 
	var newsImg = $('body#news-01 #content img, body#news #content img');
	var contentWidth = $('body#news-01 #content .line, body#news #content .line').width();
	newsImg.each(function(){
		var newsImgW = $(this).width();
		if( newsImgW > contentWidth ){
			$(this).addClass('fluid');
		}
	});
}



// resize window

$(window).resize(function(){

	var windowSize = $(window).width();
	
	if ( windowSize > 639 ) {
		$('body').removeClass('overlaySearch');
		$('.formArea form').css('height', 'auto');
		$('body').removeClass('overlayMenu');
		$('#globalNavi').css('height', 'auto');
		$('#globalNavi ul li.mm-item .mm-item-content').slideUp('fast');
		$('#globalNavi ul li.mmItem a span').removeClass('open');
		$('#globalNavi ul li.mm-item a:not(.megamenu a)').addClass('mm-item-link');
		
		$('#globalNavi .megamenu .megamenuInner ul li.cateTop').each(function(){
			var cateTopUrl = $(this).children('a').attr('href');
			$(this).parent('ul').parent('div').parent('div').parent('div').parent('div').siblings('a').attr('href', cateTopUrl);
			$(this).remove();
		});
		
        $('.overlayModal, .modal, .modal span, .modal img').remove();
		
		$('body#news-01 #content img, body#news #content img').removeClass('fluid');
	}

	if ( windowSize < 640 ) {
		$('#globalNavi ul li.mm-item a').removeClass('mm-item-link');
		$('#globalNavi ul li.mm-item .mm-item-content').css('top','')
		$('.mm-js-shadow').remove();
		
		fluidImg()
	}

});
