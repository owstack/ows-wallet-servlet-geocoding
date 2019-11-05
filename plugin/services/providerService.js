'use strict';

angular.module('owsWalletPlugin.services').factory('providerService', [
      'lodash',
function(lodash) {

  return {
    osm: {
      api: {
        key: '',
        url: 'https://nominatim.openstreetmap.org/search?format=json&q=',
        reverseUrl: 'https://nominatim.openstreetmap.org/reverse?format=json&'
      },
      info: {
        url: 'https://www.openstreetmap.org/',
        urlText: 'OpenStreet Map',
        attribution: 'Map data copyrighted OpenStreetMap contributors and available from https://www.openstreetmap.org.'
      },
      getLocationURI: function(latitude, longitude) {
        return 'lat=' + latitude + '&lon=' + longitude;
      },
      getAddress: function(data) {
        return lodash.get(data, 'address');
      },
      getStreet: function(address) {
        return lodash.get(address, 'number') + ' ' + lodash.get(address, 'street');
      },
      getCity: function(address) {
        return lodash.get(address, 'city');
      },
      getState: function(address) {
        return lodash.get(address, 'state');
      },
      getPostalCode: function(address) {
        return lodash.get(address, 'zip');
      },
      encodeAddress: function(address) {
        return encodeURI(
          address.number || '' + ',' +
          address.street || '' + ',' +
          address.city || '' + ',' +
          address.state || '' + ',' +
          address.postalCode || '' + ',' +
          address.country || ''
        );
      }
    },
    tamu: {
      api: {
        url: 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?apiKey={{apiKey}}&format=json&census=true&censusYear=2000|2010&notStore=false&version=4.10&',
        reverseUrl: 'https://geoservices.tamu.edu/Services/ReverseGeocoding/WebService/v04_01/HTTP/default.aspx?apiKey={{apiKey}}&format=json&notStore=false&version=4.10&'
      },
      info: {
        url: 'https://geoservices.tamu.edu/',
        urlText: 'Texas A&M Geoservices Services',
        attribution: 'Goldberg DW. 2019. Texas A&M University Geoservices. Available online at http://geoservices.tamu.edu. Last accessed 2019.'
      },
      getLocationURI: function(latitude, longitude) {
        return 'lat=' + latitude + '&lon=' + longitude;
      },
      getAddress: function(data) {
        var path = lodash.get(data, 'StreetAddresses');
        if (lodash.isArray(path)) {
          path = path[0];
        }
        return path;
      },
      getStreet: function(address) {
        return lodash.get(address, 'StreetAddress');
      },
      getCity: function(address) {
        return lodash.get(address, 'City');
      },
      getState: function(address) {
        var state = lodash.get(address, 'State');
        if (state.length > 2) {
          state = lodash.find(dataService.states, {name: state}).abbr;
        }
        return state.toUpperCase();
      },
      getPostalCode: function(address) {
        return lodash.get(address, 'Zip');
      },
      encodeAddress: function(address) {
        return encodeURI(
          'streetAddress=' + address.number || '' + '%' + address.street || '' + '&' +
          'city=' + address.city || '' + '&' +
          'state=' + address.state || '' + '&' +
          'zip=' + address.postalCode || ''
        );
      }
    },
    mapquest: {
      api: {
        url: 'http://www.mapquestapi.com/geocoding/v1/address?key={{apiKey}}&',
        reverseUrl: 'http://www.mapquestapi.com/geocoding/v1/reverse?key={{apiKey}}&includeRoadMetadata=true&includeNearestIntersection=true&'
      },
      info: {
        url: 'https://www.mapquest.com/',
        urlText: 'MapQuest',
        attribution: 'MapQuest, 2019.'
      },
      getLocationURI: function(latitude, longitude) {
        return 'location=' + latitude + ',' + longitude;
      },
      getAddress: function(data) {
        return lodash.get(data, 'results[0].locations[0]');
      },
      getStreet: function(address) {
        return lodash.get(address, 'street');
      },
      getCity: function(address) {
        return lodash.get(address, 'adminArea5');
      },
      getState: function(address) {
        return lodash.get(address, 'adminArea3').toUpperCase();
      },
      getPostalCode: function(address) {
        return lodash.get(address, 'postalCode');
      },
      encodeAddress: function(address) {
        return encodeURI(
          'location=' + address.number || '' + ' ' + address.street || '' + ',' +
          address.city || '' + ',' +
          address.state || '' + ',' +
          address.postalCode || ''
        );
      }
    }
  };

}]);
