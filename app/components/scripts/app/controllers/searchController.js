var searchController = angular.module('searchController', ['ngEnter', 'theRecipeService', 'theDataService', 'ngAnimate', 'ngConfirm']);

searchController.controller('SearchController', ['$scope','$http', '$window','detailsService', 'dataService', function($scope, $http, $window, detailsService, dataService) {
  $scope.chosen_ingredients=[]
  $scope.recipes=[]
  $scope.dataArray=[]
  $scope.query_result = []  
  $scope.excluded_ingredients = []
  $scope.match="";
  $scope.topRecipes = [];
  $scope.pageTitle = "Add Ingredients";
  $scope.keywords ="";
  $scope.placeholder = "Search Ingredients...To exclude, type 'not' or 'no' followed by ingredient name";
  $scope.placeholderAlt = "Find ingredients you want to be in the recipe";
  $scope.hovertest=false;
  $scope.searchtype="keyword"

  $scope.clearData = function(){
    // location.reload();
    dataService.clearData();
    $scope.chosen_ingredients=[];
    $scope.dataArray=[];
    $scope.query_result = [];  
    $scope.excluded_ingredients = [];
    $scope.match="";
    $scope.recipes = [];
    $scope.topRecipes = []
    setTimeout(function(){
      $scope.recipes = [];
      $scope.topRecipes = [];

    }, 1000);

  }
  $scope.uniqueIngredient = function (name) {
    var return_value = true;
    $scope.chosen_ingredients.forEach(function(ingredient) {
      if (name.toLowerCase() == ingredient.name.toLowerCase()) {
        return_value = false;
        return;
      }
    });
    $scope.excluded_ingredients.forEach(function(ingredient) {
      if (name.toLowerCase() == ingredient.name.toLowerCase()){
        return_value = false;
        return;
      }
    });
    return return_value;
  }

  $scope.reset = function(){
       $scope.match = "";
       $scope.query_result.length = 0;
  }
  $scope.insert = function(ingredient){
    if($scope.pageTitle == "Search by Keywords"){
      $scope.keywords=ingredient;
      $scope.displayRecipes();
    }
    else{
      var display =false;
      if ((ingredient.toLowerCase().substr(0,4) == "not " ) || 
      (ingredient.toLowerCase().substr(0,3) == "no ")
      && $scope.uniqueIngredient(ingredient.substr(3, ingredient.length).trim())){ 
        dataService.addExcludedIngredient({name : ingredient.substr(3, ingredient.length).trim().toLowerCase()});
        $scope.excluded_ingredients.push({name : ingredient.substr(3, ingredient.length).trim().toLowerCase()}); 
        display = true;
      } else if ((ingredient.toLowerCase().substr(0,4) != "not ") && 
      (ingredient.toLowerCase().substr(0,3) != "no ") && $scope.uniqueIngredient(ingredient)){
        dataService.addChosenIngredient({name : ingredient.toLowerCase()});
        $scope.chosen_ingredients.push({name : ingredient.toLowerCase()}); 
        display = true;
      } 
      if(display){
        $scope.displayRecipes();
        $scope.reset();
      }
    }
  }

   /**
   * Queries API for ingredients that begin with match
   * Who: Jayd
   * @match  {string}     match the search input
   * @return {data}       result of our query
   */
  $scope.queryIngredients = function(match)
  {
    
    if($scope.pageTitle == "Search Recipes"){
      $scope.keywords=match;
      displayRecipes();
    }
    else{
      var postObject = {};
    var url = '/api/ingredients/';
      if ((match.toLowerCase().substr(0,3) == "not" || match.toLowerCase().substr(0,2) == "no") 
        && match.length > 4){
        postObject = {"ingredient" : match.substr(4, match.length)};
      } 
      else {
        postObject = {"ingredient" : match};
      }
      $http.post(url, postObject).success(function(data) {
        $scope.query_result = data;
      });
    }
  }
  $scope.switchAndDisplay = function(name){
      var display =false;
       if ($scope.match.toLowerCase().substr(0,4) == "not " && $scope.uniqueIngredient(name.name)) {
          dataService.addExcludedIngredient(name);
          $scope.excluded_ingredients.push(name);
          display = true;
      } else if ($scope.match.toLowerCase().substr(0,4) != "not " && $scope.uniqueIngredient(name.name)) {
          dataService.addChosenIngredient(name);
         $scope.chosen_ingredients.push(name);
          display = true;
      }
      if(display){
        $scope.displayRecipes();
        $scope.reset();
      }
  }
  $scope.remove = function(container, index){
      container.splice(index,1);
      if (container == $scope.chosen_ingredients)
        dataService.removeIngredient("chosen_ingredients", index);
      else
        dataService.removeIngredient("excluded_ingredients", index);
      
      $scope.displayRecipes();
  }
    $scope.details = function(index){
      var theRecipe, postObject;
      theRecipe = $scope.dataArray[index];
      postObject = {};
      // if _id exists, it's from our db
      if(theRecipe._id){
        postObject.recipeId = theRecipe._id;
        postObject.type = theRecipe.__t;
      }
      else{
        postObject.recipeId = theRecipe.id;
        postObject.type = "yummly";
      }
      $http.post("/api/compositions/", postObject).success(function(data) {
       if (detailsService.setData(data)){
          var id = data.__t ? "$"+data._id : data.id;
          $window.location.href = "/#/details/"+id; //redirecting the user to the details partial
        }
      });
        //had to do this here because when it is in the <a href>...the page loads faster than this $http request
  }
  $scope.load = function() {
    $scope.recipes = [];
    if (dataService.getExcludedIngredients().length > 0  || dataService.getChosenIngredients().length > 0){
      var url = '/api/compositions/withIngredients/'
      var allowedIngredients = new Array();
      dataService.getChosenIngredients().forEach(function(ingredient){
          allowedIngredients.push(ingredient.name);
          $scope.chosen_ingredients.push({name : ingredient.name});
      });
      var excludedIngredients = new Array();
      dataService.getExcludedIngredients().forEach(function(ingredient){
          excludedIngredients.push(ingredient.name);
          $scope.excluded_ingredients.push({name : ingredient.name});
      });
      var postObject = {"ingredients" : allowedIngredients, "excluded" : excludedIngredients, "meal" : $scope.meal};
          $scope.dataArray = dataService.getRecipes();
          $scope.dataArray.forEach(function(recipe){
              $scope.recipes.push(recipe); 
        });

          $scope.topRecipes[0] = dataService.getTopRecipe0();

          $scope.topRecipes[1] = dataService.getTopRecipe1();
        };
        $scope.meal = dataService.getMeal();
        $scope.cuisine = dataService.getCuisine();
        $scope.diet = dataService.getDiet();
        $scope.keywords = dataService.getKeywords();
         $scope.recipes.splice(0,2);
    }
    $scope.changeTitle= function() {
      if($scope.pageTitle == "Add Ingredients"){
        $scope.pageTitle = "Search by Keywords";
        $scope.placeholder = "Enter keyword, chef name, kitchen equipment, recipe name, etc.";
        $scope.placeholderAlt = "Find recipes by entering in keywords";
        $scope.searchtype = "ingredient";
      }
      else {
        $scope.pageTitle = "Add Ingredients";
        $scope.placeholder = "Search Ingredients...To exclude, type 'not' or 'no' followed by ingredient name";
        $scope.placeholderAlt = "Find ingredients you want to be in the recipe";
        $scope.searchtype = "keyword";
        
      }
      
    }
  $scope.displayRecipes = function() {
    $scope.recipes = [];
    $scope.topRecipes = []
    dataService.clearRecipes();
    dataService.clearTopRecipes();
    if ($scope.chosen_ingredients.length || $scope.keywords != "") {
      var url = '/api/compositions/withIngredients/'
      var allowedIngredients = new Array();
      dataService.getChosenIngredients().forEach(function(ingredient){
          allowedIngredients.push(ingredient.name);
      });
      var excludedIngredients = new Array();
      dataService.getExcludedIngredients().forEach(function(ingredient){
          excludedIngredients.push(ingredient.name);

      });
      dataService.addMeal($scope.meal);
      dataService.addCuisine($scope.cuisine);
      dataService.addDiet($scope.diet);
      dataService.addKeywords($scope.keywords);
      var postObject = {
        "ingredients" : allowedIngredients, 
        "excluded" : excludedIngredients, 
        "meal" : $scope.meal, 
        "diet" : $scope.diet, 
        "cuisine" : $scope.cuisine,
        "keywords" : $scope.keywords
      };
      $http.post(url, postObject).success(function(data) {
        $scope.dataArray = data;
          data.forEach(function(recipe){
            $scope.recipes.push(recipe);
              dataService.addRecipe(recipe);
        });
          
        //reset the topRecipes array
        $scope.topRecipes = [];
        var r1, r2;
        r1 = $scope.recipes[0];
        r2 = $scope.recipes[1];
        //add the top two recipes from the results to the topRecipes array
        $scope.topRecipes.push(r1);
        $scope.topRecipes.push(r2);
        //remove the top two recipes from the recipes array so we don't see them twice
        $scope.recipes.splice(0,2);
        //get the detailed recipe contents for our top recipes (need the larger image)
        var postObject1, postObject2;

        // construct postObjects
        postObject1 = r1 && r1._id ? {"recipeId" : r1._id, "type": r1.__t} : {"recipeId" : r1.id, "type": "yummly"};
        postObject2 = r2 && r2._id ? {"recipeId" : r2._id, "type": r2.__t} : {"recipeId" : r2.id, "type": "yummly"};
        $http.post("/api/compositions/", postObject1).success(function(data) {
          $scope.topRecipes[0] = data;
          dataService.addTopRecipe0(data);
        });
        $http.post("/api/compositions/", postObject2).success(function(data) {
          $scope.topRecipes[1] = data;
           dataService.addTopRecipe1(data);
        });  
      });
    }
  }
  $scope.load();
}]);