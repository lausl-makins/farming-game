'use strict';

//Render pie chart on Farm Stats main page
const ctx = document.getElementById('pieChart').getContext('2d');

const chart = document.getElementById('pieChart'); //This is the canvas that holds our piechart.
const statsTableHolder = document.getElementById('statsTable'); //This is where we will instantiate our stats table into.
let user;

function loadUser() {
  let stringifiedUser = localStorage.getItem('user');
  user = JSON.parse(stringifiedUser);
}

function renderChart() {
  let cropNames = user.cropTypesForChart;
  let cropsGrown = user.cropsHarvested;

  const chartObj = {
    type: 'pie',
    data: {
      labels: cropNames,
      datasets: [{
        label: '# of Views',
        data: cropsGrown,
        backgroundColor: [
          'rgba(10, 99, 132, 0.2)',
          'rgba(255, 255, 132, 0.2)',
          'rgba(255, 255, 255, 0.2)',
          'rgba(0, 130, 132, 0.2)',
        ],
        borderColor: [
          'rgba(10, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
      }
    }
  };
  const myChart = new Chart(ctx, chartObj);
}

let tableElem;
loadUser();
renderChart();
renderStatsTable();

function renderStatsTable() {
  statsTableHolder.removeChild(statsTableHolder.childNodes[0]); //removes existing table so we dont draw duplicates
  tableElem = document.createElement('table');
  statsTableHolder.appendChild(tableElem);

  let timeString = computeTimeString();
  let totalHarvests = 0;
  for (let i in user.cropsHarvested){
    totalHarvests += user.cropsHarvested[i];
  }

  addRowToTable('Time played', timeString);
  addRowToTable('Total nuggets earned', user.totalMoneyGained);
  addRowToTable('Total crop Harvests', totalHarvests);
}


function addRowToTable(title, number) {
  let newRow = document.createElement('tr');
  let newCell = document.createElement('td');
  let newCell2 = document.createElement('td');
  newCell.textContent = title;
  newCell2.textContent = number;
  newRow.appendChild(newCell);
  newRow.appendChild(newCell2);
  tableElem.appendChild(newRow);
}

function computeTimeString() {
  let remainingSeconds = user.totalPlayTime;
  let hours = 0;
  let minutes = 0;
  if (remainingSeconds >= 3600){
    // Divides the remaining seconds by 3600 and rounds down to get hours
    hours = Math.floor(remainingSeconds/3600);
    // "Removes" the x hours worth of seconds from remaining seconds
    remainingSeconds -= hours*3600;
  }
  if (user.totalPlayTime >= 60){
    // Same process except we're dividing and multiplying by 60
    minutes = Math.floor(remainingSeconds/60);
    remainingSeconds -= minutes*60;
  }
  let secString = String(remainingSeconds);
  if (secString.length < 2){
    secString = `0${secString}`;
  }
  let minString = String(minutes);
  if (minString.length < 2){
    minString = `0${minString}`;
  }
  // Returns the time string in a template literal
  return `${hours}:${minString}:${secString}`;
}
