(function($) {
  window.M = {};

  var SETTINGS = {
    IMG_OFF_OPACITY: 0.45
  };

  var IMAGES = _.flatten(_.pluck(EXP, 'images')),
      slideInt = 5000,
      timer;


  /**
    Models
    ---------------- */
  M.Exp = Backbone.Model.extend({});

  // Model of the images, so thumbnail and large image can be bound.
  M.GalleryImage = Backbone.Model.extend({
    defaults: {
      isSelected: false
    },
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
      } else {
        this.set('index', 0);
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
    },
    getGalleryImages: function(id) {
      return this.filter(function(img) {
        return img.get('galleryId') === id;
      });
    },
    ids: function() {
      return this.pluck('id');
    }
  });

  /**
    Views
    ---------------- */
  M.ImageView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
      this.model.bind('change', this.toggle, this);
    },
    toggle: function(model, change) {
      if (model.get('isSelected')) {
        this.$el.addClass('current').fadeTo('slow', 1);
      } else {
        this.$el.removeClass('current').fadeTo('slow', SETTINGS.IMG_OFF_OPACITY);
      }
    },
    render: function() {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      this.$el.fadeTo(10, SETTINGS.IMG_OFF_OPACITY);
      return this;
    }
  });

  M.LargeImageView = M.ImageView.extend({
    template: _.template('<img src="<%= large %>" alt="">')
  });

  M.ThumbnailView = M.ImageView.extend({
    events: {
      'click a': 'goToImage'
    },
    goToImage: function(event) {
      event.preventDefault();
      this.options.controller.set('index', M.galleryImages.indexOf(this.model));
    },
    template: _.template('<a href="#"><img src="<%= thumb %>" alt=""></a>')
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
          transform: 'translateY(-160px)'
        }, 500);
      } else {
        this.$el.animate({
          transform: 'translateY(0px)'
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
      'mouseenter': 'pauseSlideshow',
      'mouseleave': 'startSlideshow',
      'click button.gallery-nav-prev': 'goToPrevImage',
      'click button.gallery-nav-next': 'goToNextImage'
    },

    initialize: function() {
      this.totalImages = this.collection.length;
      this.model.bind('change:index', this.updateIndex, this);
      this.model.bind('change:selectedNav', this.toggleSlideshowNav, this);
      // Be sure to remove the poster image which is there incase this all blows up.
      this.$el.empty();
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.collection.each(this.renderImage, this);
      this.collection.selectIndex(0);
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
      var pullLeft = model.get('index') * this.imageWidth;
      this.$el.find('ul').animate({
        transform: 'translateX(-' + pullLeft + 'px)'
      });
    },

    // Button actions. Will clear timers.
    goToNextImage: function() {
      var model = this.model,
          idx = model.get('index');
      if (idx < (this.totalImages - 1)) {
        model.set('index', idx + 1);
      } else if (idx === (this.totalImages - 1)) {
        model.set('index', 0);
      }
      window.clearInterval(timer);
    },

    goToPrevImage: function() {
      var model = this.model,
          idx = model.get('index');
      if (idx > 0) {
        model.set('index', idx - 1);
      } else {
        model.set('index', this.totalImages - 1);
      }
      window.clearInterval(timer);
    },

    // Slideshow timers
    startSlideshow: function() {
      if (!this.model.get('selectedNav')) {
        timer = setInterval(M.galleryController.nextSlide, slideInt);
      }
    },

    pauseSlideshow: function() {
      window.clearInterval(timer);
    },

    toggleSlideshowNav: function(model, change) {
      if (model.get('selectedNav')) {
        this.$el.parent().addClass('tabs-active');
      } else {
        this.$el.parent().removeClass('tabs-active');
      }
    }
  });

  // Tabs View
  M.TabView = Backbone.View.extend({
    thumbsList: null,
    template: _.template($('#exp-details-template').html()),
    events: {
      'click a.tab-button': 'toggleTab',
      'click button.gallery-nav-prev': 'goToPrevImage',
      'click button.gallery-nav-next': 'goToNextImage'
    },

    initialize: function() {
      this.controller = this.options.controller;
      this.controller.bind('change:selectedNav', this.openDetails, this);
      this.controller.bind('change:index', this.slideThumbs, this);
      this.images = M.galleryImages.getGalleryImages(this.model.get('id'));
      this.render();
    },

    render: function() {
      var data = _.extend({}, this.model.toJSON(), {thumbs: this.images}),
          template = this.template(data);

      this.$el
        .removeClass('static-tab')
        .addClass('exp-nav-on')
        .append(template);

      this.thumbsList = this.$el.find('ol');
      _.each(this.images, this.renderThumbs, this);
    },

    renderThumbs: function(thumb) {
      var thumb = new M.ThumbnailView({
        model: thumb,
        controller: this.controller
      });
      this.thumbsList.append(thumb.render().el);
    },

    openDetails: function(controller) {
      var self = this;
      if (controller.get('selectedNav') === this.model) {
        this.$el.addClass('selected').animate({
          transform: 'translateY(-240px)'
        }, 500);

        var expImages = M.galleryImages.getGalleryImages(this.model.get('id')),
            firstImgId = expImages[0].get('id'),
            imageIdx = _.indexOf(M.galleryImages.ids(), firstImgId);

        controller.set('index', imageIdx);

        M.slideshow.pauseSlideshow();
      } else {
        this.$el.animate({
          transform: 'translateY(-0px)'
        }, 500, function() {
          self.$el.find('a.tab-button > span.close-tab').remove();
          $(this).removeClass('selected');
        });
      }
    },

    // Button actions. Will clear timers.
    goToNextImage: function() {
      var controller = this.controller,
          galleryIdx = this.$el.find('ol li.current').index() + 1,
          idx = controller.get('index');
        
      if (galleryIdx < this.images.length) {
        controller.set('index', idx + 1);
      }

      if (galleryIdx === this.images.length) {
        controller.set('index', M.galleryImages.indexOf(this.images[0]));
      }

      window.clearInterval(timer);
    },

    goToPrevImage: function() {
      var controller = this.controller,
          galleryIdx = this.$el.find('ol li.current').index(),
          idx = controller.get('index');

      if (galleryIdx > 0) {
        controller.set('index', idx - 1);
      }

      if (galleryIdx === 0) {
        var lastImg = _.last(this.images);
        controller.set('index', M.galleryImages.indexOf(lastImg));
      }
      window.clearInterval(timer);
    },

    slideThumbs: function(model, changes) {
      var galleryId = model.get('gallery'),
          selectedGalleryId = this.controller.get('gallery'),
          totalImages = this.images.length,
          galleryIdx = this.$el.find('ol li.current').index() + 1,
          pullLeft = (galleryIdx === 1) 
                    ? 0 
                    : (galleryIdx - 2) * 80;

      if (galleryId === selectedGalleryId && totalImages > 3) {
        if (galleryIdx > 0 && galleryIdx < totalImages) {
          this.thumbsList.animate({
            transform: 'translateX(-' + pullLeft + 'px)'
          });
        } else if (galleryIdx === totalImages) {
          this.thumbsList.animate({
            transform: 'translateX(-' + ((totalImages - 3) * 80) + 'px)'
          });
        }
      }
    },

    toggleTab: function(event) {
      event.preventDefault();

      var selectedNav = this.controller.get('selectedNav');

      if (this.model === selectedNav) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function() {
      this.controller.set('selectedNav', this.model);
      this.$el.find('a.tab-button').append('<span class="close-tab">&times;</span>');
    },

    close: function() {
      var self = this;
      this.controller.set('selectedNav', null);
      this.$el.animate({
        transform: 'translateY(0px)'
      }, 500, function() {
        self.$el.find('a.tab-button > span.close-tab').remove();
        $(this).removeClass('selected');
      });
    }
  });

  // Boot
  // Kick off all the collections, controllers, timer.
  M.experiences = new M.Experiences(EXP);
  M.galleryImages = new M.GalleryImages(IMAGES);
  M.galleryController.set('totalImages', M.galleryImages.length);
  timer = setInterval(M.galleryController.nextSlide, slideInt);

  // Update the gallery collection index when the controller updates.
  M.galleryController.on('change:index', function(model, change) {
    M.galleryImages.selectIndex(model.get('index'));
  });

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
})(jQuery);