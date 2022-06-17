const express = require('express')
const app = express()
const port = 4000
var request = require('request')
const bodyPar = require('body-parser');
app.use(bodyPar.json()); 
app.use(bodyPar.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

let dataFormApi = "",nameOfCoin = "bitcoin", dataToChart = "";

async function resData(nameOfCoin){
    let marketData = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + nameOfCoin, function (err, resp, body) {
            dataFormApi = JSON.parse(body)
        resolve(dataFormApi)
        });
    })

    if(marketData){
    let marketChart = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + nameOfCoin + '/market_chart?vs_currency=pln&days=30', function (er, resp, body) {
            dataToChart = JSON.parse(body)
        resolve(dataFormApi)
        });
    })
}
}

app.get('/', async(req, res) => {
    await resData(nameOfCoin)
    res.render('index', { dataFormApi,dataToChart,nameOfCoin })
})

app.post('/', async (req, res) => {
    nameOfCoin = req.body.selectCoin;
    await resData(nameOfCoin)
    res.render('index', { dataFormApi,dataToChart,nameOfCoin })
})

app.listen(port, () => {
    console.log(`Uruchomiono pod adresem: http://localhost:${port}`)
})