#!/bin/bash

# BEGIN: Optional configuration settings

# This mnemonic is used to set up persistent public key for e2ee
# Replace this with your own 12-word mnemonic.
# You can get one at https://wallet.fullstack.cash.
export MNEMONIC="olive two muscle bottom coral ancient wait legend bronze useful process session"

# The human readable name this IPFS node identifies as.
export COORD_NAME=bch-wallet-service-generic

# Allow this node to function as a circuit relay. It must not be behind a firewall.
#export ENABLE_CIRCUIT_RELAY=true
# For browsers to use your circuit realy, you must set up a domain, SSL certificate,
# and you must forward that subdomain to the IPFS_WS_PORT.
#export CR_DOMAIN=subdomain.yourdomain.com

# Debug level. 0 = minimal info. 2 = max info.
export DEBUG_LEVEL=1

# END: Optional configuration settings


# Production database connection string.
export DBURL=mongodb://172.17.0.1:5555/ipfs-service-prod

# Customize these environment variables for your own installation.
export GET_JWT_AT_STARTUP=1
export AUTHSERVER=https://auth.fullstack.cash
export APISERVER=https://api.fullstack.cash/v5/
export FULLSTACKLOGIN=demo@demo.com
export FULLSTACKPASS=demo

# Ports
export PORT=5001 # REST API
export IPFS_TCP_PORT=5668 # IPSF TCP Port
export IPFS_WS_PORT=5669 # IPFS WS Port

export SVC_ENV=production
npm start
