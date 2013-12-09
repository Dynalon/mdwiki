FAQ
====

  * ### Q: Can I open `mdwiki.html` in my browser from the menu or by specifying via a `file://` URL?
  * A: Yes, at least for most browsers. There are some gimmicks that won't work on some browsers. List of browser that support opening MDwiki via `file://` urls:

    * Firefox (v23): Works good, no issues known.
    * Internet Explorer (v10): Works good, no issues known.
    * Google Chrome: Works only when started with the commandline parameter `--allow-file-access-from-files`. Even then, Chrome has minor issues. I.e. the math gimmick will not render correctly.
    * Safari: Does not work. Maybe cmdline flag needed as in Chrome?

Note: It is usally best to use a webserver when running locally and not to use `file://` URLs as those are not yet 100% supported by every gimmick or third-party script.

Gimmicks that won't work when using `file://` urls:

  * Facebok Likebutton (problem with their Cross-Origin setting?)
  * Disqus (hardcoded `//`-prefixed urls in their scripts)

- - - - - - - - -

  * ### Q: I don't want to install nginx or apache locally. What is the fastest/easiest way to setup a local HTTP server to get started with MDwiki ?
  * A: If you are on OS X or Linux, just use the `SimpleHTTPServer` that comes with python. To start a server on port 8080, run this command from within the folder where your `mdwiki.html` is located:

  ```bash
  python -m SimpleHTTPServer 8080
  ```
  Another good choices is node.js `http-server` server:

  ```bash
  npm install -g http-server
  http-server
  ```

  Both will then listen on port 8080 on your local machine.

- - - - - - - - -

  * ### Q: Can sites generated from MDwiki be crawled and indexed by search engines like Google?
  *  A: Yes, with some additional work. There is no user-friendly, easy solution yet, but we are working on it. Take for example [www.notesync.org] which is running MDwiki and fully indexed by google. We are still evaluating best solutions to make the same techniques easily accesible for everyone.

  [issues]: https://github.com/Dynalon/mdwiki/issues
  [www.notesync.org]: http://www.notesync.org/
