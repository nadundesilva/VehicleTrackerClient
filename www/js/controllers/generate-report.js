angular.module('app.controllers')

.controller('generateReportCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk, sharedData) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.report_criteria = {};
    $scope.type = {};
    $scope.selected_vehicles = [];
    $scope.date = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

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
  });

  $scope.generateReport = function() {
    for (var i = 0 ; i < $scope.vehicles.length ; i++) {
      if ($scope.vehicles[i].checked) {
        $scope.selected_vehicles.push($scope.vehicles[i].license_plate_no);
      }
    }
    var reportData = sharedData.getData();

    if ($scope.type.main == null || $scope.type.sub == null) {
      $cordovaToast.showShortBottom('The main category and the sub category are required');
    } else if ($scope.type.main == "FUEL" && $scope.type.sub == "CONSUMPTION") {
      if ($scope.selected_vehicles.length == 0) {
        $cordovaToast.showShortBottom('Vehicle required for report generation');
      } else {
        reportData.fuel_consumption = {};
        reportData.fuel_consumption.date = $scope.date;
        reportData.fuel_consumption.vehicles = $scope.selected_vehicles;
        $state.go('menu.report', { type : 'FUEL_CONSUMPTION' });
      }
    }
  };
});
