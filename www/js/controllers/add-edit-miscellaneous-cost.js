angular.module('app.controllers')

.controller('addEditMiscellaneousCostCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected_vehicle = {};
    $scope.mode = $stateParams.mode;
    $scope.misc_cost = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    if($stateParams.mode == 'EDIT') {
      $scope.misc_cost_id = $stateParams.misc_cost_id;
      $scope.selected_vehicle.license_plate_no = $stateParams.license_plate_no;
      $scope.misc_cost.type = $stateParams.type;
      $scope.misc_cost.value = parseFloat($stateParams.value);
    } else {
      $scope.selected_vehicle.license_plate_no = null;
      $scope.misc_cost.type = null;
      $scope.misc_cost.value = null;

      // Loading license plate nos
      $scope.showLoadingOverlay('Retrieving Vehicles');
      $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/name/')
        .then(function (response) {
          if (response.data.status == 'SUCCESS') {
            $scope.vehicles = response.data.owned_vehicles;
            $scope.vehicles = $scope.vehicles.concat(response.data.managed_vehicles);
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

  $scope.addUpdateMiscCost = function() {
    if ($scope.selected_vehicle.license_plate_no == null ||
        $scope.misc_cost.type == null ||
        $scope.misc_cost.value == null) {
      $cordovaToast.showShortBottom('Vehicle, cost type and price are required');
    } else {
      $scope.showLoadingOverlay(($stateParams.mode == 'ADD' ? 'Creating' : 'Updating') + ' Miscellaneous Cost');
      var method;
      if($stateParams.mode == 'ADD') {
        method = 'POST';
      } else {
        method = 'PUT';
      }
      $http({
        method : method,
        url : $rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.selected_vehicle.license_plate_no + '/misc-cost/' + ($stateParams.mode == 'ADD' ? '' : $scope.misc_cost_id + '/'),
        data : { misc_cost: $scope.misc_cost }
      }).then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaToast.showShortBottom('Miscellaneous cost ' + ($stateParams.mode == 'ADD' ? 'creation' : 'updating') + ' successful');
          if($stateParams.mode == 'EDIT') {
            $ionicHistory.backView().stateParams = { license_plate_no: $scope.selected_vehicle.license_plate_no, misc_cost_id: $scope.misc_cost_id };
            $ionicHistory.backView().stateId = $ionicHistory.backView().stateName + "_license_plate_no=" + $scope.selected_vehicle.license_plate_no + "_misc_cost_id_=" + $scope.misc_cost_id;
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
          console.log(response.data.status);
          $cordovaToast.showShortBottom('Unknown error');
        }
        $scope.hideLoadingOverlay();
      }, function(error) {
        $cordovaToast.showShortBottom('Connection error');
        $scope.hideLoadingOverlay();
      });
    }
  };
});
