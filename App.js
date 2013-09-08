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

    /*var marker = new google.maps.Marker({
        position: new google.maps.LatLng(37.7749295,-122.4194155),
        map: map,
        title: 'Hello World!'
    });*/





    LoadData();
    Events();
}



function LoadData ()
{

    // RECEIVE DATA VIA JSON HERE
    Data={"Clubs":[
        {
            "Name":"Ruby Skies",
            "Type":"Clubs",
             "Pos": {
                 "lat": "37.7749295",
                 "lon": "-122.4194155"
             }

        },
        {
            "Name":"bla blub Club",
            "Type":"Bar",
            "Pos": {
                "lat": "37.7749595",
                "lon": "-122.4004155"
            }
        },
        {
            "Name":"test Club",
            "Type":"Bar",
            "Pos": {
                "lat": "37.7449595",
                "lon": "-122.4034155"
            }
        }
    ]}

    console.log(Data.Clubs[0].Pos)

    Markers = [];
    for (var x = 0;x<Data.Clubs.length;x++)
    {
        // CUSTOM ICON
         marker = new google.maps.Marker({
            position: new google.maps.LatLng(Data.Clubs[x].Pos.lat,Data.Clubs[x].Pos.lon),
            map: map,
            icon: 'img/icon.png',
            title:"ID"
        });

        Markers.push(marker);
    }



}

function Events ()
{
    // ENABLE DETAIL
   for (var x = 0;x<Data.Clubs.length;x++)
    {
    google.maps.event.addListener(Markers[x], 'click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());


        $('#Phone').find('.DetailLayer').animate({top:'85%'},200,function(){

            $.ajax({
                type: "POST",
                url: "GetDetails.php",
                data: {ID:x},
                success: function(content)
                {
                    $('#Phone').find('.DetailLayer').html(content)
                    console.log('Data Received');
                }
            });
        });
    });
    }


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

        $('#Phone').find('.Search').css('top','-60px');
    })

    $('#Phone').find('.Rate').click(function(){

        $('#Phone').find('.RateLayer').css('left','0px');
    })

    Hammer('.RateLayer').on("swipeleft", function(e) {

        $('#Phone').find('.RateLayer').css('left','-100%');
        e.preventDefault();
    })


    Hammer('body').on("swipeup", function(e) {
        //alert('you swiped left!');
          console.log(e.pageY);
        $('.DetailLayer').css('top','0px');
        e.preventDefault()
    });


    Hammer('body').on("swipedown", function(e) {

        $('.DetailLayer').css('top','100%');
        e.preventDefault()

    });

    document.addEventListener('touchmove',function(e) {

        e.preventDefault();
    },false);


    /*
    $('DetailLayer').on( "swipeup", page, function() {
       // $.mobile.changePage( prev + ".html", { transition: "slide", reverse: true } );
    });*/

}



