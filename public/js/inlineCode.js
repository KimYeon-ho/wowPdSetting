;(function($){
    var is = (function () {
        var _agent = navigator.userAgent,
            _appName = navigator.appName,
            isMobile = /LG|SAMSUNG|Samsung|iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i.test(_agent),
            isIOS = !/Android/i.test(_agent) && /iPhone|iPad|iPod/i.test(_agent),
            isIE = (_appName === 'Netscape' && _agent.toLowerCase().indexOf('trident') !== -1) || _agent.toLowerCase().indexOf("msie") !== -1,
            isIEVer = (function () {
                var word,
                    version = 'N/A',
                    reg = null;
                if (_appName === 'Microsoft Internet Explorer') { // IE old version ( IE 10 or Lower )
                    word = 'msie ';
                } else if (_agent.search('trident') > -1) { // IE 11
                    word = 'trident/.*rv:';
                } else if (_agent.search('edge/') > -1) { // IE 12  ( Microsoft Edge )
                    word = 'edge/';
                }
                reg = new RegExp(word + '([0-9]{1,})(\\.{0,}[0-9]{0,1})');
                if (reg.exec(_agent) !== null) version = parseFloat(RegExp.$1 + RegExp.$2);
                return version;
            })();
        return {
            agent: _agent,
            appName: _appName,
            mobile: isMobile,
            ios: isIOS,
            ie: isIE,
            ieVer: isIEVer
        };
    })();

    var isAEM = false,
        winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        $win = $(window),
        $doc = $(document),
        isW = winW > 768;

    var readyFn = function(){
        //
    };


    /**
     * 실행
     */
    readyFn();
    $win.on('resize load', function(){
        winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (!isW && winW > 768){
            isW = true;
        } else if (isW && winW <= 768) {
            isW = false;
        }
    });
})(jQuery);