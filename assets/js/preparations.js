(function($) {
    var version = '1.5.2',
    optionOverrides = {},
    defaults = {
        exclude: [],
        excludeWithin:[],
        offset: 0,

            // one of 'top' or 'left'
        direction: 'top',

            // jQuery set of elements you wish to scroll (for $.smoothScroll).
            //  if null (default), $('html, body').firstScrollable() is used.
        scrollElement: null,

            // only use if you want to override default behavior
        scrollTarget: null,

            // fn(opts) function to be called before scrolling occurs.
            // `this` is the element(s) being scrolled
        beforeScroll: function() {},

            // fn(opts) function to be called after scrolling occurs.
            // `this` is the triggering element
        afterScroll: function() {},
        easing: 'swing',
        speed: 400,

            // coefficient for "auto" speed
        autoCoefficient: 2,

            // $.fn.smoothScroll only: whether to prevent the default click action
        preventDefault: true
    },

        getScrollable = function(opts) {
            var scrollable = [],
            scrolled = false,
            dir = opts.dir && opts.dir === 'left' ? 'scrollLeft' : 'scrollTop';

            this.each(function() {

                if (this === document || this === window) { return; }
                var el = $(this);
                if ( el[dir]() > 0 ) {
                    scrollable.push(this);
                } else {
                    // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
                    el[dir](1);
                    scrolled = el[dir]() > 0;
                    if ( scrolled ) {
                        scrollable.push(this);
                    }
                    // then put it back, of course
                    el[dir](0);
                }
            });

            // If no scrollable elements, fall back to <body>,
            // if it's in the jQuery collection
            // (doing this because Safari sets scrollTop async,
            // so can't set it to 1 and immediately get the value.)
            if (!scrollable.length) {
                this.each(function() {
                    if (this.nodeName === 'BODY') {
                        scrollable = [this];
                    }
                });
            }

            // Use the first scrollable element if we're calling firstScrollable()
            if ( opts.el === 'first' && scrollable.length > 1 ) {
                scrollable = [ scrollable[0] ];
            }

            return scrollable;
        };

    $.fn.extend({
        scrollable: function(dir) {
            var scrl = getScrollable.call(this, {dir: dir});
            return this.pushStack(scrl);
        },
        firstScrollable: function(dir) {
            var scrl = getScrollable.call(this, {el: 'first', dir: dir});
            return this.pushStack(scrl);
        },

        smoothScroll: function(options, extra) {
            options = options || {};

            if ( options === 'options' ) {
                if ( !extra ) {
                    return this.first().data('ssOpts');
                }
                return this.each(function() {
                    var $this = $(this),
                    opts = $.extend($this.data('ssOpts') || {}, extra);

                    $(this).data('ssOpts', opts);
                });
            }

            var opts = $.extend({}, $.fn.smoothScroll.defaults, options),
            locationPath = $.smoothScroll.filterPath(location.pathname);

            this
                .unbind('click.smoothscroll')
                .bind('click.smoothscroll', function(event) {
                    var link = this,
                    $link = $(this),
                    thisOpts = $.extend({}, opts, $link.data('ssOpts') || {}),
                        exclude = opts.exclude,
                        excludeWithin = thisOpts.excludeWithin,
                            elCounter = 0, ewlCounter = 0,
                            include = true,
                                clickOpts = {},
                                hostMatch = ((location.hostname === link.hostname) || !link.hostname),
                                    pathMatch = thisOpts.scrollTarget || ( $.smoothScroll.filterPath(link.pathname) === locationPath ),
                                    thisHash = escapeSelector(link.hash);

                    if ( !thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash) ) {
                        include = false;
                    } else {
                        while (include && elCounter < exclude.length) {
                            if ($link.is(escapeSelector(exclude[elCounter++]))) {
                                include = false;
                            }
                        }
                        while ( include && ewlCounter < excludeWithin.length ) {
                            if ($link.closest(excludeWithin[ewlCounter++]).length) {
                                include = false;
                            }
                        }
                    }

                    if ( include ) {

                        if ( thisOpts.preventDefault ) {
                            event.preventDefault();
                        }

                        $.extend( clickOpts, thisOpts, {
                            scrollTarget: thisOpts.scrollTarget || thisHash,
                            link: link
                        });

                        $.smoothScroll( clickOpts );
                    }
                });

            return this;
        }
    });

    $.smoothScroll = function(options, px) {
        if ( options === 'options' && typeof px === 'object' ) {
            return $.extend(optionOverrides, px);
        }
        var opts, $scroller, scrollTargetOffset, speed, delta,
        scrollerOffset = 0,
            offPos = 'offset',
            scrollDir = 'scrollTop',
                aniProps = {},
                aniOpts = {};

        if (typeof options === 'number') {
            opts = $.extend({link: null}, $.fn.smoothScroll.defaults, optionOverrides);
            scrollTargetOffset = options;
        } else {
            opts = $.extend({link: null}, $.fn.smoothScroll.defaults, options || {}, optionOverrides);
            if (opts.scrollElement) {
                offPos = 'position';
                if (opts.scrollElement.css('position') === 'static') {
                    opts.scrollElement.css('position', 'relative');
                }
            }
        }

        scrollDir = opts.direction === 'left' ? 'scrollLeft' : scrollDir;

        if ( opts.scrollElement ) {
            $scroller = opts.scrollElement;
            if ( !(/^(?:HTML|BODY)$/).test($scroller[0].nodeName) ) {
                scrollerOffset = $scroller[scrollDir]();
            }
        } else {
            $scroller = $('html, body').firstScrollable(opts.direction);
        }

        // beforeScroll callback function must fire before calculating offset
        opts.beforeScroll.call($scroller, opts);

        scrollTargetOffset = (typeof options === 'number') ? options :
            px ||
            ( $(opts.scrollTarget)[offPos]() &&
              $(opts.scrollTarget)[offPos]()[opts.direction] ) ||
            0;

        aniProps[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;
        speed = opts.speed;

        // automatically calculate the speed of the scroll based on distance / coefficient
        if (speed === 'auto') {

            // $scroller.scrollTop() is position before scroll, aniProps[scrollDir] is position after
            // When delta is greater, speed will be greater.
            delta = aniProps[scrollDir] - $scroller.scrollTop();
            if(delta < 0) {
                delta *= -1;
            }

            // Divide the delta by the coefficient
            speed = delta / opts.autoCoefficient;
        }

        aniOpts = {
            duration: speed,
            easing: opts.easing,
            complete: function() {
                opts.afterScroll.call(opts.link, opts);
            }
        };

        if (opts.step) {
            aniOpts.step = opts.step;
        }

        if ($scroller.length) {
            $scroller.stop().animate(aniProps, aniOpts);
        } else {
            opts.afterScroll.call(opts.link, opts);
        }
    };

    $.smoothScroll.version = version;
    $.smoothScroll.filterPath = function(string) {
        string = string || '';
        return string
            .replace(/^\//,'')
            .replace(/(?:index|default).[a-zA-Z]{3,4}$/,'')
            .replace(/\/$/,'');
    };

    // default options
    $.fn.smoothScroll.defaults = defaults;

    function escapeSelector (str) {
        return str.replace(/(:|\.)/g,'\\$1');
    }

})(jQuery);

$(document).ready(function(){

    $(".menu-button, .close-button").click(function(){
        $("#sidebar").toggleClass("open");
        return false;
    });

    $("a").smoothScroll({offset: -30, excludeWithin: [".wayfinding-block", "#sidebar"]});

    /* Comment JavaScript, courtesy of MMistakes */

    var $comments = $('.js-comments');

    $('#comment-form').submit(function () {
        var form = this;

        $(form).addClass('disabled');
        $('#comment-form-submit').html(/*'<svg class="icon spin"><use xlink:href="#icon-loading"></use></svg> */'Loading...');

        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                $('#comment-form-submit').html('Submitted!').addClass('btn--disabled');
                $('#comment-form .js-notice').removeClass('notice--danger').addClass('notice--success');
                $('#comment-form input, #comment-form button, #comment-form textarea').attr('disabled', 'disabled');
                showAlert('success');
            },
            error: function (err) {
                console.log(err);
                $('#comment-form-submit').html('Submit Comment');
                $('#comment-form .js-notice').removeClass('notice--success').addClass('notice--danger');
                showAlert("failure");
                $(form).removeClass('disabled');
            }
        });

        return false;
    });

    function showAlert(result) {
        $('#comment-form .js-notice').removeClass('hidden');
        $('#comment-form #js-notice-' + result).removeClass('hidden');
    }
});

// Staticman comment replies
// modified from Wordpress https://core.svn.wordpress.org/trunk/wp-includes/js/comment-reply.js
var addComment = {
    moveForm: function( commId, parentId, respondId, postId ) {
        var div, element, style, cssHidden,
        t           = this,
        comm        = t.I( commId ),
        respond     = t.I( respondId ),
        cancel      = t.I( 'cancel-comment-reply-link' ),
        parent      = t.I( 'comment-replying-to' ),
        post        = t.I( 'comment-post-slug' ),
        commentForm = respond.getElementsByTagName( 'form' )[0];

        if ( ! comm || ! respond || ! cancel || ! parent || ! commentForm ) {
            return;
        }

        t.respondId = respondId;
        postId = postId || false;

        if ( ! t.I( 'sm-temp-form-div' ) ) {
            div = document.createElement( 'div' );
            div.id = 'sm-temp-form-div';
            div.style.display = 'none';
            respond.parentNode.insertBefore( div, respond );
        }

        comm.parentNode.insertBefore( respond, comm.nextSibling );
        if ( post && postId ) {
            post.value = postId;
        }
        parent.value = parentId;
        cancel.style.display = '';

        cancel.onclick = function() {
            var t       = addComment,
            temp    = t.I( 'sm-temp-form-div' ),
            respond = t.I( t.respondId );

            if ( ! temp || ! respond ) {
                return;
            }

            t.I( 'comment-replying-to' ).value = t.I( 'comment-replying-to' ).getAttribute( 'data-original-value' );
            temp.parentNode.insertBefore( respond, temp );
            temp.parentNode.removeChild( temp );
            this.style.display = 'none';
            this.onclick = null;
            return false;
        };

        /*
         * Set initial focus to the first form focusable element.
         * Try/catch used just to avoid errors in IE 7- which return visibility
         * 'inherit' when the visibility value is inherited from an ancestor.
         */
        try {
            for ( var i = 0; i < commentForm.elements.length; i++ ) {
                element = commentForm.elements[i];
                cssHidden = false;

                // Modern browsers.
                if ( 'getComputedStyle' in window ) {
                    style = window.getComputedStyle( element );
                    // IE 8.
                } else if ( document.documentElement.currentStyle ) {
                    style = element.currentStyle;
                }

                /*
                 * For display none, do the same thing jQuery does. For visibility,
                 * check the element computed style since browsers are already doing
                 * the job for us. In fact, the visibility computed style is the actual
                 * computed value and already takes into account the element ancestors.
                 */
                if ( ( element.offsetWidth <= 0 && element.offsetHeight <= 0 ) || style.visibility === 'hidden' ) {
                    cssHidden = true;
                }

                // Skip form elements that are hidden or disabled.
                if ( 'hidden' === element.type || element.disabled || cssHidden ) {
                    continue;
                }

                element.focus();
                // Stop after the first focusable element.
                break;
            }

        } catch( er ) {}

        return false;
    },

    I: function( id ) {
        return document.getElementById( id );
    }
};
