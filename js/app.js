'use strict';

// This is how many plot objects will be instantiated to populate the plotGrid
const plotQty = 25; // index 0-24

// DOM REFERENCES

let gameArea = document.getElementById('gameArea');
let plotGrid = document.getElementById('plotGrid');
let inventoryGrid = document.getElementById('inventoryGrid');
let moneyDisplay = document.getElementById('moneyDisplay');


// GLOBAL VARIABLES

//Will not be saved, created at initialization:
let cropTypes = []; //List of all possible crop types implemented
let allItems = []; //List of all possible items the player could have in their inventory

//Will be saved/loaded:
let playerInventory = []; //list of slugs
let plotGridState = []; //list of LivePlant objects and empty spaces
//add plant to specific index spot when planting
//remove from index space when harvesting

// TODO: variable to track which seed is selected for planting LAUREN

// FUNCTIONS

function initPlotGrid() {
  // initial render of blank plots, aka populate DOM with plot elements and create an array of plot elements
  for (let i = 0; i < plotQty; i++) {
    let newPlot = document.createElement('div');
    newPlot.setAttribute('id', `${i}-plot`);
    newPlot.setAttribute('class', 'plot-div');
    plotGrid.appendChild(newPlot);
  }
}

function userMoney(number){
  user.playerMoney += number;
  user.totalMoneyGained += number;
  moneyDisplay.innerText = user.playerMoney +' nuggets';
}


//This function puts all of our save state and user data into local storage.
function pushLocalStorage(){
  let stringifiedUserData = JSON.stringify(user);
  localStorage.setItem('user',stringifiedUserData);
  // TODO: Stringify and save inventory and plotGridState LIESL
}


//TODO: function to replace cursor icon with the seed icon when a seed is selected from store/inventory LAUREN

//TODO: function clear cursor graphic and reset to default LAUREN

//TODO: function to retrieve localStorage data, returns the objects in a 3 element array [plotGridState, userData, inventory]  LIESL

//TODO: reconstructor function, loops through retrieved localStorage object(s) and re-instatiates them MICHAEL

// CONSTRUCTORS AND METHODS
// Constructor for crops
function Crop(yieldQty, sellValue, growthTime, sprites, slug) {
  this.yieldQty = yieldQty,
  this.sellValue = sellValue;
  this.growthTime = growthTime;
  this.sprites = sprites;
  this.slug = slug;
  cropTypes.push(this);
}

//Plant entity
function LivePlant(cropSlug, age = 0, needsWater = false, locationElem) {
  this.cropSlug = cropSlug,
  this.age = age,
  this.fullyGrown = false;
  this.needsWater = needsWater;
  this.locationElem = locationElem; //the DOM element of the plot space
  this.cropElem; //the DOM element of the crop image
}

// LivePlant method to render the plant
LivePlant.prototype.renderPlant = function(ageStage = 'growth1'){
  let cropElement = document.createElement('img');
  cropElement.src = `../img/${this.cropSlug}_${ageStage}.png`;
  cropElement.setAttribute('id',`${this.locationElem.id}-${this.cropSlug}`);
  if(this.cropElem){
    this.locationElem.removeChild(this.cropElem);
  }
  this.locationElem.appendChild(cropElement);
  this.cropElem = cropElement;
};

//*************     commit plant crime     *****************//
LivePlant.prototype.killPlant = function(){
  this.locationElem.removeChild(this.cropElem);
};

// TODO: method to check growth stage and render new sprite if needed JEFFREY
LivePlant.prototype.evalGrowth = function(){
  let livePlantSlug = this.cropSlug;
  let referenceCrop = cropTypes.find(element => element.slug === livePlantSlug);
  let stage = 'growth1';
  if (this.age >= referenceCrop.growthTime){
    this.fullyGrown = true;
    if(referenceCrop.slug === 'carrot'){
      stage = 'fullgrown';
    } else{
      stage = 'produce';
    }
  } else if (this.age >= (2/3)*referenceCrop.growthTime){
    stage = 'growth3';
  } else if (this.age >= (1/3)*referenceCrop.growthTime){
    stage = 'growth2';
  }
  this.renderPlant(stage);
};

//Items appear in the inventory.  For now only Seeds are items
function Item(slug, title, sprite) {
  this.slug = slug;
  this.title = title;
  this.sprite = sprite;
  allItems.push(this);
}

//Tracks longterm user stats & money, used on the stats page and saved to localStorage
function UserStats(playerMoney = 0){
  this.totalPlayTime;
  this.totalMoneyGained; //money may be nuggets
  this.cropsHarvested; //tracks harvest and sell
  this.cropsGrown;
  this.nuggetsLearned;
  this.playerMoney = playerMoney;
}



// *********************** EVENT HANDLER ********************************

function handleClick(event){
  console.log(event.target);
  let plotIndex = Number.parseInt(event.target.id);
  // If the clicked plot is inhabited by a LivePlant, we'll execute this block
  if(plotGridState[plotIndex]){
    console.log('theres a thing here');
    plotGridState[plotIndex].killPlant();
    plotGridState[plotIndex] = undefined;
    // Adding money to user's current and lifetime dollarinos/nuggets/lauren-potatoes
    userMoney(150);
  } else if (!Number.isNaN(plotIndex)){ // If the clicked plot is not inhabited by a LivePlant, aka plotIndex is NaN, then we'll sow a seed in it.
    console.log('we sowed a seed');
    sowSeedAtLocation(plotIndex,'corn');
  }
  console.log(plotIndex);
  console.log(user.playerMoney);
}

// have big event listener where we expect user to interact

// Event Handler Helper functions, which will inherit and use the originating event object

//Function called when player sows seeds
function sowSeedAtLocation(location, seedType){
  plotGridState[location] = new LivePlant(seedType, 0, false, event.target);
  plotGridState[location].renderPlant();
  //save the plotgridstate
}

window.setInterval(globalTick, 1000);

function globalTick(){
  // TODO: loop through plotGridState array to call evalGrowth() method JEFFREY
  for (let i in plotGridState){
    if(plotGridState[i] && plotGridState[i].fullyGrown !== true){
      plotGridState[i].age++;
      plotGridState[i].evalGrowth();
    }
  }
}

// *********************** FUNCTION CALLS/ OBJECT INSTANTIATION ********************************

// TODO call localStorage retrieval function LIESL

// TODO call object reconstructor function MICHAEL

let user = new UserStats;

// TODO instatiate new Crops: potato, carrot, tomato MICHAEL
let corn = new Crop(3, 200, 30, [], 'corn');

// TODO insatiate new seed Items: potato, carrot, tomato MICHAEL
let cornSeeds = new Item('cornseeds','Corn Seeds', 'cornseeds');

initPlotGrid();

//event listener
gameArea.addEventListener('click', handleClick);
