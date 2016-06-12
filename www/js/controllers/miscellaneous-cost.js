angular.module('app.controllers')

.controller('miscellaneousCostCtrl', function($stateParams, $scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast, $cordovaPreferences, $timeout, ionicMaterialInk, ionicMaterialMotion, sharedData) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Initializing variables
    $scope.mode = $stateParams.mode;
    $scope.license_plate_no = $stateParams.license_plate_no;
    $scope.misc_cost_id = $stateParams.misc_cost_id;
    $scope.misc_cost = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(1, 1);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.showLoadingOverlay('Retrieving Information');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.license_plate_no + '/misc-cost/' + $scope.misc_cost_id + '/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.misc_cost = response.data.misc_cost;
          $scope.misc_cost.license_plate_no = $scope.license_plate_no;
          $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
            .success(function (value) {
              if(value == $scope.misc_cost.creator) {
                $scope.misc_cost.creator = null;
              }
            });
          var miscCostSharedData = sharedData.getData();
          miscCostSharedData.misc_cost = $scope.misc_cost;
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
