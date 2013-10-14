Layout
======

Page layout
-------------
All pages should start with a 1st heading, which is turned into the page title. To devide the page into sections, use 2nd degree headings. All 2nd degree headings will end up in the side menu for in-page navigation:

```markdown
Heading
=======

Section 1
---------

[...]

Section 2
---------

[...]
```
- - -

Image floating
--------------
Standard Markdown provides no way to influence the layout of your resulting website, like floating of images. To enable you to do so anyway, MDwiki interprets the presence (or absence) of blank lines between images and paragraphs in a special way that allows text flows like in newspapers.

### Floating to the left

If the image(s) are placed at the top of the paragraph, *without* any blank line between the image(s) and the paragraph, the image(s) will float left.

    ![](http://placekitten.com/g/800/800)
    The above image floats left to this text.
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

Example:

![](http://placekitten.com/g/800/800)
*To the left you will find an image that this text flows around to*. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. [Typi non habent claritatem](#) insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decim
Lorem ipsum dolor sit amet, it *esse* molestie consequat dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet **doming** id quod mazim placerat facer possim assum. Typi non habent claritatem *kursiv* consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobor

### Floating to the right

If the image(s) are placed at the bottom of the paragraph, *without* any blank line between the image(s) and the paragraph, the image(s) will float right.

    The images below float right to this text.
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
    ![](http://placekitten.com/g/600/600)
    ![](http://placekitten.com/g/600/600)

*To the right you will find two images, that are floated*. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
![](http://placekitten.com/g/600/600)
![](http://placekitten.com/g/600/600)

### No floating

A blank line before or after the image(s) disables any floating.

Source:

    ![](http://placekitten.com/g/600/350)
    ![](http://placekitten.com/g/600/350)

    This text is preceded by two images, that span across the whole Page width.

![](http://placekitten.com/g/600/350)
![](http://placekitten.com/g/600/350)

*This text is preceeded by two images, that span across the whole Page width*.
ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio [dignissim qui blandit praesent](#) luptatum zzril delenit augue duis dolore te feugait nulla facilisi. nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. investigationes demonstraverunt lectores legere me lius [quod ii legunt](#) saepius. claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decim.


### Mixing floats it all together

![](http://placekitten.com/g/600/400)
![](http://placekitten.com/g/600/400)
ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio [dignissim qui blandit praesent](#).
magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros.

ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio [dignissim qui blandit praesent](#)
ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio [dignissim qui blandit praesent](#)
![](http://placekitten.com/g/560/450)
![](http://placekitten.com/g/560/450)

![](http://placekitten.com/g/700/580)
luptatum zzril delenit augue duis dolore te feugait nulla facilisi. nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. investigationes demonstraverunt lectores legere me lius [quod ii legunt](#) saepius. claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decim.
luptatum zzril delenit augue duis dolore te feugait nulla facilisi. nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. investigationes demonstraverunt lectores legere me lius [quod ii legunt](#) saepius. claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decim.

![](http://placekitten.com/g/540/450)
![](http://placekitten.com/g/435/450)
![](http://placekitten.com/g/420/340)
