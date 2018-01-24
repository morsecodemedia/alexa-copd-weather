'use strict';

// Configurations
const alexaSkillID	= 'amzn1.ask.skill.ff01e04f-92da-4146-9352-ee361adc6e53';
const alexaSDK 		= require('alexa-sdk');
const https 		= require('https');
const $q        	= require('q');
const addressPermissions = 'read::alexa:device:all:address'
const permissions = [addressPermissions]

// Local imports
const Handlers = require('./Handlers');

exports.handler = function (event, context, callback) {
	let alexa = alexaSDK.handler(event, context)

    alexa.skillID = alexaSkillID
    alexa.registerHandlers(Handlers)

    console.log(`Beginning execution for skill with skillID=${alexa.skillID}`)
    alexa.execute()
    console.log(`Ending execution for skill with skillID=${alexa.skillID}`)
}