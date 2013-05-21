(function($) {
    'use strict';
    // call the gimmick
    $.mdbootstrap = function (method){
        if ($.mdbootstrap.publicMethods[method]) {
            return $.mdbootstrap.publicMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Method ' + method + ' does not exist on jquery.mdbootstrap');
        }
    };
    // simple wrapper around $().bind
    $.mdbootstrap.events = [];
    $.mdbootstrap.bind =  function (ev, func) {
        $(document).bind (ev, func);
        $.mdbootstrap.events.push (ev);
    };
    $.mdbootstrap.trigger = function (ev) {
        $(document).trigger (ev);
    };

    var navStyle = '';

    // PUBLIC API functions that are exposed
    var publicMethods = {
        init: function () {
            buildMenu ();
        },
        bootstrapify: function () {

            createPageSkeleton();
            changeHeading();
            replaceImageParagraphs();

            //pullRightBumper ();
            //highlightActiveLink ();

            // remove the margin for headings h1 and h2 that are the first
            // on page
            //if (navStyle == "sub" || (navStyle == "top" && $('#md-title').text ().trim ().length === 0))
            //    $(".md-first-heading").css ("margin-top", "0");

            // external content should run after gimmicks were run
            $.md.stage('bootstrap').done(function() {
                adjustExternalContent();
            });
        }
    };
    // register the public API functions
    $.mdbootstrap.publicMethods = $.extend ({}, $.mdbootstrap.publicMethods, publicMethods);

    // PRIVATE FUNCTIONS:

    function buildTopNav() {
        // replace with the navbar skeleton
        if ($('#md-menu').length <= 0) {
            return;
        }
        navStyle = 'top';
        var $menuContent = $('#md-menu').html ();

        $('#md-menu').addClass ('navbar navbar-fixed-top navbar');
        var menusrc = '';
        menusrc += '<div class="navbar-inner">';
        menusrc += '<div id="md-menu-inner" class="container">';
        menusrc += '<ul id="md-menu-ul" class="nav">';
        menusrc += $menuContent;
        menusrc += '</ul></div></div>';

        // put the new content in
        $('#md-menu').empty ();
        $('#md-menu').wrapInner ($(menusrc));


        // the menu should be the first element in the body
        $('#md-menu-container').prependTo ('#md-all');

        // then comes md-title, and afterwards md-content
        // offset md-title to account for the fixed menu space
        // 50px is the menu width + 20px spacing until first text
        // or heading
        $('#md-body').css('margin-top', '70px');
    }
    function buildSubNav() {
        // replace with the navbar skeleton
        if ($('#md-menu').length <= 0) {
            return;
        }
        navStyle = 'sub';
        var $menuContent = $('#md-menu').html ();

        var menusrc = '';
        menusrc += '<div id="md-menu-inner" class="subnav">';
        menusrc += '<ul id="md-menu-ul" class="nav nav-pills">';
        menusrc += $menuContent;
        menusrc += '</ul></div>';
        $('#md-menu').empty();
        $('#md-menu').wrapInner($(menusrc));
        $('#md-menu').addClass ('span12');

        $('#md-menu-container').insertAfter ($('#md-title-container'));
    }

    function buildMenu () {
        if ($('#md-menu a').length === 0) {
            return;
        }
        // wrap the remaining links in <li>
        $('#md-menu a').wrap('<li />');

        // TODO use dividers in the navbar
        // remove p around the links in the menu
        /*$('#md-menu p').replaceWith(function() {
            return $(this).html();
        }); */

        // call the user specifed menu function
        if ($.inArray('buildMenu', $.mdbootstrap.events) === -1) {
            buildTopNav();
        } else {
            $.mdbootstrap.trigger ('buildMenu');
        }
    }

    function createPageSkeleton() {

        $('#md-title').wrap('<div class="container" id="md-title-container"/>');
        $('#md-title').wrap('<div class="row" id="md-title-row"/>');

        $('#md-menu').wrap('<div class="container" id="md-menu-container"/>');
        $('#md-menu').wrap('<div class="row" id="md-menu-row"/>');

        $('#md-content').wrap('<div class="container" id="md-content-container"/>');
        $('#md-content').wrap('<div class="row" id="md-content-row"/>');

        $('#md-body').wrap('<div class="container" id="md-body-container"/>');
        $('#md-body').wrap('<div class="row" id="md-body-row"/>');

        $('#md-content').addClass('span10');
        $('#md-title').addClass('span10');
    }
    function pullRightBumper (){
 /*     $("span.bumper").each (function () {
			$this = $(this);
			$this.prev().addClass ("pull-right");
		});
*/
		$('span.bumper').addClass ('pull-right');
    }

    function changeHeading() {

        // HEADING
        var jumbo = $('<div class="jumbotron page-header" />');
        var heading = $('<h1/>');
        heading.text($('#md_title').text());
        jumbo.append(heading);
        $('#md-title').wrapInner(jumbo);
    }
    function highlightActiveLink () {
        // when no menu is used, return
        if ($('#md-menu').find ('li').length === 0) {
            return;
        }
		// get the filename of the currently visited page
		var filename = $(window.location.href.split ('/')).last ()[0];

		if (filename.length === 0) {
            filename = 'index.txt';
        }
		var selector = 'li:has(a[href$="' + filename + '"])';
		$('#md-menu').find (selector).addClass ('active');
    }

    // replace all <p> around images with a <div class="thumbnail" >
    function replaceImageParagraphs() {

        // only select those paragraphs that have images in them
        var $pars = $('p img').parents('p');
        $pars.each(function() {
            var $p = $(this);
            var $images = $(this).find('img')
                .filter(function() {
                    // only select those images that have no parent anchor
                    return $(this).parents('a').length === 0;
                })
                // add those anchors including images
                .add($(this).find ('a:has(img)'));

            // create a new url group at the fron of the paragraph
            $p.prepend($('<ul class="thumbnails" />'));
            // move the images to the newly created ul
            $p.find('ul').eq(0).append($images);

            // wrap each image with a <li> that limits their space
            // the number of images in a paragraphs determines thei width / span
            if ($p.hasClass ('md-floatenv')) {
                // float environments have smaller sizes for images
                if ($images.length === 1) {
                    $images.wrap('<li class="span6" />');
                } else if ($images.length === 2) {
                    $images.wrap('<li class="span3" />');
                } else {
                    $images.wrap('<li class="span2" />') ;
                }
            } else {
                // non-float => images are on their own single paragraph, make em larger
                // but remember, our image resizing will make them only as large as they are
                // but do no upscaling
                if ($images.length === 1) {
                    $images.wrap('<li class="span10" />');
                } else if ($images.length === 2) {
                    $images.wrap('<li class="span5" />');
                } else {
                    $images.wrap('<li class="span3" />');
                }
            }
            // finally, every img gets its own wrapping thumbnail div
            $images.wrap('<div class="thumbnail" />');
        });
        // apply float to the ul thumbnails
        $('.md-floatenv.md-float-left ul').addClass ('pull-left');
        $('.md-floatenv.md-float-right ul').addClass ('pull-right');
    }

    function adjustExternalContent() {
        // external content are usually iframes or divs that are integrated
        // by gimmicks
        // example: youtube iframes, google maps div canvas
        // all external content are in the md-external class

        $('iframe.md-external').not ('.md-external-nowidth')
            .attr('width', '450')
            .css ('width', '450px');

        $('iframe.md-external').not ('.md-external-noheight')
            .attr('height', '280')
            .css ('height', '280px');

        // make it appear like an image thumbnal
        $('.md-external').addClass('thumbnail');

        //.wrap($("<ul class='thumbnails' />")).wrap($("<li class='span6' />"));
        $('div.md-external').not('.md-external-noheight')
            .css('height', '280px');
        $('div.md-external').not('.md-external-nowidth')
            .css('width', '450px');

        // // make it appear like an image thumbnal
        // $("div.md-external").addClass("thumbnail").wrap($("<ul class='thumbnails' />")).wrap($("<li class='span10' />"));

        // $("div.md-external-large").css('width', "700px")
    }

}(jQuery));
