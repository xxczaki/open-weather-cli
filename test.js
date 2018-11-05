import test from 'ava';
import execa from 'execa';

test('No arguments', async t => {
	const ret = await execa.shell('node cli.js');
	t.regex(ret.stdout, /Boston/);
});

test('Help message', async t => {
	const ret = await execa.shell('node cli.js --help');
	t.regex(ret.stdout, /Usage/);
});

test('Version number', async t => {
	const {stdout} = await execa.shell('node cli.js --version');
	t.true(stdout.length < 6);
});

test('Custom location', async t => {
	const ret = await execa.shell('node cli.js --location "Poznan"');
	t.regex(ret.stdout, /Temperature/);
});

test('Use metric units', async t => {
	const ret = await execa.shell('node cli.js --units metric');
	t.regex(ret.stdout, /Celsius/);
});

test('Use imperial units', async t => {
	const ret = await execa.shell('node cli.js --units imperial');
	t.regex(ret.stdout, /Fahrenheit/);
});
