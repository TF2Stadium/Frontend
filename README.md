#TF2Stadium Frontend

TF2Stadium Frontend is the frontend server component for the [TF2Stadium](tf2stadium.com) project.

It uses [AngularJS](https://angularjs.org/) as its framework, [Gulp](http://gulpjs.com) for the enviroment automation and [Bower](http://bower.io) for managing dependencies.

##Requirements

* [NodeJS](http://nodejs.org).
* [Gulp](http://gulpjs.com). Install with `npm install -g gulp`
* [Bower](http://bower.io). Install with `npm install -g bower`

##Installation

1. Make sure you installed all the dependencies above.
2. Clone the the git repository. If you're using git, just run `git clone https://github.com/TF2Stadium/Frontend.git`. Otherwise, get it from [here](https://github.com/TF2Stadium/Frontend/archive/master.zip) and unpack it somewhere in your drive.
3. Change to the directory to where you cloned the repository and execute `npm install` (or `npm install --production` if you only want to build it) and `bower install` to install dependencies
4. Execute `npm install` and `bower install`
5. In the directory `src/app`, copy the `app.config.js.template` to `app.config.js` and replace the placeholders with your setup.

##Use

* Execute `gulp serve` and and a Webbrowser Tab should open. This needs a full npm dependency installation (`npm install`); using `npm install --production` will result in a missing module error.
* Execute `gulp` or `gulp build` when you want to build the project. It will output the files to `dist/`.

##Development

After making changes, run `gulp lint` to check for common errors or whitespace formatting issues. Most simple formatting errors can be automatically fixed with `gulp lint-fix`.

##License

Released under the [GPLv3 License (GPLv3)](https://github.com/TF2Stadium/Frontend/blob/master/LICENSE).

The assets have a variety of licenses, see src/assets/README.md for
their licensing information.
