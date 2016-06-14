angular.module('app.controllers')

.controller('reportCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk, sharedData) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.type = $stateParams.type;

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    var url = '';
    var data = {};
    if ($scope.type == 'FUEL_CONSUMPTION') {
      url = '/report/fuel/consumption/';
      data = { criteria : sharedData.getData().criteria };
      $scope.title = 'Fuel Consumption';
    } else if ($scope.type == 'AGGREGATE_MISC_COST') {
      url = '/report/misc-cost/aggregate/';
      data = { criteria : sharedData.getData().criteria };
      $scope.title = 'Aggregate Miscellaneous Costs';
    } else if ($scope.type == 'VEHICLE_MISC_COST') {
      url = '/report/vehicle/misc-cost/';
      data = { criteria : sharedData.getData().criteria };
      $scope.title = 'Miscellaneous Costs';
    } else if ($scope.type == 'DRIVER_FUEL_CONSUMPTION') {
      url = '/report/vehicle/driver/misc-cost/';
      data = { criteria : sharedData.getData().criteria };
      $scope.title = 'Driver Fuel Consumption';
    }

    // Loading license plate nos
    $scope.showLoadingOverlay('Retrieving Report');
    $http.post($rootScope.MAIN_SERVER_URL + url, data)
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.report = response.data.report;
          console.log($scope.report);
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

  $scope.$on('$ionicView.leave', function() {
    sharedData.clearData();
  });
});
