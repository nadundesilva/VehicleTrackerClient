angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in miscellaneous-cost.js
  $stateProvider

  .state('menu', {
    url: '/nav-menu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl',
    abstract:true
  })

  .state('menu.signUp', {
    url: '/sign-up/',
    views: {
      'menuContent': {
        templateUrl: 'templates/signUp.html',
        controller: 'signUpCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.login', {
    url: '/login/',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.home', {
    url: '/home/',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.vehicles', {
    url: '/manage-vehicles/',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehicles.html',
        controller: 'vehiclesCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: '<button ui-sref=\'menu.addEditVehicle({ mode : "ADD"})\' id="fab-vehicles-add" class="button button-fab button-fab-bottom-right button-balanced-900 spin"><i class="icon ion-plus"></i></button>',
        controller: function($scope, $timeout) {
          $timeout(function () {
            document.getElementById('fab-vehicles-add').classList.toggle('on');
          }, 200);
        }
      }
    }
  })

  .state('menu.addEditVehicle', {
    url: '/add-edit-vehicle/:mode?name&license_plate_no&description&fuel_one&fuel_two&make&model&year',
    views: {
      'menuContent': {
        templateUrl: 'templates/addEditVehicle.html',
        controller: 'addEditVehicleCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.vehicle', {
    url: '/vehicle/:mode?license_plate_no',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehicle.html',
        controller: 'vehicleCtrl'
      },
      'fabLeftContent': {
        template: '<button id="fab-vehicle-delete" class="button button-fab button-fab-bottom-left button-assertive-900 spin" ng-hide="managed" ng-click="deleteVehicle()"><i class="icon ion-android-cancel"></i></button>',
        controller: function($stateParams, $scope, $rootScope, $http, $state, $cordovaToast, $ionicHistory, $timeout) {
          // Initializing variables
          $scope.managed = ($stateParams.mode == "MANAGED");
          $scope.license_plate_no = $stateParams.license_plate_no;

          $timeout(function () {
            document.getElementById('fab-vehicle-delete').classList.toggle('on');
          }, 200);

          $scope.deleteVehicle = function() {
            $scope.showLoadingOverlay('Removing Driver');
            $http.delete($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.license_plate_no + '/')
              .then(function (response) {
                if (response.data.status == 'SUCCESS') {
                  $cordovaToast.showShortBottom('Vehicle removal successful');
                  $ionicHistory.backView().go();
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
          }
        }
      },
      'fabRightContent': {
        template: '<button id="fab-vehicle-edit" class="button button-fab button-fab-bottom-right button-positive-900 spin" ng-hide="managed" ng-click="goToUpdateView();"><i class="icon ion-edit"></i></button>',
        controller: function ($stateParams, $timeout, sharedData, $scope, $state) {
          // Initializing variables
          $scope.managed = ($stateParams.mode == "MANAGED");

          $timeout(function () {
            document.getElementById('fab-vehicle-edit').classList.toggle('on');
          }, 500);

          $scope.goToUpdateView = function () {
            var vehicleSharedData = sharedData.getData();
            var vehicle = vehicleSharedData.vehicle;
            $state.go('menu.addEditVehicle', { mode : "EDIT", name : vehicle.name, license_plate_no : vehicle.license_plate_no, description : vehicle.description, fuel_one : vehicle.fuel_one, fuel_two : vehicle.fuel_two, make : vehicle.make, model : vehicle.model, year : vehicle.year });
          };
        }
      }
    }
  })

  .state('menu.drivers', {
    url: '/drivers/:mode?license_plate_no',
    views: {
      'menuContent': {
        templateUrl: 'templates/drivers.html',
        controller: 'driversCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: '<button ui-sref=\'menu.addDriver({ license_plate_no : license_plate_no })\' id="fab-drivers-add" class="button button-fab button-fab-bottom-right button-balanced-900 spin" ng-show="owned"><i class="icon ion-plus"></i></button>',
        controller: function($scope, $timeout, $stateParams) {
          // Initializing variables
          $scope.license_plate_no = $stateParams.license_plate_no;
          $scope.owned = ($stateParams.mode == 'OWNED');

          $timeout(function () {
            document.getElementById('fab-drivers-add').classList.toggle('on');
          }, 200);
        }
      }
    }
  })

  .state('menu.addDriver', {
    url: '/add-driver/:license_plate_no',
    views: {
      'menuContent': {
        templateUrl: 'templates/addDriver.html',
        controller: 'addDriverCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.checkIns', {
    url: '/check-ins/:license_plate_no',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkIns.html',
        controller: 'checkInsCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: '<button ui-sref=\'menu.addEditCheckIn({ mode : "ADD", license_plate_no : license_plate_no })\' id="fab-check-ins-add" class="button button-fab button-fab-bottom-right button-balanced-900 spin"><i class="icon ion-plus"></i></button>',
        controller: function($scope, $timeout, $stateParams) {
          // Initializing variables
          $scope.license_plate_no = $stateParams.license_plate_no;

          $timeout(function () {
            document.getElementById('fab-check-ins-add').classList.toggle('on');
          }, 200);
        }
      }
    }
  })

  .state('menu.addEditCheckIn', {
    url: '/add-edit-check-in/:mode?license_plate_no&check_in_id&description&latitude&longitude',
    views: {
      'menuContent': {
        templateUrl: 'templates/addEditCheckIn.html',
        controller: 'addEditCheckInCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.checkIn', {
    url: '/check-in/:mode?license_plate_no&check_in_id',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkIn.html',
        controller: 'checkInCtrl'
      },
      'fabLeftContent': {
        template: '<button id="fab-check-in-delete" class="button button-fab button-fab-bottom-left button-assertive-900 spin" ng-hide="created" ng-click="deleteCheckIn()"><i class="icon ion-android-cancel"></i></button>',
        controller: function($stateParams, $scope, $rootScope, sharedData, $http, $state, $cordovaPreferences, $cordovaToast, $ionicHistory, $timeout) {
          // Initializing variables
          $scope.license_plate_no = $stateParams.license_plate_no;
          $scope.check_in_id = $stateParams.check_in_id;
          $scope.created = ($stateParams.mode == "CREATED");

          $timeout(function () {
            document.getElementById('fab-check-in-delete').classList.toggle('on');
          }, 200);

          $scope.deleteCheckIn = function() {
            $scope.showLoadingOverlay('Removing Check In');
            $http.delete($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.license_plate_no + '/check-in/' + $scope.check_in_id + '/')
              .then(function (response) {
                if (response.data.status == 'SUCCESS') {
                  $cordovaToast.showShortBottom('Check in removal successful');
                  $ionicHistory.backView().go();
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
          }
        }
      },
      'fabRightContent': {
        template: '<button id="fab-check-in-edit" class="button button-fab button-fab-bottom-right button-positive-900 spin" ng-hide="created" ng-click="goToUpdateView();"><i class="icon ion-edit"></i></button>',
        controller: function ($stateParams, $timeout, sharedData, $scope, $state) {
          // Initializing variables
          $scope.created = ($stateParams.mode == 'CREATED');

          $timeout(function () {
            document.getElementById('fab-check-in-edit').classList.toggle('on');
          }, 500);

          $scope.goToUpdateView = function () {
            var checkInSharedData = sharedData.getData();
            var checkIn = checkInSharedData.check_in;
            $state.go('menu.addEditCheckIn', { mode : "EDIT", license_plate_no : checkIn.license_plate_no, check_in_id : checkIn.id, description : checkIn.description, latitude : checkIn.latitude, longitude : checkIn.longitude });
          };
        }
      }
    }
  })

  .state('menu.fuelFillUps', {
    url: '/fill-ups/:license_plate_no',
    views: {
      'menuContent': {
        templateUrl: 'templates/fuelFillUps.html',
        controller: 'fuelFillUpsCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: '<button ui-sref=\'menu.addEditFuelFillUp({ mode : "ADD", license_plate_no : license_plate_no })\' id="fab-check-ins-add" class="button button-fab button-fab-bottom-right button-balanced-900 spin"><i class="icon ion-plus"></i></button>',
        controller: function($scope, $timeout, $stateParams) {
          // Initializing variables
          $scope.license_plate_no = $stateParams.license_plate_no;
          $scope.check_in_id = $stateParams.check_in_id;

          $timeout(function () {
            document.getElementById('fab-check-ins-add').classList.toggle('on');
          }, 200);
        }
      }
    }
  })

  .state('menu.addEditFuelFillUp', {
    url: '/add-edit-fill-up/:mode?license_plate_no&fuel_fill_up_id&odo_meter_reading&litres&price',
    views: {
      'menuContent': {
        templateUrl: 'templates/addEditFuelFillUp.html',
        controller: 'addEditFuelFillUpCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.fuelFillUp', {
    url: '/fuel-fill-up/:mode?license_plate_no&fuel_fill_up_id',
    views: {
      'menuContent': {
        templateUrl: 'templates/fuelFillUp.html',
        controller: 'fuelFillUpCtrl'
      },
      'fabLeftContent': {
        template: '<button id="fab-fuel-fill-up-delete" class="button button-fab button-fab-bottom-left button-assertive-900 spin" ng-hide="created" ng-click="deleteFuelFillUp()"><i class="icon ion-android-cancel"></i></button>',
        controller: function($stateParams, $scope, $rootScope, sharedData, $http, $state, $cordovaPreferences, $cordovaToast, $ionicHistory, $timeout) {
          // Initializing variables
          $scope.license_plate_no = $stateParams.license_plate_no;
          $scope.fuel_fill_up_id = $stateParams.fuel_fill_up_id;
          $scope.created = ($stateParams.mode == "CREATED");

          $timeout(function () {
            document.getElementById('fab-fuel-fill-up-delete').classList.toggle('on');
          }, 200);

          $scope.deleteFuelFillUp = function() {
            $scope.showLoadingOverlay('Removing Check In');
            $http.delete($rootScope.MAIN_SERVER_URL + '/vehicle/' + $scope.license_plate_no + '/fuel-fill-up/' + $scope.fuel_fill_up_id + '/')
              .then(function (response) {
                if (response.data.status == 'SUCCESS') {
                  $cordovaToast.showShortBottom('Fuel fill up removal successful');
                  $ionicHistory.backView().go();
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
          }
        }
      },
      'fabRightContent': {
        template: '<button id="fab-fuel-fill-up-edit" class="button button-fab button-fab-bottom-right button-positive-900 spin" ng-hide="created" ng-click="goToUpdateView();"><i class="icon ion-edit"></i></button>',
        controller: function ($stateParams, $timeout, sharedData, $scope, $state) {
          // Initializing variables
          $scope.created = ($stateParams.mode == 'CREATED');

          $timeout(function () {
            document.getElementById('fab-fuel-fill-up-edit').classList.toggle('on');
          }, 500);

          $scope.goToUpdateView = function () {
            var fuelFillUpSharedData = sharedData.getData();
            var fuelFillUp = fuelFillUpSharedData.fuel_fill_up;
            $state.go('menu.addEditFuelFillUp', { mode : "EDIT", license_plate_no : fuelFillUp.license_plate_no, fuel_fill_up_id : fuelFillUp.id, odo_meter_reading : fuelFillUp.odo_meter_reading, litres : fuelFillUp.litres, price : fuelFillUp.price });
          };
        }
      }
    }
  })

  .state('menu.miscellaneousCosts', {
    url: '/misc-costs',
    views: {
      'menuContent': {
        templateUrl: 'templates/miscellaneousCosts.html',
        controller: 'miscellaneousCostsCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.addMiscellaneousCost', {
    url: '/add-edit-misc-cost',
    views: {
      'menuContent': {
        templateUrl: 'templates/addMiscellaneousCost.html',
        controller: 'addMiscellaneousCostCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.miscellaneousCost', {
    url: '/misc-cost',
    views: {
      'menuContent': {
        templateUrl: 'templates/miscellaneousCost.html',
        controller: 'miscellaneousCostCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.generateReport', {
    url: '/generate-report',
    views: {
      'menuContent': {
        templateUrl: 'templates/generateReport.html',
        controller: 'generateReportCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.report', {
    url: '/report',
    views: {
      'menuContent': {
        templateUrl: 'templates/generateReport.html',
        controller: 'generateReportCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  })

  .state('menu.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      },
      'fabLeftContent': {
        template: ''
      },
      'fabRightContent': {
        template: ''
      }
    }
  });

$urlRouterProvider.otherwise('/nav-menu/login/')

});
