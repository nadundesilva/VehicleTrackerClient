angular.module('app.controllers')

.controller('homeCtrl', function($scope, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  // Initializing variables
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = false;
  $scope.$parent.setExpanded(false);
  $scope.$parent.setHeaderFab(false);

  $scope.$on('$ionicView.enter', function() {
    // Set Motion
    $timeout(function () {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);
    $timeout(function () {
      ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 2000
      });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
  });
});
