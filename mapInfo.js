var map;

//initializes maps on load and adds an event listener to the search box
function initMap() {
  var geocoder = new google.maps.Geocoder();
  document.getElementById('searchButton').addEventListener('click', function (e) {
    e.preventDefault();
    geocodeAddress(geocoder);
  });
}

function geocodeAddress(geocoder) {
  //styling definitions for political (left/top) map
  var styledMapType = new google.maps.StyledMapType(
    [
      {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#c9b2a6'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#447530'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#f5f1e6'}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{color: '#fdfcf8'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#f8c967'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#e9bc62'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{color: '#e98d58'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{color: '#db8555'}]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#806b63'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#7C84AE'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#92998d'}]
      }
    ],
    {name: 'Styled Map'
  });

  //custom marker styling
  var smallStar = {
    path: 'M 5,-110 35,-25 125,-25 55,30 80,115 5,65 -70,115 -55,30 -115,-25 -25,-25 z',
    fillColor: 'yellow',
    fillOpacity: 1,
    scale: .1,
    strokeColor: 'gold',
    strokeWeight: 2
  };

  var largeStar = {
    path: 'M 5,-110 35,-25 125,-25 55,30 80,115 5,65 -70,115 -55,30 -115,-25 -25,-25 z',
    fillColor: 'yellow',
    fillOpacity: .1,
    scale: .7,
    strokeColor: 'gold',
    strokeWeight: 2
  };

  //creates both maps 
  var map = new google.maps.Map(document.getElementById('politicalMap'), {
    zoom: 6,
    center: { lat: -34.397, lng: 150.644 },
    disableDefaultUI: true,
    mapTypeId: 'styled_map'
  });
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var map2 = new google.maps.Map(document.getElementById('geographicMap'), {
    zoom: 14,
    center: { lat: -34.397, lng: 150.644 },
    disableDefaultUI: true,
    mapTypeId:google.maps.MapTypeId.HYBRID
  });

  //pans camera to new location
  var address = document.getElementById('addressBox').value;
  geocoder.geocode({ 'address': address }, 
  function (results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location); 
      map2.setCenter(results[0].geometry.location); 
      var marker = new google.maps.Marker({
        map: map, 
        position: results[0].geometry.location,
        icon: smallStar
      });
      var marker2 = new google.maps.Marker({
        map: map2, 
        position: results[0].geometry.location,
        icon: largeStar
      });
    } 

    else {
      alert('Geocode was not successful for the following reason: ' + status + '\n(Try searching for a different location!)');
    }
  });
}