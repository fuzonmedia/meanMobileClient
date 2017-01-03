angular.module('starter.services', [])
.service('AuthService',function($q,$http,API_ENDPOINT){
  var AuthToken;
  var isAutheticate=false;

  function storeUserToken(token){
    isAutheticate=true;
    AuthToken=token;
    window.localStorage.setItem(API_ENDPOINT.LOCAL_TOKEN_KEY,token);
    $http.defaults.headers.common.Authorization = AuthToken;
  }

  function loadUserToken(){
    if(!isAutheticate || AuthToken===undefined){
      var token=window.localStorage.getItem(API_ENDPOINT.LOCAL_TOKEN_KEY);
      if(token){
        isAutheticate=true;
        AuthToken=token;
        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = AuthToken;
      }
    }
  }
  // try to load token when service is being called first time
  loadUserToken();

  var signup=function(user){
    return $q(function(resolve,reject){
      $http.post(API_ENDPOINT.url + API_ENDPOINT.signup ,user).then(function successCallback(response){
        if(response.data.success){
          return resolve(response.data.msg);
        }
        else {
          return reject(response.data.msg);
        }
      });
    });
  };


  var login=function(user){
    return $q(function(resolve,reject){
      $http.post(API_ENDPOINT.url + API_ENDPOINT.login ,user).then(function successCallback(response){
        if(response.data.success){
          storeUserToken(response.data.token);
          return resolve(response.data.token);
        }
        else {
          return reject(response.data.msg);
        }
      });
    });
  };

  var logout=function(){
    AuthToken=undefined;
    isAutheticate=false;
    window.localStorage.removeItem(API_ENDPOINT.LOCAL_TOKEN_KEY);
    $http.defaults.headers.common.Authorization = undefined;
  };
  return{
    login : login ,
    signup : signup,
    logout : logout,
    isAutheticate : function(){ return isAutheticate;}
  };
})
.factory('order',function($q,$http,API_ENDPOINT){
  return {
    getAll: function(){
      return $q(function(resolve,reject){
        $http.get(API_ENDPOINT.url + API_ENDPOINT.order).then(function successCallback(response){
          if(response.data.success){
            return resolve(response.data.result);
          }
          else {
            return reject(response.data.msg);
          }
        });
      });
    },
    get: function(_id){
      return $q(function(resolve,reject){
        $http.get(API_ENDPOINT.url + API_ENDPOINT.order + '/' + _id).then(function successCallback(response){
          if(response.data.success){
            return resolve(response.data.result);
          }
          else {
            return reject(response.data.msg);
          }
        });
      });
    },
    post: function(order){
      return $q(function(resolve,reject){
        $http.post(API_ENDPOINT.url + API_ENDPOINT.order,order).then(function successCallback(response){
          if(response.data.success){
            return resolve(response.data.msg);
          }
          else {
            return reject(response.data.msg);
          }
        });
      });
    },
    put: function(order){
      return $q(function(resolve,reject){
        $http.put(API_ENDPOINT.url + API_ENDPOINT.order + '/' + order._id,order).then(function successCallback(response){
          if(response.data.success){
            return resolve(response.data.result);
          }
          else {
            return reject(response.data.msg);
          }
        });
      });
    },
    delete: function(_id){
      return $q(function(resolve,reject){
        $http.delete(API_ENDPOINT.url + API_ENDPOINT.order + '/' + _id).then(function successCallback(response){
          if(response.data.success){
            return resolve(response.data.result);
          }
          else {
            return reject(response.data.msg);
          }
        });
      });
    }
  };
})
.factory('AuthInterceptor', function ($rootScope, $q) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: 'auth-not-authenticated',
      }[response.status], response);
      return $q.reject(response);
    }
  };
});
