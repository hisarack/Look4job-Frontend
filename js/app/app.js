'use strict'

var look4jobApp = angular.module('look4jobApp',['ngRoute','infinite-scroll']);

look4jobApp.config(['$routeProvider',
   function($routeProvider){
      $routeProvider.
         when("/index",{
            templateUrl:'view/companyList.html',
            controller:'companyListCtrl'
         }).
         when("/c/:companyId",{
            templateUrl:'view/company.html',
            controller:'companyDataCtrl'
         }).
         otherwise({
            redirectTo:'view/404.html'
         });
   }]);


look4jobApp.service('look4jobService',function($http){
   this.getCompanyList = function(callback_func,firstId){
      $http.get("http://li108-25.members.linode.com:3000/look4job/api/list/"+firstId+"/100.json")
      .success(function(data){
         callback_func(data);
      });
   }
   this.getCompany = function(callback_func,cid){
      console.log("http://li108-25.members.linode.com:3000/look4job/api/c/"+cid+".json");
      $http.get("http://li108-25.members.linode.com:3000/look4job/api/c/"+cid+".json")
      .success(function(data){
         callback_func(data);
      });
   }
});

look4jobApp.controller('companyListCtrl',function($scope,look4jobService){
   $scope.companyList = new Array();
   $scope.getCompanyList = function(){
      if($scope.isEnd==true){return;}
      look4jobService.getCompanyList(function(data){
         if(data.length==0){$scope.isEnd=true;return;}
         $scope.companyList.push.apply($scope.companyList,data);
         $scope.firstId=$scope.firstId+data.length;
      },$scope.firstId);
   }
   $scope.firstId=0;
   $scope.isEnd=false;
   $scope.getCompanyList();
});

look4jobApp.controller('companyDataCtrl',['$scope','$routeParams','look4jobService',function($scope,$routeParams,look4jobService){
   $scope.company = null;
   look4jobService.getCompany(function(data){
      $scope.company=data;
      console.log($scope.company);
   },$routeParams.companyId);
}]);

