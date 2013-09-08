<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
        html { height: 100% }
        body { height: 100%; margin: 0; padding: 0 }
        #Map {width:100%; height:100%}
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

    </style>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDkiG0Cf46ZW6vqvZytWl0RPimm8ImDRRo&sensor=true">
    </script>
    <script type="text/javascript">
        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(-34.397, 150.644),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
             var map = new google.maps.Map(document.getElementById("Map"),
                mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(-34.397,150.644),
                map: map,
                title: 'Hello World!'
            });


            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(18);
                map.setCenter(marker.getPosition());

                alert('sss');

            });
        }




    </script>
</head>
<body onload="initialize()">
<div id="Phone">
    <div id="Map"></div>

</div>

</body>
</html>