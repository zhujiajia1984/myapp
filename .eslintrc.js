module.exports = {
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"env": {
		"es6": true,
		"browser": true,
		"node": true
	},
	"plugins": [
		"react",
		"import"
	],
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		},
		"allowImportExportEverywhere": false,
		"codeFrame": false
	},
	rules: {
		'no-console': 'off',
		'react/prop-types': 'warn',
		'no-unused-vars': 'warn'
	},
};