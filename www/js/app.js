// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngResource','ngCordova'])

.run(function($ionicPlatform,AuthService,$rootScope,$state,$location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });


  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
    if (toState && toParams.auth && !AuthService.isAutheticate()) {
      $location.path('/welcome');
    }

    //Ignore login / register page to acceee when user already logged in & redirect to dashboard when user logged in
    if (toState && (toParams.auth===false|| toParams.auth===undefined) && AuthService.isAutheticate()) {
      $location.path('/app/dashboard');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MainCtrl'
  })

  // Each tab has its own nav history stack:
  .state('app.dashboard', {
    url: '/dashboard',
    cache: false,
    params: {auth:true},
    views: {
      'menuContent-1': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('app.orders', {
    url: '/orders',
    cache: false,
    params: {auth:true},
    views: {
      'menuContent-2': {
        templateUrl: 'templates/orders.html',
        controller: 'OrdersCtrl'
      }
    }
  })
  .state('app.order-detail', {
    url: '/orders/:orderID',
    cache: false,
    params: {auth:true},
    views: {
      'menuContent-2': {
        templateUrl: 'templates/order-detail.html',
        controller: 'OrderDetailCtrl'
      }
    }
  })
  .state('app.order-new', {
    url: '/orders-new',
    params: {auth:true},
    views: {
      'menuContent-2': {
        templateUrl: 'templates/orders-new.html',
        controller: 'OrdersNewCtrl'
      }
    }
  })
  .state('app.order-update', {
    url: '/order-update/:orderID',
    params: {auth:true},
    views: {
      'menuContent-2': {
        templateUrl: 'templates/orders-update.html',
        controller: 'OrdersUpdateCtrl'
      }
    }
  })

  // without signin
  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeController'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninController'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterController'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

})
.constant('API_ENDPOINT',{
  LOCAL_TOKEN_KEY: 'TokenKeyByFuzonmedia',
  url: 'https://rest-node-app.herokuapp.com/',
  signup: 'signup',
  login: 'authenticate',
  order: 'order'
})
// AuthInterceptor defined in service.js
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
