// Karma configuration
// Generated on Tue Sep 23 2014 11:12:25 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',
  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['jasmine'],
  // frameworks: ['ng-scenario','jasmine'], //so we can use the 'browser' call in the tests

  // list of files / patterns to load in the browser
  files: [
    '../components/scripts/lib/angular/angular.js',
    '../components/scripts/lib/angular-route/angular-route.js',
    '../components/scripts/lib/angular-mocks/angular-mocks.js',
    '../components/scripts/lib/angular-resource/angular-resource.js',
    '../components/scripts/lib/angular-animate/angular-animate.js',
    '../components/scripts/lib/angular-cookies/angular-cookies.js',
    '../components/scripts/app/**/*.js',
    'unit/*.js'
  ],


  // list of files to exclude
  exclude: [
  ],


  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
  },


  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['progress'],


  // web server port
  port: 9876,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: config.LOG_INFO,


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,


  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['Firefox'],


  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false

  });
};
