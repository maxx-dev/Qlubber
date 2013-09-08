<!DOCTYPE html>
<html>
<head>
  <title></title>

    <script src="Jquery/jquery-1.9.1.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no">
    <link rel="stylesheet" href="styles.css">

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDkiG0Cf46ZW6vqvZytWl0RPimm8ImDRRo&sensor=true&libraries=places"></script>
    <script type="text/javascript" src="App.js"></script>
    <script type="text/javascript" src="jquery.hammer.js"></script>

    <script src="http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js"></script>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css">

</head>
<body>


<div id="Phone">

    <div id="Map"></div>
    <div class="DetailLayer"></div>
    <div class="RateLayer">


        <table>

            <tr>
                <td class="title">Waiting</td>
                <td>

                    <ul class='star-rating'>
                        <li><a href='#' title='Rate this 1 star out of 5' class='one-star'>1</a></li>
                        <li><a href='#' title='Rate this 2 stars out of 5' class='two-stars'>2</a></li>
                        <li><a href='#' title='Rate this 3 stars out of 5' class='three-stars'>3</a></li>
                        <li><a href='#' title='Rate this 4 stars out of 5' class='four-stars'>4</a></li>
                        <li><a href='#' title='Rate this 5 stars out of 5' class='five-stars'>5</a></li>
                    </ul>


                </td>
            </tr>

            <tr>
                <td class="title">Ratio</td>

                <td>
                    <div data-role="rangeslider">
                        <input class="Slider"  min="0" max="100" step="1" value="50" type="range">
                    </div>

                </td>
            </tr>

            <tr>
                <td class="title">Price</td>
                <td>
                    <ul class='star-rating'>
                        <li><a href='#' title='Rate this 1 star out of 5' class='one-star'>1</a></li>
                        <li><a href='#' title='Rate this 2 stars out of 5' class='two-stars'>2</a></li>
                        <li><a href='#' title='Rate this 3 stars out of 5' class='three-stars'>3</a></li>
                        <li><a href='#' title='Rate this 4 stars out of 5' class='four-stars'>4</a></li>
                        <li><a href='#' title='Rate this 5 stars out of 5' class='five-stars'>5</a></li>
                    </ul>
                    
                    
                </td>
            </tr>


        </table>




    </div>
    <div class="Location"><img src="img/location.png"></div>
    <div class="Rate"><img src="img/rate.png"></div>

    <input id="Search">

</div>


</body>
</html>