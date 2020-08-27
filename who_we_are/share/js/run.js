(function () {
    'use strict';

    var MQL = matchMedia('(max-width: 768px)');
    var FADE_TIME = 200;

    /* ========================================
    * パイプラインセクションのアコーディオン
    * ======================================== */
    (function () {
        $('.pipeline-btn-accordion').on('click', function () {
            var $this = $(this);
            var isAiraExpanded = $(this).attr('aria-expanded') === 'true';

            if (isAiraExpanded) {
                $this.attr('aria-expanded', 'false');
                $this.next().attr('aria-hidden', 'true');
            } else {
                $this.attr('aria-expanded', 'true');
                $this.next().attr('aria-hidden', 'false');
            }

            $this.next().fadeToggle(FADE_TIME);
        });
    }());

    /* ========================================
    * パイプラインセクションのsearch-box表示処理
    * ======================================== */
    (function () {
        var $accordionBtnOfSearchBox = $('.pipeline-btn-accordion._search');
        var $win = $(window);
        var resizeTimer = null;
        var resizeFlg = false;

        $win.on('load', function () {
            if (MQL.matches) {
                resizeFlg = true;

                $accordionBtnOfSearchBox.attr({
                    'aria-expanded': 'false',
                    'aria-hidden': 'false'
                });
                $accordionBtnOfSearchBox.next().attr('aria-hidden', 'true');
            }
        });

        $win.on('resize', function () {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout (function () {
                if (MQL.matches && !resizeFlg) {
                    $accordionBtnOfSearchBox.attr({
                        'aria-expanded': 'false',
                        'aria-hidden': 'false'
                    });
                    $accordionBtnOfSearchBox.next().attr('aria-hidden', 'true').hide();
                    resizeFlg = true;
                } else if (!MQL.matches && resizeFlg) {
                    $accordionBtnOfSearchBox.attr({
                        'aria-expanded': 'true',
                        'aria-hidden': 'true'
                    });
                    $accordionBtnOfSearchBox.next().attr('aria-hidden', 'false').show();
                    resizeFlg = false;
                }
            }, 50);
        });
    }());

    /* ========================================
    * パイプラインリスト生成機能など
    * ======================================== */
    (function () {
        var LIST_TYPE = {
            top: 1
        };
        var INIT_SORT_TYPE = {
            top: 1
        };
        var MOUNT_TIME = {
            top: 200
        };
        var TOP = {
            name: {
                overview: '.pipeline-table[data-mount-name="overview"]',
                recentChanges1: '.pipeline-table[data-mount-name="recentChanges1"]',
                recentChanges2: '.pipeline-table[data-mount-name="recentChanges2"]'
            },
            codeNameSortElm: '.pipeline-table[data-mount-name] .item.codeName button',
            phaseSortElm: '.pipeline-table[data-mount-name] .item.phase button',
            filterElm: '.pipeline-box-search',
            jsonData: '/what_we_do/share/json/pipeline.json',
            listType: LIST_TYPE.top,
            sortType: INIT_SORT_TYPE.top,
            mountTime: MOUNT_TIME.top
        };
        var SORT_COMMAND = {
            ASC: "asc",
            DESC: "desc"
        };
        var Pipeline = function () {
            this.data = {};
            this.prefData = {};
            this.mountObj = {};
            this.existSession = false;
            this.mountElm = {};
            this.$codeNameSortElm = null;
            this.$phaseSortElm = null;
            this.$filterElm = null;
            this.listType = 0;
            this.sortType = 0;
            this.mountTime = 0;
            this.hash = [];

            this.init();
        };

        Pipeline.prototype = {
            /**
             * 初期処理
             * @returns {Undefined} undefined
             */
            init: function () {
                var self = this;

                this.mountObj = this.getMountObj([TOP]);

                if (this.mountObj) {
                    $.ajax({
                        url: this.mountObj.jsonData,
                        type: 'GET',
                        dataType: 'json',
                        timeout: 10000
                    }).done(function (data) {
                        self.initMountObj();
                        self.initElmEvent();
                        self.data = data;

                        if (self.$filterElm) {
                            self.setSessionItem();
                        }

                        self.initMount();
                    }).fail(function (jqXHR, textStatus) {
                        throw new Error('ajax ' + textStatus);
                    });
                }
            },
            /**
             * 引数で送られた要素が画面上に存在しているか検索、1つでも存在を確認すればその要素の情報を返し処理を終了させる
             * @param {Array} mountObjArr 描画する要素の情報が入っている配列
             * @returns {Object} 要素情報
             */
            getMountObj: function (mountObjArr) {
                var self = this;
                var returnObj = false;
                var objNameKey = '';

                mountObjArr.some(function (obj) {
                    var nextFlg = false;
                    var checkedExistElm = function (key) {
                        var elmName = '$' + key;

                        if (obj.name[key] !== null) {
                            if ($(obj.name[key]).length) {
                                self.mountElm[elmName] = $(obj.name[key]);
                            } else {
                                nextFlg = true;
                            }
                        } else {
                            self.mountElm[elmName] = null;
                        }
                    };

                    for (objNameKey in obj.name) {
                        if (obj.name.hasOwnProperty(objNameKey)) {
                            checkedExistElm(objNameKey);
                        }
                    }

                    if (nextFlg) {
                        return false;
                    }

                    returnObj = obj;

                    return true;
                });

                return returnObj;
            },
            /**
             * mountObjの情報を元にthisの初期処理を行う
             * @returns {Undefined} undefined
             */
            initMountObj: function () {
                var mountObj = this.mountObj;
                var mountObjNameKey = '';
                var mountElmName = '';

                for (mountObjNameKey in mountObj.name) {
                    if (mountObj.name.hasOwnProperty(mountObjNameKey)) {
                        mountElmName = '$' + mountObjNameKey;

                        this.mountElm[mountElmName] = $(mountObj.name[mountObjNameKey]).find('.content');
                    }
                }

                this.$codeNameSortElm = mountObj.codeNameSortElm !== null ? $(mountObj.codeNameSortElm) : null;
                this.$phaseSortElm = mountObj.phaseSortElm !== null ? $(mountObj.phaseSortElm) : null;
                this.$filterElm = mountObj.filterElm !== null ? $(mountObj.filterElm).find('input[type="checkbox"]') : null;
                this.listType = mountObj.listType;
                this.sortType = mountObj.sortType;
                this.mountTime = mountObj.mountTime;
            },
            /**
             * 要素にイベントを追加
             * @returns {Undefined} undefined
             */
            initElmEvent: function () {
                // リストアコーディオン
                $(document).on('click keydown', '.pipeline-table .contentList .itemList._body[aria-expanded]', this, this.contentListOnClick);
                // codeNameSortElm
                if (this.$codeNameSortElm) {
                    this.$codeNameSortElm.on('click', {
                        this: this,
                        type: 'codeName'
                    }, this.sortElmOnClick);
                }
                // $phaseSortElm
                if (this.$phaseSortElm) {
                    this.$phaseSortElm.on('click', {
                        this: this,
                        type: 'phase'
                    }, this.sortElmOnClick);
                }
                // $filterElm
                if (this.$filterElm) {
                    this.$filterElm.on('change', this, this.filterElmOnChange);
                }
            },
            /**
             * sessionStorageで送られてきた値を元にチェックボックスを選択する
             * @returns {Undefined} undefined
             */
            setSessionItem: function () {
                var item = {
                    modalities: [],
                    therapeuticArea: []
                };
                var key = '';
                var sessionData = JSON.parse(sessionStorage.getItem('rdproduction'));

                if (sessionStorage.getItem('rdproduction')) {
                    for (key in item) {
                        if (item.hasOwnProperty(key)) {
                            // sessionDataにmodalitiesもしくはtherapeuticAreaが存在する場合は、その値と同じチェックボックスを選択状態にする
                            if (sessionData !== null && sessionData.hasOwnProperty(key)) {
                                item[key] = sessionData[key];

                                this.filterElmEach(function ($this, val, name) { // eslint-disable-line
                                    var idx = 0;

                                    if (key === name && item[key].indexOf(val) >= 0) {
                                        idx = item[key].indexOf(val);

                                        if (val === item[key][idx]) {
                                            $this.prop('checked', true);
                                        }
                                    }
                                });
                            // sessionDataにitem内のkey（modalitiesもしくはtherapeuticArea）が存在しない場合はが存在しない場合は、該当するカテゴリの「すべて」のチェックボックスを選択状態にする
                            } else {
                                this.filterElmEach(function ($this, val, name) { // eslint-disable-line
                                    if (key === name && val === '00') {
                                        $this.prop('checked', true);
                                    }
                                });
                            }
                        }
                    }

                    this.existSession = true;
                } else {
                    // sessionが存在しない場合は「すべて」を選択した状態にする
                    this.filterElmEach(function ($this, val) {
                        if (val === '00') {
                            $this.prop('checked', true);
                        }
                    });
                }
            },
            /**
             * contentListクリック処理
             * @param {event} e クリックイベント
             * @returns {Undefined} undefined
             */
            contentListOnClick: function (e) {
                var $this = $(this);
                var $detail = $this.next('.itemList._detail');
                var ENTER = 13;
                var SPACE = 32;

                if ((e.type === 'keydown' && e.keyCode === ENTER) ||
                    (e.type === 'keydown' && e.keyCode === SPACE) ||
                    (e.type === 'click')) {

                    if ($this.attr('aria-expanded') === 'true' && $detail.attr('aria-hidden') === 'false') {
                        $this.attr('aria-expanded', 'false');
                        $detail.attr('aria-hidden', 'true');
                    } else {
                        $this.attr('aria-expanded', 'true');
                        $detail.attr('aria-hidden', 'false');
                    }

                    $detail.stop();
                    $detail.fadeToggle(300);
                }
            },
            /**
             * sort系要素のクリック処理
             * @param {event} e クリックイベント
             * @returns {Undefined} undefined
             */
            sortElmOnClick: function (e) {
                var self = e.data.this;
                var type = e.data.type;
                var $this = $(this);
                var dataName = $this.closest('.pipeline-table').data('mountName');
                var mountPoint = '$' + dataName;

                if ($this.hasClass(SORT_COMMAND.ASC)) {
                    $this.removeClass(SORT_COMMAND.ASC).addClass(SORT_COMMAND.DESC);

                    if (type === 'codeName') {
                        self.prefData = self.codeNameSort(self.prefData, SORT_COMMAND.DESC);
                    } else if (type === 'phase') {
                        self.prefData = self.phaseSort(self.codeNameSort(self.prefData, SORT_COMMAND.ASC), SORT_COMMAND.DESC);
                    }
                } else if ($this.hasClass(SORT_COMMAND.DESC)) {
                    $this.removeClass(SORT_COMMAND.DESC).addClass(SORT_COMMAND.ASC);

                    if (type === 'codeName') {
                        self.prefData = self.codeNameSort(self.prefData, SORT_COMMAND.ASC);
                    } else if (type === 'phase') {
                        self.prefData = self.phaseSort(self.codeNameSort(self.prefData, SORT_COMMAND.DESC), SORT_COMMAND.ASC);
                    }
                }

                self.mount(self.createListElmData(self.prefData[dataName]), self.mountElm[mountPoint]);
            },
            /**
             * filterElmチェンジ処理
             * @param {event} e クリックイベント
             * @returns {Undefined} undefined
             */
            filterElmOnChange: function (e) {
                var self = e.data;
                var $this = $(this);
                var dataName = $this.closest(self.mountObj.filterElm).next('.pipeline-table').data('mountName');
                var mountPoint = '$' + dataName;
                var filterObjArr = [];
                var filteredData = [];
                var sortedData = {};
                var codeNameSortElmClass = self.$codeNameSortElm ? self.$codeNameSortElm.attr('class') : SORT_COMMAND.ASC;
                var phaseSortElmClass = self.$codeNameSortElm ? self.$phaseSortElm.attr('class') : SORT_COMMAND.DESC;

                self.checkboxValidate($this);

                filterObjArr.push(self.getCheckedItem('modalities'));
                filterObjArr.push(self.getCheckedItem('therapeuticArea'));

                filteredData = self.getFilteredData(self.data, filterObjArr);

                if (self.sortType === 1) {
                    sortedData = self.phaseSort(self.codeNameSort(filteredData, codeNameSortElmClass), phaseSortElmClass);
                } else if (self.sortType === 2) {
                    sortedData = self.uminSort(filteredData, SORT_COMMAND.ASC);
                }

                self.prefData = sortedData;
                self.mount(self.createListElmData(self.prefData[dataName]), self.mountElm[mountPoint]);
            },
            /**
             * $filterElm一つ一つに対して処理を行うことができる
             * @param {Function} fn コールバック関数
             * @returns {Undefined} undefined
             */
            filterElmEach: function (fn) {
                this.$filterElm.each(function () {
                    var $this = $(this);
                    var val = $this.val();
                    var name = $this.attr('name');

                    fn($this, val, name);
                });
            },
            /**
             * 送られてきたデータをfilterObjArrを元にフィルタリングして返す
             * @param {Object} data データ
             * @param {Array} filterObjArr フィルタリング項目
             * @returns {Object} フィルタリング後のデータ
             */
            getFilteredData: function (data, filterObjArr) {
                var newData = {};
                var newDataClone = {};
                var key = '';
                var dataI = 0;
                var dataLen = 0;
                var dataItem = {};
                var filterObjArrI = 0;
                var filterObjArrLen = filterObjArr.length;
                var filterData = [];
                var comparisonProperty = '';
                var filterContnetIsAll = 0;

                // データ内のkeyごとに処理（summary, treatmentなど）
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        newData[key] = [];
                        filterContnetIsAll = 0;

                        // filterObjArrの中身ごとに処理（filterObjArrの中身にはフィルタリング項目が配列で格納されている）
                        for (filterObjArrI = 0; filterObjArrI < filterObjArrLen; filterObjArrI++) {
                            filterData = filterObjArr[filterObjArrI].data;
                            comparisonProperty = filterObjArr[filterObjArrI].name;
                            dataItem = {};

                            if (filterData.indexOf('00') >= 0) {
                                filterContnetIsAll++;

                                continue;
                            }

                            // 初回、もしくはnewData[key]にデータがない場合は送られてきたデータをもとにフィルタリング
                            if (!newData[key].length) {
                                for (dataI = 0, dataLen = data[key].length; dataI < dataLen; dataI++) {
                                    dataItem = data[key][dataI];
                                    if (filterData.indexOf(dataItem[comparisonProperty]) >= 0) {
                                        newData[key].push(dataItem);
                                    }
                                }
                            // 2回目以降はAND検索のためnewData[key]を元にフィルタリングをかける
                            } else {
                                newDataClone = JSON.parse(JSON.stringify(newData[key]));
                                newData[key] = [];

                                for (dataI = 0, dataLen = newDataClone.length; dataI < dataLen; dataI++) {
                                    dataItem = newDataClone[dataI];

                                    if (filterData.indexOf(dataItem[comparisonProperty]) >= 0) {
                                        newData[key].push(dataItem);
                                    }
                                }
                            }
                        }

                        // もしもfilterObjArrの中身が全てallの場合はフィルタリングしていない素のデータを代入
                        if (filterObjArrLen === filterContnetIsAll) {
                            newData[key] = data[key];
                        }
                    }
                }

                return newData;
            },
            /**
             * チェックボックスの活性、非活性の切り替える
             * @param {HTMLElement} $target 選択したチェックボックス
             * @returns {Undefined} undefined
             */
            checkboxValidate: function ($target) {
                var targetName = $target.attr('name');
                var targetVal = $target.val();
                var checkedItemLen = 0;

                if (targetVal === '00') {
                    this.filterElmEach(function ($this, val, name) {
                        if (val !== '00' && name === targetName) {
                            $this.prop('checked', false);
                        }

                        $target.prop('checked', true);
                    });
                } else {
                    this.filterElmEach(function ($this, val, name) {
                        // 選択されているチェックボックスの数を取得
                        if (name === targetName && $this.prop('checked')) {
                            checkedItemLen++;
                        }

                        if (val === '00' && name === targetName) {
                            $this.prop('checked', false);
                        }
                    });

                    // チェックボックスが全て選択されていない場合は「すべて」のチェックボックスを選択状態にする
                    if (!checkedItemLen) {
                        this.filterElmEach(function ($this, val, name) {
                            if (val === '00' && name === targetName) {
                                $this.prop('checked', true);
                            }
                        });
                    }
                }
            },
            /**
             * 引数で送られた文字列と同じname属性値を持っていて且つ、選択状態であるチェックボックスのvalue値を配列として返す
             * @param {String} propsName 取得したいチェックボックスのname属性値と同じ文字列
             * @returns {Array} value値が入った配列
             */
            getCheckedItem: function (propsName) {
                var returnObj = {
                    name: propsName,
                    data: []
                };

                this.filterElmEach(function ($this, val, name) {
                    var isChecked = $this.prop('checked');

                    if (name === propsName && isChecked) {
                        returnObj.data.push(val);
                    }
                });

                return returnObj;
            },
            /**
             * データのcodeNameを元にデータを昇順もしくは降順に並べ替える
             * @param {Object} data リストのデータ
             * @param {String} sortType asc もしくは desc
             * @returns {Object} 並び替えられたリストデータ
             */
            codeNameSort: function (data, sortType) {
                var newData = {};
                var key = '';

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        newData[key] = data[key];
                        newData[key].sort(function (a, b) {
                            var nameA = a.codeName.toUpperCase();
                            var nameB = b.codeName.toUpperCase();

                            if (sortType === SORT_COMMAND.ASC) {
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }
                            } else if (sortType === SORT_COMMAND.DESC) {
                                if (nameA > nameB) {
                                    return -1;
                                }
                                if (nameA < nameB) {
                                    return 1;
                                }
                            }

                            return 0;
                        });
                    }
                }

                return newData;
            },
            /**
             * データのphaseを元にデータを昇順もしくは降順に並べ替える
             * @param {Object} data リストのデータ
             * @param {String} sortType asc もしくは desc
             * @returns {Object} 並び替えられたリストデータ
             */
            phaseSort: function (data, sortType) {
                var newData = {};
                var key = '';
                
                data = this.faSort(data, sortType);

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        newData[key] = data[key];
                        newData[key].sort(function (a, b) {
                            if (sortType === SORT_COMMAND.ASC) {
                                return parseInt(a.phase, 10) - parseInt(b.phase, 10);
                            } else if (sortType === SORT_COMMAND.DESC) {
                                return parseInt(b.phase, 10) - parseInt(a.phase, 10);
                            }

                            return 0;
                        });
                    }
                }

                return newData;
            },
            /**
             * データのfaを元にデータを昇順もしくは降順に並べ替える
             * @param {Object} data リストのデータ
             * @param {String} sortType asc もしくは desc
             * @returns {Object} 並び替えられたリストデータ
             */
            faSort: function (data, sortType) {
                var newData = {};
                var key = '';

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        newData[key] = data[key];
                        newData[key].sort(function (a, b) {
                            if (sortType === SORT_COMMAND.ASC) {
                                return parseInt(a.fa, 10) - parseInt(b.fa, 10);
                            } else if (sortType === SORT_COMMAND.DESC) {
                                return parseInt(b.fa, 10) - parseInt(a.fa, 10);
                            }

                            return 0;
                        });
                    }
                }

                return newData;
            },
            /**
             * データの研究登録番号を元に昇順もしくは降順に並べ替える
             * @param {Object} data リストのデータ
             * @param {String} sortType asc もしくは desc
             * @returns {Object} 並び替えられたリストデータ
             */
            uminSort: function (data, sortType) {
                var newData = {};
                var key = '';

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        newData[key] = data[key];
                        newData[key].sort(function (a, b) {
                            if (sortType === SORT_COMMAND.ASC) {
                                return parseInt(a.umin, 10) - parseInt(b.umin, 10);
                            } else if (sortType === SORT_COMMAND.DESC) {
                                return parseInt(b.umin, 10) - parseInt(a.umin, 10);
                            }

                            return 0;
                        });
                    }
                }

                return newData;
            },
            /**
             * 送られてきたリストデータを文字列のHTMLに変換する
             * @param {Object} data リストのデータ
             * @returns {String} 文字列のHTML
             */
            createListElmData: function (data) {
                var tmpType1 = '';
                var listElmTmp = ''; // 文字列のHTML
                var dataI = 0; // データのindex番号
                var dataLen = 0; // データの表示数
                var dataItem = {}; // データ
                var hash = '';
                var therapeuticArea = {
                    '01': 'Oncology',
                    '02': 'Nephrology',
                    '03': 'Immunology/Allergy',
                    '04': 'Central Nervous System',
                    '05': 'Other'
                };

                while (true) {
                    hash = String(Math.floor(Math.random() * 1000000));

                    if (this.hash.indexOf(hash) < 0) {
                        this.hash.push(hash);
                        break;
                    }
                }

                for (dataLen = data.length; dataI < dataLen; dataI++) {
                    dataItem = data[dataI];

                    if (this.listType === 1) {
                        tmpType1 = '<li class="contentList"><ul class="itemList _body" tabindex="0" aria-expanded="false"　aria-controls="contentList' + hash + '_' + dataI + '"><li class="item codeName"><p>{{codeName}}</p></li><li class="item genericName"><p>{{genericName}}</p></li><li class="item therapeuticArea"><p>{{therapeuticArea}}</p></li><li class="item indication"><p>{{indication}}</p></li><li class="item phase"><ul class="phaseList" data-phase="{{phase}}"><li class="item" aria-hidden="{{phase1}}"><p>1</p></li><li class="item" aria-hidden="{{phase2}}"><p>2</p></li><li class="item" aria-hidden="{{phase3}}"><p>3</p></li><li class="item" aria-hidden="{{phase4}}"><p>F/A</p></li></ul></li><li class="item region"><p>{{region}}</p></li></ul><dl id="contentList' + hash + '_' + dataI + '" class="itemList _detail" aria-hidden="true"><div class="item genericName"><dt>Generic name : </dt><dd>{{genericName}}</dd></div>{{formulation}}{{mechanismOfAction}}{{inHouseOrLicensed}}{{projectType}}{{remarks}}</dl></li>';
                        tmpType1 = tmpType1.replace(/\{\{modalities\}\}/g, dataItem.modalities);
                        tmpType1 = tmpType1.replace(/\{\{codeName\}\}/g, dataItem.codeName);
                        tmpType1 = tmpType1.replace(/\{\{genericName\}\}/g, dataItem.genericName ? dataItem.genericName : '-');
                        tmpType1 = tmpType1.replace(/\{\{therapeuticArea\}\}/g, therapeuticArea[dataItem.therapeuticArea]);
                        tmpType1 = tmpType1.replace(/\{\{indication\}\}/g, dataItem.indication);
                        tmpType1 = tmpType1.replace(/\{\{phase\}\}/g, dataItem.phase);
                        if (dataItem.phase === 1) {
                            tmpType1 = tmpType1.replace(/\{\{phase1\}\}/g, 'false');
                            tmpType1 = tmpType1.replace(/\{\{phase2\}\}|\{\{phase3\}\}|\{\{phase4\}\}/g, 'true');
                        } else if (dataItem.phase === 2) {
                            tmpType1 = tmpType1.replace(/\{\{phase1\}\}|\{\{phase2\}\}/g, 'false');
                            tmpType1 = tmpType1.replace(/\{\{phase3\}\}|\{\{phase4\}\}/g, 'true');
                        } else if (dataItem.phase === 3) {
                            tmpType1 = tmpType1.replace(/\{\{phase1\}\}|\{\{phase2\}\}|\{\{phase3\}\}/g, 'false');
                            tmpType1 = tmpType1.replace(/\{\{phase4\}\}/g, 'true');
                        } else if (dataItem.phase === 4) {
                            tmpType1 = tmpType1.replace(/\{\{phase1\}\}|\{\{phase2\}\}|\{\{phase3\}\}|\{\{phase4\}\}/g, 'false');
                        }
                        tmpType1 = tmpType1.replace(/\{\{region\}\}/g, dataItem.region);

                        // formulation
                        if (dataItem.detail.formulation) {
                            tmpType1 = tmpType1.replace(/\{\{formulation\}\}/g, '<div class="item formulation"><dt>Formulation : </dt><dd>' + dataItem.detail.formulation + '</dd></div>');
                        } else {
                            tmpType1 = tmpType1.replace(/\{\{formulation\}\}/g, '');
                        }
                        // mechanismOfAction
                        if (dataItem.detail.mechanismOfAction) {
                            tmpType1 = tmpType1.replace(/\{\{mechanismOfAction\}\}/g, '<div class="item mechanismOfAction"><dt>Mechanism of Action : </dt><dd>' + dataItem.detail.mechanismOfAction + '</dd></div>');
                        } else {
                            tmpType1 = tmpType1.replace(/\{\{mechanismOfAction\}\}/g, '');
                        }
                        // inHouseOrLicensed
                        if (dataItem.detail.inHouseOrLicensed) {
                            tmpType1 = tmpType1.replace(/\{\{inHouseOrLicensed\}\}/g, '<div class="item inHouseOrLicensed"><dt>In-House or Licensed : </dt><dd>' + dataItem.detail.inHouseOrLicensed + '</dd></div>');
                        } else {
                            tmpType1 = tmpType1.replace(/\{\{inHouseOrLicensed\}\}/g, '');
                        }
                        // projectType
                        if (dataItem.detail.projectType) {
                            tmpType1 = tmpType1.replace(/\{\{projectType\}\}/g, '<div class="item projectType"><dt>Project Type : </dt><dd>' + dataItem.detail.projectType + '</dd></div>');
                        } else {
                            tmpType1 = tmpType1.replace(/\{\{projectType\}\}/g, '');
                        }
                        // remarks
                        if (dataItem.detail.remarks) {
                            tmpType1 = tmpType1.replace(/\{\{remarks\}\}/g, '<div class="item remarks"><dt>Remarks : </dt><dd>' + dataItem.detail.remarks + '</dd></div>');
                        } else {
                            tmpType1 = tmpType1.replace(/\{\{remarks\}\}/g, '');
                        }

                        listElmTmp += tmpType1;
                    }
                }

                return listElmTmp;
            },
            /**
             * 描画処理
             * @param {Object} data リストのデータ
             * @param {HTMLElement} mountPoint 描画する要素
             * @returns {Undefined} undefined
             */
            mount: function (data, mountPoint) {
                var self = this;
                var listData = $(data);

                // 通常描画
                if (mountPoint.children().length) {
                    mountPoint.fadeOut(this.mountTime, function () {
                        mountPoint.empty().append(listData);
                        mountPoint.fadeIn(self.mountTime);
                    });
                // 初期描画
                } else {
                    mountPoint.append(listData);
                }
            },
            /**
             * 初期描画用
             * @returns {Undefined} undefined
             */
            initMount: function () {
                var sortedData = {};
                var filterObjArr = [];
                var filteredData = [];
                var key = '';

                if (this.existSession) {
                    filterObjArr.push(this.getCheckedItem('modalities'));
                    filterObjArr.push(this.getCheckedItem('therapeuticArea'));

                    filteredData = this.getFilteredData(this.data, filterObjArr);

                    if (this.sortType === 1) {
                        sortedData = this.phaseSort(this.codeNameSort(filteredData, SORT_COMMAND.ASC), SORT_COMMAND.DESC);
                    } else if (this.sortType === 2) {
                        sortedData = this.uminSort(filteredData, SORT_COMMAND.ASC);
                    }

                    sessionStorage.removeItem('rdproduction');
                } else {
                    if (this.sortType === 1) {
                        sortedData = this.phaseSort(this.codeNameSort(this.data, SORT_COMMAND.ASC), SORT_COMMAND.DESC);
                    } else if (this.sortType === 2) {
                        sortedData = this.uminSort(this.data, SORT_COMMAND.ASC);
                    }
                }

                this.prefData = sortedData;

                for (key in this.mountElm) {
                    if (this.mountElm.hasOwnProperty(key)) {
                        this.mount(this.createListElmData(sortedData[key.replace('$', '')]), this.mountElm[key]);
                    }
                }
            }
        };

        new Pipeline();
    }());
}());
