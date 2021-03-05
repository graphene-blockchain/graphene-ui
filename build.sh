cd $TRAVIS_BUILD_DIR
unamestr=`uname`
echo TRAVIS_BRANCH=$TRAVIS_BRANCH

## Build the hash wallet if wer're on Linux
if [ "$unamestr" == 'Linux' ]
then
    npm run build-hash
fi
## Build the binaries if this is a release tag
if [ $TRAVIS_TAG ]
then
    npm run-script package
fi
