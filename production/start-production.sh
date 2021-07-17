#!/bin/bash

# Customize these environment variables for your own installation.
export AUTHSERVER=https://auth.fullstack.cash
export APISERVER=https://api.fullstack.cash/v5/
export FULLSTACKLOGIN=demo@demo.com
export FULLSTACKPASS=demo

# Ports
export PORT=5001 # REST API
export IPFS_TCP_PORT=5668 # IPSF TCP Port
export IPFS_WS_PORT=5669 # IPFS WS Port

# Production database connection string.
export DBURL=mongodb://172.17.0.1:5555/ipfs-service-prod

#export ENABLE_CIRCUIT_RELAY=1

export SVC_ENV=production
npm start
