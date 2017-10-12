/* global FB: true, twttr: true */
'use strict';


$(document).ready(function () {

	window.fbAsyncInit = function () {
		FB.init({
			appId: '136946733613918',
			cookie: true,
			xfbml: true,
			version: 'v2.10'
		});
		FB.AppEvents.logPageView();
	};

	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) { return; }
		js = d.createElement(s); js.id = id;
		js.src = '//connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));



	$('.share-facebook').unbind().click(function(e) {
		e.preventDefault();

		if(FB) {
			FB.ui({
				method: 'share',
				caption: 'LivPLAY',
				href: 'http://livplay.com.br'
			}, function(response){
				if (response && !response.error_code) {
					window.location.href = '/obrigado.html';
				}
			});
		}
	});

	$('.register').click(function (e) {
		e.preventDefault();

		if($('.discount').length > 0) {
			$('html, body').animate({
				scrollTop: $('.discount').offset().top
			}, 600);
		}
		else {
			window.location.href = '/';
		}

	});




	$.getScript('http://platform.twitter.com/widgets.js', function(){
		function handleTweetEvent(event){
			if (event) {
				window.location.href = '/obrigado.html';
			}
		}
		twttr.events.bind('tweet', handleTweetEvent);

	});




});