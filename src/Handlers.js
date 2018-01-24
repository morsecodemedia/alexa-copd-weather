'use strict';

const https 		= require('https');
const $q        	= require('q');
const alexaSkillID	= 'amzn1.ask.skill.ff01e04f-92da-4146-9352-ee361adc6e53';

// Internal imports
const AlexaDeviceAddressClient = require('./AlexaDeviceAddressClient');
const Intents = require('./Intents');
const Events = require('./Events');
const Messages = require('./Messages');

/**
 * This is the handler for the NewSession event.
 * Refer to the  Events.js file for more documentation.
 */
const newSessionRequestHandler = function() {
    console.info("Starting newSessionRequestHandler()");

    if(this.event.request.type === Events.LAUNCH_REQUEST) {
        this.emit(Events.LAUNCH_REQUEST);
    } else if (this.event.request.type === "IntentRequest") {
        this.emit(this.event.request.intent.name);
    }

    console.info("Ending newSessionRequestHandler()");
};

/**
 * This is the handler for the LaunchRequest event. Refer to
 * the Events.js file for more documentation.
 */
const launchRequestHandler = function() {
    console.info("Starting launchRequestHandler()");
    this.emit(":ask", Messages.WELCOME + Messages.WHAT_DO_YOU_WANT, Messages.WHAT_DO_YOU_WANT);
    console.info("Ending launchRequestHandler()");
};

/**
 * This is the handler for the SessionEnded event. Refer to
 * the Events.js file for more documentation.
 */
const sessionEndedRequestHandler = function() {
    console.info("Starting sessionEndedRequestHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending sessionEndedRequestHandler()");
};

/**
 * This is the handler for the Unhandled event. Refer to
 * the Events.js file for more documentation.
 */
const unhandledRequestHandler = function() {
    console.info("Starting unhandledRequestHandler()");
    this.emit(":ask", Messages.UNHANDLED, Messages.UNHANDLED);
    console.info("Ending unhandledRequestHandler()");
};

/**
 * This is the handler for the Amazon help built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonHelpHandler = function() {
    console.info("Starting amazonHelpHandler()");
    this.emit(":ask", Messages.HELP, Messages.HELP);
    console.info("Ending amazonHelpHandler()");
};

/**
 * This is the handler for the Amazon cancel built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonCancelHandler = function() {
    console.info("Starting amazonCancelHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending amazonCancelHandler()");
};

/**
 * This is the handler for the Amazon stop built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonStopHandler = function() {
    console.info("Starting amazonStopHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending amazonStopHandler()");
};

/**
 * This is the handler for our custom GetAddress intent.
 * Refer to the Intents.js file for documentation.
 */
const getForecastHandler = function() {
    console.info("Starting getForecastHandler()");
	getWeather( ( localTime, currentTemp, currentCondition, currentHumidity) => {
		// time format 10:34 PM
		// currentTemp 72
		// currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny
		this.emit(':tell', 'It is ' + localTime
			+ ' in Irvine, California.'
			+ currentTemp);
	});

	// console.info(this.event.context.System);

    // const consentToken = this.event.context.System.user.permissions.consentToken;

	// console.info('Consent Token:: '+ consentToken);

    // // If we have not been provided with a consent token, this means that the user has not
    // // authorized your skill to access this information. In this case, you should prompt them
    // // that you don't have permissions to retrieve their address.
    // if (!consentToken) {
    //     this.emit(":tellWithPermissionCard", Messages.NOTIFY_MISSING_PERMISSIONS, permissions);
    //     console.log("User did not give us permissions to access their address.");
    //     console.info("Ending getForecastHandler()");
    //     return;
    // }

    // const deviceID = this.event.context.System.device.deviceId;
    // const alexaAPIEndpoint = this.event.context.System.apiEndpoint;

    // const alexaDeviceAddressClient = new AlexaDeviceAddressClient(alexaAPIEndpoint, deviceID, consentToken);
    // let deviceAddressRequest = alexaDeviceAddressClient.getFullAddress();

    // deviceAddressRequest.then((addressResponse) => {
    //     switch(addressResponse.statusCode) {
    //         case 200:
    //             console.log('Address successfully retrieved, now responding to user.');
	// 			const address = addressResponse.address;
	// 			console.log('ADDRESS RSP :: '+addressResponse.address);
	// 			console.log('ADDRESS SET :: '+address);
	// 			// getWeather( ( localTime, currentTemp, currentCondition, currentHumidity) => {
	// 			// 	// time format 10:34 PM
	// 			// 	// currentTemp 72
	// 			// 	// currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny
	// 			// 	this.emit(':tell', 'It is ' + localTime
	// 			// 		+ ' in ' + data.city + '.'
	// 			// 		+ currentTemp);
	// 			// });
    //         break;
    //         case 204:
    //             // This likely means that the user didn't have their address set via the companion app.
    //             console.log("Successfully requested from the device address API, but no address was returned.");
    //             this.emit(":tell", Messages.NO_ADDRESS);
    //         break;
    //         case 403:
    //             console.log("The consent token we had wasn't authorized to access the user's address.");
    //             this.emit(":tellWithPermissionCard", Messages.NOTIFY_MISSING_PERMISSIONS, permissions);
    //         break;
    //         default:
    //             this.emit(":ask", Messages.LOCATION_FAILURE, Messages.LOCATION_FAILURE);
    //     }

    //     console.info("Ending getForecastHandler()");
    // });

    // deviceAddressRequest.catch((error) => {
    //     this.emit(":tell", Messages.ERROR);
    //     console.error(error);
    //     console.info("Ending getForecastHandler()");
	// });
};


let weatherAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: '/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
    method: 'GET'
};


function getWeather(callback) {

    let req = https.request(weatherAPI, res => {
        res.setEncoding('utf8');
        let returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            let channelObj = JSON.parse(returnData).query.results.channel;

            let localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            //let currentTemp = channelObj.item.condition.temp;
            let currentTemp = processTemp(channelObj.item.condition.temp);
            console.log(currentTemp);
            let currentCondition = channelObj.item.condition.text;

			let currentHumidity = channelObj.atmosphere.humidity;

            callback(localTime, currentTemp, currentCondition, currentHumidity);

        });

    });
    req.end();
};

function processHumidity(currentHumidity) {
	if (currentHumidity <= 15) {
		// Inhaling air with less than 10% humidity may dry out the mucus membranes.
	} else if (currentHumidity > 15 && currentHumidity <= 35) {
		// humidity is low, you are good
	} else if (currentHumidity > 35 && currentHumidity <= 49) {
		// humidity is more a concern
	} else if (currentHumidity >= 50) {
		// humidity is high enough to warrant concern, may exsaterbate symptoms
	}
};

function processCondition(currentCondition) {
	if (currentCondition == "Thunderstorms") {
		// beware
	}
}

function processTemp(currentTemp) {
	var tempResp = ' ';
	if (currentTemp <= 32) {
		tempResp += 'The current temperature is '+currentTemp+'. Cold air holds less water, making it very dry. Inhaling air with less than 10% humidity may dry out the mucus membranes. You may experience symptoms due to the current temperature.';
	} else if (currentTemp > 32 && currentTemp <= 59) {
		// meh
		tempResp += 'The current temperature is '+currentTemp+'. You are below the optimal temperature range and may experience symptoms due to the current temperature.';
	} else if (currentTemp >= 60 && currentTemp <= 77) {
		// good job
		tempResp += 'The current temperature is '+currentTemp+'. You are within the optimal temperature range and shouldn\'t have any symptoms due to the current temperature.';
	} else if (currentTemp > 78 && currentTemp <= 85) {
		// beware
		tempResp += 'The current temperature is '+currentTemp+'. You are above the optimal temperature range and may experience symptoms due to the current temperature.';
	} else if (currentTemp > 86) {
		// danger
		tempResp += 'The current temperature is '+currentTemp+'. You are above the optimal temperature range and may experience symptoms due to the current temperature.';
	}
	return tempResp;
}

const handlers = {};
// Add event handlers
handlers[Events.NEW_SESSION] = newSessionRequestHandler;
handlers[Events.LAUNCH_REQUEST] = launchRequestHandler;
handlers[Events.SESSION_ENDED] = sessionEndedRequestHandler;
handlers[Events.UNHANDLED] = unhandledRequestHandler;

// Add intent handlers
handlers[Intents.GET_FORECAST] = getForecastHandler;
handlers[Intents.AMAZON_CANCEL] = amazonCancelHandler;
handlers[Intents.AMAZON_STOP] = amazonStopHandler;
handlers[Intents.AMAZON_HELP] = amazonHelpHandler;

module.exports = handlers;