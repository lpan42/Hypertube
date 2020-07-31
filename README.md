# Hypertube
Last web project before the 1st internship in 42.
A PopcornTime-like webapp. Search and stream movies using BitTorrent protocol

### Stacks:
* Front:
    * React JS
    * Materialize UI
    * Context API
    * Axios for requests
* Back:
    * Node JS (Express)
    * JWT Token
    * Torrent-stream for download torrent
    * fluent-ffmpeg for converting videotype
    * passport local & oauth2 for user authentication
* Database:
    * MongoDB

### Main Features:
* Register
    * email, username(Max 10 characters, lowercase letters and numbers only.), lastname, firstname and pwd (Min 8 characters, at least one number, and one uppercase and lowercase letter)
    * Verify if username && email already exists
    * Verify if user fills all fields and if inputs are the right format as required
![Register](https://user-images.githubusercontent.com/45174444/89025004-63837900-d326-11ea-8903-1b2f0f149786.png)
* Login with username or email and the right pwd.
![login](https://user-images.githubusercontent.com/45174444/89027190-5cf70080-d32a-11ea-8fc8-25ec87dc341d.png)
* An e-mail with an unique link to re-initialize user's password if he request to reset the pwd.
* The Index Page
    * Auto load popular movies reccomendation 
    * Can select rank susggestions by: year, imdbrating. 
    * Can search movies by keyword.
    * Can filter movies by one or multiple customize selections:
        * genre
        * year range
        * Imdb rating
    * Thumbnail will show if the movie has been watched or not. 
    * Can add movie to the watchlater list
![index](https://user-images.githubusercontent.com/45174444/89025339-ef95a080-d326-11ea-9fca-2a016345c0e6.png)
![index filter](https://user-images.githubusercontent.com/45174444/89025351-f6bcae80-d326-11ea-9394-67adb3f03542.png)
* My Profile: User can access and edit his own profile including:
    * Avatar
    * Username
    * lastname and firstname
    * email
    * language preference
    * Thumbnial lists of watched and watched later
![profile](https://user-images.githubusercontent.com/45174444/89025710-a4c85880-d327-11ea-8636-e856ee0db762.png)
![edit profile](https://user-images.githubusercontent.com/45174444/89025714-a6921c00-d327-11ea-890c-70df63e7ca7a.png)

* movie streaming
  * Each movie has a single movie page to stream movie, show description, and user comments.
  * player will be autoloaded with movie poster until the source is selected. 
  * User can select movie source with difference torrent and resolutions.
  * Subtitle will be automatically added based on user's language preference(if available)
  * user can also change subtitle to another language or choose no subtitle.
  * The language and poster of the description are changed based on user's language preference
  * each comment will show username, time and content, username can link to user's individual profile page

![movie1](https://user-images.githubusercontent.com/45174444/89026324-cd9d1d80-d328-11ea-9bf9-b62f360179c7.png)
![movie2](https://user-images.githubusercontent.com/45174444/89026326-cf66e100-d328-11ea-97f8-19aebd708047.png)
![movie3](https://user-images.githubusercontent.com/45174444/89026330-d0980e00-d328-11ea-9217-ee61a0137ca4.png)
### Run project

* The configuration is the following:
    * Node JS server -> Port `8000`
    * React app -> Port `3000`
* Run `npm install` in each back and front directory
* DB:
    * Make sure mongodb community service is running `brew services start mongodb-community@4.2`
* start project: cd to the back directory, run `npm start` 