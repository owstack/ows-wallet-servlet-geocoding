'use strict';

angular.module('owsWalletPlugin.api.qgis').factory('getAddress', [
  'qgisService',
  'owsWalletPluginClient.api.Utils',
function(qgisService, Utils) {

	var root = {};

	var REQUIRED_DATA = [];

  root.respond = function(message, callback) {
    // Request parameters.
    var position = message.request.data.position;

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

    qgisService.getAddress(position).then(function(address) {
      var response = address;

      message.response = {
        statusCode: 200,
        statusText: 'OK',
        data: response
      };
      return callback(message);

    }).catch(function(error) {

      message.response = {
        statusCode: error.statusCode || 500,
        statusText: error.statusText || 'UNEXPECTED_ERROR',
        data: {
          message: error.message || error.toString()
        }
      };
      return callback(message);

    });

	};

  return root;
}]);
