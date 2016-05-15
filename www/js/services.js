angular.module('app.services', [])

.service('sharedData', function() {
  var vehicle = {};

  this.getVehicleData = function () {
    return vehicle;
  };

  this.clearVehicleData = function () {
    vehicle = {};
  };
});
