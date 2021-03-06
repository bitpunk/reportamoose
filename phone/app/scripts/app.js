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

var phoneApp = angular.module('phoneApp', ["leaflet-directive", "ngDragDrop", "ngResource", "ngCookies", "angularLocalStorage"]);

phoneApp.run(function($rootScope, $resource, $http, storage) {
	$rootScope.Service = $resource('/services/:id', {
		id: "@service_code"
	}, {
		update: {
			method: 'PUT'
		}
	});

	$rootScope.Request = $resource('/requests/:id', {
		id: "@service_request_id"
	}, {
		update: {
			method: 'PUT'
		}
	});

	$rootScope.locations = [];
	$rootScope.report = {};
	$rootScope.showThankMessage = false;
	$rootScope.showDraftMessage = false;
	$rootScope.keepPosition = false;
	$rootScope.settings = {
		name: "",
		mail: "",
		city: ""
	};
	$rootScope.requestMarkers = [];
	$rootScope.issueMarkers = [];
	storage.bind($rootScope, 'draft', {});
});

phoneApp.filter('timestampToDate', function() {
	return function(timestamp) {
		if (timestamp === undefined) return;
		return convertDate(timestamp).toString("dd.MM.yyyy");
	};
});

phoneApp.filter('timestampToTime', function() {
	return function(timestamp) {
		if (timestamp === undefined) return;
		return convertDate(timestamp).toString("HH:mm");
	};
});

function convertDate(timestamp) {
	var string = timestamp.substr(0, timestamp.length - 5) + 'Z';
	var time = Date.parse(string);
	return time;
}

phoneApp.config(function($routeProvider, $compileProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/app.html',
			controller: 'AppCtrl'
		})
		.when('/report', {
			templateUrl: 'views/report.html',
			controller: 'ReportCtrl'
		})
		.when('/settings', {
			templateUrl: 'views/settings.html',
			controller: 'SettingsCtrl'
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