  <?php include('includes/header.php'); ?>

    <section id="experiences">
      <div id="exp-gallery" class="container banner exp-slideshow">
        <!-- 
          Insert a generic poster image here, so if the JS doesn't load we don't load
          14 or so large images and there is also still something to show the user

          This entire area will be managed by JS, so some elements will be removed once 
          it is properly hooked up
         -->

        <img src="/images/_temp/fullsize/paradise_valley.jpg" alt="" style="margin:0 auto">
      </div>
      <nav class="tabs">
        <ul>
          <li id="exp1" class="exp-details static-tab">
            <a href="#" class="tab-button">
              <h2>Experience Name One <i class="caret"><img src="images/svg/caret.svg" alt=""></i></h2>
              <h3>For Couples</h3>
            </a>
          </li> <!-- / .exp-details -->
          <li id="exp2" class="exp-details static-tab">
            <a href="#" class="tab-button">
              <h2>Kelowna, BC <i class="caret"><img src="images/svg/caret.svg" alt=""></i></h2>
              <h3>Featured Residence</h3>
            </a>
          </li>
          <li class="exp-details static-tab">
            <a href="#" class="tab-button">
              <h2>Membership <i class="caret"><img src="images/svg/caret.svg" alt=""></i></h2>
              <h3>Benefits</h3>
            </a>
          </li> <!-- / .exp-details -->
        </ul>
      </nav>

      <!-- Will be hidden by default, and slid up by JS -->
      <div class="exp-subnav-holder exp-labels">
        <ul id="exp-gallery-labels"></ul>
      </div>
    </section> <!-- /#experiences -->

    <div id="main">
      <div class="container">
        <div class="span4 intro-column">
          <h2>About M Private Residences</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a nulla arcu, ac condimentum nulla. nulla tempor lorem sit amet tortor ultrices nec tempus tortor aliquam. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi eu metus in.<br><br></p>
          <a href="#" class="btn btn-silver">Learn More</a>
        </div>
        <div id="home-locations" class="span4 intro-column">
          <h2>Locations</h2>
          <ul class="nav-list">
            <li><a href="#">Kelowna, BC</a></li>
            <li><a href="#">Whistler, BC</a></li>
            <li><a href="#">Rancho Mirage, CA</a></li>
            <li><a href="#">Gold Canyon, AZ</a></li>
            <li><a href="#">Paradise Valley, AZ</a></li>
            <li><a href="#">Las Vegas, NV</a></li>
          </ul>
          <ul class="nav-list">
            <li><a href="#">Big Island, HI</a></li>
            <li><a href="#">New York, NY</a></li>
            <li><a href="#">St. Philip, Barbados</a></li>
            <li><a href="#">Cabo San Lucas</a></li>
            <li><a href="#">London, England</a></li>
            <li><a href="#">Provence, France</a></li>
          </ul>
          <a href="#" class="btn btn-silver">See All Locations</a>
        </div>
        <aside class="span4">
          <div class="box">
            <h2>Request More Information</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a nulla arcu.</p>
            <p>or call <strong>403.264.0993</strong></p>
            <form class="sign-up-form">
              <label for="your-email">Your Email</label>
              <input type="text" name="your-email" id="your-email" value="">
              <button class="btn">Sign Up</button>
            </form> <!-- .sign-up-form -->
          </div> <!-- / .box -->
        </aside>
      </div> <!-- / .container -->
    </div> <!-- / #main -->

<?php include('includes/footer.php'); ?>