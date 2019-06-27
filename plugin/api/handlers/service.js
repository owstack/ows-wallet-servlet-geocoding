'use strict';

angular.module('owsWalletPlugin.apiHandlers').service('service', [
	'qgisService',
  'owsWalletPluginClient.api.Utils',
function(qgisService, Utils) {

  var root = {};

  var REQUIRED_DATA = [];

  root.respond = function(message, callback) {
    // Check required parameters.
    var missing = Utils.checkRequired(REQUIRED_DATA, message.request.data);
    if (missing.length > 0) {
      message.response = {
        statusCode: 400,
        statusText: 'REQUEST_NOT_VALID',
        data: {
          message: 'The request does not include ' + missing.toString() + '.'
        }
      };
      return callback(message);
    }

    var clientId = message.header.clientId;
    var pluginConfig = message.request.data.config;

    if (!pluginConfig) {
      message.response = {
        statusCode: 500,
        statusText: 'REQUEST_NOT_VALID',
        data: {
          message: 'Missing required configuration.'
        }
      };
      return callback(message);
    }

    qgisService.init(clientId, pluginConfig).then(function() {

      message.response = {
        statusCode: 200,
        statusText: 'OK',
        data: {}
      };
      return callback(message);

    }).catch(function(error) {

      message.response = {
        statusCode: error.statusCode || 500,
        statusText: error.statusText || 'UNEXPECTED_ERROR',
        data: {
          message: error.message
        }
      };
      return callback(message);

    });

	};

  return root;
}]);
