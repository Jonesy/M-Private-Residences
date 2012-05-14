
    <footer class="main">
      <div class="container">
        <nav id="footer-nav" class="span4">
          <ul>
            <li><a href="#">About M</a></li>
            <li><a href="#">Members</a></li>
            <li><a href="#">News & Media</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <p><a href="#">Sitemap</a> | <a href="#">Legal</a> | <a href="#">Privacy</a></p>
          <div class="social-links">
            <a href="http://www.facebook.com/mprivateresidences" class="social-facebook" target="_blank"><img src="/images/svg/social-facebook.svg" alt="Share on Facebook" title="Share on Facebook"></a>
            <a href="http://twitter.com/#!/thefinestdays" class="social-twitter" target="_blank"><img src="/images/svg/social-twitter.svg" alt="Share on Twitter" title="Share on Twitter"></a>
            <a href="#" class="social-gplus" target="_blank"><img src="/images/svg/social-gplus.svg" alt="Share on Google+" title="Share on Google+"></a>
          </div> <!-- /.social-links -->
        </nav> <!-- / #footer-nav -->
        <div class="span4">
          <h2>Sign Up to Learn More!</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a nulla arcu, ac condimentum nulla. nulla tempor lorem sit amet tortor ultrices nec tempus tortor aliquam. </p>
          <form class="sign-up-form">
            <label for="your-email">Your Email</label>
            <input type="text" name="your-email" id="your-email" value="">
            <button class="btn">Sign Up</button>
          </form>
        </div> <!-- / Sign up to learn more -->
        <div class="span4">
          <h2>M Private Residences</h2>
          <address>
            Suite 205, 322 - 11th Ave. SW<br>
            Calgary, Alberta, Canada T2R 0C5<br>
            Call <strong>403.264.0993</strong>
          </address>
          <small>© 2012 M Private Residences</small>
        </div> <!-- / Address -->
      </div> <!-- /.container -->
    </footer>
  </div> <!-- / .wrapper -->

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/scripts/libs/jquery-1.7.1.min.js"><\/script>')</script>
  <script src="/scripts/libs/jquery.fancybox.js"></script>
  <script src="/scripts/libs/jquery.isotope.js"></script>
  <script>
    Modernizr.load({
      test: Modernizr.csstransitions,
      yep: '/scripts/libs/jquery.transform2d.js'
    });
  </script>
  <script src="/scripts/libs/underscore.js"></script>
  <script src="/scripts/libs/backbone.js"></script>
  <script src="/scripts/libs/grayscale.js"></script>
  <script src="/scripts/m/navigation.js"></script>
  <script src="/scripts/m/accordion.js"></script>
  <script src="/scripts/m/checkbox.js"></script>
  <script src="/scripts/m/selectbox.js"></script>
  <script src="/scripts/m.js"></script>
  <?php 
  $file = substr($_SERVER["SCRIPT_NAME"], 1);
  if ($file == 'index.php' || $file == 'experience.php' || $file == 'content.php'): ?>
  <script type="text/template" id="gallery-template">
    <ul id="gallery-images" class="carousel"></ul>
    <nav class="gallery-controls">
     <button class="gallery-nav-prev"><i><img src="images/svg/caret-lrg-left.svg"></i></button>
     <button class="gallery-nav-next"><i><img src="images/svg/caret-lrg-right.svg"></i></button>
    </nav>
  </script>
  <script type="text/template" id="exp-details-template">
    <% if (isTab) { %>
    <p><%= description %></p>
    <% } %>
    <div class="exp-thumbnails">
      <button class="gallery-nav-prev"><i><img src="images/svg/caret-lrg-left.svg" alt=""></i></button>
      <div class="exp-thumbnails-scroller">
        <ol></ol>
      </div>
      <button class="gallery-nav-next"><i><img src="images/svg/caret-lrg-right.svg" alt=""></i></button>
    </div> <!-- / .exp-thumbnails -->
    <% if (isTab) { %>
    <p class="learn-more-btn"><a href="<%= url %>" class="btn hover-silver">Learn More</a></p>
    <% } %>
  </script> 
  <script src="/scripts/experiences.js"></script>
  <?php endif; ?>

  <?php if ($file == 'index.php'): ?>
  <script>
    M.init();
    // Init the views
    M.expLabels = new M.GalleryLabelsView({
      model: M.galleryController,
      collection: M.experiences
    });


    M.expTab1 = new M.TabView({
      el: '#exp1',
      model: M.experiences.models[0],
      controller: M.galleryController
    });

    M.expTab2 = new M.TabView({
      el: '#exp2',
      model: M.experiences.models[1],
      controller: M.galleryController
    });

    M.slideshow = new M.SlideshowView({
      model: M.galleryController,
      collection: M.galleryImages
    });

    M.galleryController.set('gallery', 1);
  </script>
  <?php endif; ?>

  <?php if ($file == 'experience.php'): ?>
  <script>
    M.init();
    
    M.expTab1 = new M.TabView({
      el: '#exp1',
      model: M.experiences.models[0],
      controller: M.galleryController,
      collection: M.experiences,
      isVisible: true
    });

    M.expTab2 = new M.TabView({
      el: '#exp2',
      model: M.experiences.models[1],
      controller: M.galleryController,
      collection: M.experiences,
      isVisible: true
    });

    M.expTab3 = new M.TabView({
      el: '#exp3',
      model: M.experiences.models[2],
      controller: M.galleryController,
      collection: M.experiences,
      isVisible: true
    });

    M.slideshow = new M.SlideshowView({
      model: M.galleryController,
      collection: M.galleryImages
    });
  </script>
  <?php endif; ?>
  <?php if ($file == 'content.php'): ?>
  <script>
    M.init();
    M.slideshow = new M.SlideshowView({
      model: M.galleryController,
      collection: M.galleryImages
    });

    M.residenceGalleryControl = new M.GalleryThumbnailNavView({
      el: '#residence-thumbs',
      model: M.experiences.models[0],
      controller: M.galleryController
    });

    M.captions = new M.GalleryCaptionView({
      el: $('ul#exp-gallery-labels'),
      controller: M.galleryController,
      collection: M.galleryImages
    })
  </script>
  <?php endif; ?>
</body>
</html>