window.site = {};
(function($, site) {

  "use strict";

  $(function() {
    site.viewportWidth = (function(){
      if(window.Modernizr.touch){
        return function() {
          return $(window).width();
        };
      }else{
        if(navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i)) {
          return function(){
            return document.documentElement.clientWidth;
          };
        }else {
          return function(){
            return window.innerWidth || document.documentElement.clientWidth;
          };
        }
      }
    })();

    site.isDesktop = (function(){
      return function() {
        if (site.viewportWidth() < 992) {
          return false;
        }
        return true;
      }
    })();

    site.isMobile = (function(){
      return function() {
        if (site.viewportWidth() < 768) {
          return true;
        }
        return false;
      }
    })();

    var scroll = $(document).scrollTop(),
        elHeader = $('.navbar'),
        headerHeight = elHeader.outerHeight();

    $(window).scroll(function() {
      var scrolled = $(document).scrollTop();

      if (scrolled > headerHeight){
        elHeader.addClass('off-canvas');
      } else {
        elHeader.removeClass('off-canvas');
      }

      if (scrolled > scroll){
        elHeader.removeClass('fixed');
      } else {
        elHeader.addClass('fixed');
      }

      scroll = $(document).scrollTop();
    });

  });
}(window.jQuery, window.site));

/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'countdown',
      site = window.site;

  function Countdown(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Countdown.prototype = {
    init: function() {
      var that = this;

      that.resetCountdown();
      that.settingCountDown();
    },
    settingCountDown: function() {
      var that = this,
          options = that.options,
          initialOffset,
          i = 0,
          circle = $('.circle_animation');
      // initialize
      if (typeof options.second !== 'undefined') {
        options.items.second = options.second;
      }

      if(site.isDesktop()) {
        initialOffset = '295';
      } else {
        initialOffset = '233';
      }

      var numberSecond = that.options.second,
          areaQuestion = $('.area-question'),
          areaFail = $('.area-fail'),
          areaSuccess = $('.area-success');

      var interval = setInterval(function() {
        $('h2').text(numberSecond);
        if (i === options.items.second && areaSuccess.hasClass('hidden')) {
          areaQuestion.addClass('hidden');
          areaFail.removeClass('hidden');
          that.element.addClass('hidden');
          clearInterval(interval);
          return;
        }
        circle.css('stroke-dashoffset', initialOffset-((i+1)*(initialOffset/options.items.second)));
        i++;
        numberSecond--;
      }, 1000);

      that.intervalGlobal = interval;
    },
    resetCountdown: function() {
      var that = this,
          options = that.options,
          elText = $('.countdown h2'),
          circle = $('.circle_animation');

      circle.css('stroke-dashoffset','');
      elText.text(options.second);
    },
    destroy: function() {
      // remove events
      // deinitialize
      clearInterval(this.intervalGlobal);
      this.element.off('init.' + pluginName);
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Countdown(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    items: {
      second: 10
    }
  };

  $(function() {
    // $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'popup-custom';
      // site = window.site;

  window.posTop = 0;

  function PopupCustom(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  PopupCustom.prototype = {
    init: function() {
      var that = this,
          options = that.options,
          el = that.element,
          htmlBody = $('html, body'),
          win = $(window);
      // initialize
      if (typeof options.target !== 'undefined') {
        options.target = that.options.target;
      }

      that.target = $(options.target),
      that.overlay = $(options.layer),
      that.btnClose = that.target.find(options.btnClose),
      that.video = that.target.find('.videoplayer'),
      that.videoSrc = that.video.attr('src'),
      that.btnQuiz = $('[data-btn-quiz]'),
      that.bodyEle = $('body'),
      that.htmlEle = $('html');


      // add events
      el.on('click.' + pluginName, function() {
        window.posTop = win.scrollTop();
        that.initPopup();
        // that.updateHeight();
      });

      that.btnClose.off('click.' + pluginName).on('click.' + pluginName, function() {
        window.posTop;
        that.resetPopup();
        htmlBody.scrollTop(window.posTop);
      });

      that.btnQuiz.on('click.' + pluginName, function() {
        that.resetPopup();
      });

      that.overlay.on('click.' + pluginName, function() {
        window.posTop;
        that.resetPopup();
        htmlBody.scrollTop(window.posTop);
      });

      that.bodyEle.on('keydown',function(e){
        if(e.keyCode===27){
          window.posTop;
          that.resetPopup();
          htmlBody.scrollTop(window.posTop);
        }
      });

      // win.on('resize', function() {
      //   that.updateHeight();
      // });
    },
    initPopup: function() {
      var that = this;
      that.target.removeClass('hidden');
      that.overlay.removeClass('hidden');
      that.bodyEle.addClass('opening');
      that.htmlEle.addClass('opening');
    },
    resetPopup: function() {
      var that = this;
      that.target.addClass('hidden');
      that.overlay.addClass('hidden');
      that.bodyEle.removeClass('opening');
      that.htmlEle.removeClass('opening');
      that.video.attr('src','');
      that.video.attr('src', that.videoSrc);
    },
    // updateHeight: function() {
    //   var that = this,
    //       winHeight = $(window).height(),
    //       footerAreaHeight = that.target.find('[data-height-footer]').height(),
    //       contentHeight = that.target.find('[data-height-content]'),
    //       hContent;

    //   if(site.isMobile()) {
    //     hContent = winHeight - footerAreaHeight - 100;
    //   } else {
    //     hContent = winHeight - footerAreaHeight - 210;
    //   }

    //   contentHeight.height(hContent);
    // },
    destroy: function() {
      // remove events
      // deinitialize
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new PopupCustom(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    target: '#popup-video',
    layer: '.overlay',
    btnClose: '[data-close-btn]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'popup-ui';
      // win = $(window),
      // site = window.site;

  function PopupUI(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  PopupUI.prototype = {
    init: function() {
      var that = this,
          options = that.options,
          el = that.element,
          bodyEle = $('body'),
          htmlEl = $('html'),
          btnClose = $('[data-btn-close]'),
          areaQuestion = $('.area-question'),
          areaSuccess = $('.area-success'),
          areaFail = $('.area-fail'),
          itemQuestion = $('[data-question]').find('.list-item'),
          itemQuestionFirst = $('[data-question]').find('.list-item:first'),
          step = $('.step span'),
          stepFirst = $('.step span:first'),
          btnNext = $('[data-btn-next]');

      // initialize
      if (typeof options.src !== 'undefined') {
        options.items.src = options.src;
      }
      if (typeof options.type !== 'undefined') {
        options.items.type = options.type;
      }

      var countdown = $('[data-countdown]');

      options.callbacks = {
        open: function() {
          if ($.data(countdown[0], 'countdown')) {
            countdown['countdown']('destroy');
            countdown['countdown']('init');
          } else {
            countdown['countdown']();
          }
          bodyEle.addClass('opening');
          htmlEl.addClass('opening');
          // that.updateHeight();
        },
        close: function() {
          countdown.removeClass('hidden');
          areaQuestion.removeClass('hidden');
          areaSuccess.addClass('hidden');
          areaFail.addClass('hidden');
          btnNext.removeClass('active');
          itemQuestion.removeClass('current');
          itemQuestion.find('.active').removeClass('active');
          itemQuestionFirst.addClass('current');
          step.removeClass('active');
          stepFirst.addClass('active');
          bodyEle.removeClass('opening');
          htmlEl.removeClass('opening');
          $('html, body').scrollTop(window.posTop);
        }
      };

      btnClose.on('click.' + pluginName, function() {
        $.magnificPopup.close();
      });

      el.magnificPopup(options);

      // win.on('resize', function() {
      //   that.updateHeight();
      // });
    },
    // updateHeight: function() {
    //   var that = this,
    //       winHeight = win.height(),
    //       elPopup = $(that.options.src),
    //       elQuiz = elPopup.find('[data-height-quiz]'),
    //       hQuiz;

    //   if(site.isMobile()) {
    //     hQuiz = winHeight - 60;
    //   } else {
    //     hQuiz = winHeight - 180;
    //   }

    //   elQuiz.height(hQuiz);
    // },
    destroy: function() {
      // remove events
      // deinitialize
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new PopupUI(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    items: {
      src: '#popup-video',
      type: 'inline'
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'slide',
      win = $(window),
      site = window.site;

  function Slide(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Slide.prototype = {
    init: function() {
      var that = this,
          el = that.element,
          option = that.options;

      var resizeTimer;
      win.on('resize.' + pluginName, function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
          that.navWidth = 0;

          if(option.slideNav) {
            if(site.isMobile()) {
              that.navContainer = el.width();
              el.find('.nav-item').each(function(){
                that.navWidth += $(this).outerWidth(true);
              });
              if(that.navWidth > that.navContainer) {
                el.slick({
                  variableWidth: true,
                  infinite: false,
                  prevArrow: '<button type="button" class="slick-prev fa fa-chevron-left">Previous</button>',
                  nextArrow: '<button type="button" class="slick-next fa fa-chevron-right">Next</button>',
                });
              } else {
                el.slick('unslick');
              }
            } else {
              if (el.hasClass('slick-initialized')) {
                el.slick('unslick');
              }
            }
          }
        },400);
      }).trigger('resize');
      // initialize
      // add events
    },
    destroy: function() {
      // remove events
      // deinitialize
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Slide(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    key: 'value',
    onCallback: null
  };

  $(function() {
    $('[data-' + pluginName + ']').on('customEvent', function() {
      // to do
    });

    $('[data-' + pluginName + ']')[pluginName]({
      key: 'custom'
    });
  });

}(jQuery, window));

/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'take-the-quiz';

  function TakeTheQuiz(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  TakeTheQuiz.prototype = {
    init: function() {
      // initialize
      var that = this,
          el = that.element,
          question = el.find('[data-question]'),
          itemQuestion = question.find('li'),
          elBtnNext = $('[data-btn-next]').find('.btn-green'),
          elCountDown = $('[data-countdown]');
      // add events
      itemQuestion.on('click.' + pluginName, function() {
        var btnNext = $(this).parents('.list-item').find('[data-btn-next]');

        itemQuestion.removeClass('active');
        $(this).addClass('active');
        btnNext.addClass('active');
      });

      var areaQuestion = $('.area-question'),
          areaSuccess = $('.area-success');

      elBtnNext.on('click.' + pluginName, function() {
        var elCurrent = $(this).closest('.current'),
            stepCurrent = $('.step .active');

        elCurrent.removeClass('current');
        stepCurrent.removeClass('active');
        elCurrent.next().addClass('current');
        stepCurrent.next().addClass('active');

        if(elCurrent.hasClass('last-item')) {
          areaQuestion.addClass('hidden');
          areaSuccess.removeClass('hidden');
          elCountDown.addClass('hidden');
        }
      });
    },
    destroy: function() {
      // remove events
      // deinitialize
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new TakeTheQuiz(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
