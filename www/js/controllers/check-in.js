angular.module('app.controllers')

.controller('checkInCtrl', function($stateParams, $scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast, $cordovaPreferences, $timeout, ionicMaterialInk, ionicMaterialMotion, sharedData) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Initializing variables
    $scope.mode = $stateParams.mode;
    $scope.license_plate_no = $stateParams.license_plate_no;
    $scope.check_in_id = $stateParams.check_in_id;
    $scope.check_in = {};

    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(true);
    $scope.clearFabs(1, 1);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    $scope.showLoadingOverlay('Retrieving Information');
    $http.get($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.license_plate_no + '/check-in/' + $scope.check_in_id + '/')
      .then(function (response) {
        if (response.data.status == 'SUCCESS') {
          $scope.check_in = response.data.check_in;
          $scope.check_in.license_plate_no = $scope.license_plate_no;
          $cordovaPreferences.fetch($rootScope.USERNAME_KEY)
            .success(function (value) {
              if(value == $scope.check_in.creator) {
                $scope.check_in.creator = null;
              }
            });
          var checkInSharedData = sharedData.getData();
          checkInSharedData.check_in = $scope.check_in;

          var mapCanvas = document.getElementById("map");
          var mapOptions = {
            center: new google.maps.LatLng($scope.check_in.latitude, $scope.check_in.longitude),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          $scope.map = new google.maps.Map(mapCanvas, mapOptions);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.check_in.latitude, $scope.check_in.longitude),
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
