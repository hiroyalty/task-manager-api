# task-manager-api
A Node Express Restful webservice Application with Mongo DB. With Unit testing and Continous Integration Functionality

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
What things you need to install the software 

Mongo DB running on your server
Node Installed
Git Installed

### Installing
A step by step series of examples that tell you how to get a development env running

git pull
cd into the task-manager-api
npm install
create your environmental configuration variables file with details like:
PORT
SENDGRID_API_KEY (create an account with sendgrid mail and get your own API KEY)
JWT_SECRET (get your own jwt secret for auth from jsonwebtokens)
MONGODB_URL (your mongo database link)
then start the app: npm run dev
on production: npm run start

### Runing the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

change your environmental variables to reflect all changes.
The application uses MongoDB, changes are required to use any other type of database

## Built With

* [Node](http://www.nodejs.org/) - The framework used
* [Express](https://expressjs.com/) - Dependency Management

## Authors

* **Gbolaga Famodun** - *Initial work* - [hiroyalty](https://github.com/hiroyalty)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Mead Andrew
