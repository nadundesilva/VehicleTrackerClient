angular.module('app.controllers')

.controller('addEditCheckInCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaGeolocation) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected_vehicle = {};
    $scope.mode = $stateParams.mode;
    $scope.check_in = {};
    $scope.location_detected = false;
    $scope.location_error = false;

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.mapCanvas = document.getElementById("add-edit-check-in-map");
    $scope.mapCanvas.innerHTML = "";
    if($stateParams.mode == 'EDIT') {
      $scope.check_in_id = $stateParams.check_in_id;
      $scope.selected_vehicle.license_plate_no = $stateParams.license_plate_no;
      $scope.check_in.description = $stateParams.description;
      $scope.check_in.latitude = $stateParams.latitude;
      $scope.check_in.longitude = $stateParams.longitude;

      $scope.mapOptions = {
        center: new google.maps.LatLng($scope.check_in.latitude, $scope.check_in.longitude),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map($scope.mapCanvas, $scope.mapOptions);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.check_in.latitude, $scope.check_in.longitude),
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        icon: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png'
      });
    } else {
      $scope.selected_vehicle.license_plate_no = null;
      $scope.check_in.description = null;

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

      // Locating the user's location
      $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function(position){
        $scope.mapOptions = {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map($scope.mapCanvas, $scope.mapOptions);
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          icon: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png'
        });
        $scope.check_in.latitude = position.coords.latitude;
        $scope.check_in.longitude = position.coords.longitude;
        $scope.location_detected = true;
        $scope.location_error = false;
      }, function(error){
        $scope.location_detected = false;
        $scope.location_error = true;
      });
    }
  });

  $scope.addUpdateCheckIn = function() {
    if ($scope.selected_vehicle.license_plate_no == null ||
        $scope.check_in.description == null) {
      $cordovaToast.showShortBottom('Vehicle and description are required');
    } else {
      $scope.showLoadingOverlay(($stateParams.mode == 'ADD' ? 'Creating' : 'Updating') + ' Check In');
      var method;
      if($stateParams.mode == 'ADD') {
        method = 'POST';
      } else {
        method = 'PUT';
      }
      $http({
        method : method,
        url : $rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.selected_vehicle.license_plate_no + '/check-in/' + ($stateParams.mode == 'ADD' ? '' : $scope.check_in_id + '/'),
        data : { check_in: $scope.check_in }
      }).then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaToast.showShortBottom('Check in ' + ($stateParams.mode == 'ADD' ? 'creation' : 'updating') + ' successful');
          if($stateParams.mode == 'EDIT') {
            $ionicHistory.backView().stateParams = { license_plate_no: $scope.selected_vehicle.license_plate_no, check_in_id: $scope.check_in_id };
            $ionicHistory.backView().stateId = $ionicHistory.backView().stateName + "_license_plate_no=" + $scope.selected_vehicle.license_plate_no + "_check_in_id_=" + $scope.check_in_id;
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
