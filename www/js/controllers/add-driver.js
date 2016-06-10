angular.module('app.controllers')

.controller('addDriverCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, $filter, ionicMaterialMotion, ionicMaterialInk) {
  // Initializing variables
  $scope.search_key = {};
  $scope.searching = false;

  // Initialization
  $scope.$on('$ionicView.beforeEnter', function() {
    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.triggerAnimation();
  });

  $scope.search = function() {
    // Loading vehicles
    $scope.searching = true;
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $stateParams.license_plate_no + '/driver/user/' + $scope.search_key.name + '/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.users = response.data.users;
          $scope.triggerAnimation();
        } else if (response.data.status == 'USER_NOT_LOGGED_IN') {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('You have to login first');
          $state.go('menu.home', {}, {location: "replace", reload: true});
        } else {
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.searching = false;
      }, function (response) {
        $cordovaToast.showShortBottom('Connection error');
        console.log(response.data.message);
        $scope.searching = false;
      });
  };

  $scope.triggerAnimation = function () {
    // Set Motion
    $timeout(function () {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);
    $timeout(function () {
      ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 4000
      });
    }, 700);
  };
});
