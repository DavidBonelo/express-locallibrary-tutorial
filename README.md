## express-locallibrary-tutorial
Simple demo of a skeleton express app made following this [MDN tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/)

Requisites:
- A mongodb database running on local with an empty database named `local_library`.\
 or you can set a cloud instance by setting the url in the [app.js](./app.js) file

To run the server clone this repo and then execute:
```sh
npm install
# for OSX/Linux
DEBUG=express-locallibrary-tutorial:* npm run start
# for Windows
SET DEBUG=express-locallibrary-tutorial:* & npm start
```
the frontend is accesible from [localhost:3000](localhost:3000)
and if you want to be cool navigate to [localhost:3000/users/cool](localhost:3000/users/cool) :sunglasses: