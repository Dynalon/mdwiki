Hosting on GitHub
=================

Attention: This tutorial is incomplete. Please help completing it for beginner users by [contributing][contribute].

About
------


This tutorial describes how to setup a public website using MDwiki  which is hosted through [GitHub][GitHub]. GitHub is a perfect choice for hosting, and the MDwiki project website located at <http://www.mdwiki.info> is also hosted on GitHub.

[![Github logo](githublogo.png)](http://www.github.com)

The advantages on using GitHub for your website or wiki:

* Other people can make changes to your Markdown files and help extend the wiki
* You still can review changes first and decide whether or not to accept those changes (which are called _pull request_ in GitHub terms)
* The whole service is free
* Hosting is fast and reliable
* You can optionally use your own domain

[GitHub]: http://www.github.com

Steps
------

### Step 1: Get a GitHub account

You can sign up with GitHub at <http://www.github.com/signup>.

### Step 2: Fork mdwiki-seed

We have set up a [minimal example MDwiki installation](https://github.com/Dynalon/mdwiki-seed) that you can use as a starting point. Included is the latest MDwiki release and some example Markdown that is easy to understand.  Follow the link and click the "fork" button to get your own copy.

Now you should be able to see an index page at http://username.github.io/mymdwiki/mdwiki.html#!index.md, where username is your Github account name.  It may take up to ten minutes for this to be available.

### Step 3: Edit your forked version of MDwiki seed
Clone your fork and make some changes.  For instance, you may wish to

    git mv mdwiki.html index.html
    
as this will allow you to omit mdwiki.html from the URLs for your pages.

### Step 4: Push changes back

### Step 5: Setup your own domain

### Additional notes

Note: This tutorial is incomplete. Please help completing it for beginner users by [contributing][contribute].


[contribute]: /contribute.md
