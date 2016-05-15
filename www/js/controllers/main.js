angular.module('app.controllers', ['ngCordova'])

.controller('mainCtrl', function($scope, $ionicLoading) {
  // Initializing variables
  $scope.loading = false;
  
  $scope.showLoadingOverlay = function(loadingText) {
    if (loadingText == null) {
      loadingText = 'Loading';
    }
    loadingText += '...';
    $ionicLoading.show({
      template: '<p>' + loadingText + '</p><ion-spinner icon="android"></ion-spinner>'
    });
    $scope.loading = true;
  };

  $scope.hideLoadingOverlay = function(){
    $ionicLoading.hide();
    $scope.loading = false;
  };

  $scope.hideNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  };

  $scope.showNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  };

  $scope.noHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setExpanded = function(bool) {
    $scope.isExpanded = bool;
  };

  $scope.setHeaderFab = function(location) {
    var hasHeaderFabLeft = false;
    var hasHeaderFabRight = false;

    switch (location) {
      case 'left':
        hasHeaderFabLeft = true;
        break;
      case 'right':
        hasHeaderFabRight = true;
        break;
    }

    $scope.hasHeaderFabLeft = hasHeaderFabLeft;
    $scope.hasHeaderFabRight = hasHeaderFabRight;
  };

  $scope.hasHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (!content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }

  };

  $scope.hideHeader = function() {
    $scope.hideNavBar();
    $scope.noHeader();
  };

  $scope.showHeader = function() {
    $scope.showNavBar();
    $scope.hasHeader();
  };

  $scope.clearFabs = function(leftFabsCount, rightFabsCount) {
    var fabs = document.getElementsByClassName('button-fab button-fab-bottom-left');
    if (fabs.length) {
      for (var i = 0; i < fabs.length - leftFabsCount; i++) {
        fabs[i].remove();
      }
    }
    fabs = document.getElementsByClassName('button-fab button-fab-bottom-right');
    if (fabs.length) {
      for (var i = 0; i < fabs.length - rightFabsCount; i++) {
        fabs[i].remove();
      }
    }
  };
});
