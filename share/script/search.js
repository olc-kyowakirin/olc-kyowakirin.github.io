(function() {
var da = document.createElement('script');
da.type = 'text/javascript'; da.async = true;
if ('https:' == document.location.protocol) {
da.src =  'https://rsv.dga.jp/s/kirin/search_tool_n1.js';
} else {
da.src =  'http://cache.dga.jp/s/kirin/search_tool_n1.js';
}
var sc  = document.getElementsByTagName('script')[0];
sc.parentNode.insertBefore(da, sc);
})();