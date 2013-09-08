// new google.maps.LatLng(37.7749295, -122.4194155)

/*
if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(initialize);
    console.log('ss');
} else {
    error('Geo Location is not supported');
}

*/


$(document).ready(function(){


    initialize();
})


//console.log(position.coords)
//var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

function initialize() {



    var mapOptions = {
        center: new google.maps.LatLng(37.7749295,-122.4194155),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
     map = new google.maps.Map(document.getElementById("Map"),
        mapOptions);





    var input = document.getElementById('Search');
    var searchBox = new google.maps.places.SearchBox(input);

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });
    var Val = $('#Search').attr('placeholder')
    $('#Search').val('  Search');


    /*var marker = new google.maps.Marker({
        position: new google.maps.LatLng(37.7719295,-122.4194155),
        map: map,
        title: 'Hello World!',
        icon: 'img/icon.png'
    });*/
LoadData();
            Events();


}



function LoadData ()
{
    Markers = [];
    // RECEIVE DATA VIA JSON HERE
   Data={
    "Clubs": [
        {
            "Name": "Ruby Skye",
            "Type": "Club",
			"DetailURL": "img/ruby_skye_detail_pin.png",
            "Pos": {
                "lat": "37.78751621619397",
                "lon": "-122.410207092762"
            }
        },
        {
            "Name": "Cantina",
            "Type": "Bar",
			"DetailURL": "img/cantina_detail_pin.png",
            "Pos": {
                "lat": "37.7892162113055",
                "lon": "-122.4100287258625"
            }
        },
        {
            "Name": "Slide",
            "Type": "Club",
			"DetailURL": "img/slide_detail_pin.png",
            "Pos": {
                "lat": "37.7875661848687",
                "lon": "-122.40964483469725"
            }
        },
		{
            "Name": "Fuel LLC",
            "Type": "Bar",
			"DetailURL": "img/cantina_detail_pin.png",
            "Pos": {
                "lat": "37.780998",
                "lon": "-122.412049"
            }
        },
		{
            "Name": "Mr Smith's",
            "Type": "Club",
			"DetailURL": "img/ruby_skye_detail_pin.png",
            "Pos": {
                "lat": "37.779974",
                "lon": "-122.412086"
            }
        },
			{
            "Name": "Lalita Exotic Thai Cuisine & Bar",
            "Type": "Bar",
			"DetailURL": "img/cantina_detail_pin.png",
            "Pos": {
                "lat": "37.781038",
                "lon": "-122.413538"
            }
        },
		{
            "Name": "The Showdown",
            "Type": "Bar",
			"DetailURL": "img/cantina_detail_pin.png",
            "Pos": {
                "lat": "37.781936",
                "lon": "-122.410097"
            }
        },
			{
            "Name": "The Warfield",
            "Type": "Bar",
			"DetailURL": "img/cantina_detail_pin.png",
            "Pos": {
                "lat": "37.782767",
                "lon": "-122.410435"
            }
        }
    ]
}

    for (var x = 0;x<Data.Clubs.length;x++)
    {
	 var image = 'img/ic_pin_club.png';
	 
	if (Data.Clubs[x].Type == 'Bar')
	 {
	  image = 'img/ic_pin_bar.png';
	 }
	 else if (Data.Clubs[x].Type ==  'Clubs')
	 {
	  image = 'img/ic_pin_club.png';
	 }
	 else if (Data.Clubs[x].Type ==  'Event')
	 {
	  image = 'img/ic_pin_events.png';
	 }

		
		 marker = new google.maps.Marker({
            position: new google.maps.LatLng(Data.Clubs[x].Pos.lat,Data.Clubs[x].Pos.lon),
            map: map,
            icon: image,
            title:Data.Clubs[x].ID
        });
		 google.maps.event.addListener(marker, 'click', function() {
        //alert("I am marker " + marker.title);
        $('#Phone').find('.DetailLayer').show();
        $('#Phone').find('.DetailLayer').animate({top:'85%'},200,function(){

          GetDetailData (ID);

        });
    });
		marker.iconLevel1 = image;
		marker.iconLevel2 = Data.Clubs[x].DetailURL;
		Markers.push(marker);
    }
}

function createMarker(lat,lon, t,icon,ID) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lon),
        map: map,
        title: t,
        icon: icon
    });

    google.maps.event.addListener(marker, 'click', function() {
        //alert("I am marker " + marker.title);
        $('#Phone').find('.DetailLayer').show();
        $('#Phone').find('.DetailLayer').animate({top:'85%'},200,function(){

          GetDetailData (ID);

        });
    });

  
}

function GetDetailData (ID)
{
    $.ajax({
        type: "POST",
        url: "GetDetails_Specific.php",
        data: {ID:ID},
        success: function(content)
        {
            console.log(content)
            $('#Phone').find('.DetailLayer').html(content)
            console.log(' Detail Data Received');
        }
    });
}

function Events ()
{
var zoomLevel = 1;

google.maps.event.addListener(map, 'zoom_changed', function() {
  var i, prevZoomLevel;

  prevZoomLevel = zoomLevel;

  if ( map.getZoom() > 20)
  zoomLevel = 3
  else if ( map.getZoom() > 17)
  zoomLevel = 2;
	else 
	zoomLevel = 1;
	
  if (prevZoomLevel !== zoomLevel) {
    for (i = 0; i < Markers.length; i++) {
      if (zoomLevel === 2) {
        Markers[i].setIcon(Markers[i].iconLevel2);
      }
      else {
        Markers[i].setIcon(Markers[i].iconLevel1);
      }
	  
	  if (zoomLevel === 3) {
		   marker = new google.maps.Marker({
            position: new google.maps.LatLng(37.7743295,-122.4195155),
            map: map,
            icon: 'img/ic_pin_friend.png',
			clickable: true,
            title:"ID"

        });

		marker.info = new google.maps.InfoWindow({
			content: 'David Farr'
			});

			google.maps.event.addListener(marker, 'click', function() {
			marker.info.open(map, marker);
			});
			
			
			marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(37.7743495,-122.4195355),
            map: map,
            icon: 'img/ic_pin_friend.png',
			clickable: true,
            title:"ID"

        });
		marker2.info = new google.maps.InfoWindow({
			content: 'Max Mustermann'
			});

			google.maps.event.addListener(marker2, 'click', function() {
			marker2.info.open(map, marker2);
			});
	  }
    }
  }
});

    // SWITCH TOM MY LOC
    $('#Phone').find('.Location').click(function(){

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
            });
        }
        console.log(map);
    })

    $('#Map').click(function(){

        $('#Search').fadeOut();

        console.log('ss');
    })

    $('#Phone').find('.Rate').click(function(){

        $('#Phone').find('.RateLayer').css('left','0px');
    })

    Hammer('.RateLayer').on("swipeleft", function(e) {

        $('#Phone').find('.RateLayer').css('left','-100%');
        e.preventDefault();
    })


    Hammer('body').on("drag", function(e) {


        $('#Search').fadeOut();
    })


    Hammer('body').on("swipeup", function(e) {

       /* if (e.gesture.pointerType != 'mouse')
        {
          $('.DetailLayer').show();
          $('.DetailLayer').css('top','0px');
          e.preventDefault()
        }*/
    });


    Hammer('body').on("swipedown", function(e) {

        if (e.gesture.pointerType != 'mouse')
        {
        $('.DetailLayer').css('top','100%');
          setTimeout(function(){

              $('.DetailLayer').hide();
          },500)
        e.preventDefault()
        }

    });

    $('.Slider').mousedown(function(e){

        e.preventDefault();
        alert ('ss');
    })


    DetailDrag = false;
    Hammer('body').on("drag", function(e) {

        console.log(e.gesture.touches[0].pageY);
        if (DetailDrag)
        {
            $('.DetailLayer').css('top', e.gesture.touches[0].pageY+'px');
        }
    });


    Hammer('body').on("dragend", function(e) {

        var top = parseInt($('.DetailLayer').css('top'));
        if (top < window.innerHeight*0.5)
        {
            $('.DetailLayer').css('top','0px');

        }
        else
        {
            $('.DetailLayer').css('top','100%');
        }
    });

    Hammer('.DetailLayer').on("dragstart", function(e) {
        DetailDrag = true;
    });

    $('.DetailLayer').mousedown(function(){
        DetailDrag = true;
    })

    $('.DetailLayer').mouseup(function(){
        DetailDrag = false;
    })


    document.addEventListener('touchmove',function(e) {

        e.preventDefault();
    },false);


    /*
    $('DetailLayer').on( "swipeup", page, function() {
       // $.mobile.changePage( prev + ".html", { transition: "slide", reverse: true } );
    });*/

}



