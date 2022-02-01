'use strict';

// This is how many plot objects will be instantiated to populate the plotGrid
const plotQty = 25;

// DOM REFERENCES

let plotGrid = document.getElementById('plotGrid');
let inventoryGrid = document.getElementById('inventoryGrid');
let cropTypes = [];

function initPlotGrid() {
// initial render of blank plots, aka populate DOM with plot elements and create an array of plot elements
  for (let i = 0; i < plotQty; i++){
    let newPlot = document.createElement('div');
    newPlot.setAttribute('id',`plot-${i}`);
    newPlot.setAttribute('class','plot-div');
    plotGrid.appendChild(newPlot);
  }
}

function Crop(yieldQty,sellValue,growthTime,sprites,slug){
  this.yieldQty = yieldQty,
  this.sellValue = sellValue;
  this.growthTime = growthTime;
  this.sprites = sprites;
  this.slug = slug;
  cropTypes.push(this);
}

let corn = new Crop(3,200,30,[],'corn');

function LivePlant(cropSlug,age = 0,needsWater = false){
  this.cropSlug = cropSlug,
  this.age = age,
  this.needsWater = needsWater;
}

PlotContents


// function saveGame{

// }

initPlotGrid();
