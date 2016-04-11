angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.home', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menu', {
    url: '/nav-menu',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.login', {
    url: '/login',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('menu.signUp', {
    url: '/sign-up',
    views: {
      'side-menu21': {
        templateUrl: 'templates/signUp.html',
        controller: 'signUpCtrl'
      }
    }
  })

  .state('menu.addFuelFillUp', {
    url: '/add-edit-fill-up',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addFuelFillUp.html',
        controller: 'addFuelFillUpCtrl'
      }
    }
  })

  .state('menu.addMiscellaneousCost', {
    url: '/add-edit-misc-cost',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addMiscellaneousCost.html',
        controller: 'addMiscellaneousCostCtrl'
      }
    }
  })

  .state('menu.addCheckIn', {
    url: '/add-edit-check-in',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addCheckIn.html',
        controller: 'addCheckInCtrl'
      }
    }
  })

  .state('menu.vehicles', {
    url: '/manage-vehicles',
    views: {
      'side-menu21': {
        templateUrl: 'templates/vehicles.html',
        controller: 'vehiclesCtrl'
      }
    }
  })

  .state('menu.checkIns', {
    url: '/check-ins',
    views: {
      'side-menu21': {
        templateUrl: 'templates/checkIns.html',
        controller: 'checkInsCtrl'
      }
    }
  })

  .state('menu.fuelFillUps', {
    url: '/fill-ups',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fuelFillUps.html',
        controller: 'fuelFillUpsCtrl'
      }
    }
  })

  .state('menu.addVehicle', {
    url: '/add-edit-vehicle',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addVehicle.html',
        controller: 'addVehicleCtrl'
      }
    }
  })

  .state('menu.settings', {
    url: '/settings',
    views: {
      'side-menu21': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('menu.miscellaneousCosts', {
    url: '/misc-costs',
    views: {
      'side-menu21': {
        templateUrl: 'templates/miscellaneousCosts.html',
        controller: 'miscellaneousCostsCtrl'
      }
    }
  })

  .state('menu.generateReport', {
    url: '/generate-report',
    views: {
      'side-menu21': {
        templateUrl: 'templates/generateReport.html',
        controller: 'generateReportCtrl'
      }
    }
  })

  .state('report', {
    url: '/report',
    templateUrl: 'templates/report.html',
    controller: 'reportCtrl'
  })

  .state('menu.vehicle', {
    url: '/vehicle',
    views: {
      'side-menu21': {
        templateUrl: 'templates/vehicle.html',
        controller: 'vehicleCtrl'
      }
    }
  })

  .state('menu.checkIn', {
    url: '/page19',
    views: {
      'side-menu21': {
        templateUrl: 'templates/checkIn.html',
        controller: 'checkInCtrl'
      }
    }
  })

  .state('menu.fuelFillUp', {
    url: '/fill-up',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fuelFillUp.html',
        controller: 'fuelFillUpCtrl'
      }
    }
  })

  .state('menu.miscellaneousCost', {
    url: '/misc-cost',
    views: {
      'side-menu21': {
        templateUrl: 'templates/miscellaneousCost.html',
        controller: 'miscellaneousCostCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/nav-menu/login')

  

});