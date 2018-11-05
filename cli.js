#!/usr/bin/env node

'use strict';

const meow = require('meow');
const chalk = require('chalk');
const got = require('got');
const Ora = require('ora');

// Meow configuration
const cli = meow(`
	Usage
	  $ weather <location> <options>

    Options
      --units, -u       Specify units (imperial or metrics)

	Examples
	  $ weather New York
	  $ weather Boston --units imperial
`, {
	flags: {
		units: {
			type: 'string',
			alias: 'u',
			default: 'metric'
		}
	}
});

const spinner = new Ora();

spinner.start('Fetching data...');

(async () => {
	try {
		const location = cli.input.join(' ') || 'Boston';

		// Fetch data from openweathermap api
		const response = await got(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${cli.flags.units}&APPID=a40636258ec257059436a5ac207bc5ac`, {json: true});

		// Generate weather report
		spinner.succeed('Weather report:\n');

		console.log(`${chalk.green.bold(response.body.name)}\n`);

		if (cli.flags.units === 'imperial') {
			console.log(`Temperature: ${response.body.main.temp} Fahrenheit`);
		} else {
			console.log(`Temperature: ${response.body.main.temp} Celsius`);
		}
		console.log('--------');
		console.log(`Pressure: ${response.body.main.pressure} HPa`);
		console.log(`Humidity: ${response.body.main.humidity} %`);
		console.log(`Cloudiness: ${response.body.clouds.all} %`);
		console.log(`Wind speed: ${response.body.wind.speed} km/h\n`);
	} catch (error) {
		spinner.fail('Something went wrong!');
		process.exit(1);
	}
})();
