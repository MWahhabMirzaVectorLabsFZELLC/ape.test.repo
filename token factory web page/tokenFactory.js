var web3;
var factoryAddress = "0x59d1BF3F0e00c558f181c6a85a5a647C72993AEE"; // Replace with your TokenFactory contract address

var factoryAbi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_initialSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_listingAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_pricePerToken",
				"type": "uint256"
			}
		],
		"name": "createToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_pricePerToken",
				"type": "uint256"
			}
		],
		"name": "listExistingToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_marketplaceAddress",
				"type": "address"
			}
		],
		"name": "setMarketplaceAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RemainingTokensTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "TokenCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pricePerToken",
				"type": "uint256"
			}
		],
		"name": "TokenListedOnMarketplace",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getToken",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "marketplaceAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokens",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
async function Connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
        } catch (error) {
            console.error("User denied account access or error occurred:", error);
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        console.log("Connected to Ethereum provider through window.web3");
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        console.log("Connected to local Ethereum node");
    }
}

async function setMarketplaceAddress() {
    const marketplaceAddress = document.getElementById('marketplaceAddress').value;
    const accounts = await web3.eth.getAccounts();
    
    const factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
    factoryContract.methods.setMarketplaceAddress(marketplaceAddress).send({ from: accounts[0] })
    .on('receipt', function(receipt){
        alert('Marketplace address set successfully!');
    })
    .on('error', function(error){
        console.error('Error setting marketplace address:', error);
    });
}

async function createToken() {
    const name = document.getElementById('tokenName').value;
    const symbol = document.getElementById('tokenSymbol').value;
    const initialSupply = document.getElementById('initialSupply').value;
    const listingAmount = document.getElementById('listingAmount').value;
    const pricePerToken = document.getElementById('pricePerToken').value;
    const accounts = await web3.eth.getAccounts();

    const factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
    factoryContract.methods.createToken(name, symbol, initialSupply, listingAmount, pricePerToken).send({ from: accounts[0] })
    .on('receipt', async function(receipt){
        const tokenAddress = receipt.events.TokenCreated.returnValues.tokenAddress;

        // Add token to the wallet
        addTokenToWallet(tokenAddress, symbol, 18);
    })
    .on('error', function(error){
        console.error('Error creating token:', error);
    });
}

async function listExistingToken() {
    const tokenAddress = document.getElementById('existingTokenAddress').value;
    const listingAmount = document.getElementById('existingListingAmount').value;
    const pricePerToken = document.getElementById('existingPricePerToken').value;
    const accounts = await web3.eth.getAccounts();

    const factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
    factoryContract.methods.listExistingToken(tokenAddress, listingAmount, pricePerToken).send({ from: accounts[0] })
    .on('receipt', function(receipt){
        alert('Existing token listed successfully!');
    })
    .on('error', function(error){
        console.error('Error listing existing token:', error);
    });
}

async function getToken() {
    const index = document.getElementById('tokenIndex').value;

    const factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
    factoryContract.methods.getToken(index).call()
    .then(function(token){
        const tokenInfo = `Name: ${token[0]}, Symbol: ${token[1]}, Address: ${token[2]}, Owner: ${token[3]}`;
        document.getElementById('tokenInfo').innerText = tokenInfo;
    })
    .catch(function(error){
        console.error('Error getting token information:', error);
    });
}

async function totalTokens() {
    const factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
    factoryContract.methods.totalTokens().call()
    .then(function(total){
        document.getElementById('totalTokens').innerText = `Total Tokens: ${total}`;
    })
    .catch(function(error){
        console.error('Error getting total tokens:', error);
    });
}

async function addTokenToWallet(tokenAddress, tokenSymbol, tokenDecimals) {
    try {
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: tokenAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                },
            },
        });

        if (wasAdded) {
            console.log('Token added to wallet!');
        } else {
            console.log('Token not added to wallet.');
        }
    } catch (error) {
        console.error('Error adding token to wallet:', error);
    }
}

// Initialize web3 and connect to the contract
Connect();

