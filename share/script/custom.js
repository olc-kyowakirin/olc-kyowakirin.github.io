(function (doc) {
    'use strict';

    var docElm = doc.documentElement;

    if (
        docElm &&
        docElm.nodeType === 1
    ) {
        docElm.setAttribute('data-script-enabled', 'true');
    }

    docElm = null;
})(window.document);


/* =========================
特定リンクへのaddclass
=========================== */
$(function () {
    'use strict';

    var current = '';
    var linkUrl = '';
    var directoryUrl = ['tw', 'kkr', 'hk', 'kr', 'singapore', 'thailand', 'biowa', 'kkd'];
    var permissionUrl = /.*(ir\.kyowa-kirin\.com\/en\/|m\.kirin\.co\.jp).*/;

    var chkNotEngDirectory = function (directoryName) {
        return directoryUrl.indexOf(directoryName) > -1;
    };

    // モーダル対象class（パス,リンク先）
    var addModalClass = function (href, $target) {
        linkUrl = href.split('/')[1];

        if (linkUrl === '' || linkUrl === undefined ) {
            linkUrl = current;
        }
        // リンク先とアクセス中のページが英語サイトか確認
        if (!chkNotEngDirectory(linkUrl) && !chkNotEngDirectory(current)) {
            return;
        }
        // 別の言語サイトへのリンクか確認
        if (linkUrl !== current) {
            $target.addClass('externalWin');
        }
    };

    // パーミッションチェック
    var checkPermission = function (href) {
        return href.match(permissionUrl);
    };

    /* =========================
    カレント取得
    =========================== */
    current = location.pathname.split('/')[1];

    /* =========================
    ページ内の外部リンクチェック
    =========================== */
    (function () {

        $('a[href]').each(function () {
            var $self = $(this);
            var href = $self.attr('href');
            var flgSelfDomain = href.indexOf('www.kyowa-kirin.com/') > -1;

            // href属性が下記の場合は現在のpassを入れる
            if (href === '#' || href === null || href === undefined) {
                href = location.pathname;
            }
            // http始まり
            if (href.match(/^http/)) {
                // 除外対象ドメインの場合は終了
                if (checkPermission(href)) {

                    return;
                }
                // http始まりでwww.kyowa-kirin.comだった場合、hrefをルート相対URL化
                if (flgSelfDomain) {
                    href = href.replace(/http.+kyowa-kirin.com/, '');
                } else {
                    // 上記に当てはなまらない全てのhttpリンクにaddclass
                    $self.addClass('externalWin');

                    return;
              }
            }
            addModalClass(href, $self);
        });
    })();


    /* =========================
    モーダル
    =========================== */
    (function () {
        var exURL;
        var modalTxt = '';
        modalTxt = '<div id="informationBord">';
        modalTxt += '<div class="externalArea">';
        modalTxt += '<div class="txtArea">';
        modalTxt += '<p class="externalTxt">You will be accessing an external site.<br> Click "OK" to continue.</p>';
        modalTxt += '</div>';
        modalTxt += '<div class="btnExternalArea">';
        modalTxt += '<div class="externalBtnStyle02">';
        modalTxt += '<a target="_blank" href="#" id="externalURL">';
        modalTxt += '<span>OK</span>';
        modalTxt += '</a>';
        modalTxt += '</div>';
        modalTxt += '</div>';
        modalTxt += '<a id="externalAreaClosebtn" href="#">';
        modalTxt += '<img src="/share/images/btn_modal_close.png" alt="close modal">';
        modalTxt += '</a>';
        modalTxt += '</div>';

        $('body').on('click', '.externalWin', function () {
            $('body').append('<div id="glayLayer"></div>');
            exURL = $(this).attr('href');
            $('body').append(modalTxt);
            $('#externalURL').attr('href', exURL);

            return false;
        });

        // PC用
        $(document).on('click', '#glayLayer,#externalWindow,#externalAreaClosebtn', function () {
            removeModal();

            return false;
        });

        // タッチデバイス用
        $(document).on('touchstart touchmove touchend', '#glayLayer,#externalWindow,#externalAreaClosebtn', function (event) {
            var $self = $(this);

            if ('touchstart' === event.type) {
                $self.attr('data-touchstarted', '');

                return false;
            }
            if ('touchmove' === event.type) {
                $self.removeAttr('data-touchstarted');

                return false;
            }
            if ('undefined' !== typeof $(this).attr('data-touchstarted')) {
                removeModal();
                $self.removeAttr('data-touchstarted');

                return false;
            }
        });

        $(document).on('click', '#externalURL', function () {
            // iOS safari 短縮URL対策
            setTimeout(function () {
            sleep(500);
            }, 100);
            removeModal();
        });

        var removeModal = function () {
            $('#informationBord').remove();
            $('#glayLayer').remove();
        };
    })();
});

/* =========================
タブ機能
=========================== */
$(function () {
    'use strict';
    // HTMLの読み込みが終わったら
    var hash;

    $(window).on('load', function () {
        var target = '';
        hash = location.hash;

        if (/#_ga.*/.test(hash)) {
            hash = '';
        }

        if (hash === '' || hash === '#informationArchiveArea') {
            target = 'info';
        } else {
            target = 'news';
        }

        changeTabActive(target);
        changeBodyShow(hash);

        // タブがクリックされたら
        $(document).on('click', '#tabLists .tab a', function (event) {
            var $self = $(this);
            var hash = $self.attr('href');
            var target = $self.parent().attr('id');

            changeTabActive(target);
            changeBodyShow(hash);
            document.activeElement.blur();
            event.preventDefault();
        });

        // スマホデバイス
        $(document).on('touchstart touchmove touchend', '#tabLists .tab a', function(event) {
            if ('touchstart' === event.type) {
                $(this).attr('data-touchstarted', '');

                return false;
            }
            if ('touchmove' === event.type) {
                $(this).removeAttr('data-touchstarted');

                return false;
            }
            if ('undefined' !== typeof $(this).attr('data-touchstarted')) {
                event.preventDefault();
                var $self = $(this);
                var hash = $self.attr('href');
                var target = $self.parent().attr('id');

                changeTabActive(target);
                changeBodyShow(hash);
                document.activeElement.blur();
                $self.removeAttr('data-touchstarted');

                return false;
            }
        });
    });

    // タブ用表示切り替え
    var changeTabActive = function (target) {
        $('#tabLists .tab').removeClass('active');
        $('#' + target).addClass('active');
    };

    // 表示内容切り替え
    var changeBodyShow = function (hash) {
        $('#newsArea').removeClass('show');
        $('#informationArchiveArea').removeClass('show');
        if (hash === '') {
            $('#informationArchiveArea').addClass('show');
        } else {
            $(hash).addClass('show');
        }
    };
});