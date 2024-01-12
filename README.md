<h1 align="center">
<br>
<img src="https://github.com/danielalejandrojaen/whspr/blob/followersChange/client/src/style/whspr-logo.png?raw=true" style="width: 200px">
</h1>
<br>
<div align="center">
<h1> whspr </h1>
Whspr is an audio based social media web application. Users can log in with their google accounts and record voice posts, synthesize audio posts, and interact with other like-minded users. This application was created with the intention of providing a platform for individuals to contextualize the world they live in, their interests and their passions through the power of a waveform.
</div>

      
<p align="center">
  <a href="#techstack">Tech Stack</a> •
  <a href="#howtostart">How To Start</a> •
  <a href="#features">Features</a> •
  <a href="#projectstructure">Project Structure</a>
</p>

---

## Tech Stack
* [PostgreSQL](https://www.postgresql.org/) - Open source relational database management.
* [Sequelize](https://sequelize.org/) - Object-Relational Mapping for SQL databases to simplify queries and database interactions.
* [Express](https://expressjs.com/) - Web framework for Node.js, used for server hosting, routing, and middleware.
* [React](https://reactjs.org/) - Front-end library for building user interfaces and components.
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment to execute our code.
* [Passport](http://www.passportjs.org/) - Authentication middleware for verifying user integrity.
* [Google OAuth](https://developers.google.com/identity/protocols/oauth2) - Authentication protocol to allow users to log in with their Google accounts.
* [Google Cloud Platform](https://cloud.google.com/) - Cloud computing services for hosting, used to store audio files.
* [TypeScript](https://www.typescriptlang.org/) - Strongly typed language built on Javascript that allows for more robust and error-free code.
* [WavesurferJS](https://wavesurfer-js.org/) - Audio visualization library used to display audio waves/visuals.
* [Agora.io](https://www.agora.io/en/) - Used for live audio streaming in our chat rooms.
* [Socket.io](https://socket.io/) - Used to access web sockets for live chat rooms.
* [Amazon Web Services](https://aws.amazon.com/) - Cloud computing services for hosting, used to deploy our application on an EC2 ubuntu instance.
* [Algolia](https://www.algolia.com/) - Used for indexing users, posts, and categories as well as auto-complete suggestions.
* [Tone.js](https://tonejs.github.io/) - Used for audio synthesizing.
* [Multer](https://www.npmjs.com/package/multer) - Used for uploading audio files to our server.
* [Axios](https://www.npmjs.com/package/axios) - Used for making HTTP requests.
* [Sass](https://sass-lang.com/) - A CSS preprocessor that gives us more functionality and flexibility when writing CSS.
* [Bootstrap](https://getbootstrap.com/) - A CSS framework that gives us pre-built components and styling. 
* [React Bootstrap](https://react-bootstrap.github.io/) - A version of BootStrap that is compatible with React.
* [Babel](https://babeljs.io/) - A JavaScript compiler that makes our code compatible with all browsers.
* [Webpack](https://webpack.js.org/) - A module bundler that bundles our code into a single file.

---

## How To Start

### 1. Clone the [repository](https://github.com/Auralities/whspr.git) and install dependencies
```
git clone https://github.com/Auralities/whspr.git
cd whspr
npm install
```
### 2. Create a .env file in the root directory and add the following:
```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
APP_ID=YOUR_AGORA_APP_ID
ADMIN_API_KEY=YOUR_AGORA_ADMIN_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```
> [!IMPORTANT]: You will need to create a Google OAuth 2.0 Client ID and Secret. You can do so by following the instructions here: https://developers.google.com/identity/protocols/oauth2. You will not be able to access the application having this set up.

>![Note]: You will need to create an Agora account and create an Agora App ID and Admin API Key. You can do so by following the instructions here: https://docs.agora.io/en/Video/start_call_web?platform=Web
<br>
> You will need to create an OpenAI account and create an OpenAI API Key. You can do so by following the instructions here: https://beta.openai.com/docs/developer-quickstart/your-api-keys
<br>
>This is not required, however if you wish to utilize a search index or autocomplete functionality, you will need to create an Algolia account and create an Algolia App ID and Admin API Key. You can do so by following the instructions here: https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/tutorials/getting-started-with-the-algolia-api/

### 3. Use the following commands to start the application:
* In one terminal, build the client with webpack by running npm run build:
```
npm run build
```
* In another terminal, start the server by running npm start/npm run start:
```
npm run start
```

---

## Features
* Users can log in with their Google accounts.
* Users can explore posts on their explore page or see posts from people they follow in their own home feed.
* Users can record audio posts.
    * Users can add categories to their posts or select from an existing category to add their post to.
* Users can synthesize audio posts using a synthesizer.
    * Users can select from a variety of oscillators, effects, and filters to create their own sound.
* Users can interact with other users by following them, liking their posts, and commenting on their posts.
    * Users can see statistics on their posts reflecting the number of likes, comments and listens.
    * User interactions are logged and used to generate a customized feed for each user.
* Users can create voice chat rooms and invite other users to join them.
    * Users can mute and un-mute themselves, and if they created the room, can mute others.
* Users can search for other users, posts, and categories.
* Users can view their profile, followers and following as well as others.
* Users can make a magic conch post, this post will be randomly assigned to another user in the database. 
    * Users can view their inbox/outbox for magic conch messages, and are limited to one outbound and inbound message per day.
* Users can chat with WhisperAI, an AI chatbot that responds to user voice messages in real time with voice.
    * Message history is stored in the database and can be viewed by users.
---
### Project structure


* `/client/src/components`: reusable front end components used in multiple places to create user interfaces.
* `/client/src/style`: contains the global app styles as well as the pngs, svg's and other assets used in this project.
* `/client/src/`: contains the agoraConfig file, the index.html file and the index.tsx file(root of the react app).
* `/server`: contains server files as well as database models, and interfaces, the google cloud storage config file, the index.ts file for the server and the authentication middleware.
* `/server/db`: contains the database index.ts initialization file and scripts for the database seeding.
* `/server/db/scripts`: contains the database seeding scripts.
* `/server/routes`: contains the server routes.
