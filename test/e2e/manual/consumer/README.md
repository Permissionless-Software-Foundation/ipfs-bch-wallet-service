# Consumer Simulation E2E Test

The files in this directory simulates a consumer of web services, using JSON RPC over IPFS. It starts a new IPFS node that connects to the ipfs-bch-wallet-service and exercises each JSON RPC endpoint.

## Instructions

Execute these steps in order to run the test:

1. Run your local copy of ipfs-bch-wallet-service service provider.
2. Update the [test-data.json](./test-data.json) file with the IPFS ID of the ipfs-bch-wallet-service.
3. In another terminal, run the client simulation with `node client.e2e.js`
