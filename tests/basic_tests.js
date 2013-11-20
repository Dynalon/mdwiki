var local_url = 'http://localhost:9000/mdwiki-debug.html';
var live_url = 'http://dynalon.github.io/mdwiki/index.html';
var live_debug_url = 'http://dynalon.github.io/mdwiki/mdwiki-latest-debug.html';

// change to test the website
var url = local_url;

module.exports = {
    'It has a title': function (test) {
        test
        .open(url)
        .waitForElement('#start-tests')
        .assert.title().is('MDwiki - Markdown based wiki done 100% on the client via javascript', 'It has title')
        .done();

    },
    'It has a bootstrap navigation menu at the top': function (test) {
        test
        .open(url)
        .waitForElement('#start-tests')
        .assert.exists('ul.nav')
        .done();
    },
    'It has the page brand set correctly': function (test) {
        test
        .open(url)
        .waitForElement('#start-tests')
        .assert.exists('a.navbar-brand')
        .assert.text('a.navbar-brand', 'MDwiki')
        .done();
    }
};
