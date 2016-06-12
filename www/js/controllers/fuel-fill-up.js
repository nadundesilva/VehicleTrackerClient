angular.module('app.controllers')

.controller('fuelFillUpCtrl', function($stateParams, $scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast, $cordovaPreferences, $timeout, ionicMaterialInk, ionicMaterialMotion, sharedData) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Initializing variables
    $scope.mode = $stateParams.mode;
    $scope.license_plate_no = $stateParams.license_plate_no;
    $scope.fuel_fill_up_id = $stateParams.fuel_fill_up_id;
    $scope.fuel_fill_up = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(1, 1);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.showLoadingOverlay('Retrieving Information');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.license_plate_no + '/fuel-fill-up/' + $scope.fuel_fill_up_id + '/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.fuel_fill_up = response.data.fuel_fill_up;
          $scope.fuel_fill_up.license_plate_no = $scope.license_plate_no;
          $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
            .success(function (value) {
              if(value == $scope.fuel_fill_up.creator) {
                $scope.fuel_fill_up.creator = null;
              }
            });
          var fuelFillUpSharedData = sharedData.getData();
          fuelFillUpSharedData.fuel_fill_up = $scope.fuel_fill_up;

          var mapCanvas = document.getElementById("fuel-fill-up-map");
          var mapOptions = {
            center: new google.maps.LatLng($scope.fuel_fill_up.latitude, $scope.fuel_fill_up.longitude),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          $scope.map = new google.maps.Map(mapCanvas, mapOptions);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.fuel_fill_up.latitude, $scope.fuel_fill_up.longitude),
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            icon: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png'
          });
        } else if (response.data.status == 'USER_NOT_LOGGED_IN') {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $cordovaToast.showShortBottom('You have to login first');
          $state.go('menu.home', {}, {location: "replace", reload: true});
        } else {
          console.log(response.data.status);
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
