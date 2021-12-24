#!/bin/bash

# This script is an example for running a generic ipfs-service-provider instance
# using a local installation of bch-api.

# Ports
export PORT=5002 # REST API port
export IPFS_TCP_PORT=5268
export IPFS_WS_PORT=5269

# The human-readible name that is used when displaying data about this node.
export COORD_NAME=ipfs-service-provider-generic

# This is used for end-to-end encryption (e2ee).
export MNEMONIC="churn aisle shield silver ladder swear hunt slim pen demand spoil veteran"

# 0 = less verbose. 3 = most verbose
export DEBUG_LEVEL=1

# MongoDB connection string.
#export DBURL=mongodb://localhost:27017/bch-service-dev

# Customize these environment variables for your own installation.
export GET_JWT_AT_STARTUP=0
export APISERVER=http://localhost:3000/v5/


npm start
