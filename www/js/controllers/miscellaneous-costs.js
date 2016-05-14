angular.module('app.controllers')

.controller('miscellaneousCostsCtrl', function($scope, ionicMaterialInk, ionicMaterialMotion) {
  // Initialization
  $scope.$on('$ionicView.enter', function() {
    // Updating the view
    $scope.showHeader();
    $scope.isExpanded = false;
    $scope.setExpanded(false);
    $scope.setHeaderFab(false);
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  });
});
