const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const habitat = require('habitat');

const ParseDashboard = require('parse-dashboard');

let env = new habitat('parseServer');
module.exports = ()=>{
  "use strict";

  console.log(env.all())
  let api = new ParseServer({
    databaseURI: env.get("database_uri") || 'mongodb://localhost:27017/dev',
    cloud: env.get("cloud_code_main") || __dirname + '/../cloud/main.js',
    appId: env.get("app_id") || 'myAppId',
    masterKey: env.get("master_key") || '', //Add your master key here. Keep it secret!
    restAPIKey: env.get("rest_key") || '', //Add your master key here. Keep it secret!
    javascriptKey: env.get("javascript_key") || '', //Add your master key here. Keep it secret!
    clientKey: env.get("client_key") || '', //Add your master key here. Keep it secret!
    serverURL: env.get("server_url")  || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
    liveQuery: {
      classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    }
  });


  let app = express();

// Serve static assets from the /public folder
  app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
  var mountPath = env.get("mount") || '/parse';
  app.use(mountPath, api);

  var dashboard = new ParseDashboard({
    "apps": [
      {
        "serverURL": env.get("server_url"),
        "appId": env.get("app_id"),
        "masterKey": env.get("master_key"),
        "appName": env.get("app_name")
      }
    ]
  });

// Parse Server plays nicely with the rest of your web routes
  app.get('/', function(req, res) {
    res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
  });

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
  app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/test.html'));
  });

  app.use('/dashboard', dashboard);


  var port = env.get("port") || 1337;
  var httpServer = require('http').createServer(app);
  httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
  });

// This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);

}




