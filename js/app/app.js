'use strict'

var look4jobApp = angular.module('look4jobApp',['ngRoute','infinite-scroll']);

look4jobApp.config(['$routeProvider',
   function($routeProvider){
      $routeProvider.
         when("/list/:keywordId",{
            templateUrl:'view/companyList.html',
            controller:'companyListCtrl'
         }).
         when("/c/:keywordId/:companyId",{
            templateUrl:'view/company.html',
            controller:'companyDataCtrl'
         }).
         when("/index",{
            redirectTo: '/list/1'
         }).
         otherwise({
            redirectTo:'view/404.html'
         });
   }]);


look4jobApp.service('look4jobService',function($http){
   this.getCompanyList = function(callback_func,firstId,keywordId){
      $http.get("http://li108-25.members.linode.com:3000/look4job/api/list/"+keywordId+"/"+firstId+"/100.json")
      .success(function(data){
         callback_func(data);
      });
   }
   this.getKeywordList = function(callback_func){
      $http.get("http://li108-25.members.linode.com:3000/look4job/api/keyword.json")
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

look4jobApp.controller('companyListCtrl',['$scope','$routeParams','look4jobService',function($scope,$routeParams,look4jobService){
   $scope.companyList = new Array();
   $scope.getCompanyList = function(){
      if($scope.isEnd==true){return;}
      look4jobService.getCompanyList(function(data){
         if($scope.companyList.length > 0){return;} //solve reload problem temply
         if(data.companies.length==0){$scope.isEnd=true;return;}
         $scope.companyList.push.apply($scope.companyList,data.companies);
         $scope.firstId=$scope.firstId+data.length;
         $scope.curKeywordName = data.name;
         $scope.curKeywordId = $routeParams.keywordId;
      },$scope.firstId,$routeParams.keywordId);
   }
   $scope.keywordList = new Array();
   $scope.getKeywordList = function(){
      look4jobService.getKeywordList(function(dataList){
         $scope.keywordList = dataList;
      });
   }
   $scope.firstId=0;
   $scope.isEnd=false;
   $scope.getCompanyList();
   $scope.getKeywordList();
}]);

look4jobApp.controller('companyDataCtrl',['$scope','$routeParams','look4jobService',function($scope,$routeParams,look4jobService){
   $scope.company = null;
   look4jobService.getCompany(function(data){
      $scope.company=data;
      $scope.curKeywordId = $routeParams.keywordId;
      console.log($scope.company);
   },$routeParams.companyId);
}]);

