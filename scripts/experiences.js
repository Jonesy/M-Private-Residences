(function($) {
  window.M = {};

  var SETTINGS = {
    IMG_OFF_OPACITY: 0.45
  };

  var IMAGES = _.flatten(_.pluck(EXP, 'images')),
      slideInt = 5000,
      timer;

  M.init = function() {
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
      this.loadImage(this.model.toJSON());
      this.$el.fadeTo(10, SETTINGS.IMG_OFF_OPACITY);
      return this;
    },

    loadImage: function(model) {
      var self = this,
          imgSize = this.imgType;

      $('<img />')
          .hide()
          .attr('src', model[imgSize])
          .load(function() {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {

            } else {
              self.$el.append($(this));
              $(this).fadeIn();
            }
          });
    },

    toggle: function(model, change) {
      if (model.get('isSelected')) {
        this.$el.addClass('current').fadeTo('slow', 1);
      } else {
        this.$el.removeClass('current').fadeTo('slow', SETTINGS.IMG_OFF_OPACITY);
      }
    },
    goToImage: function(event) {
      event.preventDefault();
      var idx = this.model.collection.indexOf(this.model);
      M.galleryController.set('index', idx);
    }
  });

  M.LargeImageView = M.ImageView.extend({
    imgType: 'large'
  });

  M.ThumbnailView = M.ImageView.extend({
    imgType: 'thumb',
    goToImage: function(event) {
      event.preventDefault();
      this.options.controller.set('index', M.galleryImages.indexOf(this.model));
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
          selectedGalleryId = model.get('gallery'),
          animation1 = {
            transform: 'translateY(-160px)'
          },
          animation2 = {
            transform: 'translateY(0px)'
          };
      
      // TODO: Figure out why CSS transforms plugin isn't firing this on first run.
      // if (!Modernizr.csstransitions) {
        animation1 = {top: -160};
        animation2 = {top: 0};
      // }

      if (id === selectedGalleryId) {
        this.$el.animate(animation1, 500);
      } else {
        this.$el.animate(animation2, 400);
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
      this.totalImages = this.collection.length;
      this.model.bind('change:index', this.updateIndex, this);
      this.model.bind('change:selectedNav', this.toggleSlideshowNav, this);
      // Be sure to remove the poster image which is there incase this all blows up.
      this.$el.empty();
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.$el.find('ul').css('left', this.imageWidth * this.totalImages * -1);
      _.each(_.range(3), function() {
        this.collection.each(this.renderImage, this);
      }, this);
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
      var self = this,
          previousIdx = model.previous('index'),
          fullGalleryLength = (this.totalImages * this.imageWidth),
          pullLeft = model.get('index') * this.imageWidth,
          animation = {
            transform: 'translateX(-' + pullLeft + 'px)'
          },
          beginning = {
            transform: 'translateX(-' + fullGalleryLength + 'px)'
          },
          end = {
            transform: 'translateX(' + this.imageWidth + 'px)'
          };


      if (!Modernizr.csstransitions) {
        animation = {left: (pullLeft + fullGalleryLength) * -1}
        beginning = {left: (fullGalleryLength * 2) * -1}
        end = {left: (fullGalleryLength - this.imageWidth) * -1}
      }


      if (change === 0 && previousIdx === this.totalImages - 1) {
        this.$el.find('ul').animate(beginning, 800, function() {
          if (Modernizr.csstransitions) {
            $(this).css('transform', 'translateX(-0px)');
          } else {
            $(this).css('left', fullGalleryLength * -1);
          }
        });
      } else if (change === (this.totalImages - 1) && previousIdx === 0) {
        this.$el.find('ul').animate(end, 800, function() {
          if (Modernizr.csstransitions) {
            $(this).css('transform', 'translateX(-' + (self.totalImages * self.imageWidth - self.imageWidth) + 'px)');
          } else {
            $(this).css('left', ((fullGalleryLength * 2) - self.imageWidth) * -1);
          }

        });
      } else {
        this.$el.find('ul').animate(animation, 800);
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

  M.GalleryControls = Backbone.View.extend({
    thumbsList: null,
    
    genericEvents: {
      'click button.gallery-nav-prev': 'goToPrevImage',
      'click button.gallery-nav-next': 'goToNextImage'
    },

    renderThumbs: function(thumb) {
      var thumb = new M.ThumbnailView({
        model: thumb,
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
                    : (galleryIdx - 2) * 80,

          animation1 = {
            transform: 'translateX(-' + pullLeft + 'px)'
          },
          animation2 = {
            transform: 'translateX(-' + ((totalImages - 3) * 80) + 'px)'
          };

      if (!Modernizr.csstransitions) {
        animation1 = {left: pullLeft * -1};
        animation2 = {left: ((totalImages - 3) * 80) * -1};
      }

      if (galleryId === selectedGalleryId && totalImages > 3) {
        if (galleryIdx > 0 && galleryIdx < totalImages) {
          this.thumbsList.animate(animation1);
        } else if (galleryIdx === totalImages) {
          this.thumbsList.animate(animation2);
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
      var self = this,
          animation1 = {
            transform: 'translateY(-240px)'
          },
          animation2 = {
            transform: 'translateY(-0px)'
          };

      if (!Modernizr.csstransitions) {
        animation1 = {top: -240};
        animation2 = {top: 0};
      }

      if (controller.get('selectedNav') === this.model) {
        this.$el.addClass('selected').animate(animation1, 500);

        var expImages = M.galleryImages.getGalleryImages(this.model.get('id')),
            firstImgId = expImages[0].get('id'),
            imageIdx = _.indexOf(M.galleryImages.ids(), firstImgId);

        controller.set('index', imageIdx);

        M.slideshow.pauseSlideshow();
      } else {
        this.$el.animate(animation2, 500, function() {
          self.$el.find('a.tab-button > span.close-tab').remove();
          $(this).removeClass('selected');
        });
      }
    },

    setSelected: function(model, change) {
      if (this.collection) {
        var idx = this.collection.indexOf(this.model);
        
        if (model.get('gallery') === idx+1) {
          this.$el.addClass('selected');
        } else {
          this.$el.removeClass('selected');
        }
      }
    },

    toggleTab: function(event) {
      event.preventDefault();
      if (!this.options.isVisible) {
        var selectedNav = this.controller.get('selectedNav');

        if (this.model === selectedNav) {
          this.close();
        } else {
          this.open();
        }
      }
    },

    open: function() {
      this.controller.set('selectedNav', this.model);
      this.$el.find('a.tab-button').append('<span class="close-tab">&times;</span>');
    },

    close: function() {
      var self = this,
          animation = {
            transform: 'translateY(0px)'
          };

      if (!Modernizr.csstransitions) {
        animation = {top: 0};
      }

      this.controller.set('selectedNav', null);
      this.$el.animate(animation, 500, function() {
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
          hasCaption = (caption) ? true : false,
          animation1 = {
            transform: 'translateY(-180px)'
          },
          animation2 = {
            transform: 'translateY(0px)'
          };
      
      // if (!Modernizr.csstransitions) {
        animation1 = {top: -180};
        animation2 = {top: 0};
      // }

      if (hasCaption) {
        this.$el.find('li').animate(animation1, 500);
        this.$el.find('li').text(caption);
      } else {
        this.$el.find('li').animate(animation2, 400);
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