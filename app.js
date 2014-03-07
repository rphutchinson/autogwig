var request = require('request');
var argsParser = require("argsparser");

var gwigUserId = '<Your User ID - grab it from the chrome debug console>';
var gwigAuthHeader = 'Bearer <Your bearer token from Authorization header>';
var gwigToEmail = '<Whoever you want to send GWIG to>';
var gwigBaseUrl = 'https://app.gwig.com';

var placesApiKey = '<YOUR Google App API Key>';

var clArgs = argsParser.parse();
var place = clArgs['-p'];

var placesSearch = {
  uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  qs: {
        key: placesApiKey,
        location: '32.776566,-79.930922', //Charleston, SC
        radius: 30000,
        sensor: false,
        keyword: place
  },
  json: true
};

request(placesSearch, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var bestMatch = (body.results[0]);
    console.log("Using Place result for " + bestMatch.name);
    var gwigBody = {
      business:{
        name: bestMatch.name,
        placesId: bestMatch.id,
        reference: bestMatch.reference,
        categories: bestMatch.types,
        vicinity: bestMatch.vicinity,
        latitude: bestMatch.geometry.location.lat,
        longitude: bestMatch.geometry.location.long
      },
      tUser:{
          firstName: '<Your First Name>',
          lastName: '<Your Last Name>',
          email: '<email for your GWIG account>',
          isFBUser: '<true || false>'
      }
    };

    var createGwig = {
        uri: gwigBaseUrl + '/user/' + gwigUserId + '/referral/' + gwigToEmail,
        headers: {
          'Authorization': gwigAuthHeader,
          'content-type': 'application/json'
        },
        body: JSON.stringify(gwigBody),
        rejectUnauthorized: false,
    };
    console.log("Creating GWIG with body:");
    console.log(createGwig);

    request.post(createGwig, function (error, response, body){
      if(error){
          console.log(error);
      } else if(response.statusCode == 200){
          console.log('Successful GWIG for ' + gwigBody.business.name);
      } else {
          console.log('GWIG not created. Received status code ' + response.statusCode)
      }
    });
  }
});
