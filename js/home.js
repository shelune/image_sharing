'use strict';

$(document).ready(function() {

	$('#upload-section input[type=hidden]').val(localStorage.getItem("userID"));

	var searchButton = $('.fa-search'),
		sortButton = $('.fa-sort'),
		searchBar = $('.search-bar'),
		imageEntity = "http://192.168.56.1:8080/WebApplication3/webresources/entity.image",
		commentEntity = "http://192.168.56.1:8080/WebApplication3/webresources/entity.comment",
		currentUser = localStorage.getItem("username"),
		currentUserID = $('#upload-section input[type=hidden]').val();

	if (currentUserID === '') {
		alert("You are not logged in!");
		//window.location.replace("index.html");
	} else {
		$.get(imageEntity, function (xml) {
	        var images = $.xml2json(xml),
	            photoPanes = $('.photo-pane img'),
	            intendedPhotoPanes = 12,
	            imageTotal = Object.keys(images.image).length;

	        for (var i = imageTotal - 1; i > 0; i -= 1) {
	        	var imgLink = 'http://192.168.56.1/upload/' + images.image[i].ipath,
	        		imgOwner = images.image[i].uname.uid,
	        		imgId = images.image[i].iid;
	        	if (imgOwner === currentUserID) {
	        		$('.gallery').append('<figure class="photo-pane"><img src="' + imgLink + '" img-id="' + imgId + '"alt=""><i class="fa fa-comment"></i><figcaption>' + images.image[i].uname.uname + '</figcaption></figure>');
	        	}
	        	loadCmtNumber();         
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

	console.log("You are logged in as " + currentUser);

	console.log($('#upload-section input[type=hidden]').val());
   
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
	});

	$('.close-button').click(function() {
		$('.show').removeClass('show');
	});

	$('button.logout').click(function () {
		localStorage.removeItem("userID");
		localStorage.removeItem("username");
		$('#upload-section input[type=hidden]').attr("value", '');
		window.location.replace("index.html");
	});

	$('button.upload').click(function () {
		$('html, body').animate({
	        scrollTop: $($(this).find('a').attr('href')).offset().top}, 500);
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

    $('.gallery').on('click', '.photo-pane', function () {
    	var hiddenImgId = $(this).find('img').attr("img-id"),
			imgSrc = $(this).find('img').attr("src"),
			commentSection = $('.comment-section');
		console.log(hiddenImgId);

		$('.show').removeClass('show');
		$('.modal--lightbox').addClass('show');
        $('.modal--lightbox img').attr("src", imgSrc);
        $('.modal--lightbox textarea[name="img-id"]').text(hiddenImgId);
        $('.modal--lightbox input[name=comment-user-id]').val(currentUserID);

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
});
