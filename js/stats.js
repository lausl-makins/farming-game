'use strict';

//Render pie chart on Farm Stats main page
const ctx = document.getElementById('pieChart').getContext('2d');

function renderChart() {
  console.log('tried to render chart');
  let productNames = [];
  let productVotes = [];
  let productViews = [];
  for (let i = 0; i < allProducts.length; i++) {
    productNames.push(allProducts[i].name);
    productVotes.push(allProducts[i].votes);
    productViews.push(allProducts[i].views);
  }
  const chartObj = {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [{
        label: '# of Views',
        data: productViews,
        backgroundColor: [
          'rgba(10, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(10, 99, 132, 1)'
        ],
        borderWidth: 1
      }, {
        label: '# of Votes',
        data: productVotes,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  const myChart = new Chart(ctx, chartObj);
}

renderChart();