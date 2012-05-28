(function($) {
  window.M = {};

  // Store any global settings here. Seconds are multiplied by milliseconds for convenience.
  M.Settings = {
    // Default image opacity that the slide show will $.fadeTo
    IMG_OFF_OPACITY: 0.45,
    // Intervals between slideshow transition
    SLIDE_INTERVAL: 8 * 1000,
    // Speed
    SLIDE_TRANSITION: 850,
    // If the Timer is stopped silently, wait this long before turning it on
    RESTART_TIMEOUT: 8 * 1000,
    // Tabs and captions
    TAB_SLIDEUP_SPEED: 500,
    TAB_SLIDEDOWN_SPEED: 400,
    ERROR_IMAGE: '/images/_temp/fullsize/paradise_valley.jpg'
  };

  var IMAGES = _.flatten(_.pluck(EXP, 'images'));

  // Simple namespace for slideshow timers
  M.Timer = {
    // Store timer here
    ticker: null,
    // Only creates a timer that will go to the next slide.
    create: function() {
      this.ticker = setInterval(M.galleryController.nextSlide, M.Settings.SLIDE_INTERVAL);
    },
    /**
      @param opts {Object} Takes an option of 'silent', which stops the slide show, but 
                            gives tells the UI it's faux paused.
    */
    destroy: function(opts) {
      var defaults = {
            silent: false
          },
          settings = _.extend({}, defaults, opts);
      window.clearInterval(M.Timer.ticker);

      if (settings.silent) {
        this.ticker = {};
      } else {
        this.ticker = null;
      }
    }
  };

  M.init = function() {
    // Boot
    // Kick off all the collections, controllers, timer.
    M.experiences = new M.Experiences(EXP);
    M.galleryImages = new M.GalleryImages(IMAGES);
    M.galleryController.set('totalImages', M.galleryImages.length);

    // Update the gallery collection index when the controller updates.
    M.galleryController.on('change:index', function(model, change) {
      M.galleryImages.selectIndex(model.get('index'));
    });
  };

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
    },
    getIndex: function(model) {
      return this.indexOf(model);
    }
  });

  /**
    Views
    ---------------- */
  M.ImageView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click img': 'goToImage'
    },
    initialize: function() {
      this.model.bind('change', this.toggle, this);
    },

    render: function() {
      var index = this.model.collection.getIndex(this.model);
      this.loadImage(this.model.toJSON());
      if (this.imgType !== 'thumb') {
        this.$el.hide().delay(index * 50).fadeTo(10, M.Settings.IMG_OFF_OPACITY);
      }
      return this;
    },

    loadImage: function(model, options) {
      var self = this,
          imgSize = this.imgType,
          settings = _.extend({}, options);

      $('<img />')
          .hide()
          .attr('src', model[imgSize])
          .load(function() {
            self.$el.append($(this));

            if (settings.grayscale) {
              grayscale($(this));
            }

            $(this).fadeIn();
          });
    },

    toggle: function(model, change) {
      if (this.imgType === 'thumb') {
        var imgSize = this.imgType,
          $selectedImage = $('<img>').attr('src', model.get(imgSize)).hide();
        if (model.get('isSelected')) {
          this.$el.addClass('current');

          $selectedImage
            .addClass('temp')
            .css({
              position: 'absolute',
              top: 0,
              left: 0
            })
            .appendTo(this.$el)
            .fadeIn();
        } else {
          this.$el
            .removeClass('current')
            .find('img.temp')
            .fadeOut('fast', function() {
              $(this).remove();
            });
        }

      } else {
        if (model.get('isSelected')) {
          this.$el.addClass('current').fadeTo('slow', 1);
        } else {
          this.$el.removeClass('current').fadeTo('slow', M.Settings.IMG_OFF_OPACITY);
        }
      }
    },
    goToImage: function(event) {
      event.preventDefault();
      var idx = this.model.collection.indexOf(this.model);
      M.galleryController.set('index', idx);
    }
  });

  M.LargeImageView = M.ImageView.extend({
    events: {
      'click img': 'goToPage'
    },
    imgType: 'large',
    goToPage: function(event) {
      var url = M.experiences.get(1).get('url');
      
      if (window.location.pathname !== '/' + url) {
        window.location = url; 
      }
      return false;
    }
  });

  M.ThumbnailView = M.ImageView.extend({
    imgType: 'thumb',
    render: function() {
      this.loadImage(this.model.toJSON(), {grayscale: true});
      return this;
    },
    goToImage: function(event) {
      event.preventDefault();
      M.Timer.destroy();
      this.options.controller.set('index', M.galleryImages.indexOf(this.model));

      setTimeout(function() {
        if (!M.Timer.ticker) {
          M.Timer.create();
        }
      }, M.Settings.RESTART_TIMEOUT);
    }
  });

  // The White labels
  M.GalleryLabelView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<h2><%= place %></h2><h3><%= location %></h3>'),
    initialize: function() {
      this.controller = this.options.controller;
      this.controller.bind('change:gallery', this.toggle, this);
    },

    toggle: function(model, change) {
      var id = this.model.get('id'),
          selectedGalleryId = model.get('gallery');

      if (id === selectedGalleryId) {
        this.$el.animate({top: -160}, M.Settings.TAB_SLIDEUP_SPEED, 'easeInOut');
      } else {
        this.$el.animate({top: 0}, M.Settings.TAB_SLIDEDOWN_SPEED, 'easeInOut');
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
      this.model.trigger('change', {gallery: 1});
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
      var self = this;
      this.totalImages = this.collection.length;
      this.model.bind('change:index', this.updateIndex, this);
      this.model.bind('change:selectedNav', this.toggleSlideshowNav, this);
      // Be sure to remove the poster image which is there incase this all blows up.
      this.$el.empty();
      $.when(this.load()).then(
        function() {
          setTimeout(function() {
            self.render();
          }, 2000);
        },
        function() {
          self.fail();
        }
      );
    },
    
    fail: function() {
      var $failImg = $('<img>');
      $failImg.prop('src', M.Settings.ERROR_IMAGE);
      $failImg.css('margin', '0 auto');
      this.$el.empty().append($failImg);
    },
    
    load: function() {
      var dfd = new jQuery.Deferred(),
          totalImages = this.collection.length,
          images = this.collection.pluck('large'),
          totalImagesLoaded = 0,
          $loadImage = $('<img src="/images/m-loader.gif">'),
          loadImageHeight = 35;

          $loadImage.css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: (loadImageHeight / 2) * -1,
            marginLeft: (loadImageHeight / 2) * -1,
          });
          
          this.$el.append($loadImage);

          _.each(images, function(src, idx) {
            var img = new Image();
            $(img).load(function () {
              totalImagesLoaded++;
              if (totalImagesLoaded === totalImages) {
                dfd.resolve();
              }
            }).error(function () {
              dfd.reject();
            }).attr('src', src);
          });
      return dfd.promise();
    },

    render: function() {
      this.$el.empty();
      this.$el.html(this.template());
      this.$el.find('ul').css('left', this.imageWidth * this.totalImages * -1);
      _.each(_.range(3), function() {
        this.collection.each(this.renderImage, this);
      }, this);
      this.collection.selectIndex(0);
      M.Timer.create();
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
      var self = this,
          previousIdx = model.previous('index'),
          fullGalleryLength = (this.totalImages * this.imageWidth),
          pullLeft = model.get('index') * this.imageWidth;


      if (change === 0 && previousIdx === this.totalImages - 1) {
        this.$el.find('ul').animate({
          left: (fullGalleryLength * 2) * -1
        }, M.Settings.SLIDE_TRANSITION, 'easeInOut', function() {
          $(this).css('left', fullGalleryLength * -1);
        });
      } else if (change === (this.totalImages - 1) && previousIdx === 0) {
        this.$el.find('ul').animate({
          left: (fullGalleryLength - this.imageWidth) * -1
        }, M.Settings.SLIDE_TRANSITION, 'easeInOut', function() {
          $(this).css('left', ((fullGalleryLength * 2) - self.imageWidth) * -1);
        });
      } else {
        this.$el.find('ul').animate({
          left: (pullLeft + fullGalleryLength) * -1
        }, M.Settings.SLIDE_TRANSITION);
      }
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
      M.Timer.destroy();
    },

    goToPrevImage: function() {
      var model = this.model,
          idx = model.get('index');
      if (idx > 0) {
        model.set('index', idx - 1);
      } else {
        model.set('index', this.totalImages - 1);
      }
      M.Timer.destroy();
    },

    // Slideshow timers
    startSlideshow: function() {
      if (!this.model.get('selectedNav')) {
        M.Timer.create();
      }
    },

    pauseSlideshow: function() {
      M.Timer.destroy({silent: true});
    },

    toggleSlideshowNav: function(model, change) {
      if (model.get('selectedNav')) {
        this.$el.parent().addClass('tabs-active');
      } else {
        this.$el.parent().removeClass('tabs-active');
      }
    }
  });

  M.GalleryControls = Backbone.View.extend({
    thumbsList: null,
    
    genericEvents: {
      'click button.gallery-nav-prev': 'goToPrevImage',
      'click button.gallery-nav-next': 'goToNextImage'
    },

    renderThumbs: function(img) {
      var thumb = new M.ThumbnailView({
        model: img,
        controller: this.controller
      });
      this.thumbsList.append(thumb.render().el);
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

      M.Timer.destroy();
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
      M.Timer.destroy();
    },

    slideThumbs: function(model, changes) {
      var galleryId = model.get('gallery'),
          selectedGalleryId = this.controller.get('gallery'),
          totalImages = this.images.length,
          galleryIdx = this.$el.find('ol li.current').index() + 1,
          pullLeft = (galleryIdx === 1) ? 0 : (galleryIdx - 2) * 80,

          animation1 = {
            transform: 'translateX(-' + pullLeft + 'px)'
          },
          animation2 = {
            transform: 'translateX(-' + ((totalImages - 3) * 80) + 'px)'
          };


      if (galleryId === selectedGalleryId && totalImages > 3) {
        if (galleryIdx > 0 && galleryIdx < totalImages) {
          this.thumbsList.animate({left: pullLeft * -1}, M.Settings.SLIDE_TRANSITION, 'easeInOut');
        } else if (galleryIdx === totalImages) {
          this.thumbsList.animate({left: ((totalImages - 3) * 80) * -1}, M.Settings.SLIDE_TRANSITION, 'easeInOut');
        }
      }
    }
  });

  // Tabs View
  M.TabView = M.GalleryControls.extend({
    template: _.template($('#exp-details-template').html()),
    events: {
      'click a.tab-button': 'toggleTab'
    },
    
    initialize: function() {
      this.events = _.extend(this.genericEvents, this.events);
      this.delegateEvents();

      this.controller = this.options.controller;
      this.controller.bind('change:selectedNav', this.openDetails, this);
      this.controller.bind('change:index', this.slideThumbs, this);
      this.controller.bind('change:gallery', this.setSelected, this);
      this.controller.bind('change:gallery', this.resetScroller, this);
      this.images = M.galleryImages.getGalleryImages(this.model.get('id'));
      this.render();
    },

    render: function() {
      var data = _.extend(
                  {}, 
                  this.model.toJSON(), 
                  {
                    thumbs: this.images,
                    isTab: true
                  }
                ),
          template = this.template(data);

      this.$el
        .removeClass('static-tab')
        .addClass('exp-nav-on')
        .append(template);

      this.thumbsList = this.$el.find('ol');
      _.each(this.images, this.renderThumbs, this);
    },

    openDetails: function(controller) {
      var self = this;

      if (controller.get('selectedNav') === this.model) {
        this.$el.addClass('selected').animate({top: -240}, M.Settings.TAB_SLIDEUP_SPEED, 'easeInOut');

        var expImages = M.galleryImages.getGalleryImages(this.model.get('id')),
            firstImgId = expImages[0].get('id'),
            imageIdx = _.indexOf(M.galleryImages.ids(), firstImgId);

        controller.set('index', imageIdx);

        M.slideshow.pauseSlideshow();
      } else {
        this.$el.animate({
          top: 0
        }, M.Settings.TAB_SLIDEUP_SPEED, 'easeInOut', function() {
          self.$el.find('a.tab-button > span.close-tab').remove();
          $(this).removeClass('selected');
        });
      }
    },

    setSelected: function(model, changes) {
      if (this.collection) {
        var idx = this.collection.indexOf(this.model);
        
        if (model.get('gallery') === idx+1) {
          this.$el.addClass('selected');
        } else {
          this.$el.removeClass('selected');
        }
      }
    },

    resetScroller: function(model, changes) {
      if (model.get('gallery') !== this.model.get('id')) {
        this.thumbsList.animate({left: 0}, 500, 'easeInOut');
      }
    },

    // If the tabs are set as visible, this method gets skipped and the links work
    toggleTab: function(event) {
      if (!this.options.isVisible) {
        event.preventDefault();
        if (!this.options.isVisible) {
          var selectedNav = this.controller.get('selectedNav');

          if (this.model === selectedNav) {
            this.close();
          } else {
            this.open();
          }
        }
      }
    },

    open: function() {
      this.controller.set('selectedNav', this.model);
      this.$el.find('a.tab-button').append('<span class="close-tab">&times;</span>');
    },

    close: function() {
      var self = this;

      this.controller.set('selectedNav', null);
      this.$el.animate({top: 0}, M.Settings.TAB_SLIDEUP_SPEED, 'easeInOut', function() {
        self.$el.find('a.tab-button > span.close-tab').remove();
        $(this).removeClass('selected');
      });
    }
  });

  // Residences page
  M.GalleryCaptionView = Backbone.View.extend({
    className: 'pull-right',
    template: _.template('<li></li>'),
    initialize: function() {
      this.controller = this.options.controller;
      this.controller.bind('change:index', this.toggle, this);
      this.render();
      this.toggle(this.controller);
    },

    toggle: function(model, change) {
      var idx = model.get('index'),
          image = this.collection.at(idx),
          caption = image.get('caption'),
          hasCaption = (caption) ? true : false;

      if (hasCaption) {
        this.$el.find('li').animate({top: -180}, M.Settings.TAB_SLIDEUP_SPEED, 'easeInOut');
        this.$el.find('li').text(caption);
      } else {
        this.$el.find('li').animate({top: 0}, M.Settings.TAB_SLIDEDOWN_SPEED, 'easeInOut');
        this.$el.find('li').text('');
      }
    },

    render: function() {
      var template = this.template();
      this.$el.append(template);
    }
  });
  
  M.GalleryThumbnailNavView = M.GalleryControls.extend({
    template: _.template($('#exp-details-template').html()),
    
    initialize: function() {
      this.events = _.extend(this.genericEvents, this.events);
      this.delegateEvents();

      this.controller = this.options.controller;
      this.controller.bind('change:selectedNav', this.openDetails, this);
      this.controller.bind('change:index', this.slideThumbs, this);
      this.images = M.galleryImages.getGalleryImages(this.model.get('id'));
      this.render();
    },

    render: function() {
      var data = _.extend({}, this.model.toJSON(),{thumbs: this.images, isTab: false}),
          template = this.template(data);

      this.$el.append(template);

      this.thumbsList = this.$el.find('ol');
      _.each(this.images, this.renderThumbs, this);
    }
  });
  
})(jQuery);