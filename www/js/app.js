angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ionMdInput', 'ionic-material'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $cordovaToast) {
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

  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }
    else if ($ionicHistory.backView() != null) {
      $ionicHistory.backView().go();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      $cordovaToast.showShortBottom("Press back button again to exit");
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      }, 2000);
    }
    e.preventDefault();
    return false;
  }, 101);

  $rootScope.APP_NAME = 'Vehicle Manager';

  //Setting constants
  $rootScope.USERNAME_KEY = 'username';
  $rootScope.PASSWORD_KEY = 'password';
  $rootScope.ONLINE_MODE_KEY = 'online_mode';

  $rootScope.MAIN_SERVER_URL = 'http://10.0.2.2/VehicleTracker/web';
  // $rootScope.MAIN_SERVER_URL = 'http://192.168.1.3/VehicleTracker/web';
  // $rootScope.MAIN_SERVER_URL = 'https://nadundesilva-vehicle-tracker.herokuapp.com';
});
