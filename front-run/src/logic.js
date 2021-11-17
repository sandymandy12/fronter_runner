require('dotenv').config()
const Web3 = require('web3')
const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk')
const ethers = require('ethers');
const fs = require('fs')
//const assert = require('assert');

let divider = "\n------------------------------------------------------\n"


let NETWORK, ACCOUNT, TOKEN_ADDRESS, EXCHANGE_ADDRESS, ETH_AMOUNT;

let token
let route
let weth
let provider
let signer
let uniswap
let chainId


// declare the token contract interfaces
tokenContract = new ethers.Contract(
  TOKEN_ADDRESS,
  ['function balanceOf(address owner) external view returns (uint)',
      'function decimals() external view returns (uint8)',
      'function approve(address spender, uint value) external returns (bool)'],
  signer
);

// declare the Uniswap contract interface
uniswap = new ethers.Contract(
  EXCHANGE_ADDRESS,
  ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
  SIGNER
);



async function run(){

    
  token = await Fetcher.fetchTokenData(chainId, TOKEN_ADDRESS)
  weth = WETH[chainId]
  const pair = await Fetcher.fetchPairData(token, weth, provider)
  route = new Route([pair], weth)

  initialTokenBalance = await tokenContract.balanceOf(ACCOUNT);
  
  if(true){
    subscription = web3.eth.subscribe('pendingTransactions', function (error, result) {})
        .on("data", function (transactionHash) {
            web3.eth.getTransaction(transactionHash)
              .then(function (transaction) {
                if(transaction && !trxflag){
                  parseTransactionData(transaction)
                }
              })
            .catch(function () {
              console.log("\x1b[1m\x1b[Bot]: WARNING! Promise error caught!\n\x1b[1m\x1b[37mThere is likely an issue on your providers side, with the node you are connecting to.\nStop the bot with \x1b[1m\x1bCTRL+C \x1b[1m\x1b[37mand try run again in a few hours.");
            //.catch((error) => {
            //  assert.isNotOk(error,'Promise error')
            })
        });

    
  }
}

async function executeTrxs(transactionDetails){
  if(trxflag){
    return
  }
  trxflag = true

  console.table([{
    'Transaction Hash': transactionDetails['hash'],
    'Observations': 'Valid Transaction',
    'Timestamp': Date.now()
  }])
  console.log(divider)
  console.log('\n\x1b[1m\x1b[37m[Bot]: Transaction spotted! - \x1b[32m', transactionDetails, "\x1b[0m\n");

  const buy = await buyTokens(transactionDetails)
  const sell = await sellTokens(transactionDetails)  
}

async function sellTokens(transactionDetails){
  const amountIn = tokensToSell

  if (amountIn.toString() !== '0'){
    const gasPrice = transactionDetails.gasPrice
    const newGasPrice = Math.floor(parseInt(gasPrice) - parseInt(1))
    const gasLimit = Math.floor(transactionDetails.gas * 1.3)

    const amountInHex = ethers.BigNumber.from(amountIn.toString()).toHexString();
    const ethAmount = ethers.utils.parseEther(ETH_AMOUNT);
    const amountOutMin = Math.floor(ethAmount * 0.01);
    const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
    const path = [token.address, weth.address];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();
  
    const nonceCount = await web3.eth.getTransactionCount(ACCOUNT)
    
    const tx = await uniswap.swapExactTokensForETH(
      amountInHex,
      amountOutMinHex,
      path,
      ACCOUNT,
      deadlineHex,
      { 
        nonce: nonceCount + 1,
        gasPrice: ethers.BigNumber.from(newGasPrice).toHexString(),
        gasLimit: ethers.BigNumber.from(gasLimit).toHexString()
      }
    );
    console.log('\x1b[1m\x1b[37m[Bot]: Your sell transaction was: \x1b[1m\x1b[32m', tx.hash, "\x1b[0m");
  }
}


async function buyTokens(transactionDetails){
  if(true){
    const gasPrice = transactionDetails.gasPrice
    const newGasPrice = Math.floor(parseInt(gasPrice) + parseInt(1))
    const gasLimit = Math.floor(transactionDetails.gas * 1.2)
    
    const inputEth = parseFloat(ETH_AMOUNT) * 0.99;
    const ethAmount = ethers.utils.parseEther(inputEth.toString());
    const trade = new Trade(route, new TokenAmount(weth, ethAmount), TradeType.EXACT_INPUT);
    const path = [weth.address, token.address];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();

    tokensToSell = trade.outputAmount.raw
    const amountOutHex = ethers.BigNumber.from(tokensToSell.toString()).toHexString();
    
    const ethAmt = parseFloat(ETH_AMOUNT) * 1.2;
    const amountInMax = ethers.utils.parseEther(ethAmt.toString());
    const amountInMaxHex = ethers.BigNumber.from(amountInMax.toString()).toHexString();
   
    const tx = await uniswap.swapETHForExactTokens(
      amountOutHex,
      path,
      ACCOUNT,
      deadlineHex,
      { 
        value: amountInMaxHex, 
        gasPrice: ethers.BigNumber.from(newGasPrice).toHexString(),
        gasLimit: ethers.BigNumber.from(gasLimit).toHexString()
      }
    );
    console.log('\x1b[1m\x1b[37m[Bot]: Your purchase transaction was: \x1b[1m\x1b[32m', tx.hash, "\x1b[0m");
  }
}

function print() {
  console.clear()
  console.log("\n")

  console.log('\x1b[1m\x1b[33m███████╗██████╗░░█████╗░███╗░░██╗████████╗░░░░░░██████╗░██╗░░░██╗███╗░░██╗███╗░░██╗███████╗██████╗░')
  console.log('\x1b[1m\x1b[33m██╔════╝██╔══██╗██╔══██╗████╗░██║╚══██╔══╝░░░░░░██╔══██╗██║░░░██║████╗░██║████╗░██║██╔════╝██╔══██╗')
  console.log('\x1b[1m\x1b[33m█████╗░░██████╔╝██║░░██║██╔██╗██║░░░██║░░░█████╗██████╔╝██║░░░██║██╔██╗██║██╔██╗██║█████╗░░██████╔╝')
  console.log('\x1b[1m\x1b[33m██╔══╝░░██╔══██╗██║░░██║██║╚████║░░░██║░░░╚════╝██╔══██╗██║░░░██║██║╚████║██║╚████║██╔══╝░░██╔══██╗')
  console.log('\x1b[1m\x1b[33m██║░░░░░██║░░██║╚█████╔╝██║░╚███║░░░██║░░░░░░░░░██║░░██║╚██████╔╝██║░╚███║██║░╚███║███████╗██║░░██║')
  console.log('\x1b[1m\x1b[33m╚═╝░░░░░╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░░░░░░░╚═╝░░╚═╝░╚═════╝░╚═╝░░╚══╝╚═╝░░╚══╝╚══════╝╚═╝░░╚═╝')

  console.log(divider)
}

run()
