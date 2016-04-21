describe('loginCtrl', function() {
  var controller, $scope, $http, $cordovaPreferences, $ionicPlatform, $state;

  beforeEach(angular.mock.module('app.controllers', ['ngCordovaMocks']));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $http = jasmine.createSpyObj('$http', ['post']);
    $cordovaPreferences = jasmine.createSpyObj('$cordovaPreferences', ['store', 'fetch']);
    $ionicPlatform = jasmine.createSpyObj('$ionicPlatform', ['ready']);
    $cordovaToast = jasmine.createSpyObj('$cordovaToast', ['showShortBottom']);
    $ionicHistory = jasmine.createSpyObj('$ionicHistory', ['nextViewOptions']);
    $state = jasmine.createSpyObj('$state', ['go']);
    controller = $controller('loginCtrl', {
      '$scope': $scope,
      '$rootScope': $rootScope,
      '$http': $http,
      '$cordovaPreferences': $cordovaPreferences,
      '$ionicPlatform': $ionicPlatform,
      '$cordovaToast': $cordovaToast,
      '$ionicHistory': $ionicHistory,
      '$state': $state
    });
    console.log('test');
  }));

  describe('$scope.workOffline', function() {
    it('Goes to main state', function() {
      expect(controller.$state.go).toBeDefined();
    });
  });
});
