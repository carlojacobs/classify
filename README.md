# Classify web-app
Classify is a web application that helps students communicate with each other in a structured way. You can make an account, create a class, add students to that class and share information with every student in the class.

## Structure
The web application consists of a front-end that is visible to the user, and a back-end that handles all data traffic between the database and the front-end.
### Back-end
The back-end was built using [NodeJS](https://nodejs.org/en/), a flexible framework that allows you to run `Javascript` on the serverside. In addition to `NodeJS`, I used a framework called [Express](https://expressjs.com/). Express is a lightweight framework for `NodeJS` that is perfect for building web-applications. Of course, every web-app needs a database to store its data. For this project I chose the `NoSQL` database [MongoDB] and its NodeJS client [Mongoose](https://mongoosejs.com/).
### Front-end
In order to build the user interface of this web-app, I used [React](https://reactjs.org/). React is a JavaScript library for building user interfaces, created and maintained by Facebook. It allows you to break up the UI into re-useable classes called `Components`, these components make your web-app faster and more flexible.
