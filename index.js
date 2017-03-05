const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const habitat = require('habitat');

const ParseDashboard = require('parse-dashboard');

let env = new habitat('parseServer');
module.exports = ()=> {
    "use strict";

    //console.log(env.all())

    let options = {
        databaseURI: env.get("database_uri") || 'mongodb://localhost:27017/dev',
        cloud: env.get("cloud_code_main") || __dirname + '/cloud/main.js',
        appId: env.get("application_id") || 'myAppId',
        masterKey: env.get("master_key") || '', //Add your master key here. Keep it secret!
        //restAPIKey: env.get("rest_key") || '', //Add your master key here. Keep it secret!
        //javascriptKey: env.get("javascript_key") || '', //Add your master key here. Keep it secret!
        //  clientKey: env.get("client_key") || '', //Add your master key here. Keep it secret!
        serverURL: env.get("url") || 'http://localhost:1337/parse'  // Don't forget to change to https if needed

    }

    console.log(options)


    let api = new ParseServer(options);


    let app = express();


    var mountPath = env.get("mount") || '/parse';

    app.use(mountPath, api);

    var apps={
        "apps": [
            {
                "serverURL": env.get("url"),
                "appId": env.get("application_id"),
                "masterKey": env.get("master_key"),
                "appName": env.get("name")
            }
        ]
    }
    console.log(apps)
    var dashboard = new ParseDashboard(apps);
    app.use('/dashboard', dashboard);
    app.listen(env.get("port"), function () {
        console.log('parse-server-example running on port 1337.');
    });
}