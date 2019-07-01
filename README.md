# EtherFabrica

Deploying Ethereum Smartcontracts on Hyperledger Fabric

## Components

1.Hyperledger Fabric EVM

Ethereum virtual machine Running on Hyperledger fabric peers

2.Fab3 Proxy

EVM Compatiable Blockchain(Hyperledger) node provider

3.web3.js

A javascript library for interacting with local or remote blockchain node. in this project scenario, it will interacts Fab3.

4.A BYFN Fabric Network

A simple Byfn network allows you to create Hyperledger Fabric network Running with 2 Organizations each ORG with two peers.

## Work Flow
1. Build your Fabric network
2. Mounting EVM on Fabric-peers.
3. Start Your fabric network
4. Install and Instantiate EVM Chaincode
5. Setup Fab3 
6. Deploy Smartcontract.
 
#### Pre-Requisites
1.golang

Installing Go and add it to your path
```
wget https://dl.google.com/go/go1.12.6.linux-amd64.tar.gz

sudo tar -xvf go1.12.6.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOPATH=$HOME/go  #choose your prferred work directory path
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

go version  #check if it is installed correctly

```



2. node.js and Npm

```
sudo apt-get install nodejs
sudo apt-get install npm
```
## Steps

### 1. Build Your Fabric Network
a) Clone fabric-samples to ```$GOPATH/src/github.com/hyperledger/``` for this, we need to create directories first and clone

```
cd $GOPATH/src
mkdir github.com
cd github.com
mkdir hyperledger
cd hyperledger

git clone https://github.com/hyperledger/fabric-samples.git

cd fabric-samples
git checkout release-1.4
```
b) download docker images for fabric-samples first network
```
./scripts/bootstrap.sh
```
### 2. Mounting EVM on Fabric-peers.

Clone the ```fabric-chaincode-evm repo``` in your GOPATH directory.


```
cd $GOPATH/src/github.com/hyperledger/
git clone https://github.com/hyperledger/fabric-chaincode-evm
cd fabric-chaincode-evm
git checkout release-0.1

```
We need to include fabric-chaincode-evm to our first network docker images. Navigate back to fabric-samples/first-network directory.

```
cd $GOPATH/src/github.com/hyperledger/fabric-samples/first-network

```
Update docker-compose-cli.yaml with the volumes to include the EVM. like below using any code editor


  ``` 
     cli:
       volumes:
       - ./../../fabric-chaincode-evm:/opt/gopath/src/github.com/hyperledger/fabric-chaincode-evm
    
   ```
      
 
     
     
### 3. Start Your fabric-Network

Generate certifacates and start your network 

```
./byfn.sh generate
./byfn.sh up
```
Now your fabric network with Evm is up and running. 

### 4. Install and Instantiate EVM Chaincode

Now we need to Install and instantiate chaincode on evm. navigate to cli of docker container
```
docker exec -it cli bash
```
Adding required Peer dependies for network.
```
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

```
Install and Instantiate Chaincode on all peers

```
peer chaincode install -n evmcc -l golang -v 0 -p github.com/hyperledger/fabric-chaincode-evm/evmcc

peer chaincode instantiate -n evmcc -v 0 -C mychannel -c '{"Args":[]}' -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

exit
```
### 5. Setup Fab3
Execute the following to set certain environment variables required for setting up Fab3.

```
export FABPROXY_CONFIG=${GOPATH}/src/github.com/hyperledger/fabric-chaincode-evm/examples/first-network-sdk-config.yaml # Path to a compatible Fabric SDK Go config file
export FABPROXY_USER=User1 # User identity being used for the proxy (Matches the users names in the crypto-config directory specified in the config)
export FABPROXY_ORG=Org1  # Organization of the specified user
export FABPROXY_CHANNEL=mychannel # Channel to be used for the transactions
export FABPROXY_CCID=evmcc # ID of the EVM Chaincode deployed in your fabric network
export PORT=5000 # Port the proxy will listen on. If not provided default is 5000.

```
Now Navigate back to ```fabric-chaincode-evm``` to build and run proxy
```
cd $GOPATH/src/github.com/hyperledger/fabric-chaincode-evm/
go build -o fab3 ./fabproxy/cmd #builds the proxy with predefined env variables
./fab3   #starts proxy on your host
```
Now your Fabric network is ready for deploying Smartcotracts

### 6. Deploying Smartcontracts

install web3 library

```
npm install web3@0.20.2
```
Create Work directory of your choice and run ```npm install ``` in that directory.

Now we'll enter node console to set up our web3.
```
node
```

Assign Web3 library and use the fab3 running in the previous terminal as provider

```
Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:5000'))
```

To see your account information

```
web3.eth.accounts
```
Assign this account as defaultAccount

```web3.eth.defaultAccount = web3.eth.accounts[0]```

Now You can deploy your smartcontract by pointing Abi and bytecode in similar way as you do with ethereum.



