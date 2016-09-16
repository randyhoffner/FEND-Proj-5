var locations = [];
var map;
var infowindow;
var mapZoom;


function initMap() {
    'use strict';
    if (window.innerWidth < 730) {
        mapZoom = 12;
    } else {
        mapZoom = 15;
    }
    //Ashland, Oregon latlng.
    var latlng = {
        lat: 42.194576,
        lng: -122.709477
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: mapZoom,
        mapTypeControl: false,
        styles: [{
                featureType: 'water',
                stylers: [{
                    color: '#19a0d8'
                }]
            }, {
                featureType: 'administrative',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#ffffff'
                }, {
                    weight: 6
                }]
            }, {
                featureType: 'administrative',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#e85113'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#efe9e4'
                }, {
                    lightness: -40
                }]
            }, {

                featureType: 'transit.station',
                stylers: [{
                    weight: 9
                }, {
                    hue: 'e85113'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'on'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#efe9e4'
                }, {
                    lightness: -25
                }]
            }, {
                featureType: 'poi.medical',
                stylers: [{
                    color: '#0C479D'
                }, {
                    lightness: 30
                }]
            }, {
                featureType: 'poi.business',
                elementType: 'labels.text.fill',
                stylers: [{
                    invert_lightness: true
                }, {
                    color: '#0055ff'
                }, {
                    weight: 0.57
                }]
            }

        ]
    });

    infowindow = new google.maps.InfoWindow();
}



// Call Yelp Search API; returns information about 20
// Ashland locations.
function callYelp() {
    'use strict';

    //Nonce generator to generate a random number.
    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelp_url = 'https://api.yelp.com/v2/search';

    //Yelp parameters.
    var parameters = {
        location: 'ashland+oregon',
        oauth_consumer_key: 'bJ6MqThUNog4U8vA25ZD5Q',
        oauth_token: 'OZWne-Ax7iRaccvd7uoAjnohr2-eh-u9',
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb'
    };

    //Generate OAuth 1.0a authentication signature.
    //oauth-signature.min.js from github.com/bettiolo/oauth-signature-js
    //Long strings are Consumer Secret and Token Secrete respectively.
    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, 'L2veuSo8hUYFu77i2bFX3fqsm0c', 'uFqQIfacltRZEzKNvet6LEwgW7Y');
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        jsonpCallback: 'cb',

        //Parse returned results.
        success: function(results) {

            var place;

            for (var i = 0; i < results.businesses.length; i++) {
                place = {};
                var image = results.businesses[i].image_url;
                place.name = results.businesses[i].name;
                place.id = i + 1;
                place.location = {
                    'lat': results.businesses[i].location.coordinate.latitude,
                    'lng': results.businesses[i].location.coordinate.longitude
                };

                //Replace 'ms' Yelp image with larger 'l' image.
                place.image = image.replace('ms', 'l');
                place.ratingImage = results.businesses[i].rating_img_url;
                place.reviewSnippet = results.businesses[i].snippet_text;
                place.reviewUrl = results.businesses[i].url;
                place.address = results.businesses[i].location.display_address[0] + ', ' + results.businesses[i].location.display_address[1];

                locations.push(new Place(place));
            }

            createMarker();
            ko.applyBindings(new ViewModel());
        },
        //Error message to display if Yelp api call fails.
        error: function() {
            alert('Sorry, Yelp information not currently available');
        }
    };
    $.ajax(settings);
}


callYelp();

//Create markers for locations returned by Yelp api.
function createMarker() {
    "use strict";
    locations.forEach(function(place) {


        //Create a blue paddle marker.
        var bluImage = {
            url: 'http://www.google.com/mapfiles/kml/paddle/blu-circle.png',
            scaledSize: new google.maps.Size(40, 40)

        };

        //Create a yellow paddle marker.
        var ylwImage = {
            url: 'http://www.google.com/mapfiles/kml/paddle/ylw-circle.png',
            scaledSize: new google.maps.Size(40, 40)
        };



        var markerOptions = {
            map: map,
            position: place.location,
            icon: bluImage,
            animation: google.maps.Animation.DROP
        };

        place.marker = new google.maps.Marker(markerOptions);

        //Add red marker for hospital.
        var marker = new google.maps.Marker({
            position: {
                lat: 42.206443,
                lng: -122.72495
            },
            map: map,
            title: 'Ashland Community Hospital',

        });

        //Marker starts  out not clicked.
        place.marker.clicked = false;

        //Change marker color to yellow.
        place.marker.changeColor = function() {
            place.marker.setIcon(ylwImage);
        };

        //Reset marker color to blue.
        place.marker.resetColor = function() {
            if (place.marker.clicked !== true) {
                place.marker.setIcon(bluImage);
            }
        };

        function resetMarkers() {
            locations.forEach(function(place) {
                if (place.marker.clicked === true) {
                    place.marker.clicked = false;
                    place.marker.setIcon(bluImage);
                }
            });
        }

        //When marker is clicked, it bounces and opens an infowindow.
        google.maps.event.addListener(place.marker, 'click', function() {
            resetMarkers();
            this.clicked = true;
            toggleBounce(this);
            openInfowindow(place, place.marker);
        });


        place.marker.click = function() {
            google.maps.event.trigger(place.marker, 'click');
        };

        //Mouseover turns marker yellow.
        place.marker.addListener('mouseover', function() {
            if (this.clicked === false) {
                this.changeColor();
            }
        });

        //Mouseout changes marker back to blue.
        place.marker.addListener('mouseout', function() {
            if (this.clicked === false) {
                this.resetColor();
            }
        });
    });
}




function openInfowindow(place, marker) {
    'use strict';
    //Information to fill infowindow.
    var infowindowHtml = '<div id="infoWindow">' +
        '<div class = "place-name">' + place.name + '</div>' +
        '<img class = "rating" src="' + place.ratingImage + '">' +
        '<img class = "place-image" src= "' + place.image + '">' +
        '<div class = "reviews"><h3>Review Snippet</h3><p id="snippet">' + place.reviewSnippet + '</p></div>' +
        '<a href = "' + place.reviewUrl + '" target="_blank"> Click here to see more reviews </a>' +
        '</div>';
    //Set content in infowindow and open it.
    infowindow.setContent(infowindowHtml);
    infowindow.open(map, marker);

    //Wlhen infowindow is closed, reset marker to original status and re-center map.
    google.maps.event.addListener(infowindow, 'closeclick', function() {
        marker.clicked = false;
        marker.resetColor();
        map.panTo({
            lat: 42.194576,
            lng: -122.709477
        });
    });
}

function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 2100);
}

//Store information for location places.
function Place(dataObj) {
    'use strict';
    this.name = dataObj.name;
    this.location = dataObj.location;
    this.id = dataObj.id;
    this.image = dataObj.image;
    this.marker = null;
    this.ratingImage = dataObj.ratingImage;
    this.reviewSnippet = dataObj.reviewSnippet;
    this.reviewUrl = dataObj.reviewUrl;
    this.address = dataObj.address;
}


ko.bindingHandlers.autoComplete = {

    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        var settings = valueAccessor();

        var selectedOption = settings.selected;
        var options = settings.options;

        var updateElementValueWithLabel = function(event, ui) {


            $(element).val(ui.item.label);

            if (typeof ui.item !== "undefined") {
                selectedOption(ui.item);
            }
        };

        $(element).autocomplete({
            source: options,
            select: function(event, ui) {
                updateElementValueWithLabel(event, ui);
            },
            focus: function(event, ui) {
                updateElementValueWithLabel(event, ui);
            },
            change: function(event, ui) {
                updateElementValueWithLabel(event, ui);
            }
        });
    }
};

//ViewModel
var ViewModel = function() {
    var self = this;

    // Search bar functionality.
    self.points = ko.observableArray(locations);
    self.query = ko.observable('');
    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.points(), function(point) {
            //Filter markers and list.
            if (point.name.toLowerCase().indexOf(self.query().toLowerCase()) === -1) {
                point.marker.setVisible(false);
            } else {
                point.marker.setVisible(true);
            }
            return point.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });



    self.locations = locations;

    self.selectedOption = ko.observable('');
    self.options = self.locations.map(function(element) {

        return {
            label: element.name,
            value: element.id,
            object: element
        };
    });
};


//Toggle list of places on and off.
$("#place-toggle").click(function() {
    $("#place-list").toggle();
});

//Error message to dispay if Google Map API fails to load.
function initMapLoadError() {
    alert("Google Map API failed to load.");

}
