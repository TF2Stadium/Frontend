# TF2Stadium Frontend

TF2Stadium Frontend is the frontend server component for the
[TF2Stadium](https://tf2stadium.com) project.

It uses [AngularJS](https://angularjs.org/) as its framework,
[NPM](https://www.npmjs.com/) for package management,
[webpack](https://webpack.github.io/) for builds, and
[Karma](https://karma-runner.github.io/) for testing.

## Developer Quickstart

Have `git`, `node` (v18.12.1), and `npm` (v9.2.0) installed, and then
follow these steps:

    # Download this repository via git
    git clone https://github.com/TF2Stadium/Frontend.git
    cd Frontend

    # Install dependencies
    npm install

    # Update API_ENDPOINT and WS_ENDPOINT
    cp app.config.template.json app.config.json
    $EDITOR app.config.json

    # Run a dev server at localhost:8080
    npm start

## Configuration

The frontend is configured in app.config.json. A template is
provided. `SENTRY_ENDPOINT` and `DISCORD_LINK` are optional and not
required for development.

The easiest way to get a backend running is to use our docker-compose
templates at https://github.com/TF2Stadium/docker. If you use that dev
setup, then you just need to set `API_ENDPOIONT` to
`http://localhost:4001/` and `WS_ENDPOINT` to
`ws://localhost:4001/websocket/`.

## More tasks

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

## Development

    # Start a new feature branch, based on dev
    git checkout -b my-feature dev

    # Start a dev server and make your changes
    npm start

    # Test them, these should pass with 0 issues:
    npm run lint

    # TODO: Tests are broken temporarily
    # npm run test

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
