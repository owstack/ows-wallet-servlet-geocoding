'use strict';

angular.module('owsWalletPlugin.api.qgis').factory('QGIS', [
  'ApiMessage',
  'owsWalletPlugin.api.QGISServlet',
  'owsWalletPluginClient.api.ApiError',
  'owsWalletPluginClient.api.PluginApiHelper',
function(QGISServlet, ApiMessage, PluginApiHelper) {

  /**
   * Constructor.
   * @param {Object} configId - The configuration ID for the servlet.
   * @constructor
   */
  function QGIS(configId) {
    var self = this;

    var servlet = new PluginApiHelper(QGISServlet);
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
        url: apiRoot + '/qgis/address',
        data: position
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
        url: apiRoot + '/qgis/position',
        data: address
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
 
  return QGIS;
}]);
