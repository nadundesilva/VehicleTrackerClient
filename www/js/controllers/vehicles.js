angular.module('app.controllers')

.controller('vehiclesCtrl', function($scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.showLoadingOverlay('Retrieving Vehicles');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/get')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.owned_vehicles = response.data.owned_vehicles;
          $scope.managed_vehicles = response.data.managed_vehicles;
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
});
