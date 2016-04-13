angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //Setting constants
  $rootScope.USERNAME_KEY = 'username';
  $rootScope.PASSWORD_KEY = 'password';
  $rootScope.ONLINE_MODE_KEY = 'online_mode';

  $rootScope.MAIN_SERVER_URL = 'http://192.168.1.3/symfony/vehicle_tracker/web';
  //$rootScope.MAIN_SERVER_URL = 'https://nadundesilva-vehicle-tracker.herokuapp.com';
});
