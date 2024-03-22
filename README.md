# ipfs-bch-wallet-service

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is a censorship-resistant, IPFS-based microservice that provides access for wallets to access the Bitcoin Cash (BCH) blockchain. It leverages [bch-js](https://github.com/Permissionless-Software-Foundation/bch-js).

- [Decentralized Blockchain Service Providers](https://youtu.be/m_33rRXEats) YouTube video demos this software.
- [JSON RPC and REST API Documentation](https://ipfs-bch-wallet-service.fullstack.cash/)

## About This Repository

This repository is forked from the [ipfs-service-provider](https://github.com/Permissionless-Software-Foundation/ipfs-service-provider) repository. That code has been customized to provide BCH blockchain access for wallets. This server-side node.js app provides both REST API over HTTP and JSON RPC over IPFS endpoints for wallets to access the blockchain through.

As part of the end-to-end testing, a virtual client can be started that will interrogate every endpoint provided by this API server. This client can be forked by developers to write their own apps that use this IPFS-based service.

## Roadmap

This repository is one step in a longer path. Here are the major milestones of this path:

- Add wallet-based calls to ipfs-bch-wallet-service (this repository).
- Create a miniature version of bch-js that makes calls over JSON RPC (bch-js-ipfs).
- Given a variable, minimal-slp-wallet could call bch-js or bch-js-ipfs for network calls.
- Fork slp-cli-wallet and add `daemon` feature to spin up IPFS node and work with bch-js-ipfs.

## Requirements

- node **^16.20.2**
- npm **^8.19.4**
- Docker **^20.10.8**
- Docker Compose **^1.27.4**

## Installation

### Development Environment

**Note:** This software now uses an external go-ipfs IPFS node. The instructions below have not been updated to reflect this.

A development environment will allow you modify the code on-the-fly and contribute to the code base of this repository. [PM2](https://www.npmjs.com/package/pm2) is recommended for running this code base as an IPFS Circuit Relay.

- [Video: Installing ipfs-service-provider](https://youtu.be/Z0NsboIVN44)
- [Step-by-step installation instructions](https://gist.github.com/christroutner/3304a71d4c12a3a3e1664a438f64d9d0)

```bash
git clone https://github.com/Permissionless-Software-Foundation/ipfs-bch-wallet-service
cd ipfs-bch-wallet-service
./install-mongo.sh
npm install
cd shell-scripts
./ipfs-bch-wallet-service.sh
```

### Production Environment

The [docker](./production/docker) directory contains a Dockerfile for building a production deployment.

```
docker-compose pull
docker-compose up -d
```

- You can bring the containers down with `docker-compose down`
- You can bring the containers back up with `docker-compose up -d`.

### Development Environment

A development environment will allow you modify the code on-the-fly and contribute to the code base of this repository. Ubuntu v20 is the recommended OS for creating a dev environment. Other operating systems may cause issues.

```bash
git clone https://github.com/Permissionless-Software-Foundation/ipfs-service-provider
cd ipfs-service-provider
./install-mongo-sh
npm install
npm start
```

## File Structure

The file layout of this repository follows the file layout of [Clean Architecture](https://christroutner.github.io/trouts-blog/blog/clean-architecture). Understaning the principles laid out this article will help developers navigate the code base.

## Usage

- `npm start` Start server on live mode
- `npm run docs` Generate API documentation
- `npm test` Run mocha tests

## Documentation

API documentation is written inline and generated by [apidoc](http://apidocjs.com/). Docs can be generated with this command:
- `npm run docs`

Visit `http://localhost:5020/` to view docs

There is additional developer documentation in the [dev-docs directory](./dev-docs).

## Dependencies

- [koa2](https://github.com/koajs/koa/tree/v2.x)
- [koa-router](https://github.com/alexmingoia/koa-router)
- [koa-bodyparser](https://github.com/koajs/bodyparser)
- [koa-generic-session](https://github.com/koajs/generic-session)
- [koa-logger](https://github.com/koajs/logger)
- [MongoDB](http://mongodb.org/)
- [Mongoose](http://mongoosejs.com/)
- [Passport](http://passportjs.org/)
- [Nodemon](http://nodemon.io/)
- [Mocha](https://mochajs.org/)
- [apidoc](http://apidocjs.com/)
- [ESLint](http://eslint.org/)
- [ipfs-coord](https://www.npmjs.com/package/ipfs-coord)

## IPFS

Snapshots pinned to IPFS will be listed here.

## License

[MIT](./LICENSE.md)

a
