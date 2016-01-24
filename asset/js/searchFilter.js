/**
 * Created by lipeng_wei on 15-11-7.
 */
jQuery.fn.searchFilter = function(list, options) {
    options = options || {};
    list = jQuery(list);
    var input = this;
    var lastFilter = '';
    var timeout = options.timeout || 0;
    var callback = options.callback || function() {};
    var keyTimeout;
    var lis = list.children();
    var len = lis.length;
    var oldDisplay = len > 0 ? lis[0].style.display : "block";
    callback(len);
    input.change(function() {
        var filter = input.val().toLowerCase();
        var li, innerText;
        var numShown = 0;
        var firstShown = 0;
        $(lis).each(function(){
            this.style.display = 'none';
            $(this).attr('display', 'none');
        });
        for (var i = 0; i < len; i++) {
            li = lis[i];
            innerText = !options.selector ?
                (li.textContent || li.innerText || "") :
                $(li).find(options.selector).text();
            if (innerText.toLowerCase().indexOf(filter) >= 0) {
                if (li.style.display == "none") {
                    li.style.display = oldDisplay;
                    $(li).attr('display', oldDisplay);
                    $(list).append($(li));
                }
                if (! firstShown) {
                    firstShown = li;
                }
                numShown++;
            } else {
                if (li.style.display != "none") {
                    li.style.display = "none";
                    $(li).attr('display', 'none');
                }
            }
        }
        callback(numShown, firstShown, filter);
        return false;
    }).keydown(function() {
        clearTimeout(keyTimeout);
        keyTimeout = setTimeout(function() {
            if( input.val() === lastFilter ) return;
            lastFilter = input.val();
            input.change();
        }, timeout);
    });
    return this;
}