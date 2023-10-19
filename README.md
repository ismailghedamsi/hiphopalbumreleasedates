A platform that provides information about the release dates of hip hop albums. This project aims to keep hip hop enthusiasts updated with the latest album releases.

**Usage**  
The platform provides a user-friendly interface where you can view the release dates of various hip hop albums. You can also search for specific albums using the search functionality.

**Contributing**  
**I - Clone the repository:**  
```
git clone https://github.com/ismailghedamsi/hiphopalbumreleasedates.git
```
**II - Navigate to the project directory:**
```
cd hiphopalbumreleasedates
```
**III - Install the required dependencies**
```
npm i
```
**IV - Setting Up Supabase**  
**1 - Create an supabase project**   
**2 - create a releases table with those columns**  
id: uuid  
created_at: timestamp with time zone  
artist: text  
album: text  
releaseDate: text  
cover: character varying  
addedBy: uuid  
links: json  default {   "spotify": "",   "bandcamp": "" ,"apple_music": "" }  
**3 - Create a .env.local file in the root directory of the project.**  
**4 - Add the following lines to the .env file:**  

```
NEXT_PUBLIC_REACT_APP_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**V - Start the development server**

```
npm start
```
Happy coding

You can also contribute by adding new and upcoming releases to the app
