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

console.log(parsedObjects) //not sure what the variable name is above 

function resonstructObjFromLocal(){
  //do I have objects in storage
  for (let i = 0; i < parsedObjects.length; i++){
    let myParsedGridState = new LivePlant(
    LivePlant[i].cropSlug,
    LivePlant[i].age,
    LivePlant[i].needsWater,
    LivePlant[i].locationElem,
    LivePlant[i].cropElem);

    let myParsedUserData = new UserStats(
    UserStats[i].totalPlayTime,
    UserStats[i].totalMoneyGained,
    UserStats[i].cropsHarvested,
    UserStats[i].cropsGrown,
    UserStats[i].nuggetsLearned,
    UserStats[i].playerMoney);

    let myParsedInventory = new Item(
    Item[i].slug, 
    Item[i].title, 
    Item[i].sprite);

    allItems.push(myParsedInventory);
  }

 
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
  this.needsWater = needsWater;
  this.locationElem = locationElem; //the DOM element of the plot space
  this.cropElem; //the DOM element of the crop image
}

// LivePlant method to render the plant
LivePlant.prototype.renderPlant = function(){
  let cropElement = document.createElement('img');
  cropElement.src = 'img/carrot_fullgrown.png';//`${cropSlug}_${age}.jpg` -> carrot_fullgrown.jpg
  cropElement.setAttribute('id',`${this.locationElem.id}-carrot`);
  this.locationElem.appendChild(cropElement);
  this.cropElem = cropElement;
};

//*************     commit plant crime     *****************//
LivePlant.prototype.killPlant = function(){
  this.locationElem.removeChild(this.cropElem);
};

// TODO: method to check growth stage and render new sprite if needed JEFFREY
// USE THIS NAME PLS evalGrowth()

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
    sowSeedAtLocation(plotIndex,'potato');
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
  console.log('tick');
  // TODO: loop through plotGridState array to call evalGrowth() method JEFFREY
}

// *********************** FUNCTION CALLS/ OBJECT INSTANTIATION ********************************

// TODO call localStorage retrieval function LIESL


// TODO call object reconstructor function to reconstruct items after pulling from local storage
resonstructObjFromLocal();


let user = new UserStats;
//  sprite arrays not necessary
//Feeding our Crop constructor new crops: function Crop(yieldQty, sellValue, growthTime, sprites, slug)
let potato = new Crop(1, 40, 30, [], 'potato');
let carrot = new Crop(1, 15, 15, [], 'carrot');
let corn   = new Crop(3, 20, 45, [], 'corn');
let tomato = new Crop(20, 5, 60, [], 'tomato');
let laurenPotato = new Crop(100, 1000, 1, [], 'laurenPotato');


// Feeding new seed Items: potato, carrot, tomato, corn to Item constructor function: Item(slug, title, sprite)
let potatoSeeds = new Item('potatoseeds','Potato Seeds', 'potatoseeds');
let carrotSeeds = new Item('carrotseeds','Carrot Seeds', 'carrotseeds');
let cornSeeds = new Item('cornseeds','Corn Seeds', 'cornseeds');
let tomatoSeeds = new Item('tomatoseeds','Tomato Seeds', 'tomatoseeds');
let laurenPotatoSeed = new Item('lpotatoseeds', 'L-Potato Seeds', 'laurenpotatoseeds')

initPlotGrid();

//event listener
gameArea.addEventListener('click', handleClick);
