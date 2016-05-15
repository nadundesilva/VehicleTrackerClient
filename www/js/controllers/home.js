angular.module('app.controllers')

.controller('homeCtrl', function($scope, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Updating the view
    $scope.$parent.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(false);
    $scope.clearFabs(0, 0);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

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
  });
});
