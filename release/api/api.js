'use strict';

angular.module('owsWalletPlugin.api.geocoding', []).namespace().constant('GeocodingServlet',
{
  id: 'org.openwalletstack.wallet.plugin.servlet.geocoding'
});

'use strict';

angular.module('owsWalletPlugin.api.geocoding').factory('Geocoding', [
  'ApiMessage',
  'lodash',
  'owsWalletPluginClient.api.ApiError',
  'owsWalletPlugin.api.geocoding.GeocodingServlet',
  'owsWalletPluginClient.api.PluginApiHelper',
function(ApiMessage, lodash, ApiError, GeocodingServlet, PluginApiHelper) {

  /**
   * Constructor.
   * @param {Object} configId - The configuration ID for the servlet.
   * @constructor
   */
  function Geocoding(configId) {
    var self = this;

    var servlet = new PluginApiHelper(GeocodingServlet);
    var apiRoot = servlet.apiRoot();
    var config = servlet.getConfig(configId);

    /**
     * Public functions
     */

    /**
     * Get the address for the specified geographic position or the device current address.
     * @return {Promise<Invoice>} A promise for the response.
     */
    this.getAddress = function(position) {
      var request = {
        method: 'GET',
        url: apiRoot + '/address',
        data: position || {},
        opts: {
          timeout: -1
        }
      };

      return new ApiMessage(request).send().then(function(response) {
        return response.data;

      }).catch(function(error) {
        throw new ApiError(error);
        
      });
    };

    /**
     * Get the geogrpahic position for the specified address or the device current position.
     * @return {Promise<Invoice>} A promise for the response.
     */
    this.getPosition = function(address) {
      var request = {
        method: 'GET',
        url: apiRoot + '/position',
        data: address || {},
        opts: {
          timeout: -1
        }
      };

      return new ApiMessage(request).send().then(function(response) {
        return response.data;

      }).catch(function(error) {
        throw new ApiError(error);
        
      });
    };

    /**
     * Initialize the service.
     * @return a promise when service is initialized.
     */
    this.init = function() {
      var request = {
        method: 'PUT',
        url: apiRoot + '/service',
        data: {
          config: config
        }
      };

      return new ApiMessage(request).send().then(function(response) {
        self.provider = lodash.get(response, 'data.provider', {});
        return self;

      }).catch(function(error) {
        throw new ApiError(error);

      });
    };

    return this;
  };
 
  return Geocoding;
}]);
