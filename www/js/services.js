angular.module('app.services', [])

.service('sharedData', function() {
  var data = {};

  this.getData = function () {
    return data;
  };

  this.clearData = function () {
    data = {};
  };
});
