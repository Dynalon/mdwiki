# MDwiki

[About](index.md)

[Docs]()

  * [Quickstart](quickstart.md)
  * [Layout](layout.md)
  * [FAQ](faq.md)
  - - - -
  * # Advanced
  * [Customizing](customizing.md)

[Gimmicks](gimmicks.md)

[Tutorials]()

  * [About the Tutorials](tutorials.md)
  - - - -
  * [Hosting with GitHub](tutorials/github.md)
  * [Use with Dropbox](tutorials/dropbox.md)
  * [Set up MDwiki on IIS](tutorials/iis/iis.md)

[Examples](examples.md)
[Download](download.md)
[Contribute](contribute/index.md)
[Forum](forum.md)


[gimmick:theme (inverse: false)](spacelab)

[gimmick:ThemeChooser](Change theme)

[gimmick:forkmeongithub](http://github.com/Dynalon/mdwiki/)

<!-- counter pixel for counting visitors -->
<!-- <img src="http://stats.markdown.io/mdwiki_info.gif" style="display:none;"/> -->

<script>
$(document).ready(function() {
  $.md.stage('all_ready').subscribe(function (done) {
    var warning="";
    warning+="ATTENTION: This is the unstable MDwiki website. For documentation of the latest stable ";
    warning+="MDwiki please see <a href='http://www.mdwiki.info'>the stable documentation.</a>";

    $('#md-content').prepend($('<div class="alert alert-danger">' + warning + '</div>'));
    done();
  });
});
</script>

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-44627253-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

