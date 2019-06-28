'use strict';

angular.module('owsWalletPlugin').config(function($pluginConfigProvider) {

  /**
   * API routes for our service.
   * A match is made by searching routes in order, the first match returns the route.
   */
  $pluginConfigProvider.router.routes([
    { path: '/address',  method: 'GET', handler: 'getAddress' },
    { path: '/position', method: 'GET', handler: 'getPosition' },
    { path: '/service',  method: 'PUT', handler: 'service' }
  ]);

})
.run(function() {

  owswallet.Plugin.ready(function() {

    // Do initialization here
    
  });

});
