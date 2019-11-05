'use strict';

angular.module('owsWalletPlugin.services').factory('geocodingService', [
  '$log',
  'dataService',
  'lodash',
  'providerService',
  'owsWalletPluginClient.api.Device',
  'owsWalletPluginClient.api.Http',
function($log, dataService, lodash, providerService, Device, Http) {

  var root = {};

  var isCordova = owswallet.Plugin.isCordova();

  var provider;
  var apiKey;
  var geocodingApi;
  var geocodingReverseApi;

  // Invoked via the servlet API to initialize our environment using the provided configuration.
  root.init = function(clientId, config) {
    return new Promise(function(resolve, reject) {

      if (!config) {
        var error = 'Could not initialize API service: no plugin configuration provided';
        $log.error(error);
        reject(error);
      }

      var providerConfig = lodash.find(config.providers, function(p) {
        return p.default == true;
      });

      provider = providerService[providerConfig.name];
      apiKey = providerConfig.apiKey;

      createGeocodingApiProvider();

      return resolve({
        provider: provider.info
      });
    });
  };

  root.getAddress = function(position) {
    return new Promise(function(resolve, reject) {
      if (position) {
        // Get address of specified position.
        geocodingReverseApi.get(provider.getLocationURI(position.coords.latitude, position.coords.longitude)).then(function(response) {
          resolve(decodeAddress(response.data));

        }).catch(function(response) {
          reject(getError(response, 'getAddress'));

        });

      } else {

        // Get address of device.
        Device.getCurrentPosition().then(function(position) {
          if (position) {
            return geocodingReverseApi.get(provider.getLocationURI(position.coords.latitude, position.coords.longitude));
          } else {
            resolve();
          }

        }).then(function(response) {
          resolve(decodeAddress(response.data));

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
        var encodedAddress = provider.encodeAddress(address);

        geocodingApi.get(encodedAddress).then(function(response) {
          resolve(response.data);

        }).catch(function(response) {
          reject(getError(response, 'getPosition'));
        });

      } else {
        // Get position of device.
        Device.getCurrentPosition().then(function(position) {
          if (position) {
            resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude                
              }
            });
          } else {
            resolve();
          }

        }).catch(function(response) {
          reject(getError(response, 'getPosition'));

        });
      }
    });
  };

  /**
   * Private functions
   */

  function createGeocodingApiProvider() {
    // Using the access token, create a new provider for making future API requests.
    geocodingApi = new Http(provider.api.url.replace('{{apiKey}}', apiKey), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    geocodingReverseApi = new Http(provider.api.reverseUrl.replace('{{apiKey}}', apiKey), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  };

  function decodeAddress(data) {
    var address = provider.getAddress(data);
    return {
      street: provider.getStreet(address),
      city: provider.getCity(address),
      state: provider.getState(address),
      postalCode: provider.getPostalCode(address)
    }    
  };

  function getError(response, callerId) {
    // Check for JS error.
    if (response.message) {
      return {
        id: 'unexpected_error',
        message: response.message
      }
    }

    $log.error('Geocoding: ' + callerId + ' - ' + response.toString());
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
