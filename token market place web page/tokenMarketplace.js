var web3;
var marketplaceAddress = "0xb1f8896DCd91D2Bdbe5Abc69B7b9D7A46cA08c3d"; // Replace with your market place contract address
var marketplaceAbi =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "purchaseToken",
		"outputs": [],
		"stateMutability": "payable",
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
		"name": "relistToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_factoryAddress",
				"type": "address"
			}
		],
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
		"name": "TokenListed",
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
		"name": "TokenListingUpdated",
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
				"name": "buyer",
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
		"name": "TokenPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "checkAllowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factoryContract",
		"outputs": [
			{
				"internalType": "address payable",
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
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getListing",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
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
		"name": "listings",
		"outputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerToken",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "tokenBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalListings",
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
] // Replace with your contract ABI

var marketplaceContract;

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

	marketplaceContract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
}

async function listToken() {
	const tokenAddress = document.getElementById('tokenAddress').value;
	const amount = document.getElementById('listingAmount').value;
	const pricePerToken = document.getElementById('pricePerToken').value;
	const accounts = await web3.eth.getAccounts();

	marketplaceContract.methods.relistToken(tokenAddress, amount, pricePerToken).send({ from: accounts[0] })
		.on('receipt', function (receipt) {
			alert('Token listed successfully!');
		})
		.on('error', function (error) {
			console.error('Error listing token:', error);
		});
}

async function purchaseToken() {
	const index = document.getElementById('listingIndex').value;
	const amount = document.getElementById('purchaseAmount').value;
	const accounts = await web3.eth.getAccounts();

	marketplaceContract.methods.getListing(index).call().then(async listing => {
		const tokenAddress = listing[0];
		const pricePerToken = web3.utils.toBN(listing[3]);
		const totalCost = web3.utils.toBN(amount).mul(pricePerToken);

		try {
			await marketplaceContract.methods.purchaseToken(index, amount).send({ from: accounts[0], value: totalCost.toString() });
			alert('Token purchased successfully!');
			
			// Fetch token details (symbol and decimals)
			const tokenContract = new web3.eth.Contract([
				{
					"constant": true,
					"inputs": [],
					"name": "symbol",
					"outputs": [{ "name": "", "type": "string" }],
					"payable": false,
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [],
					"name": "decimals",
					"outputs": [{ "name": "", "type": "uint8" }],
					"payable": false,
					"type": "function"
				}
			], tokenAddress);

			const tokenSymbol = await tokenContract.methods.symbol().call();
			const tokenDecimals = await tokenContract.methods.decimals().call();

			// Add token to MetaMask
			await addTokenToWallet(tokenAddress, tokenSymbol, tokenDecimals);
		} catch (error) {
			console.error('Error purchasing token:', error);
		}
	}).catch(error => {
		console.error('Error getting listing:', error);
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

async function getListing() {
	const index = document.getElementById('listingInfoIndex').value;

	marketplaceContract.methods.getListing(index).call()
		.then(function (listing) {
			const listingInfo = `Token Address: ${listing[0]}, Seller: ${listing[1]}, Amount: ${listing[2]}, Price Per Token: ${listing[3]}`;
			document.getElementById('listingInfo').innerText = listingInfo;
		})
		.catch(function (error) {
			console.error('Error getting listing information:', error);
		});
}

async function totalListings() {
	marketplaceContract.methods.totalListings().call()
		.then(function (total) {
			document.getElementById('totalListings').innerText = `Total Listings: ${total}`;
		})
		.catch(function (error) {
			console.error('Error getting total listings:', error);
		});
}

// Initialize web3 and connect to the contract
Connect();

