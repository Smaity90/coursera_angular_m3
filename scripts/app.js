(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems',FoundItemsDerective);

// Controller 
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl=this;
  
  // narrowItDown
  ctrl.narrowItDown=function(){
    ctrl.foundItems=null;
     ctrl.errorMsg=null;
     if(ctrl.searchTerm ==""){
       ctrl.errorMsg="Nothing Found";
     }else{
            var foundItems=MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            foundItems.then(function(result){
                if(result.length<1){
                  ctrl.errorMsg="Nothing Found";
                }else{
                  ctrl.foundItems=result;
                }
          }).catch(function(){
            console.log("something went wrong");
          }); 
     }
  };

  //Remove Items
  ctrl.removeFoundItem=function(index){
    ctrl.foundItems=MenuSearchService.removeFoundItem(index);
  };
  
}

//directive
function FoundItemsDerective(){
  var ddo={
     templateUrl:'template/itemfound.template.html',
     scope:{
       itemList:'<',
       errorMsg:'@',
       removeItem:'&removeFoundItem'
     }
  };
  return ddo;
}

// service
MenuSearchService.$inject=["$http","ApiBasePath"]
function MenuSearchService($http,ApiBasePath){
  var service =this;
   var foundItems=[];

  service.getMatchedMenuItems=function(searchTerm){
     return  $http({
          url:(ApiBasePath+"/menu_items.json"),
          method:"GET"
      }).then(function(result){
          foundItems=[];
          var menu_items=result.data.menu_items;
         
          for(var i=0;i<menu_items.length;i++){
            var item=menu_items[i];
            if(item.description.indexOf(searchTerm)!=-1){
              foundItems.push(item);
            }
          }
          return foundItems;
      },function(error){
          console.log("Error:"+error.data);
      });
  };// end of getMatchedMenuItems

  service.removeFoundItem=function(index){
     foundItems.splice(index,1);
    return foundItems;
  };

}

})();
