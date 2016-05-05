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

  .state('menu.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.signUp', {
    url: '/sign-up',
    views: {
      'menuContent': {
        templateUrl: 'templates/signUp.html',
        controller: 'signUpCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.addFuelFillUp', {
    url: '/add-edit-fill-up',
    views: {
      'menuContent': {
        templateUrl: 'templates/addFuelFillUp.html',
        controller: 'addFuelFillUpCtrl'
      },
      'fabContent': {
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
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.addCheckIn', {
    url: '/add-edit-check-in',
    views: {
      'menuContent': {
        templateUrl: 'templates/addCheckIn.html',
        controller: 'addCheckInCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.vehicles', {
    url: '/manage-vehicles',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehicles.html',
        controller: 'vehiclesCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.checkIns', {
    url: '/check-ins',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkIns.html',
        controller: 'checkInsCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.fuelFillUps', {
    url: '/fill-ups',
    views: {
      'menuContent': {
        templateUrl: 'templates/fuelFillUps.html',
        controller: 'fuelFillUpsCtrl'
      },
      'fabContent': {
        template: ''
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
      'fabContent': {
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
      'fabContent': {
        template: ''
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
      'fabContent': {
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
      'fabContent': {
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
      'fabContent': {
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
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.checkIn', {
    url: '/check-in',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkIn.html',
        controller: 'checkInCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('menu.fuelFillUp', {
    url: '/fill-up',
    views: {
      'menuContent': {
        templateUrl: 'templates/fuelFillUp.html',
        controller: 'fuelFillUpCtrl'
      },
      'fabContent': {
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
      'fabContent': {
        template: ''
      }
    }
  })

$urlRouterProvider.otherwise('/nav-menu/login')

});
