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
let playerInventory = ['carrot_seeds', 'carrot_seeds', 'tomato_seeds']; //list of slugs
let plotGridState = []; //list of LivePlant objects and empty spaces
//add plant to specific index spot when planting
//remove from index space when harvesting

// DONE: variable to track which seed is selected for planting LAUREN
let currentItemSelected = 'potato_seed'; //Tracks the slug of which seed or other item the user has clicked on, therefore readying it for planting. Used by SowSeedAtLocation()

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

function userMoney(number) {
  user.playerMoney += number;
  user.totalMoneyGained += number;
  moneyDisplay.innerText = user.playerMoney + ' nuggets';
}


//This function puts all of our save state and user data into local storage.
function pushLocalStorage() {
  let stringifiedUserData = JSON.stringify(user);
  localStorage.setItem('user', stringifiedUserData);
  // TODO: Stringify and save inventory and plotGridState LIESL
  let stringifiedInventory = JSON.stringify(playerInventory);
  localStorage.setItem('playerInventory',stringifiedInventory);
  let stringifiedGrid = JSON.stringify(plotGridState); 
  localStorage.setItem('plotGridState',stringifiedGrid);
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

  playerInventory = ['carrot_seeds', 'carrot_seeds', 'tomato_seeds', 'tomato_seeds'];

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



//TODO: function to retrieve localStorage data, returns the objects in a 3 element array [plotGridState, userData, inventory]  LIESL


let stringifiedInventory = localStorage.getItem('playerInventory');

let stringifiedGrid = localStorage.getItem('plotGridState');

function retrievedUserData() {
  // //test code start
  // let testData = localStorage.getItem('test');
  // console.log('test data', testData);
  // //test code end
  let stringifiedUserData = localStorage.getItem('user');
  console.log('this is my user data',stringifiedUserData);
  let stringifiedInventory = localStorage.getItem('plyaerInventory');
  console.log('this is my inventory data',stringifiedInventory);
  let stringifiedGrid = localStorage.getItem('plotGridState');
  console.log('this is my plot grid data',stringifiedGrid);

  //TODO render data on page 
  
} 



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
LivePlant.prototype.killPlant = function () {
  this.locationElem.removeChild(this.cropElem);
};

// This method checks growth stage and calls the renderPlant method with the growth stage as the argument
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
function UserStats(playerMoney = 0) {
  this.totalPlayTime;
  this.totalMoneyGained; //money may be nuggets
  this.cropsHarvested; //tracks harvest and sell
  this.cropsGrown;
  this.nuggetsLearned;
  this.playerMoney = playerMoney;
}



// *********************** EVENT HANDLER ********************************

function handleClick(event) {
  console.log(event.target);

  //If we clicked on a plot:
  if (event.target.className.includes('plot') || event.target.id.includes('plot')) {
    console.log('clicked on plot');
    let plotIndex = Number.parseInt(event.target.id);

    // If the clicked plot is inhabited by a LivePlant, we'll kill/harvest the plant and get our money from it
    if (plotGridState[plotIndex] !== undefined) {
      console.log(plotGridState);
      plotGridState[plotIndex].killPlant();
      plotGridState[plotIndex] = undefined;
      // Adding money to user's money
      userMoney(150);
    }
    else if (!Number.isNaN(plotIndex)) { // If the clicked plot is not inhabited by a LivePlant, aka plotIndex is NaN, then we'll sow a seed in it.
      console.log('Clicked empty plot');
      if (currentItemSelected !== null) {
        sowSeedAtLocation(plotIndex, currentItemSelected);
      }
    }

    console.log(plotIndex);
    console.log(user.playerMoney);
  }

  pushLocalStorage(); //saving user data 
}

  //If we clicked on an item icon:
  else if (event.target.className === 'itemIcon') {
    console.log('Clicked on inventory item');
    changeSelectedItem('seeds_tomato'); //TODO:  make this dynamic
  }

  //If we didn't click on the above, let's deselect our current item.
  else {
    console.log('Clicked somewhere not meaningful');
    changeSelectedItem(null);
  }
}

// Event Handler Helper functions, which will inherit and use the originating event object

//Function called when player sows seeds
function sowSeedAtLocation(location, seedType) {
  plotGridState[location] = new LivePlant(seedType, 0, false, event.target);
  plotGridState[location].renderPlant();
  changeSelectedItem(null);
  //save the plotgridstate  
}

window.setInterval(globalTick, 1000);


function globalTick(){
  // This is the event function to handle plant growth.
  // Per the event handler above, it fires every second.
  // It loops through the plotGridState array to call evalGrowth() method on any LivePlants
  for (let i in plotGridState){
    if(plotGridState[i] && plotGridState[i].fullyGrown !== true){
      plotGridState[i].age++;
      plotGridState[i].evalGrowth();
    }
  }
}

// *********************** FUNCTION CALLS/ OBJECT INSTANTIATION ********************************

// TODO call localStorage retrieval function LIESL


let stringifiedUser = localStorage.getItem('user');

let parsedInt = JSON.parse(stringifiedUser);

// TODO call object reconstructor function MICHAEL

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


/// *********************** Functions called upon pageload *********************** 
initPlotGrid();
drawInventory(playerInventory);

// *********************** event listeners *********************** 
gameArea.addEventListener('click', handleClick);
