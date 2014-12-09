// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
'use strict';
module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // coverage reporter generates the coverage
    reporters: ['coverage', 'story'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/scripts/**/*.js': ['coverage'],
      'app/scripts/directives/templates/*.html': ['ng-html2js'],
      'app/views/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'app/'
    },

    coverageReporter: {
      type: 'lcovonly',
      dir: 'coverage/'
    },


    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/cryptojslib/rollups/hmac-sha256.js',
      'app/bower_components/cryptojslib/rollups/pbkdf2.js',
      'app/bower_components/cryptojslib/rollups/md5.js',
      'app/bower_components/cryptojslib/components/enc-base64.js',
      'app/bower_components/angular-translate/angular-translate.js',
      'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'app/bower_components/angulartics/src/angulartics.js',
      'app/bower_components/angulartics/src/angulartics-ga.js',
      'app/bower_components/ngDialog/js/ngDialog.js',
      'app/bower_components/angular-restmod/dist/angular-restmod-bundle.js',
      'app/bower_components/angular-restmod/dist/plugins/dirty.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/angular-moment/angular-moment.js',
      'app/bower_components/angular-truncate/src/truncate.js',
      'app/bower_components/angular-svg-round-progressbar/roundProgress.js',
      'app/bower_components/lodash/dist/lodash.compat.js',
      'app/scripts/initializers/modules.js',
      'app/scripts/initializers/api.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'app/scripts/directives/templates/*.html',
      'app/views/**/*.html',
      'test/helpers/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      'app/scripts/initializers/app.js',
      'app/scripts/config_sample.js'
    ],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
