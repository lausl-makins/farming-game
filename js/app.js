'use strict';

// This is how many plot objects will be instantiated to populate the plotGrid
const plotQty = 25; // index 0-24

// DOM REFERENCES

let gameArea = document.getElementById('gameArea');
let plotGrid = document.getElementById('plotGrid');
let inventoryGrid = document.getElementById('inventoryGrid');

//Will not be saved, created at initialization:
let cropTypes = []; //List of all possible crop types implemented
let allItems = []; //List of all possible items the player could have in their inventory

//Will be saved/loaded:
let playerInventory = []; //list of slugs
let playerMoney = 0;
let plotGridState = []; //list of LivePlant objects and empty spaces
//add plant to specific index spot when planting
//remove from index space when harvesting


function initPlotGrid() {
  // initial render of blank plots, aka populate DOM with plot elements and create an array of plot elements
  for (let i = 0; i < plotQty; i++) {
    let newPlot = document.createElement('div');
    newPlot.setAttribute('id', `${i}-plot`);
    newPlot.setAttribute('class', 'plot-div');
    plotGrid.appendChild(newPlot);
  }
}

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
function LivePlant(cropSlug, age = 0, needsWater = false, location) {
  this.cropSlug = cropSlug,
  this.age = age,
  this.needsWater = needsWater;
  this.location = location; //the index number of the plot space
}




//Items appear in the inventory.  For now only Seeds are items
function Item(slug, title, sprite) {
  this.slug = slug;
  this.title = title;
  this.sprite = sprite;
  allItems.push(this);
}

//Tracks longterm user stats, used on the stats page and saved to localStorage
function UserStats(){
  this.totalPlayTime;
  this.totalMoneyGained; //money may be nuggets
  this.cropsHarvested; //tracks harvest and sell
  this.cropsGrown;
  this.nuggetsLearned;
}


let user = new UserStats;

//This function puts all of our save state and user data into local storage.
function pushLocalStorage(){
  let stringifiedUserData = JSON.stringify(user);
  localStorage.setItem('user',stringifiedUserData);
  //will be adding a save state later
  //save state is gamer term for all thats happened in gamer world that you've saved
}


// *********************** EVENT HANDLER ********************************

function handleClick(event){
  console.log(event.target.id);
  let plotIndex = Number.parseInt(event.target.id);
  console.log(plotIndex);
  sowSeedAtLocation(plotIndex,'potato');
}
// have big event listener where we expect user to interact

//Function called when player sows seeds
function sowSeedAtLocation(location, seedType){
  plotGridState[location] = new LivePlant(seedType, 0, false, location);
  let cropElement = document.createElement('img');
  cropElement.src = 'assets/lauren.jpg';
  event.target.appendChild(cropElement);
  //save the plotgridstate
}



// function saveGame{

// }

let corn = new Crop(3, 200, 30, [], 'corn');

let cornSeeds = new Item('cornseeds','Corn Seeds', 'cornseeds');

initPlotGrid();

//event listener
gameArea.addEventListener('click', handleClick);

