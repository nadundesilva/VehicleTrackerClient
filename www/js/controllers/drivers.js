angular.module('app.controllers')

.controller('driversCtrl', function($scope, $rootScope, $http, $state, $ionicHistory, $cordovaToast, $timeout, $filter, ionicMaterialMotion, ionicMaterialInk) {

  $scope.triggerAnimation = function () {
    // Set Motion
    $timeout(function () {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);
    $timeout(function () {
      ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 4000
      });
    }, 700);
  };
});
