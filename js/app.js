'use strict';

// This is how many plot objects will be instantiated to populate the plotGrid
const plotQty = 25; // index 0-24

// DOM REFERENCES

let gameArea = document.getElementById('gameArea');
let plotGrid = document.getElementById('plotGrid');
let inventoryGrid = document.getElementById('inventoryGrid');
let moneyDisplay = document.getElementById('moneyDisplay');


// GLOBAL VARIABLES

let user = new UserStats();

//Will not be saved, created at initialization:
let cropTypes = []; //List of all possible crop types implemented
let allItems = []; //List of all possible items the player could have in their inventory

//Will be saved/loaded:
let playerInventory = ['carrot_seeds', 'carrot_seeds', 'tomato_seeds']; //list of slugs
let plotGridState = []; //list of LivePlant objects and empty spaces
//add plant to specific index spot when planting
//remove from index space when harvesting

// DONE: variable to track which seed is selected for planting LAUREN
let currentItemSelected; //Tracks the slug of which seed or other item the user has clicked on, therefore readying it for planting. Used by SowSeedAtLocation()

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

// Show player money\
function renderPlayerMoney(){
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
}

//--> DONE: function to replace cursor icon with the seed icon when a seed is selected from store/inventory LAUREN
//--> DONE: function clear cursor graphic and reset to default LAUREN

function changeCursor(newCursorFilename) {
  //newCursor should be either the name of the item that the cursor changes to or it should be null, which makes the cursor the default one again. 
  let cursorElement = document.getElementsByTagName('body')[0];
  if (newCursorFilename !== null) {
    cursorElement.style.cursor = `url('/img/${newCursorFilename}.png'), auto`;
  }
  else {
    cursorElement.style.cursor = 'pointer';
  }
}


// **************************************************************  I N V E N T O R Y     F U N C T I O N S **************************************************************
//displays/refreshes the player's inventory as buttons
function drawInventory(inventory) {
  //inventoryGrid is our dom object

  playerInventory = ['carrot', 'carrot', 'tomato', 'tomato'];

  //clear out all inventoryslots from inventorygrid
  for (let i = 0; i < inventoryGrid.children.length; i++) {
    inventoryGrid.removeChild(inventoryGrid.lastChild);
  }

  //draws new inventory slots for each item in our inv
  for (let i = 0; i < playerInventory.length; i++) {
    // console.log(`Found item in player inventory: ${playerInventory[i]}`);

    let newSlot = document.createElement('div'); //Make a new slot for the item
    newSlot.className = 'inventorySlot';

    let newItemIcon = document.createElement('img'); //Make an image to display the item
    newItemIcon.src = 'img/seeds_tomato.png'; //Set the icon's source; TODO:  Template literal to dynamically set icon
    newItemIcon.className = 'itemIcon';
    newItemIcon.id = playerInventory[i];

    newSlot.appendChild(newItemIcon);

    inventoryGrid.appendChild(newSlot);
  }
  //inventoryslots get onclicks for ChangeSelectedItem(); or whatever

}

// function addItemToInventory(itemSlug) {

// }

// function removeItemFromInventory(itemSlug) {

// }

function changeSelectedItem(itemSlug) {
  currentItemSelected = itemSlug;
  changeCursor(itemSlug);

}

// function tryUseSelectedItem() {

// }



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

//TODO: reconstructor function, loops through retrieved localStorage object(s) and re-instantiates them MICHAEL
// The function retrievedUserData() is not complete

function reconstructObjFromLocal() {
  let parsedObjects = retrievedUserData();

  user = parsedObjects[0];
  console.log(parsedObjects[0]);
  // DISCUSS not necessary because the user object does not need to inherit any methods.
  // let user = new UserStats(
  //   parsedUser.totalPlayTime,
  //   parsedUser.totalMoneyGained,
  //   parsedUser.cropsHarvested,
  //   parsedUser.cropsGrown,
  //   parsedUser.nuggetsLearned,
  //   parsedUser.playerMoney);

  let parsedInventory = parsedObjects[1];
  playerInventory = parsedInventory;

  let parsedGrid = parsedObjects[2];
  // for (let i = 0; i < parsedObjects.length; i++){
  // console.log(parsedGrid);
  for (let j = 0; j < parsedGrid.length; j++) {
    let retrievedCrop = parsedGrid[j];
    if(retrievedCrop !== null){
      let restoredPlant = new LivePlant(
        retrievedCrop.cropSlug,
        retrievedCrop.locationIndex,
        retrievedCrop.age);
      plotGridState[j] = restoredPlant;
      console.log(`Added retrievedCrop ${retrievedCrop.cropSlug} to index ${j} in plotGridState`);
    }
  }
  //   let parsedInventory = new Item(
  //   Item[i].slug,
  //   Item[i].title,
  //   Item[i].sprite);

  // allItems.push(myParsedInventory);
}
// }


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
  cropElem.src = `../img/${this.cropSlug}_${ageStage}.png`;
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
function Item(slug, title, sprite) {
  this.slug = slug;
  this.title = title;
  this.sprite = sprite;
  allItems.push(this);
}

//Tracks longterm user stats & money, used on the stats page and saved to localStorage
function UserStats(totalPlayTime, totalMoneyGained ,cropsHarvested, cropsGrown, nuggetsLearned, playerMoney = 0) {
  this.totalPlayTime = totalPlayTime;
  this.totalMoneyGained = totalMoneyGained; //money may be nuggets
  this.cropsHarvested = cropsHarvested; //tracks harvest and sell
  this.cropsGrown = cropsGrown;
  this.nuggetsLearned = nuggetsLearned;
  this.playerMoney = playerMoney;
}

// *********************** EVENT HANDLER ********************************

function handleClick(event) {
  console.log(event.target);

  //If we clicked on a plot:
  if (event.target.className.includes('plot') || event.target.className.includes('crop')) {
    console.log('clicked on plot');
    let plotIndex = Number.parseInt(event.target.id);

    // If the clicked plot is inhabited by a LivePlant, we'll kill/harvest the plant and get our money from it
    if (event.target.className === 'crop') {
      plotGridState[plotIndex].killPlant();
      plotGridState[plotIndex] = undefined;
      // Adding money to user's money
      givePlayerMoney(150);
    }
    else if (!Number.isNaN(plotIndex) && typeof(currentItemSelected) === 'string') { // If the clicked plot is not inhabited by a LivePlant (plotIndex is N) then we'll sow a seed in it.
      console.log('Clicked empty plot');
      if (currentItemSelected !== null) {
        sowSeedAtLocation(plotIndex, currentItemSelected);
      }
    }
  }

  else if (event.target.className === 'itemIcon') {
    console.log('Clicked on inventory item');
    changeSelectedItem(event.target.id);
  }

  //If we didn't click on the above, let's deselect our current item.
  else {
    console.log('Clicked somewhere not meaningful');
    changeSelectedItem(null);
  }
  pushLocalStorage(); //saving user data
  //If we clicked on an item icon:
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
  // This is the event function to handle plant growth.
  // Per the event handler above, it fires every second.
  // It loops through the plotGridState array to call evalGrowth() method on any LivePlants
  for (let i in plotGridState) {
    if (plotGridState[i] && plotGridState[i].fullyGrown !== true) {
      plotGridState[i].age++;
      plotGridState[i].evalGrowth();
      pushLocalStorage();
    }
  }
}

// *********************** FUNCTION CALLS/ OBJECT INSTANTIATION ********************************

//  sprite arrays not necessary
//Feeding our Crop constructor new crops: function Crop(yieldQty, sellValue, growthTime, sprites, slug)
let potato = new Crop(1, 40, 30, [], 'potato');
let carrot = new Crop(1, 15, 15, [], 'carrot');
let corn = new Crop(3, 20, 45, [], 'corn');
let tomato = new Crop(20, 5, 60, [], 'tomato');


// Feeding new seed Items: potato, carrot, tomato, corn to Item constructor function: Item(slug, title, sprite)
let potatoSeeds = new Item('potato', 'Potato Seeds', 'potatoseeds');
let carrotSeeds = new Item('carrot', 'Carrot Seeds', 'carrotseeds');
let cornSeeds = new Item('corn', 'Corn Seeds', 'cornseeds');
let tomatoSeeds = new Item('tomato', 'Tomato Seeds', 'tomatoseeds');


/// *********************** Functions called upon pageload ***********************

initPlotGrid();

// let stringifiedUser = localStorage.getItem('user');

// let parsedInt = JSON.parse(stringifiedUser);

if (localStorage.getItem('user')){
  reconstructObjFromLocal();
}


if (user===undefined) {
  user = new UserStats();
}

drawInventory(playerInventory);
renderPlayerMoney();
globalTick();

// *********************** event listeners ***********************
gameArea.addEventListener('click', handleClick);

window.setInterval(globalTick, 1000);
