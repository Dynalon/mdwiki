FAQ
====

  * __Q: Can I open `mdwiki.html` in my browser from the menu or by specifying via a `file://` URL?__
  * A: This varies by browser:
    * Firefox: Works perfectly when using `file://` urls. Due to some bugs, some exernal resources might however fail to load.
    * Google Chrome: Works only when started with the commandline parameter `--allow-file-access-from-files`

    Note: It is usally best to use a webserver when running locally and not to use `file://` URLs as those are not yet 100% supported.

- - - - - - - - -

  * __Q: I don't want to install nginx or apache locally. What is the fastest/easiest way to setup a local HTTP server to get started with MDwiki ?__
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

  * __Q: Can sites generated from MDwiki be crawled and indexed by search engines like Google?__
    A: Yes, with some additional work. There is no user-friendly, easy solution yet, but we are working on it. Take for example [www.notesync.org] which is running MDwiki and fully indexed by google. We are still evaluating best solutions to make the same techniques easily accesible for everyone.

- - - - - - - - -

  * __Q: Why aren't there more questions in the FAQ?__
    A: Because nobody asked a question. You can do so by [opening up an issue][issues].


  [issues]: https://github.com/Dynalon/mdwiki/issues
  [www.notesync.org]: http://www.notesync.org/
