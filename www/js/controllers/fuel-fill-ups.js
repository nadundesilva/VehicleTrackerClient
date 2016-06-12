angular.module('app.controllers')

.controller('fuelFillUpsCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  $scope.$on('$ionicView.beforeEnter', function() {
    // Initializing variables
    $scope.selected_vehicle = {};
    $scope.selected_vehicle.license_plate_no = null;

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 1);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.triggerAnimation();

    // Loading license plate nos
    $scope.showLoadingOverlay('Retrieving Vehicles');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/name/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.vehicles = response.data.owned_vehicles;
          $scope.vehicles = $scope.vehicles.concat(response.data.managed_vehicles);
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
        $scope.hideLoadingOverlay();
      }, function (response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
  });

  $scope.loadFuelFillUps = function() {
    $scope.showLoadingOverlay('Retrieving Fuel Fill Ups');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.selected_vehicle.license_plate_no + '/fuel-fill-up/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.fuel_fill_ups = response.data.fuel_fill_ups;
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
        $scope.hideLoadingOverlay();
      }, function (response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
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
