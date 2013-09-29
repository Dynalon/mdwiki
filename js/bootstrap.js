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
        bootstrapify: function () {
            createPageSkeleton();
            buildMenu ();
            changeHeading();
            replaceImageParagraphs();

            $('table').addClass('table').addClass('table-bordered');
            //pullRightBumper ();

            // remove the margin for headings h1 and h2 that are the first
            // on page
            //if (navStyle == "sub" || (navStyle == "top" && $('#md-title').text ().trim ().length === 0))
            //    $(".md-first-heading").css ("margin-top", "0");

            // external content should run after gimmicks were run
            $.md.stage('pregimmick').subscribe(function(done) {
                if ($.md.config.useSideMenu !== false) {
                    createPageContentMenu();
                    addFooter();
                }
                done();
            });
            $.md.stage('postgimmick').subscribe(function(done) {
                adjustExternalContent();
                highlightActiveLink();

                done();
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
        var $menuContent = $('#md-menu').children();

        // $('#md-menu').addClass ('navbar navbar-default navbar-fixed-top');
        // var menusrc = '';
        // menusrc += '<div id="md-menu-inner" class="container">';
        // menusrc += '<ul id="md-menu-ul" class="nav navbar-nav">';
        // menusrc += '</ul></div>';

        var navbar = '';
        navbar += '<div class="navbar navbar-default navbar-fixed-top" role="navigation">';
        navbar +=   '<div class="navbar-header">';
        navbar +=     '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">';
        navbar +=       '<span class="sr-only">Toggle navigation</span>';
        navbar +=       '<span class="icon-bar"></span>';
        navbar +=       '<span class="icon-bar"></span>';
        navbar +=       '<span class="icon-bar"></span>';
        navbar +=     '</button>';
        navbar +=     '<a class="navbar-brand" href="#"></a>';
        navbar +=   '</div>';

        navbar +=   '<div class="collapse navbar-collapse navbar-ex1-collapse">';
        navbar +=     '<ul class="nav navbar-nav" />';
        navbar +=     '<ul class="nav navbar-nav navbar-right" />';
        navbar +=   '</div>';
        navbar += '</div>';
        var $navbar = $(navbar);

        $navbar.appendTo('#md-menu');
        // .eq(0) becase we dont want navbar-right to be appended to
        $('#md-menu ul.nav').eq(0).append($menuContent);

        // the menu should be the first element in the body
        $('#md-menu').prependTo ('#md-all');

        var brand_text = $('#md-menu h1').text();
        $('#md-menu h1').remove();
        $('a.navbar-brand').text(brand_text);


        // then comes md-title, and afterwards md-content
        // offset md-title to account for the fixed menu space
        // 50px is the menu width + 20px spacing until first text
        // or heading
        $('#md-body').css('margin-top', '70px');
    }
    function buildSubNav() {
        // replace with the navbar skeleton
        /* BROKEN CODE
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
        $('#md-menu').addClass ('col-md-12');

        $('#md-menu-container').insertAfter ($('#md-title-container'));
        */
    }

    function buildMenu () {
        if ($('#md-menu a').length === 0) {
            return;
        }
        var h = $('#md-menu');

        // make toplevel <a> a dropdown
        h.find('> a[href=""]')
            .attr('data-toggle', 'dropdown')
            .addClass('dropdown-toggle')
            .attr('href','')
            .append('<b class="caret"/>');
        h.find('ul').addClass('dropdown-menu');
        h.find('ul li').addClass('dropdown');

        // replace hr with dividers
        $('#md-menu hr').each(function(i,e) {
            var hr = $(e);
            var prev = hr.prev();
            var next = hr.next();
            if (prev.is('ul') && prev.length >= 0) {
                prev.append($('<li class="divider"/>'));
                hr.remove();
                if (next.is('ul')) {
                    next.find('li').appendTo(prev);
                    next.remove();
                }
                // next ul should now be empty
            }
            return;
        });

        // remove empty uls
        $('#md-menu ul').each(function(i,e) {
            var ul = $(e);
            if (ul.find('li').length === 0) {
                ul.remove();
            }
        });

        $('#md-menu hr').replaceWith($('<li class="divider-vertical"/>'));


        // wrap the toplevel links in <li>
        $('#md-menu > a').wrap('<li />');
        $('#md-menu ul').each(function(i,e) {
            var ul = $(e);
            ul.appendTo(ul.prev());
            ul.parent('li').addClass('dropdown');
        });

        // call the user specifed menu function
        buildTopNav();
    }
    function isVisibleInViewport(e) {
        var el = $(e);
        var top = $(window).scrollTop();
        var bottom = top + $(window).height();

        var eltop = el.offset().top;
        var elbottom = eltop + el.height();

        return (elbottom <= bottom) && (eltop >= top);
    }

    function createPageContentMenu () {

        // assemble the menu
        var $headings = $('#md-content').find('h2');

        if ($headings.length === 0) {
            return;
        }

        $('#md-content').removeClass ('col-md-12');
        $('#md-content').addClass ('col-md-9');
        $('#md-content-row').prepend('<div class="col-md-3" id="md-left-column"/>');

        var recalc_width = function () {
            // if the page menu is affixed, it is not a child of the
            // <md-left-column> anymore and therefore does not inherit
            // its width. On every resize, change the class accordingly
            var width_left_column = $('#md-left-column').css('width');
            $('#md-page-menu').css('width', width_left_column);
        };

        $(window).scroll(function() {
            recalc_width($('#md-page-menu'));
            var $first;
            $('*.md-inpage-anchor').each(function(i,e) {
                if ($first === undefined) {
                    var h = $(e);
                    if (isVisibleInViewport(h)) {
                        $first = h;
                    }
                }
            });
            // highlight in the right menu
            $('#md-page-menu a').each(function(i,e) {
                var $a = $(e);
                if ($first && $a.text() === $first.text()) {
                    $('#md-page-menu a.active').removeClass('active');
                    //$a.parent('a').addClass('active');
                    $a.addClass('active');
                }
            });
        });


        var affixDiv = $('<div id="md-page-menu" />');

        //var top_spacing = $('#md-menu').height() + 15;
        var top_spacing = 70;
        affixDiv.affix({
            //offset: affix.position() - 50,
            offset: 130
        });
        affixDiv.css('top', top_spacing);
        //affix.css('top','-250px');

        var $pannel = $('<div class="panel panel-default"><ul class="list-group"/></div>');
        var $ul = $pannel.find("ul");
        affixDiv.append($pannel);

        $headings.each(function(i,e) {
            var $heading = $(e);
            var $li = $('<li class="list-group-item" />');
            var $a = $('<a />');
            $a.attr('href', $heading.text());
            $a.click(function(ev) {
                ev.preventDefault();

                var $this = $(this);
                $.md.scrollToInPageAnchor($this.text());
            });
            $a.text($heading.text());
            $li.append($a);
            $ul.append($li);
        });

        $(window).resize(function () {
            recalc_width($('#md-page-menu'));
        });
        $.md.stage('postgimmick').subscribe(function (done) {
            // recalc_width();
            done();
        });

        //menu.css('width','100%');
        $('#md-left-column').append(affixDiv);

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

        $('#md-title').addClass('col-md-12');
        $('#md-content').addClass('col-md-12');

    }
    function pullRightBumper (){
 /*     $("span.bumper").each (function () {
			$this = $(this);
			$this.prev().addClass ("pull-right");
		});
		$('span.bumper').addClass ('pull-right');
*/
    }

    function changeHeading() {

        // HEADING
        var jumbo = $('<div class="page-header" />');
        var heading = $('<h1/>');
        jumbo.append(heading);
        $('#md-title').wrapInner(jumbo);
    }

    function highlightActiveLink () {
        // when no menu is used, return
        if ($('#md-menu').find ('li').length === 0) {
            return;
        }
		var filename = $.md.mainHref;

		if (filename.length === 0) {
            filename = 'index.md';
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
                .add($(this).find ('img'))
                .addClass('img-responsive')
                .addClass('img-thumbnail');

            // create a new url group at the fron of the paragraph
            //$p.prepend($('<ul class="thumbnails" />'));
            // move the images to the newly created ul
            //$p.find('ul').eq(0).append($images);

            // wrap each image with a <li> that limits their space
            // the number of images in a paragraphs determines thei width / span
            // FLOATS disabled for now
            if (false && $p.hasClass ('md-floatenv')) {
                // float environments have smaller sizes for images
                if ($images.length === 1) {
                    $images.wrap('<div class="col-md-6" />');
                } else if ($images.length === 2) {
                    $images.wrap('<div class="col-md-3" />');
                } else {
                    $images.wrap('<div class="col-md-2" />') ;
                }
            } else {
                // non-float => images are on their own single paragraph, make em larger
                // but remember, our image resizing will make them only as large as they are
                // but do no upscaling

                // TODO replace by calculation
                if ($images.length === 1) {
                    $images.wrap('<div class="col-sm-12" />');
                } else if ($images.length === 2) {
                    $images.wrap('<div class="col-sm-6" />');
                } else if ($images.length === 3) {
                    $images.wrap('<div class="col-sm-4" />');
                } else if ($images.length === 4) {
                    $images.wrap('<div class="col-sm-3" />');
                } else {
                    $images.wrap('<div class="col-sm-2" />');
                }
            }
            // finally, every img gets its own wrapping thumbnail div
            //$images.wrap('<div class="thumbnail" />');
        });
        // image groups are always a row
        $('p.md-image-group').addClass('row');

        // apply float to the ul thumbnails
        //$('.md-floatenv.md-float-left ul').addClass ('pull-left');
        //$('.md-floatenv.md-float-right ul').addClass ('pull-right');
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
        //$('.md-external').addClass('img-thumbnail');

        //.wrap($("<ul class='thumbnails' />")).wrap($("<li class='col-md-6' />"));
        $('div.md-external').not('.md-external-noheight')
            .css('height', '280px');
        $('div.md-external').not('.md-external-nowidth')
            .css('width', '450px');

        // // make it appear like an image thumbnal
        // $("div.md-external").addClass("thumbnail").wrap($("<ul class='thumbnails' />")).wrap($("<li class='col-md-10' />"));

        // $("div.md-external-large").css('width', "700px")
    }

    // note: the footer is part of the GPLv3 legal information
    // and may not be removed or hidden to comply with licensing conditions.
    function addFooter() {
        var navbar = '';
        navbar += '<div id="#md-copyright-footer" class="navbar navbar-default navbar-fixed-bottom">';
        navbar +=     '<ul class="nav navbar-nav navbar-left">';
        navbar +=       '<p class="navbar-text">';
        navbar +=       '</p>';
        navbar +=     '</ul>';
        navbar +=     '<ul class="nav navbar-nav navbar-right">';
        navbar +=       '<p class="navbar-text">';
        navbar +=          'Website created with <a href="http://dynalon.github.io/mdwiki">MDwiki</a> ';
        navbar +=         '(&copy; 2013 Timo D&ouml;rr and contributors.) ';
        navbar +=         '<a href="http://dynalon.github.io/mdwiki">MDwiki</a> is free software licensed under ';
        navbar +=         '<a href="https://github.com/Dynalon/mdwiki/blob/master/LICENSE.txt">GNU GPLv3 (additional terms apply).</a>';
        navbar +=       '</p>';
        navbar +=     '</ul>';
        navbar +=   '</div>';
        navbar += '</div>';
        var $navbar = $(navbar);
        $navbar.css('position', 'relative');
        $navbar.css('margin-top', '1em');
        $('#md-all').append ($navbar);
    }
}(jQuery));
