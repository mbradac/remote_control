# Remote Control
App to control computer via mobile phone by using your phone's screen as a
touchpad and a keyboard instead of physical ones. App consists of two parts:
server part that should be run on the computer you wish to control and client
part that should be run on your mobile phone.

## Server
Server part is coded in python3.5 and uses pipenv for dependency management.
After installing pipenv and appropriate python version (if not supported on your
system you can use pyenv) you can run `pipenv install` in server folder to
install dependencies and then run the server with command `pipenv run python
main.py` If you run command on remote computer (e.g. over ssh) remember
to set `DISPLAY` variable for expected results, e.g. `DISPLAY=:0 pipenv run
python main.py`.

## Client
Client app uses react native framework. You can build it and run it on your
devices as you would any other react native app that contains native code.
See `Bulding projects with native code` on page
https://facebook.github.io/react-native/docs/getting-started.html for details.
App is currently only written for Android devices, although only small changes
would be needed to run it on iOS.
