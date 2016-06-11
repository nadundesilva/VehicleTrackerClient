angular.module('app.controllers')

.controller('addEditVehicleCtrl', function($stateParams, $scope, $rootScope, $http, $cordovaToast, $ionicHistory, $state, ionicMaterialInk, ionicMaterialMotion) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Initializing variables
    $scope.mode = $stateParams.mode;
    $scope.vehicle = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(false);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    if($stateParams.mode == 'EDIT') {
      $scope.vehicle.name = $stateParams.name;
      $scope.vehicle.license_plate_no = $stateParams.license_plate_no;
      $scope.original_license_plate_no = $stateParams.license_plate_no;
      $scope.vehicle.description = $stateParams.description;
      $scope.vehicle.fuel_one = $stateParams.fuel_one;
      if($stateParams.fuel_two != null) {
        $scope.vehicle.bi_fuel = true;
        $scope.vehicle.fuel_two = $stateParams.fuel_two;
      } else {
        $scope.vehicle.bi_fuel = false;
      }
      $scope.vehicle.make = $stateParams.make;
      $scope.vehicle.model = $stateParams.model;
      $scope.vehicle.year = parseInt($stateParams.year);
    } else {
      $scope.vehicle.name = null;
      $scope.vehicle.license_plate_no = null;
      $scope.vehicle.description = null;
      $scope.vehicle.bi_fuel = false;
      $scope.vehicle.fuel_one = null;
      $scope.vehicle.fuel_two = null;
      $scope.vehicle.make = null;
      $scope.vehicle.model = null;
      $scope.vehicle.year = null;
    }
  });

  $scope.addUpdateVehicle = function() {
    if ($scope.vehicle.name == null ||
      $scope.vehicle.license_plate_no == null ||
      $scope.vehicle.fuel_one == null ||
      ($scope.vehicle.bi_fuel && $scope.vehicle.fuel_two == null) ||
      $scope.vehicle.make == null ||
      $scope.vehicle.model == null ||
      $scope.vehicle.year == null) {
      $cordovaToast.showShortBottom('Name, license plate, fuel type, make, model and year are required');
    } else {
      $scope.showLoadingOverlay(($stateParams.mode == 'ADD' ? 'Creating' : 'Updating') + ' Vehicle');
      var method;
      if($stateParams.mode == 'ADD') {
        method = 'POST';
      } else {
        method = 'PUT';
      }
      $http({
        method : method,
        url : $rootScope.MAIN_SERVER_URL + '/vehicle/' + ($stateParams.mode == 'ADD' ? '' : $scope.original_license_plate_no + '/'),
        data : { vehicle: $scope.vehicle }
      }).then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaToast.showShortBottom('Vehicle ' + ($stateParams.mode == 'ADD' ? 'creation' : 'update') + ' successful');
          if($stateParams.mode == 'EDIT') {
            $ionicHistory.backView().stateParams = {license_plate_no: $scope.vehicle.license_plate_no};
            $ionicHistory.backView().stateId = $ionicHistory.backView().stateName + "_license_plate_no=" + $scope.vehicle.license_plate_no;
          }
          $ionicHistory.backView().go();
        } else if (response.data.status == 'USER_NOT_LOGGED_IN') {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('You have to login first');
          $state.go('menu.home', {}, {location: "replace", reload: true});
        } else if (response.data.status == 'VEHICLE_DUPLICATE_LICENSE_PLATE_NO') {
          $cordovaToast.showShortBottom('License plate number already exists');
        } else {
          alert(response.data.status);
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.hideLoadingOverlay();
      }, function(response) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
    }
  };
});
