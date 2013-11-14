if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo -e "Starting to update gh-pages\n"

  mkdir $HOME/mdwiki/
  cp dist/mdwiki.html $HOME/mdwiki/mdwiki-latest.html
  cp dist/mdwiki-debug.html $HOME/mdwiki/mdwiki-latest-debug.html

  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"

  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/Dynalon/mdwiki.git gh-pages > /dev/null

  cd gh-pages
  cp $HOME/mdwiki/*.html .

  #add, commit and push files
  git add -f *.html
  git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null

  echo -e "Done updating\n"
fi
