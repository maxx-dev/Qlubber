<!DOCTYPE html>
<html>
<head>
  <title></title>

    <script src="Jquery/jquery-1.9.1.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no">


    <style>


        #Phone {

            position:absolute;
            left:0px;
            top:0px;
            margin:0px;
            padding:0px;
            width:100%;
            height:100%;
            border: 1px black solid;
            overflow:hidden;


        }


        #Phone #Map {

            position:absolute;
            top:0px;
            left:0px;
            width:100%;
            height:100%;

        }


        #Phone .Search {

            position:absolute;
            top:15px;
            margin:0px;
            padding:0px;
            width:95%;
            height:50px;
            left:2.5%;
            -webkit-box-shadow: 3px 3px 13px 3px #898684;
            font-size:30px;
        }

        #Phone .DetailLayer {

            position:absolute;
            top:100%;
            width:100%;
            height:100%;
            border-top: 4px #726f6d solid;
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#dfe9eb), color-stop(10%,#d5dfe3), color-stop(25%,#c6d1d6), color-stop(37%,#c7d3d9), color-stop(50%,#c9d5db), color-stop(51%,#b5c5cd), color-stop(83%,#d3e0e3), color-stop(100%,#e1eded)); /* Chrome,Safari4+ */

        }

        #Phone .Location {

            position:absolute;
            bottom:10px;
            right:10px;
            width:50px;
            height:50px;
            border-radius:3px;
            background-color:#e3e0de;
            -webkit-box-shadow: 3px 3px 13px 3px #898684;

        }

        #Phone .Location div {

            background-image:url('location.png');
        }


    </style>


    <script type="text/javascript"
            src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDkiG0Cf46ZW6vqvZytWl0RPimm8ImDRRo&sensor=false">
    </script>
    <script type="text/javascript">

        // new google.maps.LatLng(37.7749295, -122.4194155)

        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(37.7749295, -122.4194155),
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("Map"),
                mapOptions);


            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(37.7749295, -122.4194155),
                map: map,
                title:"Hello World!"
            });


            // CUSTOM ICON
          /*  var marker = new google.maps.Marker({
                position: new google.maps.LatLng(-23.397, 149.644),
                map: map,
                icon: 'icon.png',
                title:"Hello World!"
            });*/

            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(15);
                map.setCenter(marker.getPosition());

                $('#Phone').find('.DetailLayer').animate({top:'90%'},200,function(){

                $.ajax({
                    type: "POST",
                    url: "GetDetails.php",
                    data: {},
                    success: function(content)
                    {
                        $('#Phone').find('.DetailLayer').html(content)
                        console.log('Data Received');

                    }
                });




                });
            });
        }
    </script>

    <script>

        $(document).ready(function(){


            $('#Map').click(function(){


                $('#Phone').find('.Search').animate({top:-60},200);
            })



        })

    </script>

</head>
<body onload="initialize()">


<div id="Phone">

    <div id="Map"></div>
    <div class="DetailLayer"></div>
    <div class="Location"><div></div></div>

    <input class="Search">

</div>


</body>
</html>