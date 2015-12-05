'use strict';

$(document).ready(function() {
   
	var searchButton = $('.fa-search'),
		sortButton = $('.fa-sort'),
		searchBar = $('.search-bar'),
		inputs = $( '.input-file' ),
		uploadButton = $('button.upload');

	searchButton.click(function() {
		$('.header__functions i').addClass('button-hidden');
		searchBar.addClass('search-bar-open');
	});

	searchBar.keydown(function (e) {
		if (e.which === 13) {
			e.preventDefault();
			$('.header__functions i').removeClass('button-hidden');
			searchBar.removeClass('search-bar-open');
		}
	});

	sortButton.click(function () {
		$('.sort-options').toggleClass('visible');
	});

	$('.sort-options li').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});

	$('.login').click(function() {
		$('.show').removeClass('show');
		$('[data-form="login"]').addClass('show');
	});

	$('.signup').click(function() {
		$('.show').removeClass('show');
		$('[data-form="signup"]').addClass('show');
	});

	$('.photo-pane').click(function() {
		var hiddenImgId = $(this).find('img').attr("src");
		$('.show').removeClass('show');
		$('.modal--lightbox').addClass('show');
        $('.modal--lightbox img').attr("src", hiddenImgId);
        $('.modal--lightbox textarea[name="img-id"]').text(hiddenImgId);
        $.get("http://192.168.56.1:8080/WebApplication3/webresources/entity.comment", function (xml) {
        	var comments = $.xml2json(xml),
        		commentTotal = Object.keys(comments.comment).length,
        		commentSection = $('.comment-section');
        	for (var i = 0; i < commentTotal; i += 1) {
        		commentSection.append('<div class="comment"><div class="comment__author"><a href="#">Some Author</a></div><p class="comment__content">' + comments.comment[i].cment + '</p></div>')
        		console.log(comments.comment[i].cment);
        	}
        });
	});

	$('.close-button').click(function() {
		$('.show').removeClass('show');
	});

	$('.form--comment .submit-button').click(function() {

		/*
		$.ajax({
			type: "POST",
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
			url: "http://192.168.56.1:8080/WebApplication3/webresources/entity.comment",
			dataType: "json",
			data: user,
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log("Error: " + data);
			}	
		}); */
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
    
  
        $.get("http://192.168.56.1:8080/WebApplication3/webresources/entity.image", function (xml) {
            var images = $.xml2json(xml),
                photoPanes = $('.photo-pane img');

            for (var i = 0; i < photoPanes.length; i += 1) {
                photoPanes.eq(i).attr("src", "http://192.168.56.1/upload/" + images.image[i].ipath);
                photoPanes.eq(i).attr("img-id", images.image[i].iid);
            }
        });
});
