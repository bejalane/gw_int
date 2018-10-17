jQuery(document).ready(function($){

    //ACCESSIBILITY
    function updateStatement(){
        localStorage.setItem('slAcc', JSON.stringify(accessibilityMain));
    }

    function getStatement() {
        return JSON.parse(localStorage.getItem('slAcc'));
    }

    var accessibilityMainMaster = {
        'fontSize': 0,
        'readable': false,
        'headersHighlights': false,
        'linksHighlights': false,
        'imageDescription': false,
        'monochrome': false,
        'contrast': false,
        'cursorBig': false,
        'zoomPage': false,
        'bgColor': 'initial'
    };

    var accessibilityMain;
    if (getStatement()){
        accessibilityMain = getStatement();
    } else{
        accessibilityMain = Object.assign({}, accessibilityMainMaster);
    }

    function init(){
        //font-size        
        $('div, span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function (i, v) {
            $(this).attr('data-accfont', parseInt($(this).css('font-size')));
            if (accessibilityMain.fontSize !== 0){
                $(this).css('font-size', parseInt($(this).css('font-size')) + accessibilityMain.fontSize + 'px');
            }
        })

        //readable
        if(accessibilityMain.readable){
            $('body').addClass('sl-acc-standard-font');
            $('.sl-acc-readable-font').addClass('sl-acc-btn-active');
            $('div, span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function(i, obj) {
                $(this).addClass('sl-acc-standard-font');
            });
        }

        //bg-color
        if(accessibilityMain.bgColor !== 'initial'){
            $('body').css('background-color', accessibilityMain.bgColor);
        }

        //headersHighlights
        if(accessibilityMain.headersHighlights){
            $('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').wrapInner( "<span class='sl-acc-header-underline-wrapper'></span>" ).addClass('sl-acc-header-underline');
            $('.sl-acc-highlight-header').addClass('sl-acc-btn-active');

        }

        //linksHighlights
        if(accessibilityMain.linksHighlights){
            $('a').not('.sl-acc-main-wrapper *').addClass('sl-acc-link-bottom-line');
            $('.sl-acc-highlight-links').addClass('sl-acc-btn-active');
        }

        //monochrome
        if(accessibilityMain.monochrome){
            $('body').addClass('sl-acc-grayscale');
            $('.sl-acc-monochrome').addClass('sl-acc-btn-active');
        }

        //contrast
        if(accessibilityMain.contrast){
            $('head').append($("<link href='assets/css/sl-accessibility-contrast.css' id='highContrastStylesheet' rel='stylesheet' type='text/css' />"));
            $('body').addClass('contrast');
            $('.sl-acc-contrast').attr('id', 'is_high_contrast').attr('aria-pressed', true).addClass('active');
           // createCookie('a11y-high-contrast', '1');
        }

        //zoom
        if(accessibilityMain.zoomPage){
            $('body').addClass('sl-acc-body-zoom');
            $('.sl-acc-zoom-plus').addClass('sl-acc-btn-active');
        }

        //cursorBig
        if(accessibilityMain.cursorBig){
            $('body').addClass('sl-acc-cursor-big-icon');
            $('a').addClass('sl-acc-pointer-big');
            $('input[type="submit"]').addClass('sl-acc-pointer-big');
            $('.sl-acc-big-cursor').addClass('sl-acc-btn-active');
        }


        //image description
        if(accessibilityMain.imageDescription){
            $('img').addClass('add-title');
            $('.sl-acc-img-title').addClass('sl-acc-img-title-active');
            $('.sl-acc-img-description').addClass('sl-acc-btn-active');
        }
    }

    //show accessible menu
    $('.sl-acc-open-icon a').click(function(e){
        e.preventDefault();
        $(".sl-acc-main-wrapper").css("visibility", "visible");
        $('.sl-acc-main-wrapper').addClass('sl-acc-open');
        $('.sl-acc-open-icon').hide(300);
       $('.sl-acc-main-wrapper').animate({
           left: 0
       }, 300, function() {
           // Animation complete.
       });
    });

    // close acc menu
    $('.sl-acc-close-icon').click(function(e) {
        // ESCAPE key pressed
            $('.sl-acc-open-icon').show(300);
            $('.sl-acc-main-wrapper').animate({
                left: '-260px'
            }, 300, function() {
                // Animation complete.
            });
    });

    $(document).keydown(function(e) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            $('.sl-acc-open-icon').show(300);
            $('.sl-acc-main-wrapper').animate({
                left: '-260px'
            }, 300, function() {
                // Animation complete.
            });
        }
    });

    //menu top block
    $( ".sl-acc-open-enter-block a, .sl-acc-open-key-nav-block a" ).focus(function() {
        $(this).parent().animate({
            top: '0'
        }, 300, function() {
            // Animation complete.
        });
    });
    $( ".sl-acc-open-enter-block a, .sl-acc-open-key-nav-block a" ).focusout(function() {
        $(this).parent().animate({
            top: '-100px'
        }, 100, function() {
            // Animation complete.
        });
    });
    $( ".sl-acc-open-enter-block a, .sl-acc-open-key-nav-block a" ).click(function(e) {
        e.preventDefault();

        $('#focus').focus();

        $('.sl-acc-main-wrapper').css("visibility", "visible");
        $('.sl-acc-open-icon').hide(300);
        $('.sl-acc-main-wrapper').animate({
            left: 0
        }, 300, function() {
            // Animation complete.
        });
        $(this).parent().animate({
            top: '-100px'
        }, 100, function() {
            // Animation complete.
        });
    });









    //FONT SIZE
    $('.sl-acc-font-plus').on('click', function(e) {
        e.preventDefault();
        accessibilityMain.fontSize = accessibilityMain.fontSize + 1;
        $('div , span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function (i, v) {
            $(this).css('font-size', parseInt($(this).css('font-size')) + 1 + 'px');
        });
        updateStatement();
    });

    $('.sl-acc-font-minus').on('click', function(e) {
        e.preventDefault();
        accessibilityMain.fontSize = accessibilityMain.fontSize - 1;
        $('div , span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function (i, v) {
            $(this).css('font-size', parseInt($(this).css('font-size')) - 1 + 'px');
        })
        updateStatement();
    });

    $('.sl-acc-font-reset').on('click', function(e) {
        e.preventDefault();
        resetFontSize();
        updateStatement();
    });

    function resetFontSize(){
        accessibilityMain.fontSize = 0;
        $('div, span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function (i, v) {
            var defaultFontSize =  $(this).attr('data-accfont');
            $(this).css('font-size', defaultFontSize + 'px');
        });
    }

    //Readable
    $('.sl-acc-readable-font').click(function(e){
        e.preventDefault();
        if($('body').hasClass('sl-acc-standard-font')){
          $('body').removeClass('sl-acc-standard-font');
          $(this).removeClass('sl-acc-btn-active');
          $('div, span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function(i, obj) {
            $(this).removeClass('sl-acc-standard-font');
            accessibilityMain.readable = false;
          });
        } else {
          $('body').addClass('sl-acc-standard-font');
          $(this).addClass('sl-acc-btn-active');
          $('div, span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function(i, obj) {
            $(this).addClass('sl-acc-standard-font');
            accessibilityMain.readable = true;
          });
        }
        updateStatement();
    });

    //BG COLOR
    $('.sl-acc-bg-color').click(function(e){
        e.preventDefault();
        accessibilityMain.bgColor = $(this).attr('data-color');
        console.log(accessibilityMain.bgColor);
        $('body').css('background-color', accessibilityMain.bgColor);
        updateStatement();
    });

    //HIGHLIGHT HEADERS
    $('.sl-acc-highlight-header').on('click', function(e) {
        e.preventDefault();
        if($('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').hasClass('sl-acc-header-underline')){
            $(this).removeClass('sl-acc-btn-active');
            $('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').each(function(i, obj) {
                var content = $(this).children('.sl-acc-header-underline-wrapper').text();
                $(this).html(content);
            });
            $('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').removeClass('sl-acc-header-underline');
            accessibilityMain.headersHighlights = false;
            console.log(accessibilityMain.headersHighlights);
        } else{
            $('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').wrapInner( "<span class='sl-acc-header-underline-wrapper'></span>" ).addClass('sl-acc-header-underline');
            $(this).addClass('sl-acc-btn-active');
            accessibilityMain.headersHighlights = true;
            console.log(accessibilityMain.headersHighlights);
        }
        updateStatement();
    });

    //HIGHLIGHT LINKS
    $('.sl-acc-highlight-links').on('click', function(e) {
        e.preventDefault();
        if($('a').hasClass('sl-acc-link-bottom-line')){
            $('a').removeClass('sl-acc-link-bottom-line');
            $(this).removeClass('sl-acc-btn-active');
            accessibilityMain.linksHighlights = false;
        }
        else {
            $('a').not('.sl-acc-main-wrapper *').addClass('sl-acc-link-bottom-line');
            $(this).addClass('sl-acc-btn-active');
            accessibilityMain.linksHighlights = true;
        }
        updateStatement();
    });

    //MONOCHROME GRAYSCALE
    $('.sl-acc-monochrome').click(function(e){
        e.preventDefault();
        if($('body').hasClass('sl-acc-grayscale')){
            $('body').removeClass('sl-acc-grayscale');
            accessibilityMain.monochrome = false;
            $(this).removeClass('sl-acc-btn-active');
        } else {
            $('body').addClass('sl-acc-grayscale');
            accessibilityMain.monochrome = true;
            $(this).addClass('sl-acc-btn-active');
        }
        updateStatement();
    });

    //CONTRAST ADJUST
    $('.sl-acc-contrast').on('click', function(e) {
        e.preventDefault();
        if ($(this).attr('id') == "is_normal_contrast") {
            $(this).addClass('sl-acc-btn-active');
            $('head').append($("<link href='assets/css/sl-accessibility-contrast.css' id='highContrastStylesheet' rel='stylesheet' type='text/css' />"));
            $('body').addClass('contrast');
            $(this).attr('id', 'is_high_contrast').attr('aria-pressed', true).addClass('active');
            //createCookie('a11y-high-contrast', '1');
            accessibilityMain.contrast = true;
            console.log(accessibilityMain.contrast);
        } else {
            $(this).removeClass('sl-acc-btn-active');
            $('#highContrastStylesheet').remove();
            $('body').removeClass('contrast');
            $(this).attr('id', 'is_normal_contrast').attr('aria-pressed', false).removeClass('active');
           // eraseCookie('a11y-high-contrast');
            accessibilityMain.contrast = false;
        }
        updateStatement();
    });

    //ZOOM
    $('.sl-acc-zoom-plus').on('click', function(e) {
        e.preventDefault();
            $('body').addClass('sl-acc-body-zoom');
            $(this).addClass('sl-acc-btn-active');
            accessibilityMain.zoomPage = true;
        updateStatement();
    });

    $('.sl-acc-zoom-minus').on('click', function(e) {
        e.preventDefault();
        $('body').removeClass('sl-acc-body-zoom');
        $('.sl-acc-zoom-plus').removeClass('sl-acc-btn-active');
        //accessibilityMain.zoomPage = false;
        updateStatement();
    });

    //BIG CURSOR
    $('.sl-acc-big-cursor').on('click', function(e) {
        e.preventDefault();
        if($('body').hasClass('sl-acc-cursor-big-icon')){
            $('body').removeClass('sl-acc-cursor-big-icon');
            $('a').removeClass('sl-acc-pointer-big');
            $('input[type="submit"]').removeClass('sl-acc-pointer-big');
            $(this).removeClass('sl-acc-btn-active');
            accessibilityMain.cursorBig = false;
        }
        else {
            $('body').addClass('sl-acc-cursor-big-icon');
            $('a').addClass('sl-acc-pointer-big');
            $('input[type="submit"]').addClass('sl-acc-pointer-big');
            $(this).addClass('sl-acc-btn-active');
            accessibilityMain.cursorBig = true;
        }
        updateStatement();
    });

    //IMG DESCRIPTION
    $('.sl-acc-img-description').on('click', function(e) {
        e.preventDefault();
        if($('img').hasClass('add-title')){
            $(this).removeClass('sl-acc-btn-active');
            $('img').removeClass('add-title');
            $('.sl-acc-img-title').removeClass('sl-acc-img-title-active');
            accessibilityMain.imageDescription = false;
        } else {
            $(this).addClass('sl-acc-btn-active');
            $('img').addClass('add-title');
            $('.sl-acc-img-title').addClass('sl-acc-img-title-active');
            accessibilityMain.imageDescription = true;
        }
        updateStatement();
    });

    $(document).mousemove(function (e) {
        if($('.sl-acc-img-title').hasClass('sl-acc-img-title-active')){
            $('img').each(function(i, v){
                var img = $(this)[0];
                var title = $('.sl-acc-img-title');
                var text = $(img).attr('alt');
                if(!text){text = "Untitled";}
                if((e.pageY < $(img).offset().top ||
                    e.pageY > $(img).offset().top + $(img).height() ||
                    e.pageX < $(img).offset().left ||
                    e.pageX > $(img).offset().left + $(img).width()) ){
                } else{
                    $(title).text(text);
                    title.offset({
                        top: (e.pageY ? e.pageY + 20 : e.clientX + 20),
                        left: (e.pageX ? e.pageX + 20 : e.clientY + 20)
                    });
                    $('.sl-acc-img-title').show();
                }
                $(img).mouseleave(function(){ $('.sl-acc-img-title').hide(); });
            });
        }
    });


    //RESET ALL
    $('.sl-acc-reset').on('click', function(e) {
        e.preventDefault();
        accessibilityMain = Object.assign({}, accessibilityMainMaster);
        updateStatement();
        resetFontSize();
        //readable
        $('body').removeClass('sl-acc-standard-font');
        $('.sl-acc-readable-font').removeClass('sl-acc-btn-active');
        $('div, span, h1, h2, h3, h4, h5, h6, p, a, ul, li').not('.sl-acc-main-wrapper *').each(function(i, obj) {
            $(this).removeClass('sl-acc-standard-font');
        });
        //BG COLOR
        $('body').css('background-color', accessibilityMain.bgColor);
        //HIGHLIGHT HEADERS
        $('.sl-acc-highlight-header').removeClass('sl-acc-btn-active');
        if($('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').hasClass('sl-acc-header-underline')) {
            $(this).removeClass('sl-acc-btn-active');
            $('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').each(function (i, obj) {
                var content = $(this).children('.sl-acc-header-underline-wrapper').text();
                $(this).html(content);
            });
            $('h1, h2, h3, h4, h5').not('.sl-acc-main-wrapper *').removeClass('sl-acc-header-underline');
        }
        //HIGHLIGHT LINKS
        $('a').removeClass('sl-acc-link-bottom-line');
        $('.sl-acc-highlight-links').removeClass('sl-acc-btn-active');
        //MONOCHROME
        $('body').removeClass('sl-acc-grayscale');
        $('.sl-acc-monochrome').removeClass('sl-acc-btn-active');
        //CONTRAST
        $('#highContrastStylesheet').remove();
        $('body').removeClass('contrast');
        $('.sl-acc-contrast').attr('id', 'is_normal_contrast').attr('aria-pressed', false).removeClass('active');
        $('.sl-acc-contrast').removeClass('sl-acc-btn-active');
        //eraseCookie('a11y-high-contrast');
        //ZOOM
        $('body').removeClass('sl-acc-body-zoom');
        $('.sl-acc-zoom-plus').removeClass('sl-acc-btn-active');
        //CURSOR BIG
        $('body').removeClass('sl-acc-cursor-big-icon');
        $('a').removeClass('sl-acc-pointer-big');
        $('input[type="submit"]').removeClass('sl-acc-pointer-big');
        $('.sl-acc-big-cursor').removeClass('sl-acc-btn-active');
        $('sl-acc-zoom-plus').removeClass('sl-acc-btn-active');
        //IMG DESCRIPTION
        $('img').removeClass('add-title');
        $('.sl-acc-img-title').removeClass('sl-acc-img-title-active');
        $('.sl-acc-img-description').removeClass('sl-acc-btn-active');
    });

    //INIT
    init();

    //TAB-OPEN

    $( ".sl-acc-open-icon a" ).focus(function() {
        $(".sl-acc-main-wrapper").css("visibility", "visible");
        $('.sl-acc-main-wrapper').animate({
            left: 0
        }, 300, function() {
            // Animation complete.
        });
        $('.sl-acc-open-icon').hide(300);
    });

    //REPORT FORM

    $('.sl-acc-report-button-wrapper').on('click', function(e) {
        e.preventDefault();
        $('.sl-acc-options-wrapper').hide();
        $('.sl-acc-report-form-wrapper').show(200);
        });

    $('.sl-acc-report-form-close span').on('click', function(e) {
        e.preventDefault();
        $('.sl-acc-report-form-wrapper').hide();
        $('.sl-acc-options-wrapper').show(200);
    });



    //VALIDATION REPORT FORM

    function validation(){

        var nameValidation;
        if( $('#sl-acc-report-name').val() == ""){
            $('#sl-acc-report-name').addClass('ivalid-field');
        } else {
            $('#sl-acc-report-name').removeClass('ivalid-field');
        }

        var messageValidation;
        if( $('#sl-acc-report-message').val() == ""){
            $('#sl-acc-report-message').addClass('ivalid-field');
        } else {
            $('#sl-acc-report-message').removeClass('ivalid-field');
        }





        var emailValidation;
        if( $('#sl-acc-report-email').val() == ""){
            $('#sl-acc-report-email').addClass('ivalid-field');
        } else {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            emailValidation = emailRegex.test( $('#sl-acc-report-email').val() );
            if(emailValidation){
                $('#sl-acc-report-email').removeClass('ivalid-field');
            } else {
                $('#sl-acc-report-email').addClass('ivalid-field');
            }
        }


        var valid = ($('#sl-acc-report-name').val() != "" && $('#sl-acc-report-message').val() != "" && $('#sl-acc-report-email').val() != "" && emailValidation) ? true : false;
        return valid;
    }

});