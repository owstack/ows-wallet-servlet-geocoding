'use strict';

angular.module('owsWalletPlugin').config(function($pluginConfigProvider) {

  /**
   * API routes for our service.
   * A match is made by searching routes in order, the first match returns the route.
   */
  $pluginConfigProvider.router.routes([
    { path: '/openstreetmap/address',  method: 'GET', handler: 'getAddress' },
    { path: '/openstreetmap/location', method: 'GET', handler: 'getLocation' }
  ]);

})
.run(function(openStreetMapService) {

  owswallet.Plugin.ready(function() {

    // Do initialization here
    
  });

});
