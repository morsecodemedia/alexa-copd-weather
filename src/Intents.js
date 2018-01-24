'use strict';

/**
 * This file contains constant definitions of intents that we're
 * interested in for our skill.
 *
 * Refer to the following link for a list of built-in intents,
 * and what those intents do.
 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/standard-intents
 */

/**
 * TODO - Write a legit comment for this custom intent
 */
const GET_FORECAST = "GetForecast";

/**
 * This is an Amazon built-in intent.
 */
const AMAZON_HELP = "AMAZON.HelpIntent";

/**
 * This is an Amazon built-in intent.
 */
const AMAZON_CANCEL = "AMAZON.CancelIntent";

/**
 * This is an Amazon built-in intent.
 */
const AMAZON_STOP = "AMAZON.StopIntent";

module.exports = {
    "GET_FORECAST": GET_FORECAST,
    "AMAZON_HELP": AMAZON_HELP,
    "AMAZON_CANCEL": AMAZON_CANCEL,
    "AMAZON_STOP": AMAZON_STOP
};