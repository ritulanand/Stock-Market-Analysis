import { createChart, updateChartData } from "./createChart.js";

const Stocks = ['AAPL','MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

let currentStock = 'AAPL'; 
// let chart; 

let onemonthel = document.getElementById('1-month');
let threemonthel = document.getElementById('3-month');
let oneyear = document.getElementById('1-year');
let fiveyear = document.getElementById('5-year');

onemonthel.setAttribute("current-stock", currentStock);
threemonthel.setAttribute("current-stock", currentStock);
oneyear.setAttribute("current-stock", currentStock);
fiveyear.setAttribute("current-stock", currentStock);


document.getElementById('1-month').addEventListener('click', (e) => {
    const currentStockEl = e.target.getAttribute("current-stock");
    console.log("currentStockEl", currentStockEl)
    updateChartData(currentStockEl, '1mo', stockData);
})

document.getElementById('3-month').addEventListener('click', (e) => {
    const currentStockEl = e.target.getAttribute("current-stock");
    console.log("currentStockEl", currentStockEl)
    updateChartData(currentStockEl, '3mo', stockData);
})

document.getElementById('1-year').addEventListener('click', (e) => {
    const currentStockEl = e.target.getAttribute("current-stock");
    console.log("currentStockEl", currentStockEl)
    updateChartData(currentStockEl, '1y', stockData);
})

document.getElementById('5-year').addEventListener('click', (e) => {
    const currentStockEl = e.target.getAttribute("current-stock");
    console.log("currentStockEl", currentStockEl)
    updateChartData(currentStockEl, '5y', stockData);
})




async function fetchStockProfileData() {
    const response = await fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata');
    const data = await response.json();
    console.log('data', data);
    return data.stocksProfileData[0]; 
}

fetchStockProfileData();

// Fetch stock data for charting
async function fetchStockChartData() {
    const response = await fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata');
    const data = await response.json();
    console.log("data ???????",data )
    stockData = data.stocksData[0];
   console.log('data charting', stockData); 
   Object.keys(stockData).forEach((stockSymbol, i) => {
    console.log("stockData >>>>>", stockSymbol);
    console.log("stockSymbol fetch", stockData[stockSymbol])
    for(let stock in stockData[stockSymbol]){
        if(stockData[stockSymbol].hasOwnProperty(stock)){
            // const stockdata = stockStats[stock];
            console.log("stockinside", stock)
            console.log('//// inside', stockData[stockSymbol][stock]);

            createChart(currentStock, stock, stockData); // Render default chart for 'AAPL'
            
        }
    }
    
})
}   

fetchStockChartData();


let stockStats = {};
let stockProfiles = {};
let stockData = {}; // Store stock data for chart


async function fetchStockStats() {
    const response = await fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata');
    const data = await response.json();
    stockStats = data.stocksStatsData[0];  // Store stock data globally for later use
    console.log("stockStats >>>>>>>>", stockStats);
    stockProfiles = await fetchStockProfileData();
    renderStockList();
}
fetchStockStats();

async function renderStockList(){
    const stockListElement = document.getElementById('stockList');
    stockListElement.innerHTML = '';
    


    Object.keys(stockStats).forEach(stockSymbol  => {
        const stockdata = stockStats[stockSymbol];
        if(stockdata.bookValue !== undefined && stockdata.profit !== undefined){
        console.log('stocksymbol', stockSymbol);
        const listItem = document.createElement('li');
        const bookValue = stockStats[stockSymbol]?.bookValue || 'N/A';
        const profit = stockStats[stockSymbol]?.profit;
        const profitColor = profit > 0 ? 'green' : 'red';

        listItem.innerHTML = `
        <button class="btn-text">${stockSymbol}</button>
        <span class="bookValue">&nbsp; $${bookValue}</span>
        <span class="profit" style="color : ${profitColor};">&nbsp; ${profit > 0 ? (profit*1000).toFixed(2) : profit}%</span>
        `;

        listItem.onclick = () => handleStockClick(stockSymbol);
        stockListElement.appendChild(listItem);
        }
    })
}


function handleStockClick(stockSymbol){
    createChart(stockSymbol, '5y', stockData); // Default to 5-year data
    console.log("stockprofiles", stockProfiles);
    const stockProfile = stockProfiles[stockSymbol];
    console.log('stockprofile', stockProfile);

    //
    onemonthel.setAttribute("current-stock", stockSymbol);
    threemonthel.setAttribute("current-stock", stockSymbol);
    oneyear.setAttribute("current-stock", stockSymbol);
    fiveyear.setAttribute("current-stock", stockSymbol);
    //  
    
   
    const stockSummary = stockProfile?.summary || 'No summary available';
    const bookValue = stockStats[stockSymbol]?.bookValue ;
    const profile = stockStats[stockSymbol]?.profit;
    const profitColor = profile > 0 ? 'green' : 'red';
    document.getElementById('stockName').innerText = stockSymbol;
    document.getElementById('profit').innerText = `${(profile)}%`;
    if( document.getElementById('profit').classList.contains('green')){
        document.getElementById('profit').classList.remove('green');
    }
    if( document.getElementById('profit').classList.contains('red')){
        document.getElementById('profit').classList.remove('red');
    }
    document.getElementById('profit').classList.add(profitColor);
    
    document.getElementById('bookValue').innerText = `$${bookValue}`;
   
    document.getElementById('summary').innerText = `${stockSummary}`;
}




















