import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Web3 from 'web3';
import { sendTransaction } from 'web3/lib/commonjs/eth.exports';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  web3!: Web3;
address:any=''
balance:any
balanceInEther:any
sendmoney:boolean=false
disconnectdisplay:boolean=false

  constructor() { this.initWeb3(); }
  ngOnInit(): void {
    setInterval(this.accountchange, 1000)
  }







// for connect meta mask
  private initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
    } else {
      console.error('MetaMask not detected. Please install MetaMask.');
    }
  }

  async connectWallet() {  
    this.initWeb3()

    if (!this.web3) {
      console.error('MetaMask not detected. Please install MetaMask.');
      return;
    }

    try {
      // ethereum.request({ method: 'eth_requestAccounts', params: [] });
       await    window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        eth_accounts: {}
      }],

    })
      const accounts = await this.web3.eth.requestAccounts();
      console.log(accounts)
      const address = accounts[0];
      console.log('Connected to MetaMask with address:', address);
this.address=address
      // Now you can use 'address' for further operations
      const balance = await this.web3.eth.getBalance(address);
      console.log('Balance:', balance);
      this.balance = balance



      this.web3.eth.getBalance(address)
      .then((wei: any) => {
        const accountbalance = this.web3.utils.fromWei(wei, 'ether');
        console.log('Balance in Ether:', accountbalance);
        this.balanceInEther = accountbalance; // Assuming you have balanceInEther defined in your component''
       console.log(window.ethereum.isConnected()) 
this.sendmoney=true
this.disconnectdisplay=true

      })
      .catch(error => {
        console.error('Error getting balance:', error);
      });


    } catch (error:any) {
      if (error.name === 'AbortError') {
        console.log('Permission request aborted.');
      } else {
        console.error('Error connecting to MetaMask:', error);


      }
    } 
  }


// for transaction
  params= [
    {
      from:'',
      to: '0x6E54891dfd02995D4A70f3a7cAb0D9bC535DEE2C',
      // gas: '0x76c0', // 30400
      // gasPrice: '0x9184e72a000', // 10000000000000
      value: '0x174876E800',
      data:
        '',
    },
  ];

  sendTransaction1(){

    this.params[0].from=this.address
window.ethereum
  .request({
    method: 'eth_sendTransaction',
    params:this.params,
  })
  .then((result:any) => {
    console.log(result)
    // The result varies by RPC method.
    // For example, this method returns a transaction hash hexadecimal string upon success.
  })
  .catch((error:any) => {
    console.log(error)

    // If the request fails, the Promise rejects with an error.
  });
}



  


 
  disconnectWallet() {

    if (typeof window.ethereum !== 'undefined') {
      // Request to disconnect the wallet
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => {
          this.address=''
this.balance=''
this.balanceInEther=''
          console.log('Disconnected from MetaMask');
          window.location.reload()
          // Provide user feedback or update your application state as needed
        })
        .catch((error:any) => {
          console.error('Error disconnecting from MetaMask:', error);
          // Handle any errors that occur during the disconnection process
        });
    }



    




  }
  




accountchange(){
  if (window.ethereum) {
    // Request account access if needed
       window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts:any) => {
        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts:any) => {
          const selectedAccount = newAccounts[0]; // Assuming you're interested in the first account
          console.log(`Selected account changed to: ${selectedAccount}`);
          // Trigger your action here
          // For example, you can update UI elements or perform other operations
          window.location.reload()
        });
      })
      .catch((error:any) => console.error('Error requesting accounts:', error));
  } else {
    console.error('MetaMask extension not detected');
  }
  
}













// // Assuming you have Web3 installed and instantiated as 'web3'

// // Define the addresses and ABIs for LINK and WMATIC tokens
// const linkTokenAddress = '0x514910771af9ca656af840dff83e8264ecf986ca'; // Replace with actual LINK token address
// const wmaticTokenAddress = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'; // Replace with actual WMATIC token address

// const erc20Abi = [
//   // Standard ERC20 functions
//   {
//     constant: true,
//     inputs: [],
//     name: 'balanceOf',
//     outputs: [{ name: '_owner', type: 'address' }, { name: 'balance', type: 'uint256' }],
//     type: 'function'
//   }
// ];

// // Check if MetaMask is installed and accessible
// if (typeof window.ethereum !== 'undefined') {
//   const web3 = new Web3(window.ethereum);

//   // Request accounts from MetaMask
//   window.ethereum.request({ method: 'eth_requestAccounts' })
//     .then(async (accounts) => {
//       const address = accounts[0];

//       // Get the balance of LINK
//       const linkContract = new web3.eth.Contract(erc20Abi, linkTokenAddress);
//       const linkBalance = await linkContract.methods.balanceOf(address).call();

//       // Get the balance of WMATIC
//       const wmaticContract = new web3.eth.Contract(erc20Abi, wmaticTokenAddress);
//       const wmaticBalance = await wmaticContract.methods.balanceOf(address).call();

//       console.log('LINK Balance:', linkBalance);
//       console.log('WMATIC Balance:', wmaticBalance);
//     })
//     .catch((error) => {
//       console.error('Error connecting to MetaMask:', error);
//     });
// } else {
//   console.error('MetaMask not detected. Please install MetaMask.');
// }





// @ViewChild('siweResult', { static: true }) ele!: ElementRef;


async siweSign(siweMessage:any) {
  this.initWeb3()
  if (!this.web3) {
    console.error('MetaMask not detected. Please install MetaMask.');
    return;
  }
  try {
    const from = this.address;
    
    const msg =siweMessage
    console.log(msg)
    const sign = await window.ethereum.request({
      method: 'personal_sign',
      params: [msg, from],
    });
    console.log(sign)
    const balance = await this.web3.eth.getBalance(this.address);
    console.log('Balance:', balance);
    this.balance = balance



    this.web3.eth.getBalance(this.address)
    .then((wei: any) => {
      const accountbalance = this.web3.utils.fromWei(wei, 'ether');
      console.log('Balance in Ether:', accountbalance);
      this.balanceInEther = accountbalance; // Assuming you have balanceInEther defined in your component''
     console.log(window.ethereum.isConnected()) 
     this.sendmoney=true
this.disconnectdisplay=true

    })
  
  } catch (err) {
    console.error(err);
     
  }
};

async siew(){
  const domain = window.location.host;
  const accounts = await this.web3.eth.requestAccounts();
  console.log(accounts)

  const from = accounts[0];
  this.address=accounts[0]
  const siweMessage = ` ${domain} wants you to sign in with your Ethereum account:\n${from}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;
  this.siweSign(siweMessage);
}


async displayTokens(){
  const tokenAddress = `0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270`;
const tokenSymbol = 'WMATIC';
const tokenDecimals = 18;
const tokenImage = 'https://s2.coinmarketcap.com/static/img/coins/64x64/8925.png';

try {
  // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
  const wasAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress, // The address of the token.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
        decimals: tokenDecimals, // The number of decimals in the token.
        image: tokenImage, // A string URL of the token logo.
      },
    },
  });

  if (wasAdded) {
    console.log('Thanks for your interest!');
  } else {
    console.log('Your loss!');
  }
} catch (error) {
  console.log(error);
}
}



}
