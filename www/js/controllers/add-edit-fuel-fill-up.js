angular.module('app.controllers')

.controller('addEditFuelFillUpCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicHistory, $cordovaToast, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaGeolocation) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected_vehicle = {};
    $scope.mode = $stateParams.mode;
    $scope.fuel_fill_up = {};
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

    $scope.mapCanvas = document.getElementById("add-edit-fuel-fill-up-map");
    $scope.mapCanvas.innerHTML = "";
    if($stateParams.mode == 'EDIT') {
      $scope.fuel_fill_up_id = $stateParams.fuel_fill_up_id;
      $scope.selected_vehicle.license_plate_no = $stateParams.license_plate_no;
      $scope.fuel_fill_up.odo_meter_reading = parseFloat($stateParams.odo_meter_reading);
      $scope.fuel_fill_up.litres = parseFloat($stateParams.litres);
      $scope.fuel_fill_up.price = parseFloat($stateParams.price);
      $scope.fuel_fill_up.station_latitude = $stateParams.station_latitude;
      $scope.fuel_fill_up.station_longitude = $stateParams.station_longitude;

      $scope.mapOptions = {
        center: new google.maps.LatLng($scope.fuel_fill_up.station_latitude, $scope.fuel_fill_up.station_longitude),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map($scope.mapCanvas, $scope.mapOptions);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.fuel_fill_up.station_latitude, $scope.fuel_fill_up.station_longitude),
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        icon: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png'
      });
    } else {
      $scope.selected_vehicle.license_plate_no = null;
      $scope.fuel_fill_up.odo_meter_reading = null;
      $scope.fuel_fill_up.litres = null;
      $scope.fuel_fill_up.price = null;

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
        $scope.fuel_fill_up.station_latitude = position.coords.latitude;
        $scope.fuel_fill_up.station_longitude = position.coords.longitude;
        $scope.location_detected = true;
        $scope.location_error = false;
      }, function(error){
        $scope.location_detected = false;
        $scope.location_error = true;
      });
    }
  });

  $scope.addUpdateFuelFillUp = function() {
    if ($scope.selected_vehicle.license_plate_no == null ||
        $scope.fuel_fill_up.odo_meter_reading == null ||
        $scope.fuel_fill_up.litres == null ||
        $scope.fuel_fill_up.price == null) {
      $cordovaToast.showShortBottom('Vehicle, Odo meter reading, litres and price are required');
    } else {
      $scope.showLoadingOverlay(($stateParams.mode == 'ADD' ? 'Creating' : 'Updating') + ' Fuel Fill Up');
      var method;
      if($stateParams.mode == 'ADD') {
        method = 'POST';
      } else {
        method = 'PUT';
      }
      $http({
        method : method,
        url : $rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.selected_vehicle.license_plate_no + '/fuel-fill-up/' + ($stateParams.mode == 'ADD' ? '' : $scope.fuel_fill_up_id + '/'),
        data : { fuel_fill_up: $scope.fuel_fill_up }
      }).then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $cordovaToast.showShortBottom('Fuel fill up ' + ($stateParams.mode == 'ADD' ? 'creation' : 'updating') + ' successful');
          if($stateParams.mode == 'EDIT') {
            $ionicHistory.backView().stateParams = { license_plate_no: $scope.selected_vehicle.license_plate_no, fuel_fill_up_id: $scope.fuel_fill_up_id };
            $ionicHistory.backView().stateId = $ionicHistory.backView().stateName + "_license_plate_no=" + $scope.selected_vehicle.license_plate_no + "_fuel_fill_up_id_=" + $scope.fuel_fill_up_id;
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
