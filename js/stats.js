'use strict';

//Render pie chart on Farm Stats main page
const ctx = document.getElementById('pieChart').getContext('2d');

const chart = document.getElementById('pieChart'); //This is the canvas that holds our piechart.
const statsTableHolder = document.getElementById('statsTable'); //This is where we will instantiate our stats table into.
let user;

function loadUser() {
  let stringifiedUser = localStorage.getItem('user');
  user = JSON.parse(stringifiedUser);
  console.log(user);
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
  // Create table:
  // if (tableElem){
  tableElem = document.createElement('table');
  // }
  statsTableHolder.appendChild(tableElem);

  let timeString = computeTimeString();
  let totalHarvests = 0;
  for (let i in user.cropsHarvested){
    totalHarvests += user.cropsHarvested[i];
  }

  addRowToTable('Time played', timeString);
  addRowToTable('Total money earned', user.totalMoneyGained);
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
    hours = Math.floor(remainingSeconds/3600);
    remainingSeconds -= hours*3600;
  }
  if (user.totalPlayTime >= 60){
    minutes = Math.floor(remainingSeconds/60);
    remainingSeconds -= minutes*60;
  }
  return `${hours}:${minutes}:${remainingSeconds}`;
}

// function addHeadersToTable(table) {
//   //Adds a row consisting of our timeslot labels at the top of the table.
//   const tableHeadersElem = document.createElement('thead');
//   table.appendChild(tableHeadersElem);

//   //Adds a single blank heading, so there's room to put the city name
//   const blankHeader = document.createElement('th');
//   blankHeader.textContent = '';
//   tableHeadersElem.appendChild(blankHeader);

//   //Loops through list of times to populate headings
//   for (let i = 0; i < times.length; i++) {
//     const tableHeader = document.createElement('th');
//     tableHeader.textContent = times[i];
//     tableHeadersElem.appendChild(tableHeader);
//   }

//   //Adds final Daily Location Total header
//   const dailyLocationTotalHeader = document.createElement('th');
//   dailyLocationTotalHeader.textContent = 'Daily Location Total';
//   tableHeadersElem.appendChild(dailyLocationTotalHeader);
// }


// function addFootersToTable(table) {
//   //Adds a row consisting of our sales totals to the bottom of the table.
//   const tableFootersElem = document.createElement('thead');
//   table.appendChild(tableFootersElem);

//   //Adds a the "Totals" label
//   const totalsLabel = document.createElement('th');
//   totalsLabel.textContent = 'Totals';
//   tableFootersElem.appendChild(totalsLabel);

//   let dailyTotalsSum = 0;

//   //Loops through list of times to populate totals
//   for (let i = 0; i < times.length; i++) {
//     let hourlyTotal = 0;
//     for (let j = 0; j < cities.length; j++) {
//       hourlyTotal += cities[j].simulatedCookiesSoldPerHour[i];
//       dailyTotalsSum += cities[j].simulatedCookiesSoldPerHour[i];
//     }
//     const tableFooter = document.createElement('th');
//     tableFooter.textContent = hourlyTotal;
//     tableFootersElem.appendChild(tableFooter);
//   }}
