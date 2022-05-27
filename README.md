# ePioneers

## _Crypto Wallet Server_

- [About ePioneers](#about)
- [About ePioneers Crypto Wallet](#about-wallet)
- [Technology](#tech)
- [Code Conventions](#installing)
- [API Blockchain](#blockchain)

# About ePioneers

ePioneers is a climate startup founded with the mission to create state-of-the-art web3 technology infrastructure for nature and communities to thrive.
We enable Nature Restoration and the  Democratization of Climate Investing with a robust system of data-driven and decentralized solutions. We leverage the best of human talent  combined with disruptive design. Our founding team has a track record of pioneering new industries as the founders of Latin America’s 1st coding bootcamp - World Tech Makers -  and the creation of Latin America’s 1st Digital Nomads Visa. Learn more about our work at www.epioneer.io

# About ePioneers Crypto Wallet

ePioneers Crypto Wallet is the tool for users that want to contribute with Nature Restoration. The Wallet allows users to:

- Purchase NFTs
- Sell NFTs
- Track crypto portfolios
- Purchase city routes

# Technology

The backend server for Blockchain ePioneers Crypto Wallet is built using the Nest.js framework, which is built on top of Node.js and Express. The connection with a blockchains is secure across SDK of Algorand and Stacks:



### About Nest.js

Nest (NestJS) is a framework for building efficient, scalable [Node.js](https://nodejs.org/) server-side applications. It uses progressive JavaScript, is built with and fully supports [TypeScript](http://www.typescriptlang.org/) (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming). Under the hood, Nest.js makes use of [Express](https://expressjs.com/) as a default HTTP server framework.

### Nest.js documentation

* [Nest.js getting started](https://docs.nestjs.com/first-steps)

## Code Conventions

- Files are written in Typescript
- Files and folders are named lower case for both words separated by underscore, a period is added to add further specification to the functionality of the file. Example: blockchain.controller.ts
- Variables are named using UpperCamelCase
- Models are named using Pascal_casing but with the initial letter on upper case . Example: Stops_nfts
- Variables, constants, parameters are in lowerCamelCase. Example: myWallet
- Always specify the type of a variable. Avoid using var, use let or const depending on the usecase.
- Never send data to the client without instantiating a DTO from the DTO libraries or without the corresponding response template from the repository.dto.ts file.


## Getting Started

This project has the source code of ePioneers' BackEnd Server. Only authorized people should have access to this repo.

## Project Structure 💾

Each module contains the following components:

- Module: Contains the instantiation of each module, every import and export must be handled in here
- Controller: Contains all the routes for the module and their corresponding functions, should not contain any complex logic or any DB query
- Service: Contains all the complex logic and DB queries for each of the routes in the controller as well as helper functions
- models folder: Contains every Data Transfer Object template to use on the http calls


```
📦Project
 ┣ 📂src                                 #root module folder 
 ┃ ┣ 📂blockchain                              #Blockchain module folder
 ┃ ┃ ┣ 📜blockchain.controller.spec.ts
 ┃ ┃ ┣ 📜blockchain.controller.ts
 ┃ ┃ ┣ 📜blockchain.module.ts
 ┃ ┃ ┣ 📜blockchain.service.spec.ts
 ┃ ┃ ┗ 📜blockchain.service.ts
 ┃ ┣ 📂models                            #Generals models and DTOs
 ┃ ┣ 📜app.module.ts
 ┃ ┣ 📜app.service.ts
 ┃ ┣ 📜logging.middleware.ts
 ┃ ┗ 📜main.ts
 ┣ 📜.devops.env                          #Env Varables (for dev environment)
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜README.md                            #This! :)
 ┣ 📜tsconfig.build.json
 ┗ 📜tsconfig.json
```

## Packages used in this app

```
aws-sdk				USED FOR AWS HOSTING
algosdk				USED FOR CONNECT WITH ALGORAND BLOCKCHAIN	
swagger-ui-express	USED FOR ROUTE DOCS

```

## Route descriptions

To get information about all routes available for the server checkout our [Swagger Page](https://api-testing-blockchain.epioneer.co/api-doc/).

You can also access it  through the route /api-doc on the local (localhost) or testing environment (https://api-testing-blockchain.epioneer.co/api-doc/) eg:

- http://localhost:3000/api-doc
- https://api-testing-blockchain.epioneer.co/api-doc/api-doc/



# Executing the App

To get the server running locally follow these steps:

- Install dependencies:

```sh
npm i
```

- Run the app:

```sh
npm run start:dev
```



To check the testing environment go into:

https://api-testing-blockchain.epioneer.co

https://api-testing-blockchain.epioneer.co/api-doc/ for Swagger

# NESTJS DOCS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
