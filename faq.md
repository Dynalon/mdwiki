FAQ
====

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

  - - - - - - - - -

  * __Q: Can sites generated from MDwiki be crawled and indexed by search engines like Google?__
    A: Yes, with some additional work. There is no user-friendly, easy solution yet, but we are working on it. Take for example [www.notesync.org] which is running MDwiki and fully indexed by google. We are still evaluating best solutions to make the same techniques easily accesible for everyone.

  - - - - - - - - -

  * __Q: Why aren't there more questions in the FAQ?__
    A: Because nobody asked a question. You can do so by [opening up an issue][issues].


  [issues]: https://github.com/Dynalon/mdwiki/issues
  [www.notesync.org]: http://www.notesync.org/
