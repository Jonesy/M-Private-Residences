<?php include('includes/header.php'); ?>

<div id="main" class="grey-page">
  <div class="container">
    <section id="residences">
      <header class="span12 page-header">
        <h1>Our Residences</h1>
        <small>Select and deselect buttons to filter:</small>
        <div id="residences-filter" class="filter">
          <div class="btn-group">
            <ul>
              <li class="selected"><a href="#" data-filter="" class="btn btn-white">All</a></li>
              <li><a href="#" data-filter=".sun" class="btn btn-white">Sun</a></li>
              <li><a href="#" data-filter=".snow" class="btn btn-white">Snow</a></li>
              <li><a href="#" data-filter=".city" class="btn btn-white">City</a></li>
            </ul>
          </div>
          <div class="pipe"></div>
          <div class="btn-group">
            <ul>
              <li class="selected"><a href="#" data-filter="" class="btn btn-white">All</a></li>
              <li><a href="#" data-filter=".canada" class="btn btn-white">Canada</a></li>
              <li><a href="#" data-filter=".usa" class="btn btn-white">USA</a></li>
              <li><a href="#" data-filter=".mexico" class="btn btn-white">Mexico</a></li>
              <li><a href="#" data-filter=".caribbean" class="btn btn-white">Caribbean</a></li>
              <li><a href="#" data-filter=".europe" class="btn btn-white">Europe</a></li>
            </ul>
          </div>
        </div> <!-- / .fitler -->
      </header> <!-- / exp creator header -->

      <ul id="our-residences" class="locations-grid">
        <li class="span4 residence sun caribbean">
          <img src="/images/_temp/grid/barbados.jpg" alt="">
          <h3><a href="#">Barbados</a></h3>
        </li>
        <li class="span4 residence snow canada">
          <img src="/images/_temp/grid/bear_mountain.jpg" alt="">
          <h3><a href="#">Bear Mountain</a></h3>
        </li>
        <li class="span4 residence sun barbados">
          <img src="/images/_temp/grid/big_island.jpg" alt="">
          <h3><a href="#">Big Island</a></h3>
        </li>
        <li class="span4 residence sun mexico">
          <img src="/images/_temp/grid/cabo_esperanza.jpg" alt="">
          <h3><a href="#">Cabo Esperanza</a></h3>
        </li>
        <li class="span4 residence sun usa">
          <img src="/images/_temp/grid/gold_canyon.jpg" alt="">
          <h3><a href="#">Gold Canyon</a></h3>
        </li>
        <li class="span4 residence city canada">
          <img src="/images/_temp/grid/kelowna.jpg" alt="">
          <h3><a href="#">Kelowna</a></h3>
        </li>
        <li class="span4 residence sun mexico">
          <img src="/images/_temp/grid/la_quinta.jpg" alt="">
          <h3><a href="#">La Quinta</a></h3>
        </li>
        <li class="span4 residence city europe">
          <img src="/images/_temp/grid/london.jpg" alt="">
          <h3><a href="#">London</a></h3>
        </li>
        <li class="span4 residence city usa">
          <img src="/images/_temp/grid/new_york.jpg" alt="">
          <h3><a href="#">New York</a></h3>
        </li>
      </ul>

    </section> <!-- / #experience-creator -->
  </div>
</div>
<?php include('includes/footer.php'); ?>