'use strict';

angular.module('owsWalletPlugin').config(function($pluginConfigProvider) {

  /**
   * API routes for our service.
   * A match is made by searching routes in order, the first match returns the route.
   */
  $pluginConfigProvider.router.routes([
    { path: '/qgis/address',  method: 'GET', handler: 'getAddress' },
    { path: '/qgis/location', method: 'GET', handler: 'getLocation' }
  ]);

})
.run(function(qgisService) {

  owswallet.Plugin.ready(function() {

    // Do initialization here
    
  });

});
