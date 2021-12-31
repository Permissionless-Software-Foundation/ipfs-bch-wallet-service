#!/bin/bash

# BEGIN: Optional configuration settings

# This mnemonic is used to set up persistent public key for e2ee
# Replace this with your own 12-word mnemonic.
# You can get one at https://wallet.fullstack.cash.
export MNEMONIC="olive two muscle bottom coral ancient wait legend bronze useful process session"

# The human readable name this IPFS node identifies as.
export COORD_NAME=bch-wallet-service-generic

# Allow this node to function as a circuit relay. It must not be behind a firewall.
#export ENABLE_CIRCUIT_RELAY=1
# For browsers to use your circuit realy, you must set up a domain, SSL certificate,
# and you must forward that subdomain to the IPFS_WS_PORT.
#export CR_DOMAIN=subdomain.yourdomain.com

# Debug level. 0 = minimal info. 2 = max info.
export DEBUG_LEVEL=2

# BCH Wallet Service Settings
# Change APISERVER to point to your own installation of bch-api
export APISERVER=https://api.fullstack.cash/v5/
# These settings are used to proxy a subscription to FullStack.cash.
#export GET_JWT_AT_STARTUP=1
export AUTHSERVER=https://auth.fullstack.cash
export FULLSTACKLOGIN=demo@demo.com
export FULLSTACKPASS=demo

# END: Optional configuration settings


# Production database connection string.
export DBURL=mongodb://172.17.0.1:5555/ipfs-service-prod

# Configure REST API port
export PORT=5010

# Production settings using external go-ipfs node.
export SVC_ENV=production
export IPFS_HOST=172.17.0.1
export IPFS_API_PORT=5001
export IPFS_TCP_PORT=4001
#export IPFS_WS_PORT=5269

npm start
