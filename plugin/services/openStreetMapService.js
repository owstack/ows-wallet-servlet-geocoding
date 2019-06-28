'use strict';

angular.module('owsWalletPlugin.services').factory('openStreetMapService', [
  '$log',
  'dataService',
  'owsWalletPluginClient.api.Device',
  'owsWalletPluginClient.api.Http',
function($log, dataService, Device, Http) {

  var root = {};

  var isCordova = owswallet.Plugin.isCordova();

  var apiUrl = 'https://nominatim.openstreetmap.org/';
  var openStreetMapApi;

  // Invoked via the servlet API to initialize our environment using the provided configuration.
  root.init = function(clientId, config) {
    return new Promise(function(resolve, reject) {

      if (!config) {
        var error = 'Could not initialize API service: no plugin configuration provided';
        $log.error(error);
        reject(error);
      }

      // Gather some additional information for the client. This information only during this initialization sequence.
      var info = {};
      info.urls = getUrls();

      createOpenStreetMapApiProvider();

      return resolve({
        info: info
      });
    });
  };

  root.getAddress = function(position) {
    return new Promise(function(resolve, reject) {
      if (position) {
        // Get address of specified position.
        openStreetMapApi.get('reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude).then(function(response) {
          resolve(improveAddress(response.data.address));

        }).catch(function(response) {
          reject(getError(response, 'getAddress'));

        });

      } else {

        // Get address of device.
        Device.getCurrentPosition().then(function(position) {
          return openStreetMapApi.get('reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude);

        }).then(function(response) {
          resolve(improveAddress(response.data.address));

        }).catch(function(response) {
          reject(getError(response, 'getAddress'));

        });
      }
    });
  };

  root.getPosition = function(address) {
    return new Promise(function(resolve, reject) {
      if (address) {
        // Get position for specified address.
        var encodedAddress = encodeURI(
          address.number || '' + ',' +
          address.street || '' + ',' +
          address.city || '' + ',' +
          address.state || '' + ',' +
          address.postalCode || '' + ',' +
          address.country || '');

        openStreetMapApi.get('search?format=json&q=' + encodedAddress).then(function(response) {
          resolve(response.data);
        }).catch(function(response) {
          reject(getError(response, 'getPosition'));
        });

      } else {
        // Get position of device.
        Device.getCurrentPosition().then(function(position) {
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude                
            }
          });

        }).catch(function(response) {
          reject(getError(response, 'getPosition'));

        });
      }
    });
  };

  /**
   * Private functions
   */

  function createOpenStreetMapApiProvider() {
    // Using the access token, create a new provider for making future API requests.
    openStreetMapApi = new Http(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  };

  function getUrls() {
    return {
      url: 'https://www.openstreetmap.org',
      githubUrl: 'https://github.com/openstreetmap/Nominatim'
    };
  };

  function improveAddress(address) {
    address.stateName = address.state;
    address.state = lodash.find(dataService.states, {name: address.stateName}).abbr;
    return address;
  };

  function getError(response, callerId) {
    // Check for JS error.
    if (response.message) {
      return {
        id: 'unexpected_error',
        message: response.message
      }
    }

    $log.error('OpenStreetMap: ' + callerId + ' - ' + response.toString());
    var error;

    if (response.status && response.status <= 0) {
      error = {
        id: 'network_error',
        message: 'Network error'
      };

    } else {
      error = {
        id: 'unexpected_error',
        message: response.toString()
      };
    }

    return error;
  };

  return root;
}]);
