angular.module('app.controllers')

.controller('generateReportCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk, sharedData) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.report_criteria = {};
    $scope.type = {};
    $scope.selected_vehicles = [];
    $scope.specific_vehicle = {};
    $scope.selected_drivers = [];
    $scope.date = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

  });

  $scope.generateReport = function() {
    $scope.generateSelectedLists();
    var reportData = sharedData.getData();

    if ($scope.type.main == null || $scope.type.sub == null) {
      $cordovaToast.showShortBottom('The main category and the sub category are required');
    } else if ($scope.type.main == "COST") {
      if ($scope.type.sub == "FUEL_CONSUMPTION") {
        if ($scope.selected_vehicles.length == 0) {
          $cordovaToast.showShortBottom('Vehicle required for report generation');
        } else {
          reportData.criteria = {};
          reportData.criteria.date = $scope.date;
          reportData.criteria.vehicles = $scope.selected_vehicles;
          $state.go('menu.report', { type : 'FUEL_CONSUMPTION' });
        }
      } else if ($scope.type.sub == "MISC_COST") {
        if ($scope.selected_vehicles.length == 0) {
          $cordovaToast.showShortBottom('Vehicle required for report generation');
        } else {
          reportData.criteria = {};
          reportData.criteria.date = $scope.date;
          reportData.criteria.vehicles = $scope.selected_vehicles;
          $state.go('menu.report', { type : 'AGGREGATE_MISC_COST' });
        }
      }
    } else if ($scope.type.main == "VEHICLE") {
      if ($scope.type.sub == "MISC_COST") {
        if ($scope.specific_vehicle.license_plate_no == null) {
          $cordovaToast.showShortBottom('Vehicle required for report generation');
        } else {
          reportData.criteria = {};
          reportData.criteria.date = $scope.date;
          reportData.criteria.vehicle = $scope.specific_vehicle;
          $state.go('menu.report', { type : 'VEHICLE_MISC_COST' });
        }
      }
    } else if ($scope.type.main == "DRIVER") {
      if ($scope.type.sub == "FUEL_CONSUMPTION") {
        if ($scope.specific_vehicle.license_plate_no == null) {
          $cordovaToast.showShortBottom('Vehicle required for report generation');
        } else {
          reportData.criteria = {};
          reportData.criteria.date = $scope.date;
          reportData.criteria.vehicle = $scope.specific_vehicle;
          reportData.criteria.vehicle.drivers = $scope.selected_drivers;
          $state.go('menu.report', { type : 'DRIVER_FUEL_CONSUMPTION' });
        }
      }
    }
  };

  $scope.generateSelectedLists = function() {
    if ($scope.vehicles != null) {
      for (var i = 0; i < $scope.vehicles.length; i++) {
        if ($scope.vehicles[i].checked) {
          $scope.selected_vehicles.push($scope.vehicles[i].license_plate_no);
        }
      }
    }
    if ($scope.drivers != null) {
      for (var i = 0 ; i < $scope.drivers.length ; i++) {
        if ($scope.drivers[i].checked) {
          $scope.selected_drivers.push($scope.drivers[i].username);
        }
      }
    }
  };


  $scope.$watch('type.sub', function(value) {
    if (value != null) {
      // Loading license plate nos
      $scope.showLoadingOverlay('Retrieving Vehicles');
      $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/owned/name/')
        .then(function (response) {
          if (response.data.status == 'SUCCESS') {
            $scope.vehicles = response.data.owned_vehicles;
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
    }
  });

  $scope.$watch('specific_vehicle.license_plate_no', function(value) {
    if (value != null && $scope.type.main == 'DRIVER') {
      // Loading driver names
      $scope.showLoadingOverlay('Retrieving Drivers');
      $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + value + '/driver/name/')
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
            $cordovaToast.showShortBottom('Unknown error');
          }
          $scope.hideLoadingOverlay();
        }, function (response) {
          $cordovaToast.showShortBottom('Connection error');
          $scope.hideLoadingOverlay();
        });
    }
  });
});
