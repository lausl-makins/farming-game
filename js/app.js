'use strict';

// This is how many plot objects will be instantiated to populate the plotGrid
const plotQty = 25; // index 0-24

// DOM REFERENCES

let gameArea = document.getElementById('gameArea');
let plotGrid = document.getElementById('plotGrid');
let inventoryGrid = document.getElementById('inventoryGrid');
let moneyDisplay = document.getElementById('moneyDisplay');


// GLOBAL VARIABLES
let user;

let currentDateCode = getCurrentDateCode();
// Gets and stores the current date in a string format 'YYYYMMDD' ei '202223' for Feb 3rd 2022

let currentItemSelected; //Tracks the slug of which seed or other item the user has clicked on, therefore readying it for planting. Used by SowSeedAtLocation()

//Will not be saved, created at initialization:
let cropTypes = []; //List of all possible crop types implemented
let allCropSlugs = [];
let allItems = []; //List of all possible items the player could have in their inventory

//Will be saved/loaded:
let playerInventory = []; //list of slugs. Technically, this is the store's inventory
let plotGridState = []; //list of LivePlant objects and empty spaces
//add plant to specific index spot when planting
//remove from index space when harvesting

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

function givePlayerMoney(number) {
  user.playerMoney += number;
  user.totalMoneyGained += number;
  renderPlayerMoney();
}

function spendPlayerMoney(number) {
  user.playerMoney -= number;
  // user.totalMoneyGained += number;
  renderPlayerMoney();
}

// Show player money
function renderPlayerMoney() {
  moneyDisplay.innerText = user.playerMoney + ' nuggets';
}


//This function puts all of our save state and user data into local storage.
function pushLocalStorage() {
  let stringifiedUserData = JSON.stringify(user);
  localStorage.setItem('user', stringifiedUserData);
  let stringifiedInventory = JSON.stringify(playerInventory);
  localStorage.setItem('playerInventory', stringifiedInventory);
  let stringifiedGrid = JSON.stringify(plotGridState);
  localStorage.setItem('plotGridState', stringifiedGrid);

  //Stores the currentDateCode as the lastStoreUpdate in localStorage
  let stringifiedDateCode = JSON.stringify(currentDateCode);
  localStorage.setItem('lastStoreUpdate', stringifiedDateCode);
}

//--> DONE: function to replace cursor icon with the seed icon when a seed is selected from store/inventory LAUREN
//--> DONE: function clear cursor graphic and reset to default LAUREN

function changeCursor(newCursorFilename) {
  //newCursor should be either the name of the item that the cursor changes to or it should be null, which makes the cursor the default one again. 
  let cursorElement = document.getElementsByTagName('body')[0];
  if (newCursorFilename !== null) {
    cursorElement.style.cursor = `url('/img/seeds_${newCursorFilename}.png'), auto`;
  }
  else {
    cursorElement.style.cursor = 'default';
  }
}


// **************************************************************  I N V E N T O R Y     F U N C T I O N S **************************************************************
//displays/refreshes the store's inventory as buttons.
function drawInventory(inventory) {
  //inventoryGrid is our dom object
  console.log('drawing inventory');

  //clear out all inventoryslots from inventorygrid
  for (let i = 1; i < inventoryGrid.children.length; i++) {
    inventoryGrid.removeChild(inventoryGrid.lastChild);
  }

  //draws new inventory slots for each item in our inv
  for (let i = 0; i < playerInventory.length; i++) {
    console.log(`Found item in store inventory: ${playerInventory[i]}`);

    let newSlot = document.createElement('div'); //Make a new slot for the item
    newSlot.className = 'inventorySlot';
    newSlot.innerText = `Price: ${allItems.find(element => element.slug === playerInventory[i]).seedCost}`;

    let newItemIcon = document.createElement('img'); //Make an image to display the item
    newItemIcon.src = `img/seeds_${playerInventory[i]}.png`; //Set the icon's source;
    newItemIcon.className = 'itemIcon';
    newItemIcon.id = playerInventory[i];

    newSlot.appendChild(newItemIcon);
    inventoryGrid.appendChild(newSlot);
  }
}

function changeSelectedItem(itemSlug) {
  currentItemSelected = itemSlug;
  changeCursor(itemSlug);
}

// This function retrieves localStorage data, returns the objects in a 3 element array [plotGridState, userData, inventory]  LIESL

function retrievedUserData() {
  let stringifiedUserData = localStorage.getItem('user');
  console.log('this is my user data', stringifiedUserData);
  let parsedUserData = JSON.parse(stringifiedUserData);
  let stringifiedInventory = localStorage.getItem('playerInventory');
  console.log('this is my inventory data', stringifiedInventory);
  let parsedInventory = JSON.parse(stringifiedInventory);
  let stringifiedGrid = localStorage.getItem('plotGridState');
  console.log('this is my plot grid data', stringifiedGrid);
  let parsedGrid = JSON.parse(stringifiedGrid);

  return [parsedUserData, parsedInventory, parsedGrid];
}

function retrieveLastStoreUpdate() {
  let stringifiedLastStoreUpdate = localStorage.getItem('lastStoreUpdate');
  console.log('This is my last store update data', stringifiedLastStoreUpdate);
  return JSON.parse(stringifiedLastStoreUpdate);
}

// The function retrievedUserData() is not complete

function reconstructObjFromLocal() {
  let parsedObjects = retrievedUserData();

  user = parsedObjects[0];

  let parsedInventory = parsedObjects[1];
  playerInventory = parsedInventory;

  let parsedGrid = parsedObjects[2];

  for (let j = 0; j < parsedGrid.length; j++) {
    let retrievedCrop = parsedGrid[j];
    if (retrievedCrop !== null) {
      let restoredPlant = new LivePlant(
        retrievedCrop.cropSlug,
        retrievedCrop.locationIndex,
        retrievedCrop.age);
      plotGridState[j] = restoredPlant;
    }
  }
}

function getCurrentDateCode() {
  let today = new Date();
  let dateCode = String(today.getFullYear());
  dateCode += today.getMonth()+1;
  dateCode += today.getDate();
  return dateCode;
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
  allCropSlugs.push(slug);
}

//Plant entity
function LivePlant(cropSlug, locationIndex, age = 0, needsWater = false) {
  this.cropSlug = cropSlug,
  this.age = age,
  this.fullyGrown = false;
  this.needsWater = needsWater;
  this.locationIndex = locationIndex; //the index which represents it's location in the plot grid
  // It's stored as a property since the LivePlant's methods need to perform DOM manipulation on itself
}

// LivePlant method to render the plant
LivePlant.prototype.renderPlant = function (ageStage = 'growth1') {
  let cropElem = document.createElement('img');
  // Get and assign the plant's parent element to a temporary variable
  let locationElem = document.getElementById(`${this.locationIndex}-plot`);
  cropElem.src = `img/${this.cropSlug}_${ageStage}.png`;
  // This ID must start with a number matching its index in the plotGridState
  // This way our onClick event handler behaves in a predictable way even if a crop is on top of a plot
  cropElem.id = `${this.locationIndex}-${this.cropSlug}`;
  cropElem.setAttribute('class', 'crop');
  if (locationElem.lastChild) {
    // If locationElem has a child, like another plant or the previous render of this plant, remove it!
    locationElem.removeChild(locationElem.lastChild);
  }
  // Now append the crop's element to the DOM so it can be seen and interacted with
  locationElem.appendChild(cropElem);
};

//*************     commit plant crime     *****************//
LivePlant.prototype.killPlant = function () {
  // Get and assign the plant's parent element to a temporary variable
  let locationElem = document.getElementById(`${this.locationIndex}-plot`);
  // Remove it's lastChild, which should be the img element rendered by this LivePlant.
  locationElem.removeChild(locationElem.lastChild);
};

// This method checks growth stage and calls the renderPlant method with the growth stage as the argument
LivePlant.prototype.evalGrowth = function () {
  let livePlantSlug = this.cropSlug;
  let referenceCrop = cropTypes.find(element => element.slug === livePlantSlug);
  let stage = 'growth1';
  if (this.age >= referenceCrop.growthTime) {
    this.fullyGrown = true;
    stage = 'produce';
  } else if (this.age >= (2 / 3) * referenceCrop.growthTime) {
    stage = 'growth3';
  } else if (this.age >= (1 / 3) * referenceCrop.growthTime) {
    stage = 'growth2';
  }
  this.renderPlant(stage);
};

//Items appear in the inventory.  For now only Seeds are items
function Item(slug, title, sprite, seedCost) {
  this.slug = slug;
  this.title = title;
  this.sprite = sprite;
  this.seedCost = seedCost;
  allItems.push(this);
}

//Tracks longterm user stats & money, used on the stats page and saved to localStorage
//The values assigned are the defaults for a new user
//This constructor function will not be called if the user's data already exists in localStorage
function UserStats() {
  this.totalPlayTime = 0;
  this.totalMoneyGained = 150; //money may be nuggets
  this.cropTypesForChart = allCropSlugs; // This array has all the crop type slugs, which is dynamically generated
  this.cropsHarvested = []; // Harvested crops are automatically sold, so we're only tracking this one array.
  this.nuggetsLearned = 0;
  this.playerMoney = 150;

}

// *********************** EVENT HANDLER ********************************

function handleClick(event) {
  console.log(event.target);

  //If we clicked on a plot:
  if (event.target.className.includes('plot') || event.target.className.includes('crop')) {
    let plotIndex = Number.parseInt(event.target.id);

    // If the clicked plot is inhabited by a LivePlant, we'll kill/harvest the plant and get our money from it
    if (event.target.className === 'crop' && plotGridState[plotIndex].fullyGrown) {
      let clickedPlantSlug = plotGridState[plotIndex].cropSlug;
      let slugIndex = allCropSlugs.indexOf(clickedPlantSlug);
      let referenceCrop = cropTypes.find(element => element.slug === clickedPlantSlug);
      user.cropsHarvested[slugIndex]++;
      plotGridState[plotIndex].killPlant();
      plotGridState[plotIndex] = null;
      // Adding money to user's money
      givePlayerMoney(referenceCrop.yieldQty * referenceCrop.sellValue);
    }
    // If the clicked plot is not inhabited by a LivePlant (plotIndex is NaN) and we have a seed selected, then we'll sow that seed in it.
    else if (!Number.isNaN(plotIndex) && typeof (currentItemSelected) === 'string') {
      if (currentItemSelected !== null) {
        sowSeedAtLocation(plotIndex, currentItemSelected);
      }
    }
  }

  else if (event.target.className === 'itemIcon') {

    tryPurchaseItem(event.target.id);
  }

  //If we didn't click on the above, let's deselect our current item.
  else {
    changeSelectedItem(null);
  }
  pushLocalStorage(); //saving user data
}

function tryPurchaseItem(item) {
  //if we have enough money to buy,
  let itemCost = allItems.find(element => element.slug === item).seedCost;
  // If the user has the money and has not already selected a seed to plant
  if (user.playerMoney >= itemCost && typeof (currentItemSelected) !== 'string') {
    changeSelectedItem(item);
    spendPlayerMoney(itemCost);
  }
}

// Event Handler Helper functions, which will inherit and use the originating event object

//Function called when player sows seeds
function sowSeedAtLocation(location, seedType) {
  plotGridState[location] = new LivePlant(seedType, location, 0, false);
  plotGridState[location].renderPlant();
  changeSelectedItem(null);
  //save the plotgridstate
}

function globalTick() {
  user.totalPlayTime++;
  // This is the event function to handle plant growth.
  // Per the event handler above, it fires every second.
  // It loops through the plotGridState array to call evalGrowth() method on any LivePlants
  for (let i in plotGridState) {
    if (plotGridState[i] && plotGridState[i].fullyGrown !== true) {
      plotGridState[i].age++;
      plotGridState[i].evalGrowth();
    }
  }
  pushLocalStorage();
}

// *********************** Store-Related Stuff ********************************


// Initializes the store, randomizing the store contents if the user has not played today
function initializeStore() {
  let lastStoreUpdate = retrieveLastStoreUpdate();

  if (lastStoreUpdate!==null){

    // Checks if global variable currentDateCode does NOT equal the previous session's day
    if (currentDateCode!==lastStoreUpdate) {
      console.log('New day detected');
      randomizeStoreContents(); //If it's a new day, we need to reroll what's in the store
    }
    else {
      //load store contents from memory
      console.log('Same day detected');
    }
  }
  if (playerInventory.length===0){
    randomizeStoreContents();
  }
  drawInventory(playerInventory);
}


const qtyItemsInStore = 3; //how many items we want the store to have per day

function randomizeStoreContents() {
  console.log('Randomizing store contents...');
  playerInventory = []; //yes playerInventory represents the store contents lol

  for (let i = 0; i < qtyItemsInStore; i++) {
    let randomItem;
    // Generates a randomItem, but this do...while loop will try again if it's already in the inventory
    do {
      randomItem = allItems[Math.floor(Math.random() * allItems.length)].slug;
    } while (playerInventory.includes(randomItem));
    playerInventory.push(); //gives the store a random item.
    console.log(`${allItems[1].slug}`);
  }
}


// *************** FUNCTION CALLS/ OBJECT INSTANTIATION *********************

//Feeding our Crop constructor new crops: function Crop(yieldQty, sellValue, growthTime, sprites, slug)
let potato = new Crop(10, 20, 30, [], 'potato');
let carrot = new Crop(1, 30, 15, [], 'carrot');
let corn = new Crop(3, 80, 45, [], 'corn');
let tomato = new Crop(20, 5, 60, [], 'tomato');


// Feeding new seed Items: potato, carrot, tomato, corn to Item constructor function: Item(slug, title, sprite, seedCost)
let potatoSeeds = new Item('potato', 'Potato Seeds', 'potatoseeds', 100);
let carrotSeeds = new Item('carrot', 'Carrot Seeds', 'carrotseeds', 10);
let cornSeeds = new Item('corn', 'Corn Seeds', 'cornseeds', 80);
let tomatoSeeds = new Item('tomato', 'Tomato Seeds', 'tomatoseeds', 40);

/// *********************** Functions called upon pageload ***********************

initPlotGrid();

// let stringifiedUser = localStorage.getItem('user');

// let parsedInt = JSON.parse(stringifiedUser);

if (localStorage.getItem('user')) {
  reconstructObjFromLocal();
}


if (user === undefined) {
  user = new UserStats();
}

initializeStore();
renderPlayerMoney();
globalTick();


// *********************** event listeners ***********************
gameArea.addEventListener('click', handleClick);

window.setInterval(globalTick, 1000);
