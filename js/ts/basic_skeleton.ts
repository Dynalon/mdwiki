
/* TODO:
    Split this out into:
      * tasks that need to be done as part of markdown postprocessing
      * plugins that are independent from out HTML creation process (TOC, jumplinks, image links etc.)
      * move to the according places
*/

module MDwiki.Legacy {

    export class PageSkeleton {
        config: any;
        domElement: JQuery;

        constructor(config: any, domElement: Node) {
            this.domElement = $(domElement);
            this.config = config;
        }

        createBasicSkeleton() {
            this.setPageTitle();
            this.wrapParagraphText();
            this.linkImagesToSelf();
            this.groupImages();
            this.removeBreaks();
            this.addInpageAnchors();

            return;
        }

        // set the page title to the browser document title, optionally picking
        // the first h1 element as title if no title is given
        private setPageTitle() {
            var title = this.config.title;
            var $pageTitle = this.domElement.find('h1').eq(0);
            if ($.trim($pageTitle.toptext()).length > 0) {
                this.domElement.find('#md-title').prepend($pageTitle);
                title = $pageTitle.toptext();
                // document.title = title;
            } else {
                this.domElement.find('#md-title').remove();
            }
        }

        private wrapParagraphText() {
            // TODO is this true for marked.js?

            // markdown gives us sometime paragraph that contain child tags (like img),
            // but the containing text is not wrapped. Make sure to wrap the text in the
            // paragraph into a <div>
            var self = this;
            // this also moves ANY child tags to the front of the paragraph!
            this.domElement.find('p').each(function() {
                var $p = $(this);
                // nothing to do for paragraphs without text (still needed?)
                if ($.trim($p.text()).length === 0) {
                    // make sure no whitespace are in the p and then exit
                    //$p.text ('');
                    return;
                }
                // select images & hyperlinked images within a paragraph
                var image_children = $p.contents().filter(function () {
                    var $child = $(this);
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
                            
                // images & hyperlinked images within a paragraph always go first/last of the paragraph
                // so we apply the corresponding float classes

                //Create a bug that add div in code blocks
                var templ = new Template('layout/paragraph');
                var $inserted_node = templ.insertAfter($p);

                var floatClass = self.getFloatClass($p);
                if (floatClass == "md-float-left")
                    $inserted_node.find(".md-paragraph-intro").append(image_children);
                if (floatClass == "md-float-right")
                    $inserted_node.find(".md-paragraph-outro").append(image_children);

                $inserted_node.find("p").append($p.contents());
                $p.remove();
                // at this point, we now have a paragraph that holds text AND images
                // we mark that paragraph to be a floating environment
            });
        }

        private removeBreaks() {
            // since we use non-markdown-standard line wrapping, we get lots of
            // <br> elements we don't want.

            // remove a leading <br> from floatclasses, that happen to
            // get insertet after an image
            this.domElement.find('.md-floatenv').find('.md-text').each(function () {
                var $first = $(this).find('*').eq(0);
                if ($first.is('br')) {
                    $first.remove();
                }
            });

            // remove any breaks from image groups
            this.domElement.find('.md-image-group').find('br').remove();
        }

        private getFloatClass(par) {
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
                    return $.trim($(this).text()).length > 0;
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
        private groupImages() {
            var par = this.domElement.find('p img').parents('p');
            // add an .md-image-group class to the p
            par.addClass('md-image-group');
        }

        // takes a standard <img> tag and adds a hyperlink to the image source
        // needed since we scale down images via css and want them to be accessible
        // in original format
        private linkImagesToSelf() {
            var self = this;
            function selectNonLinkedImages() {
                // only select images that do not have a non-empty parent link
                $images = self.domElement.find('img').filter(function (index) {
                    var $parent_link = $(this).parents('a').eq(0);
                    if ($parent_link.length === 0) return true;
                    var attr = $parent_link.attr('href');
                    return (attr && attr.length === 0);
                });
                return $images;
            }

            var $images = selectNonLinkedImages();
            return $images.each(function () {
                var $this = $(this);
                var img_src = $this.attr('src');
                var img_title = $this.attr('title');
                if (img_title === undefined) {
                    img_title = '';
                }
                // wrap the <img> tag in an anchor and copy the title of the image
                $this.wrap('<a class="md-image-selfref" href="' + img_src + '" title="' + img_title + '"/> ');
            });
        }

        private addInpageAnchors() {
            var config = this.config;
            // adds a pilcrow (paragraph) character to heading with a link for the
            // inpage anchor
            function addPilcrow($heading, href) {
                var c = config.anchorCharacter;
                var $pilcrow = $('<span class="anchor-highlight"><a>' + c + '</a></span>');
                $pilcrow.find('a').attr('href', href);
                $pilcrow.hide();
                var mouse_entered = false;
                $heading.mouseenter(function () {
                    mouse_entered = true;
                    MDwiki.Utils.Util.wait(300).then(function () {
                        if (!mouse_entered) return;
                        $pilcrow.fadeIn(200).css('display', 'inline');
                    });
                });
                $heading.mouseleave(function () {
                    mouse_entered = false;
                    $pilcrow.fadeOut(200);
                });
                $pilcrow.appendTo($heading);
            }
            // adds a link to the navigation at the top of the page
            function addJumpLinkToTOC($heading) {
                if (config.pageMenu && config.pageMenu.disable !== false) return;

                function supportedHeading(heading) {
                    var autoAnchors = config.pageMenu.useHeadings.split(',');
                    var supported = false;

                    $(autoAnchors).each(function (i, e:any) {
                        if (heading.toLowerCase() === e.toLowerCase()) {
                            supported = true;
                        }
                    });

                    return supported;
                }
                
                if (!supportedHeading($heading.prop("tagName"))) return;
                var c = config.pageMenu.returnAnchor;

                if (c === '')
                    return;

                //Jumping to top not working
                /*var $jumpLink = $('<a class="visible-xs visible-sm jumplink" href="#md-page-menu">' + c + '</a>');
                $jumpLink.click((ev) => {
                    ev.preventDefault();
                    this.domElement.find('body').scrollTop(this.domElement.find('#md-page-menu').position().top);                   
                });

                if ($heading.parents('#md-menu').length === 0) {
                    $jumpLink.insertAfter($heading);
                }*/
            }

            // adds a page inline anchor to each h1,h2,h3,h4,h5,h6 element
            // which can be accessed by the headings text
            this.domElement.find('h1,h2,h3,h4,h5,h6').not('#md-title h1').each(function () {
                var $heading = $(this);
                $heading.addClass('md-inpage-anchor');
                var text = $heading.clone().children('.anchor-highlight').remove().end().text();
                var href = MDwiki.Utils.Util.getInpageAnchorHref(text);
                addPilcrow($heading, href);

                //add jumplink to table of contents
                addJumpLinkToTOC($heading);
            });
        }
    }
    
    $.md.scrollToInPageAnchor = function(anchortext) {
        if (anchortext.startsWith ('#'))
            anchortext = anchortext.substring (1, anchortext.length);
        // we match case insensitive
        var doBreak = false;
        $('.md-inpage-anchor').each (function () {
            if (doBreak) { return; }
            var $this = $(this);
            // don't use the text of any subnode
            var text = $this.toptext();
            var match = util.getInpageAnchorText (text);
            if (anchortext === match) {
                this.scrollIntoView (true);
                var navbar_offset = $('.navbar-collapse').height() + 5;
                window.scrollBy(0, -navbar_offset + 5);
                doBreak = true;
            }
        });
    };
}
