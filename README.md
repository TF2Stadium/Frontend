# TF2Stadium Frontend

TF2Stadium Frontend is the frontend server component for the
[TF2Stadium](https://tf2stadium.com) project.

It uses [AngularJS](https://angularjs.org/) as its framework,
[NPM](https://www.npmjs.com/) for package management,
[webpack](https://webpack.github.io/) for builds, and
[Karma](https://karma-runner.github.io/) for testing.

## Usage

    # Run a dev server at localhost:8080
    npm start

    # Full production build, in dist/
    npm run build
    # not-quite-production build (in dist/), but way way faster
    npm run build-dev

    # Clean up any prior builds
    npm run clean

    # Run test cases
    npm run test
    # Run test cases (and try to fix simple issues)
    npm run test-browsers

    # Style-check the source code
    npm run lint
    # Style-check the source code (and try to fix simple issues)
    npm run lint-fix

## Installation

Have `git`, `node`, and `npm` installed, and then follow these steps:

    # Download this repository via git
    git clone https://github.com/TF2Stadium/Frontend.git
    # or download a zip from: https://github.com/TF2Stadium/Frontend/archive/master.zip
    # Move to the fetched directory
    cd Frontend
    # Install dependencies
    npm install

VERY IMPORTANT: copy the `app.config.template.json` to
`app.config.json` and replace the placeholders with your setup.

## Development

    # Start a new feature branch, based on dev
    git checkout -b my-feature dev

    # Start a dev server and make your changes
    npm start

    # Test them, these should pass with 0 issues:
    npm run lint
    npm run test

    # Silly whitespace errors? This can fix most of them:
    npm run lint-fix

    # Commit your changes
    git commit -m "I did some cool stuff"
    git push my-github my-feature

## License

Source code released under the
[GPLv3 License (GPLv3)](https://github.com/TF2Stadium/Frontend/blob/master/LICENSE).

The assets have a variety of licenses, see `src/assets/README.md` for
their licensing information.
