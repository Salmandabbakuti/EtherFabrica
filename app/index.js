function getGreeting(){
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:5000'))

const contractAddress ='8dfd3ae680c7fdf7ba7f485cf31646fa6427f50d'; //modify with your deployed contract address
const abi =[{"constant":false,"inputs":[{"name":"_greeting","type":"string"}],"name":"greet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGreeting","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
const mycontract = web3.eth.contract(abi);
const contract= mycontract.at(contractAddress);
web3.eth.defaultAccount =web3.eth.accounts[0];

    let result=contract.getGreeting();
    document.getElementById("getGreeting").innerHTML=result;
    console.log("Getting greeting from Chain")
}

function greet() {
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:5000'))

const contractAddress = '8dfd3ae680c7fdf7ba7f485cf31646fa6427f50d'; //modify with your deployed contract address
const abi =[{"constant":false,"inputs":[{"name":"_greeting","type":"string"}],"name":"greet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGreeting","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
const mycontract = web3.eth.contract(abi);
const contract= mycontract.at(contractAddress);
web3.eth.defaultAccount =web3.eth.accounts[0];

    contract.greet(document.getElementById("greeting").value)
    console.log("Transaction Submitted..")
}
