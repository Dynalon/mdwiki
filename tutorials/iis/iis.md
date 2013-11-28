Getting Started with MDwiki and IIS
===================

About
------

This tutorial will describe how to setup MDwiki and get it running on [IIS](http://iis.com).  This walkthrough assumes you have a fresh windows server setup with IIS installed.

Instructions
-------------

### Step 1.  Obtain MDwiki from [http://mdwiki.info], you can either fork and build your own, or download the precompiled release.

The precompiled release comes with a couple html files.  This walkthrough will assume you're using mdwiki.html.  

 -Copy mdwiki.html to a new folder where you want your website.  A standard spot would be ``C:\inetpub\wwww\blog\`` but any path will work.

 -Create two blank files.  The first being ``navigation.md`` and the second ``config.json``.

  The ``navigation.md`` will be used for for the navbar that appears on the top of your page, and the ``config.json`` file will be used for additional configuration within your site.  For simplicity we will just leave these blank, as they are required for your site to work.  Feel free to customize them in any way you like.

- Create a file named ``index.md``.  This will be the first markdown file that your site will show.  Customize it however you want.

For this demo we'll use this code

**index.md**
```
 ###Hello, mdWIKI###
```

Place these three newely created files into the spot you created website (``C:\inetpub\www\blog`` in our case).

Your directory should now look like so

```
    blog\
        mdWiki.html
        navigation.md
        config.json
        index.md
```

Adding your website to IIS
--------------

Within your IIS Manager in the left pane, right click sides and choose ``Add New Website...``

[![Add New Website...](images/add-new-website.png)]

In the Add New Website dialog, fill in your settings, if you're following along with the walkthrough they would look something like this (replace myblog.com with whatever your hostname is, or leave it blank to use the default server address)

[![Add New Website Dialog](images/add-new-website-dialog.png)]


Setting up the Markdown MIME Type
--------------

If your IIS is a on a fresh install you will notice it doesn't work quite yet.  That's because IIS out of the box doesn't know what to do with markdown (.md) files.  To fix this, select your website in the Sites dropdown, and Click on **MIME Types**

[![MIME Types](images/mime-types.png)]

Once your the MIME Types section is opened, click on ``Add..`` in the upper right.

[![MIME Types](images/add-mime-type.png)]

In the Add MIME type dialog give the file extension .md, with a MIME type of text/x-markdown like the picture below.

[[!MIME Type Dialog](images/mime-type-dialog.png)]

After clicking the OK button IIS will now know how to serve markdown files to mdWiki. 

Navigate to your site to see it up and running.

Customize and Enjoy!





Next step would be to add markdown files as a MIME type in IIS.  

