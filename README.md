# URL_SHORTENER
URL shortener application using MERN stack with user authentication, email verification and persistent user session management and proper error handling

WHAT IS THE PROJECT ABOUT?
This project is used to shorten the URL added by the user to a 24 character long URL besides the DNS or endpoint. Decresing the length of big URLs allows the management to send
the URL easily and looks rather intriguing to the clients / users.

TECHNOLOGIES USED?
This project uses MERN stack for functioning fully and is hosted on Heroku. Used NodeJs for backend scripting and API development, ReactJs as frontend framework.
The project also uses JWT(JSON web token) for user authorization on any API endpoints (if required) and localstorage for session management. The APIs have been tested with postman
in development phase as well as after the build. The project is connected with MongoAtlas to store user credentials and the URLs created by them. Uses SendGrid for sending emails
and an endpoint for verifications. 
Feel free to test the live project by visiting https://urlsrty.herokuapp.com/h <--- this URL.

HOW TO RUN?
1. Clone the code into your local machine.
2. Make sure you build an .env file and to it, add your own mongoDB URI, JWT secret and send grid API key.
3. Run the server from root folder using 'node app.js' , project is on port 8085. (If you want to test the API )
4. To run the ReactJs on development mode, go to 'client' folder and run command 'npm start' , project is on port 3000. (If you want to test the frontend as well)
5. Enjoy
