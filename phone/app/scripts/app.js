'use strict';

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	onDeviceReady: function() {
		console.log('REPORT - Device Ready!');
		document.addEventListener('offline', this.offline, true);
		angular.element(document).ready(function() {
			angular.bootstrap(document);
		});
	},
	offline: function() {
		alert("You need to be online in order to use this application!")
	}
};

app.initialize();

var phoneApp = angular.module('phoneApp', ["leaflet-directive"]);

phoneApp.run(function($rootScope) {
	$rootScope.locations = [];
	$rootScope.report = {};
	$rootScope.settings = {
		name: "",
		mail: "",
		city: ""
	};
});

phoneApp.config(function($routeProvider, $compileProvider) {
	$routeProvider
		.when('/app', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		})
		.when('/map', {
			templateUrl: 'views/map.html',
			controller: 'MapCtrl'
		})
		.when('/position', {
			templateUrl: 'views/position.html',
			controller: 'PositionCtrl'
		})
		.when('/picture', {
			templateUrl: 'views/picture.html',
			controller: 'PictureCtrl'
		})
		.when('/', {
			templateUrl: 'views/app.html',
			controller: 'AppCtrl'
		})
		.when('/report', {
			templateUrl: 'views/report.html',
			controller: 'ReportCtrl'
		})
		.when('/detail', {
			templateUrl: 'views/detail.html',
			controller: 'DetailCtrl'
		})
		.when('/settings', {
			templateUrl: 'views/settings.html',
			controller: 'SettingsCtrl'
		})
		.when('/store', {
			templateUrl: 'views/store.html',
			controller: 'StoreCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

phoneApp.factory('cordovaReady', function() {
	return function(fn) {
		var queue = [];
		var impl = function() {
			queue.push(Array.prototype.slice.call(arguments));
		};
		document.addEventListener('deviceready', function() {
			queue.forEach(function(args) {
				fn.apply(this, args);
			});
			impl = fn;
		}, false);
		return function() {
			return impl.apply(this, arguments);
		};
	};
});