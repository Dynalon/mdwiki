/* markdown.io assets (C) Timo Dörr
licensed under GNU GPLv3
see http://www.gnu.org/licenses/gpl-3.0.html
*/
(function($) {

    var publicMethods = {
        createBasicSkeleton: function() {

            $.md.trigger ('md_load');
            setPageTitle();
            wrapParagraphText();
            groupImages();
            processPreviews();
            //addInpageAnchors ();

            removeBreaks();
            //markFirstHeading ();

            $.md.trigger('md_ready');
            // trigger our themeing
            // TODO put that away
            $.md.trigger('md_theme_complete');

            // TODO gimmicks should not be done in this stage
            $.gimmicks ();
            // CALL GIMMICKS THAT ARE NOT TRIGGERED BY gimmick:FUNC() link
            $.gimmicks('colorbox');
            $.gimmicks('youtube');
            $.gimmicks('alerts');
            return;

            //$.md.trigger('md_gimmicks_complete');

            // activate syntax highlighting on <pre><code> blocks
            // via highlight.js
            /*$('pre code').each(function(i, e) {
                hljs.highlightBlock(e)
            }); */
            //$.md.trigger('md_complete');

            //$('html').removeClass('md-hidden-load');

            // jump to an anchor if necessary
            //jumpToAnchor();
        }
    };
    $.md.publicMethods = $.extend ({}, $.md.publicMethods, publicMethods);

    // adds a :icontains selector to jQuery that is case insensitive
    $.expr[':'].icontains = $.expr.createPseudo(function(arg) {
        return function(elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    // set the page title to the browser document title, optionally picking
    // the first h1 element as title if no title is given
    function setPageTitle() {
        var $pageTitle = $('h1').eq(0);
        if ($.trim($pageTitle.text()).length > 0) {
            $('#md-title').prepend($pageTitle);
            var title = $pageTitle.text();
            document.title = title;
        }
    }
    function wrapParagraphText () {
        // TODO is this true for marked.js?

        // markdown gives us sometime paragraph that contain child tags (like img),
        // but the containing text is not wrapped. Make sure to wrap the text in the
        // paragraph into a <div>

		// this also moves ANY child tags to the front of the paragraph!
		$('#md-content p').each (function () {
			var $p = $(this);
			// nothing to do for paragraphs without text
			if ($.trim($p.text ()).length === 0) {
				// make sure no whitespace are in the p and then exit
				//$p.text ('');
				return;
			}
			// children elements of the p
            var children = $p.contents ().filter (function () {
                var $child =  $(this);
                // we extract images and hyperlinks with images out of the paragraph
                if (this.tagName === 'A' && $child.find('img').length > 0) {
                    return true;
                }
                if (this.tagName === 'IMG') {
                    return true;
                }
                // else
                return false;
            });
            var floatClass = getFloatClass($p);
            $p.wrapInner ('<div class="md-text" />');

            // if there are no children, we are done
            if (children.length === 0) {
                return;
            }
            // move the children out of the wrapped div into the original p
            children.prependTo($p);

            // at this point, we now have a paragraph that holds text AND images
            // we mark that paragraph to be a floating environment
            // TODO determine floatenv left/right
            $p.addClass ('md-floatenv').addClass (floatClass);
		});
	}
	function removeBreaks (){
		// since we use non-markdown-standard line wrapping, we get lots of
		// <br> elements we don't want.

        // remove linebreaks from the menu
        $('#md-menu br').remove ();

        // remove a leading <br> from floatclasses, that happen to
        // get insertet after an image
        $('.md-floatenv').find ('.md-text').each (function () {
            var $first = $(this).find ('*').eq(0);
            if ($first.is ('br')) {
                $first.remove ();
            }
        });

        // remove any breaks from image groups
        $('.md-image-group').find ('br').remove ();
    }
	function getFloatClass (par) {
		var $p = $(par);
		var floatClass = '';

		// reduce content of the paragraph to images
		var nonTextContents = $p.contents().filter(function () {
			if (this.tagName === 'IMG' || this.tagName === 'IFRAME') {
                return true;
            }
			else if (this.tagName === 'A') {
                return $(this).find('img').length > 0;
            }
			else {
				return $.trim($(this).text ()).length > 0;
			}
		});
		// check the first element - if its an image or a link with image, we go left
		var elem = nonTextContents[0];
		if (elem !== undefined && elem !== null) {
			if (elem.tagName === 'IMG' || elem.tagName === 'IFRAME') {
                floatClass = 'md-float-left';
            }
			else if (elem.tagName === 'A' && $(elem).find('img').length > 0) {
                floatClass = 'md-float-left';
            }
			else {
                floatClass = 'md-float-right';
            }
		}
		return floatClass;
	}
    // images are put in the same image group as long as there is
    // not separating paragraph between them
    function groupImages() {
        var par = $('p img').parents('p');
        // add an .md-image-group class to the p
        par.addClass('md-image-group');
    }

    function addInpageAnchors()
    {
        // adds a page inline anchor to each h1,h2,h3,h4,h5,h6 element
        // which can be accessed by the headings text (with spaces)
        // and heading text where spaces are replaced by underscores
        $('h1,h2,h3,h4,h5,h6').each (function () {
            var $heading = $(this);
            var name = $.trim ($heading.text ());
            var $anchor1 = $('<a />').attr ('name', name).addClass('md-inpage-anchor md-inpage-anchor-space');
            $heading.wrap ($anchor1);
            // replace spaces with underscores and add that anchor, too
            name = name.replace (/ /g, '_');
            var $anchor2 = $('<a />').attr ('name', name).addClass ('md-inpage-anchor md-inpage-anchor-underscore');
            $heading.wrap ($anchor2);
        });
    }
    function processPreviews () {
        // if we had a preview, we need to process it
        $('.md-preview-begin').each (function () {
            var $this = $(this);
            var $href = $this.attr ('data-href');
            var $elems = $this.nextUntil('.md-preview-end');
            $elems.find('.md-text').last().append($('<a>...Read more</a>').attr ('href', $href));
            //var lastText = $elems.find('.md-text').last();
            var $previewDiv = $('<div />').addClass('md-preview').append($elems);
            // TODO localized versions
            $this.replaceWith ($previewDiv);
        });
    }
    function markFirstHeading() {
        // TODO replace, maybe css selector magic?
        // if the page starts with a heading first or second degree,
        // mark this heading to be the first one
        var firstElem = $('#md-content').find('p, h1, h2').eq(0);
        if (firstElem.length === 0) {
            return;
        }

        if (firstElem[0].tagName === 'H1' || firstElem[0].tagName === 'H2') {
            $(firstElem).addClass('md-first-heading');
        }
    }
    function jumpToAnchor() {
        // browser behave differently when using a link with a hashtag #
        // Safari waits until JS is finished and then jumps, others dont.
        // so we explicitly jump to the hash once the page load has finished
        var hash = window.location.hash.substring (1, window.location.hash.length).toLowerCase ();
        if (hash !== undefined && hash !== null && hash.length > 0) {
            // find the anchor for that hash
            var doBreak = false;
            $('a.md-inpage-anchor').each (function () {
                var $this = $(this);
                if ($this.attr('name').toLowerCase () === hash.toLowerCase () && !doBreak) {
                    this.scrollIntoView (true);
                    //var name = $this.attr('name').toLowerCase ();
                    //window.location.hash = '#' + $this.attr ('name');
                    doBreak = true;
                    return;
                }
            });
        }
    }

}(jQuery));
