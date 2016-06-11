angular.module('app.controllers')

.controller('driversCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, $filter, ionicMaterialMotion, ionicMaterialInk) {
  // Initialization
  $scope.$on('$ionicView.beforeEnter', function() {
    // Initializing variables
    $scope.search_key = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 1);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.triggerAnimation();

    // Loading vehicles
    $scope.showLoadingOverlay('Retrieving Drivers');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $stateParams.license_plate_no + '/driver/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.drivers = response.data.drivers;
        } else if (response.data.status == 'USER_NOT_LOGGED_IN') {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('You have to login first');
          $state.go('menu.home', {}, {location: "replace", reload: true});
        } else {
          console.log(response.data.status);
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.hideLoadingOverlay();
        $scope.triggerAnimation();
      }, function (response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
  });

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
