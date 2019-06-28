'use strict';

angular.module('owsWalletPlugin.api.osm', []).namespace().constant('OpenStreetMapServlet',
{
  id: 'org.openwalletstack.wallet.plugin.servlet.osm'
});

'use strict';

angular.module('owsWalletPlugin.api.osm').factory('OpenStreetMap', [
  'ApiMessage',
  'lodash',
  'owsWalletPluginClient.api.ApiError',
  'owsWalletPlugin.api.osm.OpenStreetMapServlet',
  'owsWalletPluginClient.api.PluginApiHelper',
function(ApiMessage, lodash, ApiError, OpenStreetMapServlet, PluginApiHelper) {

  /**
   * Constructor.
   * @param {Object} configId - The configuration ID for the servlet.
   * @constructor
   */
  function OpenStreetMap(configId) {
    var self = this;

    var servlet = new PluginApiHelper(OpenStreetMapServlet);
    var apiRoot = servlet.apiRoot();
    var config = servlet.getConfig(configId);

    init();

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
        data: position || {}
      }

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
        data: address || {}
      }

      return new ApiMessage(request).send().then(function(response) {
        return response.data;

      }).catch(function(error) {
        throw new ApiError(error);
        
      });
    };

    /**
     * Private functions
     */

    function init() {
      var request = {
        method: 'PUT',
        url: apiRoot + '/service',
        data: {
          config: config
        }
      };

      return new ApiMessage(request).send().then(function(response) {
        self.urls = lodash.get(response, 'data.info.urls', {});

      }).catch(function(error) {
        throw new ApiError(error);

      });
    };

    return this;
  };
 
  return OpenStreetMap;
}]);
