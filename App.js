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


    $.ajax({
        type: "POST",
        url: "GetDetails.php",
        data: {},
        dataType: 'json',
        success: function(data)
        {
            Data = data;
            console.log(data);
            console.log('Data Received');
            LoadData();
            Events();
        }
    });

}



function LoadData ()
{
    Markers = [];
    // RECEIVE DATA VIA JSON HERE

    for (var x = 0;x<Data.Clubs.length;x++)
    {
        var marker =  createMarker(Data.Clubs[x].Pos.lat,Data.Clubs[x].Pos.lon,'bla','img/icon.png',Data.Clubs[x].ID)
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

    Markers.push(marker);
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



