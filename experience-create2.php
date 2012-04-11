<?php include('includes/header.php'); ?>

<div id="main" class="grey-page">
  <div class="container">
    <section id="experience-creator">
      <header class="span12">
        <div class="breadcrumb numbered">
          <ol>
            <li>Destination</li>
            <li class="current">Activities</li>
            <li>Events</li>
            <li>Dining</li>
            <li>Shopping</li>
            <li>Review & Share</li>
          </ol>
        </div> <!-- / .breadcrumb -->
        <a href="#" class="btn btn-white next-step">Next</a>
        <h3>Create your own experience</h3>
        <h1>I Like To...</h1>
        <small>Make your selections below:</small>
      </header> <!-- / exp creator header -->

      <ul class="locations-grid">
        <li class="span4">
          <img src="http://placehold.it/300x148" alt="">
          <h3><a href="#" class="selected">Golf <i><img src="images/svg/caret.svg" alt="" class="caret-right"></i></a></h3>
          <dl>
            <dt>
              <button class="toggle">+</button>
              <label>
                <input type="checkbox" name="" value="">
                Golf Course Name One
              </label>
            </dt>
            <dd>Lorem ipsum dolor sit amet, consectetur adipiscing elit. etiam at fermentum ipsum. Suspendisse facilisis fringilla nunc sit amet dignissim. In feugiat, sem sed mattis eleifend, nunc nibh pellentesque lacus, et facilisis.</dd>
            <dt>
              <button class="toggle">+</button>
              <label>
                <input type="checkbox" name="" value="">
                Golf Course Name One
              </label>
            </dt>
            <dd style="display:none">Lorem ipsum dolor sit amet, consectetur adipiscing elit. etiam at fermentum ipsum. Suspendisse facilisis fringilla nunc sit amet dignissim. In feugiat, sem sed mattis eleifend, nunc nibh pellentesque lacus, et facilisis.</dd>
          </dl>
        </li>
        <li class="span4">
          <img src="http://placehold.it/300x148" alt="">
          <h3><a href="#">Attend Shows <i><img src="images/svg/caret.svg" alt="" class="caret-right"></i></a></h3>
        </li>
        <li class="span4">
          <img src="http://placehold.it/300x148" alt="">
          <h3><a href="#">Go on Tours <i><img src="images/svg/caret.svg" alt="" class="caret-right"></i></a></h3>
        </li>
      </ul> <!-- / ul.location-selection -->
      <footer>
        <div class="span12">
          <a href="#" class="btn btn-white pull-right">Next</a>
        </div>
      </footer>
    </section> <!-- / #experience-creator -->
  </div>
</div>
<?php include('includes/footer.php'); ?>