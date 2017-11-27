(function($) {
    var prismGimmick = {
        name: 'prism',
        load: function() {
            $.md.stage('gimmick').subscribe(function(done) {
                prism_highlight();
                done();
            });
        }
    };
    var supportedLangs = [
        "abap",
        "actionscript",
        "apacheconf",
        "apl",
        "applescript",
        "asciidoc",
        "aspnet",
        "autohotkey",
        "autoit",
        "bash",
        "basic",
        "batch",
        "bison",
        "brainfuck",
        "c",
        "clike",
        "coffeescript",
        "core",
        "cpp",
        "crystal",
        "csharp",
        "css",
        "css",
        "d",
        "dart",
        "diff",
        "docker",
        "eiffel",
        "elixir",
        "erlang",
        "fortran",
        "fsharp",
        "gherkin",
        "git",
        "glsl",
        "go",
        "groovy",
        "haml",
        "handlebars",
        "haskell",
        "haxe",
        "http",
        "icon",
        "inform7",
        "ini",
        "j",
        "jade",
        "java",
        "javascript",
        "json",
        "jsx",
        "julia",
        "keyman",
        "kotlin",
        "latex",
        "less",
        "lolcode",
        "lua",
        "makefile",
        "markdown",
        "markup",
        "matlab",
        "mel",
        "mizar",
        "monkey",
        "nasm",
        "nginx",
        "nim",
        "nix",
        "nsis",
        "objectivec",
        "ocaml",
        "oz",
        "parigp",
        "parser",
        "pascal",
        "perl",
        "php",
        "powershell",
        "processing",
        "prolog",
        "puppet",
        "pure",
        "python",
        "q",
        "qore",
        "r",
        "rest",
        "rip",
        "roboconf",
        "ruby",
        "rust",
        "sas",
        "sass",
        "scala",
        "scheme",
        "scss",
        "smalltalk",
        "smarty",
        "sql",
        "stylus",
        "svg",
        "swift",
        "tcl",
        "textile",
        "twig",
        "typescript",
        "verilog",
        "vhdl",
        "vim",
        "wiki",
        "xml",
        "yaml",
    ];
    $.md.registerGimmick(prismGimmick);

    function prism_highlight () {
        // marked adds lang-ruby, lang-csharp etc to the <code> block like in GFM
        var $codeblocks = $('pre code[class^=lang-]');
        $codeblocks.each(function() {
                var $this = $(this);
                var classes = $this.attr('class');
                var lang = classes.substring(5);
                if (supportedLangs.indexOf(lang) < 0) {
                    return;
                }
                $this.removeClass(classes);
                $this.addClass('language-' + lang);            
              });
        Prism.highlightAll();
    }
}(jQuery));
