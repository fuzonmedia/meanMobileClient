angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  console.log('Dashboard');
})

.controller('MainCtrl', function($scope, $stateParams, AuthService,$rootScope,$state) {
  $rootScope.AuthCheck=AuthService.isAutheticate();
  $scope.Logout=function(){
    AuthService.logout();
    $rootScope.AuthCheck=false;
    $state.go('signin');
  };

  // Listen broadcast message for 404 - un authenticated from API
  $scope.$on('auth-not-authenticated', function(event) {
    AuthService.logout();
    $rootScope.AuthCheck=false;
    $state.go('signin');
    $ionicLoading.hide();
  });
})
.controller('WelcomeController', function($scope, $stateParams, AuthService) {
  //
})
.controller('SigninController', function($scope, $stateParams, AuthService,$location,$rootScope,$state,$ionicLoading,$cordovaToast) {
  $scope.user={};
  $scope.userLogin=function() {
    if($scope.user.username!=="" && $scope.user.password!=="" ){
      $ionicLoading.show();
      AuthService.login($scope.user).then(function(msg){
        $rootScope.AuthCheck=AuthService.isAutheticate();
        $state.go('app.dashboard');
      },function(msg){
        $cordovaToast
        .show(msg, 'long', 'center')
        .then(function(success) {
          // success
        }, function (error) {
          // error
        });
      })
      .finally(function(){
        $ionicLoading.hide();
      });
    }
    else {
      $cordovaToast
      .show('Invalid Username / Password', 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }
  };
})
.controller('RegisterController', function($scope, $stateParams, AuthService,$location,$rootScope,$state,$ionicLoading,$cordovaToast) {
  //
  $scope.user={};
  $scope.Register=function() {
    if($scope.user.username!=="" && $scope.user.password!=="" && $scope.user.name!=="" && $scope.user.country!=="" ){
      $ionicLoading.show();
      AuthService.signup($scope.user).then(function(msg){
        $cordovaToast
        .show('User Successfully Registered', 'long', 'center')
        .then(function(success) {
          // success
        }, function (error) {
          // error
        });
        $state.go('signin');
      },function(msg){
        $cordovaToast
        .show(msg, 'long', 'center')
        .then(function(success) {
          // success
        }, function (error) {
          // error
        });
      })
      .finally(function(){
        $ionicLoading.hide();
      });
    }
    else {
      $cordovaToast
      .show('Please fill all required field :  Name , Username , Password , Country ', 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }
  };
  console.log('register');
})
.controller('OrdersNewCtrl', function($scope, $stateParams, AuthService,$location,$rootScope,$state,$ionicLoading,$cordovaToast,order) {
  $scope.order={};
  $scope.CreateOrder=function(){
    //Start spinner
    $ionicLoading.show();
    order.post($scope.order).then(function(result){
      $cordovaToast
      .show('Order Created', 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
      $state.go('app.orders');
    },function(msg){
      $cordovaToast
      .show(msg, 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    })
    .finally(function(){
      $ionicLoading.hide();
    });
  };
  console.log('New Order');
})
.controller('OrdersUpdateCtrl', function($scope, $stateParams, AuthService,$location,$rootScope,$state,$ionicLoading,$cordovaToast,order) {
  // Pull order details
  $ionicLoading.show();
  order.get($stateParams.orderID).then(function(result){
    $scope.order=result;
  },function(msg){
    $cordovaToast
    .show(msg, 'long', 'center')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
  })
  .finally(function(){
    $ionicLoading.hide();
  });
  $scope.UpdateOrder=function(){
    $ionicLoading.show();
    order.put($scope.order).then(function(result){
      $cordovaToast
      .show('Order Updated', 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
      $state.go('app.order-detail',{orderID: $stateParams.orderID});
    },function(msg){
      $cordovaToast
      .show(msg, 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    })
    .finally(function(){
      $ionicLoading.hide();
    });
  };

  console.log('Update Order');
})
.controller('OrdersCtrl', function($scope, $stateParams, AuthService,$location,$rootScope,$state,$ionicLoading,$cordovaToast,order) {
  $ionicLoading.show();
  order.getAll().then(function(result){
    $scope.orders=result;
  },function(msg){
    $cordovaToast
    .show(msg, 'long', 'center')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
  })
  .finally(function(){
    $ionicLoading.hide();
  });

  $scope.deleteOrder=function(id,index){
    $ionicLoading.show();
    order.delete(id).then(function(result){
      $scope.orders.splice(index, 1);
    },function(msg){
      $cordovaToast
      .show(msg, 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    })
    .finally(function(){
      $ionicLoading.hide();
    });
  };
  console.log('Order');
})
.controller('OrderDetailCtrl', function($scope, $stateParams, AuthService,$location,$rootScope,$state,$ionicLoading,$cordovaToast,order,$ionicPopup) {
  $ionicLoading.show();
  order.get($stateParams.orderID).then(function(result){
    $scope.order=result;
  },function(msg){
    $cordovaToast
    .show(msg, 'long', 'center')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
  })
  .finally(function(){
    $ionicLoading.hide();
  });

  $scope.deleteOrder=function(id){

    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Order',
      template: 'Are you sure you want to delete ?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $ionicLoading.show();
        order.delete(id).then(function(result){
          $state.go('app.orders');
        },function(msg){
          $cordovaToast
          .show(msg, 'long', 'center')
          .then(function(success) {
            // success
          }, function (error) {
            // error
          });
        })
        .finally(function(){
          $ionicLoading.hide();
        });
      } else {
      }
    });
  };
  console.log('Order Details');
});
