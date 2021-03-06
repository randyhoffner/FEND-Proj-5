#FEND Nanodegree Neighborhood Map Project No. 5
##Map of Ashland, Oregon

Locatd in the southern end of Oregon's Rogue Valley, Ashland is a delightful combination of mountain village and one of the most  sophisticated small towns in America.  One reason for the sophistication is the  world famous Oregon Shakespeare Festival, which has been a part of Ashland for more than 75 years. 

###Overview

This project uses the Google Maps API, the Yelp API, javascript, knockoutJS, and  jQueryJS to create  a map of Ashland and  show 20 locations returned from Yelp, along with the local hospital, the Shakespeare Festival theaters location, and local schools, food markets, parks, and other civic locations.

###Repository Contents

The main branch of this repo contains a "source code" directory named src, which contains all files needed to run the project.  The html, css, and main.js files in src are not minified, so that all code and commentary may be easily read.  The "production code" directory, dist, contains the same code as src, but with html, css, and main.js files minified for faster loading.  The html file was validated using the  w3.org html validator; the css file was validated to CSS Level 3 using the w3.org jigsaw validator; and main.js was validated using piliap.com/javascript-validator/.

To run the project locally using either the src or dist  code, download the appropriate folder and run index.html in a browser.  To run in a local server, open a Mac Terminal window or a windows PowerShell window, navigate to the appropriate directory, and run Python SimpleHTTPServer.  Then open a second window, navigate to the same directory, and run Ngrok to provide a local IP address to run the app in a browser.

The gh-pages branch contains only the dist code files, so the project may be opened by browsing to http://randyhoffner.github.io/FEND-Proj-5 .

###License

All code is provided under the MIT License.

###Using the App

When the app is opened, a Google Map of Ashland is displayed.  Blue markers for 20 returned Ashland Yelp locations are shown, using Google Maps DROP Animation.  On smaller screens, all these markers may not fit onto the displayed screen.  Each of the blue markers marks a place of interest from Yelp.  When the cursor hovers over a marker, it turns yellow until the cursor is removed, at which time it turns back to blue.  When a marker is clicked, it bounces, and an infowindow is opened displaying a picture and a review snippet from the selected location.  A list of "Places" appears on the right-hand side of the screen, and when a location on the list is hovered by the cursor, its blue marker turns yellow to show its location, and when the Place on the list is clicked, the marker bounces and an infowindow opens as when the marker itself is clicked.  The list is transparent so that the map features it covers may be seen.  The list of Places may be toggled open and closed by clicking on the "Places" box.

To find a location using the "Search" box, start typing its name, for example, "Lithia Park", into the box.  The autocomplete function begins reducing the list on the right.  In the case of Lithia Park, typing "L" into the box reduces the list, and the displayed markers, to the locations on the list that contain the letter "L".  Typing "LI" further reduces the list and displayed markers to those whose names contain both "L" and "i".  Typing "LIT" reduces the list and displayed markers to the single location Lithia Park.  Clicking on the list entry or marker then displays its infowindow.

In addition to the Yelp locations, Google Maps displays icons and titles for some local attractions.  These titles are in light blue text on the map.  For example, clicking on the light blue text "Oregon Shakespeare Festival", or its accompanying icon, displays an infowindow with information about the festival.  Additionally, clicking on the icon of a civic structure such as a school produces an infowindow with the structure's address.  The local hospital grounds are colored hospital-sign blue on the map, and the hospital's front entrance is marked with a red marker that, when hovered over, generates the name and address of the hospital.