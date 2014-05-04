#!/bin/bash

# fail on first error
set -e

STABLE_VERSION="v0.6"
UNSTABLE_VERSION="v0.7"

# don't do anything on pull requests
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    exit 0
fi

mkdir $HOME/mdwiki/
cp dist/mdwiki.html $HOME/mdwiki/mdwiki-latest.html
cp dist/mdwiki-debug.html $HOME/mdwiki/mdwiki-latest-debug.html

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"
cd $HOME

echo -e "Updating mdwiki website with latest version"

git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/Dynalon/mdwiki.git gh-pages > /dev/null
cd gh-pages

IS_STABLE=`head -n 10 $HOME/mdwiki/mdwiki-latest.html |grep $STABLE_VERSION`
IS_UNSTABLE=`head -n 10 $HOME/mdwiki/mdwiki-latest.html |grep $UNSTABLE_VERSION`

if [ IS_STABLE ]; then
    cp $HOME/mdwiki/*.html .
    git add -f *.html
fi

if [ IS_UNSTABLE ]; then
    cp $HOME/mdwiki/mdwiki-latest.html ./unstable/index.html
    cp $HOME/mdwiki/mdwiki-latest-debug.html ./unstable/index-debug.html
    git add -f unstable/*.html
fi

# add, commit and push files
git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
git push -fq origin gh-pages > /dev/null

echo -e "Done updating main mdwiki website\n"

# Update MDwiki Seed project with latest *stable* version of MDwiki (which is the index.html we use
# for the MDwiki website)

if [ IS_STABLE ]; then
    echo -e "Updating mdwiki-seed with latest stable version"
    cd $HOME
    git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/Dynalon/mdwiki-seed.git gh-pages-seed > /dev/null
    cd gh-pages-seed

    # in mdwiki-seed we don't use index.html but mdwiki.html and leave it up to the user to rename
    cp $HOME/gh-pages/index.html ./mdwiki.html
    git add -f *.html
    git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
    git push -fq origin gh-pages
    echo -e "Successfully updated mdwiki-seed with latest stable version"
fi
