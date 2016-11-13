$(document).ready(function(){
	/* ###### For only ies  ######*/
	//if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)){
	//	//code
	//}

	//message for old IE
	function isIE () {
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}

	if (isIE() < 10 &&  isIE()) {
		$('body').empty();
		$('body').prepend('<div class="old-browser"><div class="old-browser-text"> Браузер не поддерживается =(</div></div>');
	}

	$(".slider").owlCarousel({
	 items : 1,
	 autoplay : true,
	 nav:true,
	 dots:false,
	 loop:true,
	 navText:['<span class="arrow-el arrow-left"></span>','<span class="arrow-el arrow-right"></span>']
	 }
	);
	
	/* ###### For SlideToggle Elements  ######*/
	var hideToggle = function(targetClick,toggleEl) {
		$(targetClick).click(function(event){
				event.stopPropagation();
				$(toggleEl).toggle();
				$('.left-menu').toggle()
				$(targetClick).toggleClass('filter__toggle--open');
		});
		$(toggleEl).on("click", function (event) {
			event.stopPropagation();
		});
		$(document).on("click", function () {
				$('.left-menu').show()
				$(targetClick).removeClass('filter__toggle--open');
				$(toggleEl).hide();
		});
	}
	hideToggle('.filter__toggle','.filter__sub');

	//init scrollbar
	$(".basket-cond__wrap").mCustomScrollbar({
		setLeft: 0,
		autoDraggerLength: false
	});

	$(".order-list__wraper").mCustomScrollbar({
		setLeft: 0,
		autoDraggerLength: false
	});

	$(".m-menu__cont-scroll").mCustomScrollbar({
		setLeft: 0,
		autoDraggerLength: false,
		 scrollAmount:200
	});




	//toggle basket
	var hideToggleBasket = function(targetClick,toggleEl) {
			$(targetClick).click(function(event){
					event.stopPropagation();
					$(toggleEl).slideToggle("fast");
			});
			$(toggleEl).on("click", function (event) {
				event.stopPropagation();
			});
			$(document).on("click", function () {
					$(toggleEl).hide();
			});
		}

	hideToggleBasket('.header__basket','.basket-cond');
	hideToggleBasket('.m-header__basket','.basket-cond');

	$('.basket-cond__close').click(function(){
			$('.basket-cond').hide();
	})

	//modal
	$('.header__slogan').click(function(){
			$('.modal-item').bPopup({
				closeClass:'modal-close',
					position:['auto','auto'], // position center
					follow: [true,false],
			}); 
	})

	$('.nav__town').click(function(){
			$('.modal-city').bPopup({
				closeClass:'modal-close',
					position:['auto','auto'], // position center
					follow: [true,false],
			}); 
	})

	$('.nav__menu-enter').click(function(){
			$('.modal-auth').bPopup({
				closeClass:'modal-close',
					position:['auto','auto'], // position center
					follow: [true,false],
			}); 
	})

	//Encrement
	$('.minus').click(function () {
	        var $input = $(this).parent().find('input');
	        var count = parseInt($input.val()) - 1;
	        count = count < 1 ? 0 : count;
	        $input.val(count);
	        $input.change();
	        return false;

	    });

	$('.plus').click(function () {
	    var $input = $(this).parent().find('input');
	    $input.val(parseInt($input.val()) + 1);
	    $input.change();
	    return false;

	});

	//delete el in basket
	$('.m-order-list__del').click(function(){
		$(this).closest(".m-order-list__el").remove();
	})


	//Slide left menu
	var slideToggleLeftMenu = function(targetClick,toggleEl) {
		$(targetClick).click(function(event){
				event.stopPropagation();
				$(toggleEl).toggleClass("slide-menu--show");
				$('body').prepend("<div class='filter-bg'></div>");
				$('body').addClass("filter-body body-fix");
		});
		$(toggleEl).on("click", function (event) {
			event.stopPropagation();
		});
		$(document).on("click", function () {
				$(toggleEl).removeClass("slide-menu--show");
				$('body').removeClass("filter-body body-fix");
				$('.filter-bg').remove();
		});
	}
		
	slideToggleLeftMenu('.m-header__toggle','.m-menu '); 
	$('.m-menu__close').click(function(){
		$('.filter-bg').remove();
		$('.m-menu').removeClass("slide-menu--show");
		$('body').removeClass("filter-body body-fix");
	})
	/* ###### init RangeSLider  ######*/
	/* ###### bower i --save-dev nouislider  ######*/
	/* ###### https://gist.github.com/fantazer/2bdc4e6a63708e143718ffa7c32eae17  ######*/

	/*var slider = document.getElementById('rangeSlider'); //Элемент

	noUiSlider.create(slider, {
		start: [0, 100],
		connect: true,
		step: 10,
		range: {
			'min': 0,
			'max': 100,
		},
		pips: { // Show a scale with the slider
			mode: 'steps',
			density: 4
		}
	});*/
	

	
})