<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>M | Private Residences</title>
  <meta name="description" content="">

  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="styles/fancybox/jquery.fancybox.css">
  <link rel="stylesheet" href="styles/isotope.css">
  <link rel="stylesheet" href="styles/screen.css">

  <script src="scripts/libs/modernizr-2.5.3.min.js"></script>
  <script type="text/javascript" src="http://use.typekit.com/iaz2gyo.js"></script>
  <script type="text/javascript">try{Typekit.load();}catch(e){}</script>
</head>
<?php 
$file = substr($_SERVER["SCRIPT_NAME"], 1);
if ($file == 'index.php'):
?>
<body id="index">
<?php else: ?>
<body>
<?php endif; ?>

  <!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
  <div class="wrapper">
    <header role="banner">
      <div class="container">
        <div id="logo">
          <a href="/">M Private Residences</a>
        </div>
        <nav>
          <ul id="nav" class="main-nav">
            <li><a href="#" class="subnav" data-target="#subnav-experiences">Experiences <i><img src="images/svg/caret.svg" alt=""></i></a></li>
            <li><a href="#" class="subnav" data-target="#subnav-residences">Residences <i><img src="images/svg/caret.svg" alt=""></i></a></li>
            <li><a href="#">Membership</a></li>
          </ul>
          <ul class="secondary-nav">
            <li><a href="#">Alliances</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#" class="btn hover-silver">Register</a></li>
          </ul>
        </nav>
      </div>
    </header> <!-- / header banner -->

    <div id="subnav-experiences" class="subnav-container" style="display:none">
      <div class="container">
        <div class="span2">
          <h2>Canada</h2>
          <ul class="nav-list">
            <li><a href="#">Kelowna, BC</a></li>
            <li><a href="#">The Shutters, Victoria, BC</a></li>
            <li><a href="#">Bear Mountain, Victoria, BC</a></li>
            <li><a href="#">Whistler, BC</a></li>
          </ul>
        </div>
        <div class="span4">
          <h2>USA</h2>
          <ul class="nav-list">
            <li><a href="#">La Quinta, CA</a></li>
            <li><a href="#">Rancho Mirage, CA</a></li>
            <li><a href="#">Gold C mmttanyon, AZ</a></li>
            <li><a href="#">Paradise Valley, AZ</a></li>
          </ul>
          <ul class="nav-list">
            <li><a href="#">Las Vegas, NV</a></li>
            <li><a href="#">Oahu, HI</a></li>
            <li><a href="#">Big Island, HI</a></li>
            <li><a href="#">New York, NY</a></li>
          </ul>
        </div>
        <div class="span2">
          <h2>Caribbean</h2>
          <ul class="nav-list">
            <li><a href="#">St. Philip, Barbados West Indies</a></li>
          </ul>
        </div>
        <div class="span2">
          <h2>Mexico</h2>
          <ul class="nav-list">
            <li><a href="#">La Estancia, Cabo San Lucas</a></li>
            <li><a href="#">Esperanza 2402, Cabo San Lucas</a></li>
            <li><a href="#">Esperanza 2404, Cabo San Lucas</a></li>
          </ul>
        </div>
        <div class="span2">
          <h2>Europe</h2>
          <ul class="nav-list">
            <li><a href="#">London, England</a></li>
              <li><a href="#">St. Remy, Provence, France</a></li>
          </ul>
        </div>
      </div> <!-- / .container -->
    </div> <!-- / #subnav-experiences -->

    <div id="subnav-residences" class="subnav-container" style="display:none">
      <div class="container">
        <div class="span2">
          <h2>Canada.</h2>
          <ul class="nav-list">
            <li><a href="#">Kelowna, BC</a></li>
            <li><a href="#">The Shutters, Victoria, BC</a></li>
            <li><a href="#">Bear Mountain, Victoria, BC</a></li>
            <li><a href="#">Whistler, BC</a></li>
          </ul>
        </div>
        <div class="span4">
          <h2>USA</h2>
          <ul class="nav-list">
            <li><a href="#">La Quinta, CA</a></li>
            <li><a href="#">Rancho Mirage, CA</a></li>
            <li><a href="#">Gold C mmttanyon, AZ</a></li>
            <li><a href="#">Paradise Valley, AZ</a></li>
          </ul>
          <ul class="nav-list">
            <li><a href="#">Las Vegas, NV</a></li>
            <li><a href="#">Oahu, HI</a></li>
            <li><a href="#">Big Island, HI</a></li>
            <li><a href="#">New York, NY</a></li>
          </ul>
        </div>
        <div class="span2">
          <h2>Caribbean</h2>
          <ul class="nav-list">
            <li><a href="#">St. Philip, Barbados West Indies</a></li>
          </ul>
        </div>
        <div class="span2">
          <h2>Mexico</h2>
          <ul class="nav-list">
            <li><a href="#">La Estancia, Cabo San Lucas</a></li>
            <li><a href="#">Esperanza 2402, Cabo San Lucas</a></li>
            <li><a href="#">Esperanza 2404, Cabo San Lucas</a></li>
          </ul>
        </div>
        <div class="span2">
          <h2>Europe</h2>
          <ul class="nav-list">
            <li><a href="#">London, England</a></li>
              <li><a href="#">St. Remy, Provence, France</a></li>
          </ul>
        </div>
      </div> <!-- / .container -->
    </div> <!-- / #subnav-residences -->