(function($) {
  window.M = {};

  var IMAGES = _.flatten(_.pluck(EXP, 'images')),
      timer;


  /**
    Models
    ---------------- */
  M.Exp = Backbone.Model.extend({

  });

  M.GalleryImage = Backbone.Model.extend({
    reset: function() {
      this.set('isSelected', false);
    },
    select: function() {
      this.set('isSelected', true);
    }
  });

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
      this.invoke('reset');
      this.models[idx].select();
    }
  });


  M.experiences = new M.Experiences(EXP);
  M.galleryImages = new M.GalleryImages(IMAGES);
  M.galleryController.set('totalImages', M.galleryImages.length);
  timer = setInterval(M.galleryController.nextSlide, 2000);

  M.galleryController.on('change', function(model, change) {
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

      this.$el.empty();
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.collection.each(this.renderImage, this);
      M.galleryImages.selectIndex(0);
    },

    renderImage: function(model) {
      var image = new M.LargeImageView({
        model: model
      });
      this.$el.find('#gallery-images').append(image.render().el);
    },

    updateIndex: function(model, change) {
      var pullLeft = model.get('index') * this.imageWidth * -1;
      this.$el.find('ul').animate({
        left: pullLeft
      })
    },

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

    startSlideshow: function() {
      timer = setInterval(M.galleryController.nextSlide, 2000);
    },

    pauseSlideshow: function() {
      window.clearInterval(timer);
    }
  });

  M.slideshowView = new M.SlideshowView({
    model: M.galleryController,
    collection: M.galleryImages
  });
})(jQuery);