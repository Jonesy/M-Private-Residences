(function($) {
  window.M = {};

  var IMAGES = _.flatten(_.pluck(EXP, 'images')),
      slideInt = 5000,
      timer;


  /**
    Models
    ---------------- */
  M.Exp = Backbone.Model.extend({

  });

  // Model of the images, so thumbnail and large image can be bound.
  M.GalleryImage = Backbone.Model.extend({
    reset: function() {
      this.set('isSelected', false);
    },
    select: function() {
      this.set('isSelected', true);
    }
  });

  // Manages the global state of the slideshow
  M.Controller = Backbone.Model.extend({
    defaults: {
      index: 0
    },
    initialize: function() {
      _.bindAll(this, 'nextSlide');
    },

    nextSlide: function() {
      var idx = this.get('index'),
          total = this.get('totalImages');
      if ((idx + 1) < total) {
        this.set('index', idx + 1);
      }
    }
  });

  M.galleryController = new M.Controller();

  /**
    Collections
    ---------------- */
  M.Experiences = Backbone.Collection.extend({
    model: M.Exp
  });

  M.GalleryImages = Backbone.Collection.extend({
    model: M.GalleryImage,
    // Turn on/off grayscale version of image
    selectIndex: function(idx) {
      var galleryId = this.models[idx].get('galleryId');
      this.invoke('reset');
      this.models[idx].select();
      M.galleryController.set('gallery', galleryId);
    }
  });

  // Kick off all the collections, controllers, timer.
  M.experiences = new M.Experiences(EXP);
  M.galleryImages = new M.GalleryImages(IMAGES);
  M.galleryController.set('totalImages', M.galleryImages.length);
  timer = setInterval(M.galleryController.nextSlide, slideInt);

  // Update the gallery collection index when the controller updates.
  M.galleryController.on('change:index', function(model, change) {
    M.galleryImages.selectIndex(model.get('index'));
  });

  /**
    Views
    ---------------- */
  M.LargeImageView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<img src="<%= large %>" alt="">'),
    initialize: function() {
      this.model.bind('change', this.toggle, this);
    },
    toggle: function(model, change) {
      if (model.get('isSelected')) {
        this.$el.fadeTo('slow', 1);
      } else {
        this.$el.fadeTo('slow', 0.25);
      }
    },
    render: function() {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }
  });

  // The White labels
  M.GalleryLabelView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<h2><%= place %></h2><h3><%= location %></h3>'),
    initialize: function() {
      this.controller = this.options.controller;
      this.controller.bind('change', this.toggle, this);
    },

    toggle: function(model) {
      var id = this.model.get('id'),
          selectedGalleryId = model.get('gallery');
      
      if (id === selectedGalleryId) {
        this.$el.animate({
          top: -160
        }, 500);
      } else {
        this.$el.animate({
          top: 0
        }, 400);
      }
    },

    render: function() {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }
  });

  M.GalleryLabelsView = Backbone.View.extend({
    el: '#exp-gallery-labels',
    initialize: function() {
      this.render();
    },
    render: function() {
      this.collection.each(this.renderLabel, this);
    },
    renderLabel: function(model) {
      var label = new M.GalleryLabelView({
        model: model,
        controller: this.model
      });
      this.$el.append(label.render().el);
    }
  });

  // The main slide show view
  M.SlideshowView = Backbone.View.extend({
    el: '#exp-gallery',
    tagName: 'li',
    imageWidth: 940,
    totalImages: 0,
    template: _.template($('#gallery-template').html()),

    events: {
      'mouseover': 'pauseSlideshow',
      'mouseleave': 'startSlideshow',
      'click button.gallery-nav-prev': 'goToPrevImage',
      'click button.gallery-nav-next': 'goToNextImage'
    },

    initialize: function() {
      this.totalImages = this.collection.length;
      this.model.bind('change:index', this.updateIndex, this);

      // Be sure to remove the poster image which is there incase this all blows up.
      this.$el.empty();
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.collection.each(this.renderImage, this);
      M.galleryImages.selectIndex(0);
    },

    // Add the images
    // TODO: Add some loading animation.
    renderImage: function(model) {
      var image = new M.LargeImageView({
        model: model
      });
      this.$el.find('#gallery-images').append(image.render().el);
    },

    // Animate the carousel.
    updateIndex: function(model, change) {
      var pullLeft = model.get('index') * this.imageWidth * -1;
      this.$el.find('ul').animate({
        left: pullLeft
      })
    },

    // Button actions. Will clear timers.
    goToNextImage: function() {
      var model = this.model,
          idx = model.get('index');
      if (idx < (this.totalImages - 1)) {
        model.set('index', idx + 1);
      }
      window.clearInterval(timer);
    },

    goToPrevImage: function() {
      var model = this.model,
          idx = model.get('index');
      if (idx > 0) {
        model.set('index', idx - 1);
      }
      window.clearInterval(timer);
    },

    // Slideshow timers
    startSlideshow: function() {
      timer = setInterval(M.galleryController.nextSlide, slideInt);
    },

    pauseSlideshow: function() {
      window.clearInterval(timer);
    }
  });

  // Init the views
  M.expLabels = new M.GalleryLabelsView({
    model: M.galleryController,
    collection: M.experiences
  })

  M.slideshow = new M.SlideshowView({
    model: M.galleryController,
    collection: M.galleryImages
  });
})(jQuery);