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

let lastStoreUpdate = new Date(); //TODO:  Add this to our save file
//lastStoreUpdate stores the last Date the store updated, so we can reroll it on a new day


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
  lastStoreUpdate = JSON.parse(stringifiedLastStoreUpdate);
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
    if (referenceCrop.slug === 'carrot') {
      stage = 'fullgrown';
    } else {
      stage = 'produce';
    }
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
    console.log('clicked on plot');
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
    else if (!Number.isNaN(plotIndex) && typeof (currentItemSelected) === 'string') { // If the clicked plot is not inhabited by a LivePlant (plotIndex is N) then we'll sow a seed in it.
      console.log('Clicked empty plot');
      if (currentItemSelected !== null) {
        sowSeedAtLocation(plotIndex, currentItemSelected);
      }
    }
  }

  else if (event.target.className === 'itemIcon') {
    console.log('Clicked on inventory item');

    tryPurchaseItem(event.target.id);
    // changeSelectedItem(event.target.id);
  }

  //If we didn't click on the above, let's deselect our current item.
  else {
    console.log('Clicked somewhere not meaningful');
    changeSelectedItem(null);
  }
  pushLocalStorage(); //saving user data
}

function tryPurchaseItem(item) {
  //if we have enough money to buy, 
  let itemCost = allItems.find(element => element.slug === item).seedCost;
  if (user.playerMoney >= itemCost) {
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


// TODO: our new day checking still isn't working right :(
function initializeStore() {
  let currentDate = new Date(); //Temp variable to grab the system date
  currentDate.getDay();

  if (lastStoreUpdate!==null){

    //next line SHOULD check if the dates are different; new day condition "currentdate" is just a placholder
    if (currentDate===lastStoreUpdate) {
      console.log('New day detected');
      randomizeStoreContents(); //If it's a new day, we need to reroll what's in the store for the day. Fills playerInventory with random items
      lastStoreUpdate = currentDate; //Now we can use lastStoreUpdate to save and compare tomorrow's date
      // console.log(lastStoreUpdate);
    }
    else {
      //load store contents from memory
      console.log('Same day detected');
    }
  }
  // If the inventory is empty, randomize its contents
  // the OR conditional permits refreshing the store by deleting the localStorage date data
  if (playerInventory.length===0 || lastStoreUpdate===null){
    randomizeStoreContents();
  }
  drawInventory(playerInventory);
}

// function checkIfNewDay() { //returns true if lastStoreUpdate is a different day than the system's current time, false otherwise
//   // let currentDate = new Date();
//   // currentDate.getDay(); //grabs the real system time

//   // let tempCurrentDate = currentdate.getDay();
//   // let tempLastDate = lastStoreUpdate.getDay();

//   if (lastStoreUpdate !== null) {
//     console.log(`Last saved date: ${lastStoreUpdate.getDay()}
//     Current date: ${currentDate.getDay()}`);
//   }


//   if (lastStoreUpdate === null) { //If we don't have anything saved, it's the users first time playing, so it's treated as a new day
//     console.log('null store found');
//     return true;
//   }

//   else if (lastStoreUpdate.getDay === currentDate.getDay) { //if the store updated today, we dont need to reroll it
//     console.log('Store dates match, no need to update store');
//     return false;
//   }
//   else { //if lastStoreUpdate !== currentDate, reroll store
//     console.log('Different dates detected, rerolling store');
//     return true;
//   }
// }


// // Date checker
// const datesAreOnSameDay = (first, second) =>
//   first.getFullYear() === second.getFullYear() &&
//   first.getMonth() === second.getMonth() &&
//   first.getDate() === second.getDate();
// // end date checker


const qtyItemsInStore = 3; //how many items we want the store to have per day

function randomizeStoreContents() {
  console.log('Randomizing store contents...');
  playerInventory = []; //yes playerInventory represents the store contents lol

  for (let i = 0; i < qtyItemsInStore; i++) {
    let randomItem;
    // This do...while loop generates a randomItem, but will try again if it's already in the inventory
    do {
      randomItem = allItems[Math.floor(Math.random() * allItems.length)].slug;
    } while (playerInventory.includes(randomItem));
    playerInventory.push(randomItem); //gives the store a random item.
    console.log(`${allItems[1].slug}`);
  }
}


// *********************** FUNCTION CALLS/ OBJECT INSTANTIATION ********************************

//Feeding our Crop constructor new crops: function Crop(yieldQty, sellValue, growthTime, sprites, slug)
let potato = new Crop(1, 40, 30, [], 'potato');
let carrot = new Crop(1, 15, 15, [], 'carrot');
let corn = new Crop(3, 20, 45, [], 'corn');
let tomato = new Crop(20, 5, 60, [], 'tomato');


// Feeding new seed Items: potato, carrot, tomato, corn to Item constructor function: Item(slug, title, sprite, seedCost)
let potatoSeeds = new Item('potato', 'Potato Seeds', 'potatoseeds', 100);
let carrotSeeds = new Item('carrot', 'Carrot Seeds', 'carrotseeds', 40);
let cornSeeds = new Item('corn', 'Corn Seeds', 'cornseeds', 100);
let tomatoSeeds = new Item('tomato', 'Tomato Seeds', 'tomatoseeds', 50);

/// *********************** Functions called upon pageload ***********************

initPlotGrid();

// let stringifiedUser = localStorage.getItem('user');

// let parsedInt = JSON.parse(stringifiedUser);

if (localStorage.getItem('user')) {
  reconstructObjFromLocal();
  retrieveLastStoreUpdate(); //store update data is in a seperate function so I didn't mess up the object format lol
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
