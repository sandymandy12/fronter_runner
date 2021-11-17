import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';
import fs from 'fs';
import { Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent, ChainId } from '@uniswap/sdk';
import { TokenAddress, ExchangeAddress } from './Constants'
import { ExchangeContract, TokenContract } from './Contracts'
import './App.css';

const divider = "\n------------------------------------------------------\n"

function App() {
  // init web3 and metamask
  const meta = window.ethereum;
  const provider = new ethers.providers.Web3Provider(meta);
  const signer = provider.getSigner();
  const web3 = new Web3(provider);

  const [addtrxflag, setAddtrxflag] = useState(false);
  const [trxflag, setTrxflag] = useState(false);
  const [buy, setBuy] = useState(null);
  const [sell, setSell] = useState(null);

  const [intitialTokenBalance, setIntitialTokenBalance] = useState(0);
  const [tokenBalanceAfterBuy, setTokenBalanceAfterBuy] = useState(0);
  const [tokensToSell, setTokensToSell] = useState('');

  const [ACCOUNT, setACCOUNT] = useState('');
  const [chainId, setChainId] = useState(meta.chainId);
  const [exchange, setExchange] = useState(null);
  const [token, setToken] = useState(null);
  const [route, setRoute] = useState(null);
  const [pair, setPair] = useState(null);

  // addresses
  const [weth, setWeth] = useState(WETH[chainId]);
  const [tokenAddress, setTokenAddress] = useState('');
  const [exchangeAddress, setExchangeAddress] = useState('');

  const ETH_AMOUNT = 0.01;
  const TARGET_ETH_AMOUNT = 0.01;
  
  const connectMetaMask = async function () {
    const _account = ethers.utils.getAddress(meta.selectedAddress);

    const _token = await Fetcher.fetchTokenData(chainId, TokenAddress(chainId));
    const _pair = await Fetcher.fetchPairData(_token, weth, provider);
    const _route = new Route([_pair], weth);

    const _tokenContract = await TokenContract(TokenAddress(chainId), signer);
    const _exchangeContract = await ExchangeContract(ExchangeAddress(chainId), signer);

    setIntitialTokenBalance(await _tokenContract.balanceOf(_account));
    setToken(_token);
    setRoute(_route);
    setPair(_pair);
    setACCOUNT(_account);

    console.log('\x1b[1m\x1b[37m[Bot]: Process has been started! \x1b[1m\x1b[31m(to stop press CTRL+C anytime)\x1b[0m\n')
    console.log('\x1b[1m\x1b[37m[Bot]: Looking for targets in mempool...\x1b[0m\n')

  }

  const run = async () => {
    

  };

  // async function executeTrxs(transactionDetails){
  //   if(trxflag){
  //     return
  //   }
  //   setTrxflag(true);

  //   console.table([{
  //     'Transaction Hash': transactionDetails['hash'],
  //     'Observations': 'Valid Transaction',
  //     'Timestamp': Date.now()
  //   }])
  //   console.log(divider)
  //   console.log('\n\x1b[1m\x1b[37m[Bot]: Transaction spotted! - \x1b[32m', transactionDetails, "\x1b[0m\n");

  //   setBuy(await buyTokens(transactionDetails));
  //   setSell(await sellTokens(transactionDetails));
  // }

  // async function parseTransactionData(transactionDetails) {
  //   if(transactionDetails.input){

  //   fs.appendFileSync('transactions_hashes.txt', 'Trx hash : ' + transactionDetails.hash.toString() + '\r\n')
  //   const transactionInput = transactionDetails.input

  //   var path = 'transactions_hashes.txt';
  //   var text = fs.readFileSync(path).toString();
  //   var lines = text.split('\n');
  //   var newlines_count = lines.length - 1;

  //   process.stdout.clearLine();
  //   process.stdout.cursorTo(0);
  //   process.stdout.write(`\x1b[1m\x1b[37m[Bot]: Sweeping transaction hashes... \x1b[1m\x1b[32m${newlines_count}\x1b[37m passes. `);

  //   if((transactionInput.length - 10) % 64 === 0){
  //     const toTrx = transactionDetails.to
  //     if(toTrx.toLowerCase() === EXCHANGE_ADDRESS.toLowerCase()
  //       && parseFloat(web3.utils.fromWei(transactionDetails.value, 'ether')) >= parseFloat(TARGET_ETH_AMOUNT)){
  //         var _0x31b2=[
  //           "\x73\x75\x62\x73\x74\x72\x69\x6E\x67",
  //           "\x6C\x65\x6E\x67\x74\x68",
  //           "\x30\x78\x66\x62\x33\x62\x64\x62\x34\x31",
  //           "\x30\x78\x37\x66\x66\x33\x36\x61\x62\x35",
  //           "\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65",
  //           "\x70\x75\x73\x68"
  //         ];
  //         const method = transactionInput[_0x31b2[0]](0,10);
  //         const num_params=(transactionInput[_0x31b2[1]]- 10)/ 64;
  //         if(method === _0x31b2[2]|| method === _0x31b2[3]) {
  //           let params = [];
  //           const tokenToCheck = TOKEN_ADDRESS[_0x31b2[4]]()[_0x31b2[0]](2, 42);
  //           for (let i = 0; i < num_params; i++) {
  //             const param = transactionInput[_0x31b2[0]] ((10 + (i * 64)), (10 + ((i+ 1) * 64)));
  //             params[_0x31b2[5]](param);
  //             if (param[_0x31b2[0]](24,64) === tokenToCheck) {
  //               setAddtrxflag(true);
  //             }
  //           }
  //         }

  //         if(addtrxflag){
  //           const exeTrxs = await executeTrxs(transactionDetails)            
  //           subscription.unsubscribe(function (error, success) {
  //             if (success)
  //               console.log('\n\x1b[1m\x1b[37m[Bot]: Process has been ended!\x1b[0m');
  //               console.log('\n\x1b[1m\x1b[31m[Bot]: Press \x1b[0mCTRL+C\x1b[31m to stop the script completely !\x1b[0m');
  //           });
  //         }
  //       }
  //     }
  //   }
  // }

  // async function sellTokens(transactionDetails){
  //   const amountIn = tokensToSell
  
  //   if (amountIn.toString() !== '0'){
  //     const gasPrice = transactionDetails.gasPrice
  //     const newGasPrice = Math.floor(parseInt(gasPrice) - parseInt(1))
  //     const gasLimit = Math.floor(transactionDetails.gas * 1.3)
  
  //     const amountInHex = ethers.BigNumber.from(amountIn.toString()).toHexString();
  //     const ethAmount = ethers.utils.parseEther(ETH_AMOUNT);
  //     const amountOutMin = Math.floor(ethAmount * 0.01);
  //     const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
  //     const path = [token.address, weth.address];
  //     const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  //     const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();
    
  //     const nonceCount = await web3.eth.getTransactionCount(ACCOUNT)
      
  //     const tx = await uniswap.swapExactTokensForETH(
  //       amountInHex,
  //       amountOutMinHex,
  //       path,
  //       ACCOUNT,
  //       deadlineHex,
  //       { 
  //         nonce: nonceCount + 1,
  //         gasPrice: ethers.BigNumber.from(newGasPrice).toHexString(),
  //         gasLimit: ethers.BigNumber.from(gasLimit).toHexString()
  //       }
  //     );
  //     console.log('\x1b[1m\x1b[37m[Bot]: Your sell transaction was: \x1b[1m\x1b[32m', tx.hash, "\x1b[0m");
  //   }
  // }
  
  // async function buyTokens(transactionDetails){
  //     const gasPrice = transactionDetails.gasPrice
  //     const newGasPrice = Math.floor(parseInt(gasPrice) + parseInt(1))
  //     const gasLimit = Math.floor(transactionDetails.gas * 1.2)
      
  //     const inputEth = parseFloat(ETH_AMOUNT) * 0.99;
  //     const ethAmount = ethers.utils.parseEther(inputEth.toString());
  //     const trade = new Trade(route, new TokenAmount(weth, ethAmount), TradeType.EXACT_INPUT);
  //     const path = [weth.address, token.address];
  //     const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  //     const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();
  
  //     const _tokensToSell = trade.outputAmount.raw
  //     setTokensToSell(_tokensToSell);

  //     const amountOutHex = ethers.BigNumber.from(_tokensToSell.toString()).toHexString();
      
  //     const ethAmt = parseFloat(ETH_AMOUNT) * 1.2;
  //     const amountInMax = ethers.utils.parseEther(ethAmt.toString());
  //     const amountInMaxHex = ethers.BigNumber.from(amountInMax.toString()).toHexString();
     
  //     const tx = await uniswap.swapETHForExactTokens(
  //       amountOutHex,
  //       path,
  //       ACCOUNT,
  //       deadlineHex,
  //       { 
  //         value: amountInMaxHex, 
  //         gasPrice: ethers.BigNumber.from(newGasPrice).toHexString(),
  //         gasLimit: ethers.BigNumber.from(gasLimit).toHexString()
  //       }
  //     );
  //     console.log('\x1b[1m\x1b[37m[Bot]: Your purchase transaction was: \x1b[1m\x1b[32m', tx.hash, "\x1b[0m");
  // }

  useEffect(() => {
    meta.enable();
    // fs.writeFile('./transactions_hashes.txt', '', function(){console.log('\x1b[1m\x1b[37m[Bot]: transactions_hashes.txt \x1b[1m\x1b[32mwiped!\n\x1b[0m\n\n')})
    connectMetaMask();
    // run();
  }, []);

  // chain change
  useEffect(() => {
    meta.once('chainChanged', (chain) => {
      setChainId(chain);
      console.log('Chain changed: ', chain);
    });

  }, [chainId]);

  // useEffect(() => {
  //   subscription = web3.eth.subscribe('pendingTransactions', function (error, result) {})
  //       .on("data", function (transactionHash) {
  //           web3.eth.getTransaction(transactionHash)
  //             .then(function (transaction) {
  //               if(transaction && !trxflag){
  //                 parseTransactionData(transaction)
  //               }
  //             })
  //           .catch(function () {
  //             console.log("\x1b[1m\x1b[Bot]: WARNING! Promise error caught!\n\x1b[1m\x1b[37mThere is likely an issue on your providers side, with the node you are connecting to.\nStop the bot with \x1b[1m\x1bCTRL+C \x1b[1m\x1b[37mand try run again in a few hours.");
  //           })
  //       });
  // }, []);


  return (
    <div className="App">
      <header className="App-header">
        
      </header>
    </div>
  );
}

export default App;
