'use strict';



// This is how many plot objects will be instantiated to populate the plotGrid
const plotQty = 25;

// DOM REFERENCES

let plotGrid = document.getElementById('plotGrid');
let inventoryGrid = document.getElementById('inventoryGrid');

//Will not be saved, created at initialization:
let cropTypes = []; //List of all possible crop types implemented
let allItems = []; //List of all possible items the player could have in their inventory

//Will be saved/loaded:
let playerInventory = []; //list of slugs
let playerMoney = 0;
let plotGridState = []; //list of LivePlant objects and empty spaces

function initPlotGrid() {
  // initial render of blank plots, aka populate DOM with plot elements and create an array of plot elements
  for (let i = 0; i < plotQty; i++) {
    let newPlot = document.createElement('div');
    newPlot.setAttribute('id', `plot-${i}`);
    newPlot.setAttribute('class', 'plot-div');
    plotGrid.appendChild(newPlot);
  }
}

// Constructor for 
function Crop(yieldQty, sellValue, growthTime, sprites, slug) {
  this.yieldQty = yieldQty,
  this.sellValue = sellValue;
  this.growthTime = growthTime;
  this.sprites = sprites;
  this.slug = slug;
  cropTypes.push(this);
}

function LivePlant(cropSlug, age = 0, needsWater = false, location) {
  this.cropSlug = cropSlug,
  this.age = age,
  this.needsWater = needsWater;
  this.location = location; //the index number of the plot space
}

//Function called when player sows seeds
function SowSeedAtLocation(location, seedType){
  plotGridState[location] = new LivePlant(seedType, 0, false, location);
  //save the plotgridstate
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
  this.totalMoneyGained;
}

// function saveGame{

// }

let corn = new Crop(3, 200, 30, [], 'corn');

let cornSeeds = new Item('cornseeds','Corn Seeds', 'cornseeds');

initPlotGrid();
