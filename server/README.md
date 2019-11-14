# Mongo Express Boilerplate 


## API Specification


## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [Running Development Server](#running-development-server)
        - [Using npm](#npm)
        - [Using yarn](#yarn)
    - [Running Production Server](#running-production-server)
        - [Using npm](#npm)
        - [Using yarn](#yarn)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts) 
    - [yarn test](#test)
- [Running Tests](#running-tests)
    - [Break Down to End to End Tests](#break-down-to-end-to-end-tests)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Database/Storage](#store)
    - [MongoDB](#mongodb)
    - [S3](#s3)
- [Commit Message Guidelines](#commit-message-guidlines)
    - [Commit Message Format](#commit-message-format)
    - [Revert](#revert)
    - [Type](#type)
    - [Scope](#scope)
    - [Subject](#subject)
    - [Body](#body)
    - [Footer](#footer)
- [Branch Management](#branch-management)
- [Versioning](#versioning)
- [Authors](#authors)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Prerequisites

**You’ll need to have Node 8.10.0 or later on your local development machine**. You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to easily switch Node versions between different projects.
Node.js. That's all you need.

```sh
node -v // v9.2.0
```

## Getting Started

### Running Development Server

#### npm

Run server

```sh
npm install
npm dev
```

Open a new terminal to run database

```sh
```

#### yarn

Run server

```sh
yarn
yarn dev
```

Open a new terminal to run database

```sh
```

### Running Production Server

#### npm

Run server

```sh
npm install
npm prod
```

Open a new terminal to run database

```sh
```

#### yarn

Run server

```sh
yarn
yarn prod
```

Open a new terminal to run database

```sh
```


## Folder Structure
```
express-mongo-boilerplate
├── README.md
├── LICENSE.md
├── tmp
├── node_modules
├── package.json
├── .gitignore
├── config
│   ├── .env.example
│   ├── .env.development
│   ├── .env.staging
│   ├── .env.production
│   └── env.js
├── src
│   ├── bin
│   ├── db
│   ├── routes
│   ├── controllers
│   ├── middlewares
│   ├── utils
│   └── app.js
└── index.js  - Entry point
```

## Available Scripts

### Server

#### Test
Preparing...
Maybe like this

```sh
yarn test
```

So simple!

Actually, it's just a plan yet.


### Client

Will make new repository soon.
 
## Running Tests

### Break down into end to end tests

Will be prepared

## Deployment

Additional notes about how to deploy this on a live system will be added soon.

## Built for

* [Node.js](https://nodejs.org/ko/) - Used to build server.

> Note: Planing to use 
* [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls) - Amazon S3(Simple Storage Service) is an object storage service that offers nice scalability, data availability, security, and performance.
* [Circle CI](https://circleci.com/) - Continuous Integration. (TODO)
* [MongoDB](https://www.mongodb.com/) - Widely used free to use NoSQL database.
* [Docker](https://www.docker.com/) - Containerizate software. (TODO)

## Database

### MongoDB

Data will be stored in MongoDB.
Can specify MongoDB URI in environment variable MONGODB_CONNECTION_URL
This variable(*MONGODB_CONNECTION_URL*) *is required* to run the server
Configuration can be found in ./src/db/index.js

### S3

S3 can be configured with 4 environment variables 

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET_NAME


## Commit Message Guidelines

I referred [Google's Angular JS's contributor's commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines) to format commit messages. This leads to more **unified** and **readable messages** helping further history lookups and even CI integrations.

By the way, this repository's commit messages format is not exactly same as the one suggested above.

### Commit Message Format 

Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Samples: (even more [samples](https://github.com/sparcs-kaist/zabo-server-nodejs/commits/master))

```
docs(README): update README adding instruction on how to start docker on EC2
```
```
build(babel): Add babel preset-env

Add @babel/core, @babel/preset-env and register with @babel/register.
Entry point of the application is set to be bin/www_es6.js
Refer to the package.json file to fidn out more.
```

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Should be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
* **misc**: Adding miscellaneous items

### Scope
There's no specific recommendations for naming scope yet.
Feel free to write your own scopes.

### Subject
The subject contains a succinct description of the change:

* use the **imperative, present tense**: "change" not "changed" nor "changes"
* **do capitalize** the first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
If the commit derives changes from previous behavior, the body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to


## Branch Management

I use [git-flow](https://danielkummer.github.io/git-flow-cheatsheet/index.html) to manage branches. For branch history, see the [branches on this repository](https://github.com/jungdj/mia/branches).


## Contributing

Anyone can freely contribute on this repository.

If you have questions, do not hesitate to contact.

## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jungdj/express-mongo-boilerplate/tags). 

## Authors

* **jungdj** - [jungdj](https://github.com/jungdj)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

