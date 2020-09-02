$(function () {
    'use strict';

    var $win = $(window);
    var $body = $('body');
    var FOCUS_ELEMENTS = 'a[href], area[href], [tabindex], button, input, select, textarea, iframe, object, audio, video, output, embed';

    /* ========================================
    * 外部サイト遷移時モーダル機能プラグイン
    * ======================================== */
    (function ($) {
        var whiteListHost = [ // モーダルを表示させないhostname + directore
            'www.kyowa-kirin.co.jp',
            'www.kyowa-kirin.com',
            'ir.kyowa-kirin.com/en',
            'www.kyowakirin.com',
            'www.kyowakirin.co.jp',
            'ir.kyowakirin.com/en',
            'm.kirin.co.jp',
        ];
        var whiteListFile = []; // モーダルを表示させないファイル
        var exceptionList = [ // 例外URL: モーダルのタイプ
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/tw/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/kkr/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/hk/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/kr/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/singapore/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/thailand/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/biowa/*',
                type: 'type01'
            },
            {
                hostname: 'www.kyowakirin.com',
                pathname: '/kkd/*',
                type: 'type01'
            }
        ];
        var modalTmp = '<div class="box-modal-outbound"><div class="box-modal-inner"><div class="modal-tmp"></div><button class="btn-modal-close" type="button"><span class="radius"><span>Close</span></span></button></div>';
        var modalContentTmp = {
            type01: '<div class="box-text"><p>You will be accessing an external site.</p><p>Click "OK" to continue.</p></div><div class="align-c"><a href="{{href}}" target="_blank" class="btn-03 btn-small">OK<img src="/share/images/icon_link_blank_04.png" alt="Open in new window" class="icon-blank"></a></div>',
            type02: '<div class="box-text"><p><em>Président</em></p><p>Fabienne Delaplace-Lavoix</p><p><em>Pour toute déclaration d’effet indésirable, contactez</em></p><p>pvfrance@kyowakirin.com</p><p><em>Pour toute demande d’information médicale, contactez</em></p><p>Infomed-FR@kyowakirin.com</p></div><div class="box-text mb-0"><p>Kyowa Kirin Pharma est certifié pour son activité d’information par démarchage ou prospection visant à la promotion des médicaments.</p><p>Pour toute appréciation sur la qualité de notre information promotionnelle, contactez pharmaceutique-fr@kyowakirin.com.</p></div>',
            type03: '<div class="box-text mb-0"><p>Kyowa Kirin USA Holdings, Inc.</p><p>Address	212 Carnegie Center, Suite 400, Princeton, NJ 08540 USA</p><p>Tel	+1-609-580-7400</p><p>Fax	+1-609-919-1111</p></div>',

//sg
            type04: '<div class="box-singaporearea"><div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--Singapore --><div class="panel"><div class="box-thumb"><img src="images/index_img_singapore_map_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">Kyowa Kirin Asia Pacific Pte. Ltd.</span></h3><div class="box-sub-content box-sub-content-1"><h4 class="title">Address in operation</h4><p class="box-text">80 Robinson Road<br>#22-01/01A<br>Singapore 068898</p><p class="box-text">Phone: +65 6836 3991<br>Fax: +65 6836 3928<br>E-mail: <a href="mailto:Info-KKAP@kyowakirin.com" target="_blank"> Info-KKAP@kyowakirin.com</a><!-- /.box-sub-content --></p></div><div class="box-sub-content"><h4 class="title">Distributor: Steward Cross Pte Ltd</h4><p class="box-text">Address: 801 Toa Payoh Lorong 7,<br> #06-06 Wearnes Building,<br> Singapore 319319.<br>Phone : +65-6253 2938</p><!-- /.box-sub-content --></div><!-- /.box-content --></div><!-- /.panel singapore --></div><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div><!-- /.box-offices-globalarea --></div><!-- /.box-globalnetwork --></div>',
//au
            type05: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--Australia --><a class="panel"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_australia_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">AUSTRALIA</span>Kyowa Kirin Australia Pty Ltd</h3><p class="box-text">68 York Street,<br>Sydney,<br>NSW 2000, Australia</p></div><!-- /.panel Australia --></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',
//ch
            type06: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--China --><a href="http://www.kyowa-kirin.com.cn/en/index.html" target="_blank" class="panel outBoundModalLink"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_china_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">CHINA</span>Kyowa Hakko Kirin China Pharmaceutical Co., Ltd.</h3><p class="box-text">970 Longdong Road,<br>Pudong New Area,<br>Shanghai, 201203, China<br>Tel. +86-021-5080-0909</p><p class="link-icon link-text"><span>Visit website</span></p></div><!-- /.panel China --></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',
//hh
            type07: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--Hong Kong --><a href="https://www.kyowakirin.com/hk/index.html" target="_blank" class="panel outBoundModalLink"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_hongkong_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">HONG KONG</span>Kyowa Kirin Hong Kong Co., Ltd </h3><p class="box-text">Unit B, 13/F., 169 Electric Road,<br>North Point, Hong Kong</p><p class="link-icon link-text"><span>Visit website</span></p></div><!-- /.panel Hong Kong--></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',
//ko
            type08: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--korea --><a href="https://www.kyowakirin.com/kr/index.html" target="_blank" class="panel outBoundModalLink"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_korea_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">KOREA</span>Kyowa Kirin Korea Co., Ltd. <br>( 한국어 )</h3><p class="box-text">11F, Asia Tower,<br>430, Nonhyeon-ro, Gangnam-gu,<br>Seoul, 06223, Rep. of Korea</p><p class="link-icon link-text"><span>Visit website</span></p></div><!-- /.panel korea--></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',
//my
            type09: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--Malaysia --><a href="#" target="_blank" class="panel"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_malaysia_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">MALAYSIA</span>Kyowa Kirin Malaysia Sdn Bhd<br><span class="text-italic"><small>(formerly known as Kyowa Hakko Kirin (Malaysia) Sdn Bhd)</small></span></h3><p class="box-text">A501 West Wing, Wisma Consplant 2,<br>Jalan SS 16/1, Subang Jaya,<br>47500 Selangor, Malaysia</p><p class="link-icon link-text"><span>Visit website</span></p></div><!-- /.panel Malaysia --></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',
//th
            type10: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--Thailand --><a href="https://www.kyowakirin.com/thailand/index.html" target="_blank" class="panel outBoundModalLink"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_thailand_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">THAILAND</span>Kyowa Kirin (Thailand) Co., Ltd. </h3><p class="box-text">323 United Center Building,<br>20th floor, room 2003B<br>Silom road, Silom, Bangrak<br>Bangkok 10500 Thailand<br>Tel. +662 6312126-8<br>Fax. +662 6312125</p><p class="link-icon link-text"><span>Visit website</span></p></div><!-- /.panel Thailand--></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',
// tw
            type11: '<div class="box-offices-globalarea"><div class="box-offices-globalarea-outer"><div class="box-inner"><div class="box-panel"><!--Taiwan --><a href="#https://www.kyowakirin.com/tw/index.html" target="_blank" class="panel"><div class="box-thumb"><img src="images/index_img_regionalnetwork_panel_taiwan_01.jpg" alt=""></div><div class="box-content"><h3 class="title"><span class="sub">TAIWAN</span>Kyowa Kirin Taiwan Co., Ltd.</h3><p class="box-text">9th floor, No. 68, Section 2,<br>Zhongshan North Road, Zhongshan District,<br>Taipei City, Taiwan 10448<br><br>富邦中山大樓9F<br>中山北路二段68號</p><p class="link-icon link-text"><span>Visit website</span></p></div><!-- /.panel Taiwan--></a><!-- /.box-panel --></div><!-- /.box-inner --></div><!-- /.box-offices-globalarea-outer --></div>',

        };
        var modalOverlayTmp = '<div class="box-modal-overlay is-hidden" aria-hidden="true"></div>';
        var $modal = null;
        var $modalContent = null;
        var $modalOverlay = null;
        var $focusElement = null;
        var $clickedLink = null;
        var deferred = new $.Deferred();
        var isWhite = function (href) {
            var returnBoolean = false;
            var paths = location.pathname.split('/');
            var currentFile = paths[paths.length - 1] === '' ? 'index.html' : paths[paths.length - 1];
            var currentFileReg = {};

            if (/^(https?:)?(\/\/).*/.test(href)) {
                if (/[^/]$/.test(href)) {
                    href += '/';
                }

                whiteListFile.forEach(function (val) {
                    currentFileReg = new RegExp(val.replace(/\//g, '\\/').replace(/\*/g, '\\*').replace(/\./g, '\\.'));

                    if (currentFileReg.test(currentFile)) {
                        returnBoolean = true;
                    }
                });

                // 無駄な処理を省くためにreturnBooleanがfalseの時のみ動く
                if (!returnBoolean) {
                    whiteListHost.forEach(function (val) {
                        // 絶対パスか同じスキーマ
                        var reg = new RegExp('^(https?:)?\\/\\/' + val.replace(/\//g, '\\/').replace(/\*/g, '\\*').replace(/\./g, '\\.') + '(?=\\/)');

                        if (reg.test(href)) {
                            returnBoolean = true;
                        }
                    });
                }
            } else {
                returnBoolean = true;
            }

            return returnBoolean;
        };
        var exceptionProcess = function (href, returnType) {
            var forced = { // 例外モーダルを強制的に発生させるhref: モーダルタイプ
                '#outBoundModal-exception-01': 'type01',
                '#outBoundModal-exception-02': 'type02',
                '#outBoundModal-exception-03': 'type03',
                '#outBoundModal-popup-sg': 'type04',
                '#outBoundModal-popup-au': 'type05',
                '#outBoundModal-popup-ch': 'type06',
                '#outBoundModal-popup-kk': 'type07',
                '#outBoundModal-popup-ko': 'type08',
                '#outBoundModal-popup-my': 'type09',
                '#outBoundModal-popup-th': 'type10',
                '#outBoundModal-popup-tw': 'type11',

            }[href];
            var value = null;
            var hostname = 'www.kyowakirin.com';
            // @TODO ホストネームを固定しない場合は上記変数を削除して下記の変数のコメントアウトを解除
            // var hostname = location.hostname;
            var pathname = location.pathname.replace(/(index\.html)$/, '');
            var paths = '';
            var downDirLen = 0;

            if (returnType === 'boolean') {
                value = false;
            } else if (returnType === 'type') {
                value = 'type01';
            } else {
                returnType = 'boolean';
                value = false;
            }

            if (/^#/.test(href)) {
                if (forced) {
                    if (returnType === 'boolean') {
                        return true
                    } else if (returnType === 'type') {
                        return forced;
                    }
                } else {
                    return false;
                }
            }

            // 末尾がindex.htmlではない場合は/index.htmlを付ける
            // 末尾に/が無い且つ、末尾がindex.htmlではない場合は/index.htmlを付ける
            if (/[^/]$/.test(href) && !/(index\.html)$/.test(href)) {
                href += '/index.html';
            }
            // 末尾が/の場合はindex.htmlを付ける
            href = /\/$/.test(href) ? href + 'index.html' : href;

            // 絶対パスか同じスキーマ
            if (/^(https?:)?(\/\/).*/.test(href)) {
                hostname = href.replace(/^(https?:)?(\/\/)/, '').replace(/\/.*/, '');
                pathname = href.replace(/^(https?:)?(\/\/)(.*?)(?=\/)/, '');
            // 相対パス(./ || ../または/で始まらないリンク)
            } else if (/^[.]{1}(?=\/).*/.test(href) || /^(?!([.]{2})?\/).*/.test(href)) {
                pathname += href.replace(/^([.]{1}\/)/, '');
            // 相対パス（階層を下がる）
            } else if (/^[.]{2}(?=\/).*/.test(href)) {
                paths = pathname.match(/(.*?)\//g);
                downDirLen = href.match(/\.\.\//g).length;

                while (downDirLen--) {
                    paths.pop();
                }
                pathname = paths.join('') + href.replace(/[.]{2}\//g, '');
            // ルート相対パス
            } else if (/^\/.*/.test(href)) {
                pathname = href;
            }

            exceptionList.forEach(function (item) {
                var checkePathReg = new RegExp('^' + item.pathname.replace(/\//g, '\\/').replace(/\*/g, '\\*').replace(/\./g, '\\.'));
                var forwardMatchReg = {};

                if (!checkePathReg.test(location.pathname)) {
                    // 末尾に/が無い場合は/index.htmlを付ける
                    item.pathname = /!\/$/.test(item.pathname) ? item.pathname + '/index.html' : item.pathname;
                    // 末尾が/の場合はindex.htmlを付ける
                    item.pathname = /\/$/.test(item.pathname) ? item.pathname + 'index.html' : item.pathname;
                    if (hostname === item.hostname) {
                        // 前方一致
                        if (/\*$/.test(item.pathname)) {
                            forwardMatchReg = new RegExp('^' + item.pathname.replace(/\*/, '').replace(/\//g, '\\/').replace(/\*/g, '\\*').replace(/\./g, '\\.'));

                            if (forwardMatchReg.test(pathname)) {
                                if (returnType === 'boolean') {
                                    value = true;
                                } else if (returnType === 'type') {
                                    value = item.type;
                                }
                            }
                        // 完全一致
                        } else if (pathname === item.pathname) {
                            if (returnType === 'boolean') {
                                value = true;
                            } else if (returnType === 'type') {
                                value = item.type;
                            }
                        }
                    }
                }
            });

            return value;
        };
        var isException = function (href) {
            return exceptionProcess(href, 'boolean');
        };
        var getModalType = function (href) {
            return exceptionProcess(href, 'type');
        };
        var init = function () {
            if ($modal === null || $modalOverlay === null) {
                if (!$('.box-modal-outbound').length) {
                    $('body').append($(modalTmp));

                    $modal = $('.box-modal-outbound');
                }

                if (!$('.box-modal-overlay').length) {
                    $('body').append($(modalOverlayTmp));

                    $modalOverlay = $('.box-modal-overlay');
                }
            }
        };
        var modalShow = function (e) {
            var scrollTop = $win.scrollTop();
            var $this = e.data.$this;
            var href = e.data.href;

            e.preventDefault();

            $focusElement = $(FOCUS_ELEMENTS).not('.btn-modal-close');
            $modalContent = $(modalContentTmp[getModalType(href)].replace(/\{\{href\}\}/g, href));
            $clickedLink = $this;

            $focusElement.prop('tabindex', -1);
            $modalOverlay.removeClass('is-hidden').addClass('is-visible').attr('aria-hidden', 'false');
            $modal.addClass('is-visible').attr('aria-hidden', 'false');
            $modal.find('.modal-tmp').empty().append($modalContent);
            $body.css('marginTop', '-' + scrollTop + 'px').addClass('is-fixed');

            deferred.resolve().then(function () {
                $modal.addClass('is-animation');
            });
        };
        var modalClose = function () {
            var bodyTop = Math.abs(parseInt($body.css('marginTop'), 10));

            $focusElement.removeAttr('tabindex');
            $modalOverlay.removeClass('is-visible').attr('aria-hidden', 'true');
            $modal.removeClass('is-animation').attr('aria-hidden', 'true');
            $body.removeClass('is-fixed').css('marginTop', '');
            $win.scrollTop(bodyTop);
            $clickedLink.focus();

            $modal.one('transitionend', function () {
                $modal.removeClass('is-visible');
                $modalOverlay.addClass('is-hidden');
                $modal.find('.modal-tmp').empty();
            });
        };

        $.fn.setOutboundModal = function () {
            var $a = this;

            if (!$a.length) {
                return $a;
            }

            $a.each(function () {
                var $this = $(this);
                var href = $this.attr('href');

                if (isException(href) || !isWhite(href)) {
                    init();

                    $this.addClass('outBoundModalLink');
                    $this.on('click', {
                        $this: $this,
                        href: href
                    }, modalShow);
                }
            });

            if ($modal !== null && !$._data($modal.get(0), 'events')) {
                $modal.on('click', function (e) {
                    var $target = $(e.target);

                    if (($target.hasClass('box-modal-outbound')) ||
                        ($target.closest('.btn-modal-close, .btn-03').length)) {
                        modalClose();
                    }
                });
            }

            return $a;
        };
    }(jQuery)); // eslint-disable-line

    /* ========================================
    * a要素に外部サイト遷移時モーダル機能を追加
    * ======================================== */
    (function () {
        var $a = $('a,area').not('a[href^="mailto:"], a[href^="tel:"], .outBoundModalLink');

        if ($a.length) {
            $a.setOutboundModal();
        }
    }());
});
