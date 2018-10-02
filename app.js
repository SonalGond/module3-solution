(function () {
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    restrict:'E',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'menu',
    bindToController: true,
  };
  return ddo;
}

function FoundItemsDirectiveController(){
  var menu = this;
  menu.isEmpty = function(){
    if(!angular.isUndefined(menu.items) && menu.items.length === 0){
    return true;
  }
  else {
    return false;
  }
};
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var menu = this;

    menu.filter = function () {
    if(!angular.isUndefined(menu.searchTerm)){
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm.toLowerCase());

    promise.then(function(response) {
            menu.foundItem = response;
          }).catch(function(error){
                console.log(error.message);
              });
}
else {
  menu.isEmpty = function(){
    return true;
};
}
};


    menu.remove = function(index){
      menu.foundItem.splice(index,1);
    };
  }


   MenuSearchService.$inject = ['$http', 'ApiBasePath'];

   function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
           return $http({
               method: "GET",
               url: (ApiBasePath + "/menu_items.json")
           }).then(function success(result){
             var foundItem = [];
             result.data.menu_items.forEach(function(item) {
                  if (item.description.indexOf(searchTerm) != -1) {
                       foundItem.push({
                       name: item.name,
                       short_name: item.short_name,
                       description: item.description
                    });
                  }
               });
           return foundItem;
         });
      };
     }

}) ();
