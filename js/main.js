'use strict';

$(document).ready(function() {
   
	var searchButton = $('.fa-search'),
		sortButton = $('.fa-sort'),
		searchBar = $('.search-bar'),
		inputs = $( '.input-file' ),
		uploadButton = $('button.upload'),
		intendedPhotoPanes = 12,
		imageEntity = "http://192.168.56.1:8080/WebApplication3/webresources/entity.image",
		commentEntity = "http://192.168.56.1:8080/WebApplication3/webresources/entity.comment";

	function loadImg() {
		$.get("http://192.168.56.1:8080/WebApplication3/webresources/entity.image", function (xml) {
	        var images = $.xml2json(xml),
	            photoPanes = $('.photo-pane img'),
	            sortOrder = $('.sort-options li.active').find('a').text().toLowerCase(),
	            imageTotal = Object.keys(images.image).length;

	        for (var i = imageTotal - 1, j = 0; i >= Math.abs(imageTotal - intendedPhotoPanes); i -= 1, j += 1) {
	            if (sortOrder === 'descending') {
	            	photoPanes.eq(j).attr("src", "http://192.168.56.1/upload/" + images.image[i].ipath);
	            	photoPanes.eq(j).attr("img-id", images.image[i].iid);
	            	photoPanes.eq(j).attr("img-date", (images.image[i].time).substring(0, 10));
	            	$('.photo-pane figcaption').eq(j).text(images.image[i].uname.uname);
	            	loadCmtNumber();
	            } else if (sortOrder === 'ascending') {
	            	photoPanes.eq(j).attr("src", "http://192.168.56.1/upload/" + images.image[j].ipath);
	            	photoPanes.eq(j).attr("img-id", images.image[j].iid);
	            	photoPanes.eq(j).attr("img-date", (images.image[j].time).substring(0, 10));
	            	$('.photo-pane figcaption').eq(j).text(images.image[j].uname.uname);
	            	loadCmtNumber();
	            }
	        }
	    });
	}

	function loadCmtNumber() {
		$.get(commentEntity, function (xml) {
        	var comments = $.xml2json(xml),
        		commentTotal = Object.keys(comments.comment).length;  

        	$('.photo-pane').each(function () {
        		var hiddenImgId = 	$(this).find('img').attr('img-id'),
        			commentCount = 0;
        		for (var i = 0; i < commentTotal; i += 1) {
	        		if (comments.comment[i].img.iid === hiddenImgId) {
	        			commentCount += 1;
	        		}
	        	}
	        	$(this).find('i').html('<span>' + commentCount + '</span>');
	        	// console.log(hiddenImgId + " . " + commentCount);
        	});	    		
        });
	}

	loadImg();
	loadCmtNumber();

	console.log("Current User: " + localStorage.getItem("userID"));

	if (localStorage.getItem("userID") === null) {
		$('#form--comment__submit').attr("disabled", true);
		$('.appear').removeClass('appear').addClass('disappear');
	} else {
		$('#form--comment__submit').attr("disabled", false);
		$('.modal--lightbox input[name=comment-user-id]').val(localStorage.getItem("userID"));
		$('#upload-section input[type=hidden]').val(localStorage.getItem("userID"));
		$('button.signup').addClass('logout').removeClass('signup');
		$('i.fa-user-plus').addClass('fa-sign-out').removeClass('fa-user-plus');
		$('span[data-letters="Sign Up"]').text('Sign Out');

		$('button.login').addClass('upload').append('<a href="#upload-section">Upload</a>').removeClass('login');
		$('i.fa-sign-in').addClass('fa-upload').removeClass('fa-sign-in');
		$('span[data-letters="Log In"').remove();
		$('.disappear').removeClass('disappear').addClass('appear');
	}

	searchButton.click(function() {
		$('.header__functions i').addClass('button-hidden');
		searchBar.addClass('search-bar-open');
	});

	searchBar.keydown(function (e) {
		if (e.which === 13) {
			e.preventDefault();
			$('.header__functions i').removeClass('button-hidden');
			searchBar.removeClass('search-bar-open');
			var searchInput = $('input[name=username--search]').val();
			$.ajax({
				type: "GET",
				url: "http://192.168.56.1:8080/WebApplication3/webresources/entity.user/searchUser/" + searchInput,
				dataType: "text",
				success: function(response) {
					var images = $.xml2json(response),
						imgLink = "",
						imgOwner = "",
						imgId = "",
		        		imageTotal = Object.keys(images.image).length;
		        	if (!$.isArray(images.image)) {
		        		images.image = [images.image];	
		        	}

					$('.gallery').empty();
					for (var i = 0; i <= imageTotal; i += 1) {
				        var imgLink = 'http://192.168.56.1/upload/' + images.image[i].ipath,
				        	imgOwner = images.image[i].uname.uid,
				        	imgId = images.image[i].iid;
				        	$('.gallery').prepend('<figure class="photo-pane"><img src="' + imgLink + '" img-id="' + imgId + '"alt=""><i class="fa fa-comment"></i><figcaption>' + images.image[i].uname.uname + '</figcaption></figure>');
				        loadCmtNumber();         
	        		}
				},

				error: function () {
					console.log("User not found!");
				}
			});
		}
	});

	sortButton.click(function () {
		$('.sort-options').toggleClass('visible');
	});

	$('.sort-options li').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
		loadImg();
	});

	$('button.login').click(function() {
		$('.show').removeClass('show');
		$('[data-form="login"]').addClass('show');
	});

	$('button.signup').click(function() {
		$('.show').removeClass('show');
		$('[data-form="signup"]').addClass('show');
	});

	$('button.logout').click(function () {
		localStorage.removeItem("userID");
		localStorage.removeItem("username");
		$('#upload-section input[type=hidden]').attr("value", '');
		window.location.replace("index.html");
	});

	$('#submit-signup').click(function () {
		var userSignup = $('#username--signup').val(),
			passSignup = $('#password--signup').val();
		console.log(userSignup + " . " + passSignup);
		$.ajax({
			type: "POST",
			url: "http://192.168.56.1:8080/WebApplication3/webresources/entity.user/register/" + userSignup + "/" + passSignup,
			dataType: "text",
			success: function(response) {
				if (response === '') {
					alert("Username already taken.");

				} else {
					alert("User " + response + " created.");
					location.reload();
				}
			}
		});
	});

	$('.photo-pane').click(function() {
		var hiddenImgId = $(this).find('img').attr("img-id"),
			imgSrc = $(this).find('img').attr("src"),
			commentSection = $('.comment-section');

		$('.show').removeClass('show');
		$('.modal--lightbox').addClass('show');
        $('.modal--lightbox img').attr("src", imgSrc);
        $('.modal--lightbox textarea[name="img-id"]').text(hiddenImgId);
        $('.modal--lightbox .description__author').text($(this).find('figcaption').text());
        $('.modal--lightbox .description__date').text($(this).find('img').attr('img-date'));
        $('.modal--lightbox .description__link').text($(this).find('img').attr('src'));

        $.get(commentEntity, function (xml) {
        	var comments = $.xml2json(xml),
        		commentTotal = Object.keys(comments.comment).length;      		
        	commentSection.empty();
        	for (var i = 0; i < commentTotal; i += 1) {
        		if (comments.comment[i].img.iid === hiddenImgId) {
        			commentSection.append('<div class="comment"><div class="comment__author"><a href="#">' + comments.comment[i].user.uname + '</a></div><p class="comment__content">' + comments.comment[i].cment + '</p></div>');
        			console.log(comments.comment[i].cment);
        		}
        		// console.log(comments.comment[i].img.iid);
        	}
        });
	});

	$('.close-button').click(function() {
		$('.show').removeClass('show');
	});

	$('.form--comment .submit-button').click(function() {
		var hiddenImgId = $('photo-pane').find('img').attr("img-id"),
			commentSection = $('.comment-section');

		$.get(commentEntity, function (xml) {
        	var comments = $.xml2json(xml),
        		commentTotal = Object.keys(comments.comment).length;      		
        	commentSection.empty();
        	for (var i = 0; i < commentTotal; i += 1) {
        		if (comments.comment[i].img.iid === hiddenImgId) {
        			commentSection.append('<div class="comment"><div class="comment__author"><a href="#">' + comments.comment[i].user.uname + '</a></div><p class="comment__content">' + comments.comment[i].cment + '</p></div>');
        		}
        		// console.log(comments.comment[i].img.iid);
        	}
        });
	});

	$('.gallery').on('click', '.photo-pane', function () {
    	var hiddenImgId = $(this).find('img').attr("img-id"),
			imgSrc = $(this).find('img').attr("src"),
			commentSection = $('.comment-section');
		console.log(hiddenImgId);

		$('.show').removeClass('show');
		$('.modal--lightbox').addClass('show');
        $('.modal--lightbox img').attr("src", imgSrc);
        $('.modal--lightbox textarea[name="img-id"]').text(hiddenImgId);
        $('.modal--lightbox input[name=comment-user-id]').val(localStorage.getItem("userID"));

        loadCmtNumber();

        $.get(commentEntity, function (xml) {
        	var comments = $.xml2json(xml),
        		commentTotal = Object.keys(comments.comment).length;     

        	commentSection.empty();
        	for (var i = 0; i < commentTotal; i += 1) {
        		if (comments.comment[i].img.iid === hiddenImgId) {
        			commentSection.append('<div class="comment"><div class="comment__author"><a href="#">' + comments.comment[i].user.uname + '</a></div><p class="comment__content">' + comments.comment[i].cment + '</p></div>');
        		}
        		// console.log(comments.comment[i].img.iid);
        	}
        });
    });

	$('#submit-login').click(function () {
		var username = $('.form--login').find('input[name=username]').val(),
			password = $('.form--login').find('input[name=password]').val();
		$.ajax({
			type: "GET",
			url: "http://192.168.56.1:8080/WebApplication3/webresources/entity.user/checkLogin/" + username + "/" + password,
			dataType: "text",
			success: function(response) {
				if (response === '') {
					alert("Wrong username or password");
				} else {
					var JSON = $.parseJSON(response);
					console.log(JSON);
					localStorage.setItem("username", JSON.username);
					localStorage.setItem("userID", JSON.userID);
					window.location.replace("home.html");
				}
			}
		});
	});

	$('button.upload').click(function () {
		$('html, body').animate({
	        scrollTop: $($(this).find('a').attr('href')).offset().top
	    }, 500);
	    return false;
	});
    
    
    $('.input-file').change(function(e) {
        var fileName = '',
            label = this.nextElementSibling,
            labelValue = label.innerHtml;
        
        if (this.files && this.files.length > 1) {
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        } else {
            fileName = e.target.value.split('\\').pop();
        }
        
        if (fileName) {
            label.querySelector('span').innerHTML = fileName;
        } else {
            label.innerHtml = labelValue;
        }
    });

    $('.modal--lightbox').on('click', '.comment__author a, .description__author', function (e) {
    	e.preventDefault();
    	var authorName = $(this).text();
    	console.log(authorName);
    	$.ajax({
			type: "GET",
			url: "http://192.168.56.1:8080/WebApplication3/webresources/entity.user/searchUser/" +  authorName,
			dataType: "text",
			success: function(response) {
				var images = $.xml2json(response),
					imgLink = "",
					imgOwner = "",
					imgId = "",
		        	imageTotal = Object.keys(images.image).length;
		        if (!$.isArray(images.image)) {
		        	images.image = [images.image];	
		        }
				$('.gallery').empty();
				$('.show').removeClass('show');
				for (var i = 0; i <= imageTotal; i += 1) {
				    var imgLink = 'http://192.168.56.1/upload/' + images.image[i].ipath,
				        imgOwner = images.image[i].uname.uid,
				        imgId = images.image[i].iid;
				        $('.gallery').prepend('<figure class="photo-pane"><img src="' + imgLink + '" img-id="' + imgId + '"alt=""><i class="fa fa-comment"></i><figcaption>' + images.image[i].uname.uname + '</figcaption></figure>');
				    loadCmtNumber();         
	        	}
			},
		});
    });
});
