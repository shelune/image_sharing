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
		$('.show').removeClass('show');
		$('.modal--lightbox').addClass('show');
        $('.modal--lightbox img').attr("src", $(this).find('img').attr("src"));
        $('.modal--lightbox textarea[name="img-id"]').text($(this).find('img').attr("img-id"));
	});

	$('.close-button').click(function() {
		$('.show').removeClass('show');
	});

	$('.submit-button').click(function() {
		$('#comment-submit, .input-field').val('');
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
