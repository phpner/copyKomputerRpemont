$(document).ready(function () {

    swal.setDefaults({confirmButtonColor: '#db073d'});
    callbackPopup();
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'),
            sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    var brand = getUrlParameter('brand');

    if (brand) {
        $('.tiles a').each(function (index, element) {
            $(this).attr('href', $(this).attr('href') + '' + brand);
        });
        $('#sidebar .links a').each(function (index, element) {
            $(this).attr('href', $(this).attr('href') + '' + brand);
        });
    }

    if ($('#features .tabs').length == 1) {
        $('#features .tabs .tab').on('click', function () {
            var scrollAnchor = $(this).attr('data-scroll'),
                scrollPoint = $('#features .feature[data-anchor="' + scrollAnchor + '"]').offset().top - 60;
            $('body, html').animate({
                scrollTop: scrollPoint
            }, 500);

        });
        tabsPosition = $('#features .tabs').offset().top;
    }

    $('#testimonial textarea').autosize();

    if($('.metro-location').length) {
        $('.metro-location select').select2({
            placeholder: "Выбрать метро"
        });
        $('.metro-location button').on('click', function(e) {
            e.preventDefault();

            if($('.metro-location select').val()) {
                location.href = $('.metro-location select').val();
            }
        });
    }


    $('a.testimonial-form').click(function (e) {
        if ($(this).hasClass('active')) {
            $('#testimonial').css('display', 'none');
            $(this).removeClass('active');
            $(this).html('Оставить отзыв');
        } else {
            $('#testimonial').css('display', 'block');
            $(this).addClass('active');
            $(this).html('Скрыть форму');
        }
    });

    //$('input[name="phone"]').mask('8 (999) 999-99-99');
    var items = $('input[name="phone"]');

    Array.prototype.forEach.call(items, function (element) {
        var phoneMask = new IMask(element, {
            mask: '{8} (000) 000-00-00',
            placeholderLazy: {
                show: 'always'
            }
        });
    });


    $('.regionSelect').click(function (e) {
        var $regionsList = $('.regionsList');
        var listHeight = 30;
        $('.regionsList li').each(function () {
            listHeight += $(this).height();
        });
        if (!$(this).hasClass('active')) {
            $regionsList.css('display', 'block');
            $regionsList.animate({height: listHeight, opacity: '1'}, "slow");
            $(this).addClass('active');
        }
        var firstClick = true;
        $(document).bind('click.myEvent', function (e) {
            if (!firstClick && $(e.target).closest('.regionsList').length == 0) {
                $('.regionsList').animate({height: '0px', opacity: '0'}, "slow");
                $('.regionSelect').removeClass('active');
                $(document).unbind('click.myEvent');
            }
            firstClick = false;
        });
        e.preventDefault();
    });

    function send_order($button, $form, $ga) {
        var $data = $form.serialize();

        $button.disabled = true; //отключаем кнопку

        $.ajax({
            type: "POST",
            url: '/order.php',
            data: $data,
            dataType: 'JSON',
            success: function (msg) {
                $(".modal-close").trigger("click")
                if (msg.status) {
                    swal("Заявка отправлена!", msg.message, "success");
                    $form.trigger('reset');
                    $button.removeAttr('disabled');
                } else {
                    swal("Произошла ошибка!", msg.message, "error");
                    $button.removeAttr('disabled');
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                swal("Произошла ошибка!", "Внутренняя ошибка сервера. Пожалуйста, позвоните нам.", "error");
                $button.removeAttr('disabled');
            }
        });
    }

    $('.order-form').on('submit', function (e) {
        e.preventDefault();
        send_order($(this).find('input[name="send"]'), $(this));
    });

    $('#testimonial').on('submit', function (e) {
        e.preventDefault();
        send_order($(this).find('button[tyle="submit"]'), $(this));
    });


    $('.order-form input[name="send"]').on('click', function (e) {
        e.preventDefault();
        send_order($(this), $(this).closest('form'));
    });
    $('.order-form input[name="phone"]').on('keyup', function(e){
        if(e.keyCode == 13){
            e.preventDefault();
            send_order($(this).closest('form').find('input[name="send"]'), $(this).closest('form'));
        }
    });

    $('#all_brands').on('click', function () {
        if ($('.other-brands').is(':visible')) {
            $('.other-brands').hide();
            $(this).find('a').html('Показать все бренды');
        } else {
            $('.other-brands').show();
            $(this).find('a').html('Cкрыть');
        }
    });

    $('.menu').on('click', function () {
        $(this).toggleClass('menu--open');
        $('.mob-nav').toggleClass('mob-nav--open');
        $('.mob-body').toggleClass('mob-body--open');
        $('.drop-menu').slideUp();
        $('body').toggleClass('body--over');
    });

    $('.drop').on('click', function () {
        $('.drop-menu ').slideUp();
        $(this).parent().toggleClass('open').siblings().removeClass('open');
        $('.open > .drop-menu ').slideToggle();
    });

    $('.drop--inner').on('click', function () {
        $(this).next().slideToggle();
    });

    var $links = $('.info-links');
    if ($links.length > 0) {
        $links.each(function () {
            $('li', $(this)).slice(20, $('li', $(this)).size()).hide();
            if ($('li', $(this)).size() > 20) $(this).append('<div class="more"><span>Посмотреть все</span></div>');

            var $this = $(this);
            $this.find('.more').on('click', function () {
                $(this).css({display: 'none'});
                $this.find('li').slice(20, $this.find('li').size()).show();
            });
        });
    }


    formPolicy();

    $('.pricelist tr td').on('click',function () {
        $('.popUp').bPopup();
    });

});

function formPolicy() {
    var $form = $('#callback-form');
    var $input = $form.find('input[name=phone]');
    var $tooltip = $form.find('.form-policy-tooltip');
    $input.on("change paste keyup focus", function () {
        if ($(this).val().length > 1) {
            $tooltip.fadeIn('slow');
        } else {
            $tooltip.fadeOut();
        }
    });
    $form.find('input[type=button]').on('click', function () {
        $tooltip.fadeOut();
    });
}


function callbackPopup() {
    var $btn = $('.callback-btn'),
        $modal = $('.dialog-cb'),
        $close = $modal.find('.modal-close');

    $btn.on("click", function () {
        if ($modal.hasClass('open')) {
            $modal.removeClass('open');
        } else {
            $modal.addClass('open');
        }
        return false;
    });

    $('.dialog-cb-button a').on("click", function (e) {
        if($(window).width() > 768){
            e.preventDefault();
            if ($modal.hasClass('open')) {
                $modal.removeClass('open');
            } else {
                $modal.addClass('open');
            }
            return false;
        }
    });

    $close.on("click", function () {
        $modal.removeClass('open');
    });

    $modal.on('click', function (e) {
        if ($modal.hasClass('open')) {
            if ($(e.target).closest('.dialog-cb__modal').length === 0) {
                $modal.removeClass('open');
            }
        }
    });
}


$(window).scroll(function () {

    if ($('#features .tabs').length == 1 && tabsPosition !== undefined) {
        windowScroll = $(window).scrollTop();
        if (windowScroll >= tabsPosition) {
            $('#features').addClass('fixed');
            $('#features .feature').each(function (index) {
                if ($(this).position().top <= windowScroll + 60) {
                    $('#features .tabs .tab.active').removeClass('active');
                    $('#features .tabs .tab').eq(index).addClass('active');
                }
            });
        }
        else {
            $('#features').removeClass('fixed');
            $('#features .tabs .tab.active').removeClass('active');
            $('#features .tabs .tab:first').addClass('active');
        }
    }

}).scroll();