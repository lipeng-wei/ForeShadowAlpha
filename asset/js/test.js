/**
 * Created by lipeng_wei on 15-12-14.
 */


function $(a) {
    return document.getElementById(a);
}
function $tag(b, a) {
    return b.getElementsByTagName(a);
}
function $new(a) {
    return document.createElement(a);
}
function encodeHtml(a) {
    return a.replace(/\&/ig, "&amp;").replace(/\>/ig, "&gt;").replace(/\</ig, "&lt;").replace(/\:/ig, "&#58;").replace(/\'/ig, "&#39;").replace(/\"/ig, "&quot;");
}
function encodeRegExp(a) {
    if (a == undefined) {
        return"";
    }
    a = a.replace(/\$/g, "\\$");
    a = a.replace(/\\/g, "\\\\");
    a = a.replace(/\^/g, "\\^");
    a = a.replace(/\*/g, "\\*");
    a = a.replace(/\?/g, "\\?");
    a = a.replace(/\+/g, "\\+");
    a = a.replace(/\./g, "\\.");
    a = a.replace(/\|/g, "\\|");
    a = a.replace(/\[/g, "\\[");
    a = a.replace(/\]/g, "\\]");
    a = a.replace(/\(/g, "\\(");
    a = a.replace(/\)/g, "\\)");
    a = a.replace(/\{/g, "\\{");
    a = a.replace(/\}/g, "\\}");
    return a;
}
function highlight(c, b) {
    var a = new RegExp("(" + encodeRegExp(b) + ")", "i");
    c = c.replace(a, "####keyword-beg####$1####keyword-end####");
    return encodeHtml(c).replace("####keyword-beg####", '<span style="color:#0066CC; font-weight:bold;">').replace("####keyword-end####", "</span>");
}
function $addClass(a, b) {
    if (!a.className) {
        a.className = b;
        return;
    }
    if ($hasClass(a, b)) {
        return;
    }
    a.className += (" " + b);
}
function $hasClass(b, c) {
    var a = new RegExp(c, "ig");
    if (!b.className) {
        return false;
    }
    return a.test(b.className);
}
function $removeClass(b, c) {
    var a = new RegExp("\\s*" + c, "ig");
    if (!b.className) {
        return;
    }
    b.className = b.className.replace(a, "");
}
function $css(a) {
    for (var c = 0; c < document.styleSheets.length; c++) {
        var d;
        if (document.styleSheets[c].cssRules) {
            d = document.styleSheets[c].cssRules;
        } else {
            d = document.styleSheets[c].rules;
        }
        for (var b = 0; b < d.length; b++) {
            if (d[b].selectorText == a) {
                return d[b].style;
            }
        }
    }
}
var Data = {};
Data.init = function () {
    Data._runtime = {};
    if (Data._favorites) {
        Data._favRoot = Data._favorites.root;
        Data._trashRoot = Data._favorites.trashRoot;
        Data.getRoot = function () {
            return Data._favRoot;
        };
        Data.getTrashRoot = function () {
            return Data._trashRoot;
        };
        Data.getItemById = function (a) {
            return Data._favRoot.getNodeById(a);
        };
        Data.cloneItem = function (b) {
            var a = Data._favorites.createNode(b.type);
            a.title = b.title;
            if (b.type == "ITEM") {
                a.url = b.url;
            }
            return a;
        };
        Data.moveItemList = function (a, b, c) {
            if (b == Data.getTrashRoot().id) {
                ClipboardDemo.clear();
            }
            Data._favorites.moveNodes(c, b, a);
        };
        Data.removeItems = function (a) {
            ClipboardDemo.clear();
            if (a.length == 1) {
                Data._favorites.emptyFolder(a[0]);
            }
            Data._favorites.removeNodes(a);
        };
        Data.clearTrash = function () {
            ClipboardDemo.clear();
            Data._favorites.emptyFolder(Data._trashRoot.id);
        };
        Data.movetoRoot = function (a) {
            Data._favorites.moveNodes("append_as_child", Data._favRoot.id, a);
        };
        Data.sortByTitle = function (a) {
            var b = Data.getItemById(a);
            if (b.type == "FOLDER" || b.type == "ROOT") {
                b.sortNodes();
            }
        };
        Data.sortByVisitCount = function (a) {
            var b = Data.getItemById(a);
            if (b.type == "FOLDER" || b.type == "ROOT") {
                b.sortNodes("VISIT_COUNT_DESC");
            }
        };
        Data.getMostVisited = function () {
            return Data._favorites.getMostVisitNodes(20);
        };
        Data.getRecentVisited = function () {
            return Data._favorites.getLastVisitNodes(20);
        };
        Data.getSearchResult = function (a) {
            return Data._favorites.searchItem(a, "TITLE|URL", Data._favRoot.id);
        };
        Data.showPortDialog = function () {
            Data._favorites.showImportExportDialog();
        };
        Data.updateSiteIcon = function () {
            Data._favorites.showUpdateFaviconDialog();
        };
        Data.showSyncDialog = function () {
            Data._favorites.showSyncDialog(-1);
        };
        Data.addFolder = function (a) {
            Data._favorites.showAddFolderDialog(a);
        };
        Data.addBookmark = function (a) {
            Data._favorites.showAddFavDialog(a);
        };
        Data.editFav = function (a) {
            Data._favorites.showEditDialog(a);
        };
        Data.bindFavEvent = function (a) {
            Data._favorites.onstatechange = a;
        };
        Data.checkFamily = function (d, a) {
            var c = getItemById(d);
            var b = getItemById(a);
            if (!c || !b) {
                return false;
            }
            if (c.id == b.id) {
                return true;
            } else {
                if (b.path.indexOf(c.path) == 0) {
                    while (b.parentNode) {
                        b = b.parentNode;
                        if (c.id == b.id) {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            }
            return false;
        };
        Data.copy = function (c, a, b) {
            Data._favorites.cloneNodesTo(c, a, b);
        };
        Data.isFavManager = function (a, b) {
            if (a == "Mx3MainFrame" && b == "UPDATED") {
                return true;
            }
            return Data._favorites.id == a;
        };
    }
    if (Data._locale) {
        Data.getLang = function (a) {
            return Data._locale[a];
        };
    } else {
        Data._locale = {};
    }
    Data.CopyUrl = function (a) {
        maxthon.system.Utility.copyToClipboard(a);
    };
};
try {
    eval("runtime.import('maxthon.browser.favorites')");
    Data._favorites = runtime.FavManager;
    eval("runtime.import('maxthon.system')");
    Data._lang = runtime.Language;
    Data._locale = Data._lang.load();
    NativeMenu = runtime.NativeMenu;
} catch (e) {
    Data._history = Data._locale = null;
}
var global = {lang: {}, leafIndex: {}, leafs: {}, favIndex: {}, favData: {}, hrIndex: {}, breadcrumb: [], checkedList: [], favBlock: {start: null, end: null}, focus: null, mouseUp: {checked: true, type: -1, menukey: false}, keywords: "", searchTimer: null, searchData: null, version: external.max_version, currentLanguage: "cn", searchResult: 20};
var Lang = {init: function () {
    var a = {Edit: Data.getLang("fav-manager!Edit"), From: Data.getLang("fav-manager!From"), Collapse: Data.getLang("fav-manager!Collapse"), Delete: Data.getLang("fav-manager!Delete"), SortByTitle: Data.getLang("fav-manager!SortByTitle"), SortByVisitCount: Data.getLang("fav-manager!SortByVisitCount"), Expand: Data.getLang("fav-manager!Expand"), Open: Data.getLang("fav-manager!Open"), CopyUrl: Data.getLang("fav-manager!CopyUrl"), Browse: Data.getLang("fav-manager!Browse"), Hide: Data.getLang("fav-manager!Hide"), AddBookmark: Data.getLang("fav-manager!AddBookmark"), AddFolder: Data.getLang("fav-manager!AddFolder"), MostVisited: Data.getLang("fav-manager!MostVisited"), RecentVisited: Data.getLang("fav-manager!RecentVisited"), RootTitle: Data.getLang("fav-manager!RootTitle"), TrashTitle: Data.getLang("fav-manager!TrashTitle"), SearchResult: Data.getLang("fav-manager!SearchResult"), SearchResultMore: Data.getLang("fav-manager!searchResultMore"), Trash: Data.getLang("fav-manager!Trash"), Clear: Data.getLang("fav-manager!Clear"), DeleteConfirm: Data.getLang("fav-manager!DeleteConfirm"), ClearTrash: Data.getLang("fav-manager!ClearTrashConfirm"), Regenerate: Data.getLang("fav-manager!Regenerate"), AllSelect: Data.getLang("fav-manager!AllSelect"), Copy: Data.getLang("fav-manager!Copy"), Cut: Data.getLang("fav-manager!Cut"), Paste: Data.getLang("fav-manager!Paste"), PasteAlarm: Data.getLang("fav-manager!PasteAlarm"), UnDo: Data.getLang("fav-manager!UnDo"), Duplication: Data.getLang("fav-manager!Duplication"), Restore: Data.getLang("fav-manager!Restore")};
    global.lang = a;
}, get: function (a) {
    return global.lang[a] || a;
}};
var Layout = {resize: function () {
    var c = $("wrapper");
    var g = $("header");
    var h = $("content");
    var b = $("sidebar");
    var f = $("main");
    var d = $("folder-tree");
    var j = $("favorite-list");
    var k = $("headerL");
    var a = $("folder-foot");
    c.style.height = window.innerHeight + "px";
    h.style.height = c.offsetHeight - g.offsetHeight + "px";
    f.style.height = c.offsetHeight - g.offsetHeight + "px";
    f.style.width = c.offsetWidth - b.offsetWidth + "px";
    j.style.height = f.offsetHeight - 40 + "px";
    d.style.height = h.offsetHeight - a.offsetHeight - 18 + "px";
    k.style.minWidth = b.offsetWidth + "px";
    global.currentLanguage = (window.external.mxProductType.indexOf("zh-cn") > -1) ? "cn" : "en";
}, scroll: function (g, f, b) {
    if (!b.contains(g)) {
        return;
    }
    var d = b.offsetTop;
    var a = g.offsetTop - d - 30;
    var c = g.offsetTop + 50 - window.innerHeight;
    if (f == "up" && b.scrollTop > a) {
        b.scrollTop = a;
    }
    if (f == "down" && b.scrollTop < c) {
        b.scrollTop = c;
    }
}};
var Resizer = {timer: null, init: function () {
    $("title-resizer").addEventListener("mousedown", Resizer.resizeTitleColumnStart, null);
    $("url-resizer").addEventListener("mousedown", Resizer.resizeUrlColumnStart, null);
    $("favorite-list").onscroll = function (a) {
        $("favorite-list-head").scrollLeft = $("favorite-list").scrollLeft;
    };
}, resizeTitleColumnStart: function (a) {
    Resizer.startX = a.pageX;
    Resizer.startWidth = parseInt(document.defaultView.getComputedStyle($("title-column"), null).getPropertyValue("width"), 10);
    document.addEventListener("selectstart", Resizer.preventEvent, null);
    document.addEventListener("mousemove", Resizer.resizeTitleColumn, null);
    document.addEventListener("mouseup", Resizer.resizeTitleColumnStop, null);
}, resizeTitleColumn: function (c) {
    if (Resizer.timer) {
        clearTimeout(Resizer.timer);
        Resizer.timer = null;
    }
    var a = c.pageX - Resizer.startX;
    var b = Math.max(90, Math.min(Resizer.startWidth + a, 600));
    $("title-column").style.width = b + "px";
    Resizer.timer = setTimeout(function () {
        $css(".favorite-list .title").width = (b - 50) + "px";
        $css(".favorite-list li:not(.hr)").width = (parseInt(document.defaultView.getComputedStyle($("title-column"), null).getPropertyValue("width"), 10) + parseInt(document.defaultView.getComputedStyle($("url-column"), null).getPropertyValue("width"), 10) - 12) + "px";
        $css(".favorite-list .ctrl").left = (b - 20) + "px";
    }, 5);
}, resizeTitleColumnStop: function () {
    document.removeEventListener("mousemove", Resizer.resizeTitleColumn, null);
    document.removeEventListener("mouseup", Resizer.resizeTitleColumnStop, null);
}, resizeUrlColumnStart: function (a) {
    Resizer.startX = a.pageX;
    Resizer.startWidth = parseInt(document.defaultView.getComputedStyle($("url-column"), null).getPropertyValue("width"), 10);
    document.addEventListener("selectstart", Resizer.preventEvent, null);
    document.addEventListener("mousemove", Resizer.resizeUrlColumn, null);
    document.addEventListener("mouseup", Resizer.resizeUrlColumnStop, null);
}, resizeUrlColumn: function (c) {
    if (Resizer.timer) {
        clearTimeout(Resizer.timer);
        Resizer.timer = null;
    }
    var a = c.pageX - Resizer.startX;
    var b = Math.max(90, Math.min(Resizer.startWidth + a, 600));
    $("url-column").style.width = b + "px";
    Resizer.timer = setTimeout(function () {
        $css(".favorite-list .url").width = (b - 32) + "px";
        $css(".favorite-list li:not(.hr)").width = (parseInt(document.defaultView.getComputedStyle($("title-column"), null).getPropertyValue("width"), 10) + parseInt(document.defaultView.getComputedStyle($("url-column"), null).getPropertyValue("width"), 10) - 12) + "px";
    }, 5);
}, resizeUrlColumnStop: function () {
    document.removeEventListener("mousemove", Resizer.resizeUrlColumn, null);
    document.removeEventListener("mouseup", Resizer.resizeUrlColumnStop, null);
}, preventEvent: function (a) {
    a.preventDefault();
    return false;
}};
var Builder = {favList: function (c) {
    var h = CheckedList.get()[0];
    var j = $("favorite-list");
    var b = [];
    global.searchData = null;
    j.innerHTML = "";
    j.removeAttribute("currentId");
    CheckedList.set([]);
    var a = c.length;
    if (a == 0) {
        return;
    }
    j.appendChild(Factory.hr());
    if ($("folder-tree").getAttribute("currentId") == "{SEARCH_RESULT_LIST}") {
        var l = 0;
        for (var d = 0; d < a; d++) {
            var f = c[d];
            if (f.type == "FOLDER") {
                c.splice(d, 1);
                c.splice(l, 0, f);
                l++;
            }
        }
        a = Math.min(global.searchResult, a);
        if (a < c.length) {
            global.searchData = c;
        }
    }
    for (var d = 0; d < a; d++) {
        var f = c[d];
        global.favData[f.id] = f;
        var k;
        if (f.type == "FOLDER" || f.type == "ROOT") {
            k = Factory.folder(f);
        } else {
            k = Factory.bookmark(f);
        }
        j.appendChild(k);
        j.appendChild(Factory.hr());
    }
    if (global.searchData) {
        j.appendChild(Factory.more());
        global.searchData.splice(0, a);
    }
    var g = j.querySelector("li[favid='" + h + "']") || j.querySelector("li[favid]");
    h = g.getAttribute("favid");
    Builder.scrollFavItem(g);
    $addClass(g, "current");
    j.setAttribute("currentId", h);
    FavBlock.start(h);
}, searchMore: function () {
    var b = $("favorite-list");
    if (global.searchData == null || global.searchData.length == 0) {
        return;
    }
    function a() {
        var g = global.searchData;
        var d = global.searchResult;
        if (d > g.length) {
            d = g.length;
        }
        for (i = 0; i < d; i++) {
            var f = g[i];
            global.favData[f.id] = f;
            var c;
            if (f.type == "FOLDER") {
                c = Factory.folder(f);
            } else {
                c = Factory.bookmark(f);
            }
            b.appendChild(c);
            b.appendChild(Factory.hr());
        }
        Index.fav();
        g.splice(0, d);
        if (g.length > 0) {
            global.searchTimer = setTimeout(a, 20);
        }
    }

    global.searchTimer = setTimeout(a, 20);
}, folderTree: function (j, c) {
    j.innerHTML = "";
    var a = c.length;
    if (a == 0) {
        return;
    }
    if (j != $("folder-tree")) {
        j.appendChild(Factory.hr());
    }
    if (j == $("folder-tree") && !$("clear-trash")) {
        var f = $("folder-foot");
        f.appendChild(Factory.trash());
    }
    for (var g = 0; g < a; g++) {
        var h = c[g];
        if (h.type == "FOLDER" || h.type == "ROOT") {
            var k = Factory.leaf(h);
            var b = k.querySelector("button");
            j.appendChild(k);
            global.leafs[h.id] = {title: h.title};
            b.addEventListener("click", function (m) {
                var l = m.currentTarget;
                Builder.expand(this.parentNode.parentNode);
                m.stopPropagation();
            }, false);
            if (j != $("folder-tree")) {
                j.appendChild(Factory.hr());
            }
        }
    }
    if (j == $("folder-tree")) {
        var k = j.lastChild;
        var d = Builder.getSubFolderList(k);
        Builder.folderTree(k.lastChild, d);
        Index.leaf();
    }
}, expand: function (a) {
    var b = Builder.getSubFolderList(a);
    Builder.folderTree(a.lastChild, b);
    Index.leaf();
}, getSubFolderList: function (b) {
    var c = Data.getItemById(b.firstChild.getAttribute("favid"));
    var a = c.childNodes;
    var f = [];
    for (var d = 0; d < a.length; d++) {
        var g = a[d];
        if (g.type == "FOLDER") {
            f.push(g);
        }
    }
    return f;
}, iterateFolder: function (b) {
    var c = [];
    c.push(b);
    while (!global.leafIndex[c[c.length - 1].id]) {
        c.push(c[c.length - 1].parentNode);
    }
    while (c.length > 0) {
        var a = c.pop();
        var d = document.querySelector("#folder-tree [favid='" + a.id + "']");
        if (d && d.parentNode) {
            Builder.expand(d.parentNode);
        }
    }
    return global.leafIndex[b.id];
}, scrollFavItem: function (b) {
    var f = $("favorite-list");
    var c = b.offsetTop;
    var g = c + b.clientHeight;
    var d = f.offsetTop + f.scrollTop;
    var a = d + f.clientHeight;
    if (c > d && c < a && g > d && g < a) {
        return false;
    }
    if (g > a) {
        f.scrollTop += g - a;
    } else {
        if (c < d) {
            f.scrollTop -= d - c;
        }
    }
}};
var Factory = {leaf: function (b) {
    var a = $new("li");
    a.setAttribute("collapsed", "true");
    var f = encodeHtml(b.title);
    if (b.type == "ROOT") {
        f = Lang.get("RootTitle");
        a.setAttribute("collapsed", "false");
    }
    a.innerHTML = '<div class="folder-row"><button class="btn-toggle"></button><span class="title" title="' + f + '"><img alt="favicon" class="favicon" src="' + (b.type == "ROOT" ? "../_images/fav_16.png" : "../_images/folder_16.png") + '" />' + f + '</span></div><ul class="folder-children"></ul>';
    var d = a.firstChild;
    d.setAttribute("favId", b.id);
    var c = (b.countNodes("FOLDER", false) > 0);
    if (b.id != Data.getRoot().id) {
        d.firstChild.onclick = d.ondblclick = function () {
            if (this.nodeName == "DIV" && c && d.nextSibling.querySelectorAll("li").length == 0) {
                Builder.expand(this.parentNode);
            }
            Leaf.toggle(a);
        };
        if (!c) {
            d.firstChild.style.visibility = "hidden";
        }
    }
    d.onclick = function () {
        Leaf.current(d, b);
        Index.hr();
        global.focus = $("sidebar");
        global.focus.focus();
    };
    d.onmousedown = function () {
        event.preventDefault();
        DragSort.checker("folder");
    };
    d.oncontextmenu = function () {
        if (global.mouseUp.menukey == true) {
            Menu.treeCurrent();
            return false;
        }
        Leaf.current(d, b);
        Menu.leaf(d);
        event.stopPropagation();
        return false;
    };
    return a;
}, trash: function () {
    var b = Data.getTrashRoot();
    var a = $new("li");
    var d = Lang.get("TrashTitle");
    if (b.type == "ROOT") {
        d = Lang.get("RootTitle");
    }
    a.innerHTML = '<div class="folder-row" rowtype="trash"><span class="title" title="' + d + '"><img alt="favicon" class="favicon" src="../_images/trash_16.png" />' + d + '<span id="clear-trash" class="clear-trash" onclick="Menu.actionMap[\'clearTrash\'](); event.stopPropagation();" title="' + Lang.get("Clear") + '">' + Lang.get("Clear") + "</span></span></div>";
    var c = a.firstChild;
    c.setAttribute("favId", b.id);
    c.lastChild.onclick = function () {
        Leaf.trash(c, b);
        Index.hr();
        global.focus = $("sidebar");
        global.focus.focus();
    };
    c.lastChild.oncontextmenu = function () {
        Menu.trash(c);
        event.stopPropagation();
        return false;
    };
    return a;
}, folder: function (f) {
    var a = $new("li");
    a.className = "folder";
    var g = encodeHtml(f.title);
    var d = $("folder-tree").getAttribute("specialMode");
    var b = "";
    if (d == "TRASH_LIST") {
        b = 'style="display: none"';
    }
    var c = '<div class="info" title="' + g + '"><img alt="favicon" class="favicon" src="../_images/folder_16.png" /><span class="title">' + g + '</span></div><div class="ctrl" ' + b + '><button class="btn-edit" onclick="Dialog.show(\'folder-dialog\')"></button></div>';
    d = $("folder-tree").getAttribute("currentId");
    if (d == "{SEARCH_RESULT_LIST}") {
        c = '<div class="info" title="' + g + '"><img alt="favicon" class="favicon" src="../_images/folder_16.png" /><span class="title">' + highlight(g, global.keywords) + '</span></div><div class="ctrl" ' + b + '><button class="btn-edit" onclick="Dialog.show(\'folder-dialog\')"></button></div>';
        a.setAttribute("mode", "search-item");
    }
    a.innerHTML = c;
    a.setAttribute("favId", f.id);
    a.ondblclick = function () {
        if (d == "TRASH_LIST") {
            return;
        }
        Leaf.current(null, f);
        Index.hr();
    };
    a.onmousedown = function () {
        Fav.current(a, f);
        event.preventDefault();
        global.focus = $("favorite-list");
        global.focus.focus();
        if (event.button == 2 || event.button == 1) {
            if (event.button == 1 || !CheckedList.contains(f.id)) {
                FavBlock.start(f.id);
                CheckedList.set([f.id]);
            }
            return false;
        }
        if (event.shiftKey) {
            FavBlock.end(f.id);
        } else {
            FavBlock.start(f.id);
            if (CheckedList.contains(f.id)) {
                global.mouseUp.checked = true;
                global.mouseUp.type = event.ctrlKey ? 1 : 0;
            } else {
                if (event.ctrlKey) {
                    CheckedList.toggle(f.id);
                } else {
                    CheckedList.set([f.id]);
                }
            }
        }
        DragSort.checker();
    };
    a.onmouseup = function () {
        if (global.mouseUp.checked) {
            if (global.mouseUp.type == 1) {
                CheckedList.toggle(f.id);
            } else {
                if (global.mouseUp.type == 0) {
                    CheckedList.set([f.id]);
                }
            }
            global.mouseUp.checked = false;
            global.mouseUp.type = -1;
        }
    };
    a.oncontextmenu = function () {
        event.preventDefault();
        if (global.mouseUp.menukey == true) {
            Menu.listCurrent();
            return false;
        }
        if (CheckedList.mixed()) {
            Menu.mixed(a);
        } else {
            Menu.folder(a);
        }
        return false;
    };
    return a;
}, bookmark: function (d) {
    var k = $new("li");
    k.className = "bookmark";
    var j = encodeHtml(d.title);
    var a = encodeHtml(d.url);
    try {
        var g = global.leafs[d.parentId].title;
    } catch (h) {
        var g = Lang.get("RootTitle");
    }
    if (d.parentId == Data.getRoot().id) {
        g = Lang.get("RootTitle");
    }
    g = encodeHtml(g);
    var c = $("folder-tree").getAttribute("specialMode");
    var f = "";
    if (c == "TRASH_LIST") {
        f = 'style="display: none"';
    }
    var b = '<div class="info" title="' + j + '"><img alt="favicon" class="favicon" src="mx://favicon/' + a + '" onerror="this.src=\'../_images/file_16.png\'" /><span class="title"' + (d.mostFav ? ' style="color:red;"' : "") + ">" + j + '</span><span class="url">' + a + '</span></div><div class="ctrl" ' + f + '><button class="btn-edit" onclick="Dialog.show(\'bookmark-dialog\')" title="' + Lang.get("Edit") + '"></button></div>';
    c = $("folder-tree").getAttribute("currentId");
    if (c == "{SEARCH_RESULT_LIST}") {
        b = '<div class="info" title="' + j + '"><img alt="favicon" class="favicon" src="mx://favicon/' + a + '" onerror="this.src=\'../_images/file_16.png\'" /><span class="title"' + (d.mostFav ? ' style="color:red;"' : "") + ">" + highlight(d.title, global.keywords) + '</span><span class="url">' + highlight(d.url, global.keywords) + '</span></div><div class="ctrl" ' + f + '><button class="btn-edit" onclick="Dialog.show(\'bookmark-dialog\')" title="' + Lang.get("Edit") + '"></button></div>';
        k.setAttribute("mode", "search-item");
    }
    k.innerHTML = b;
    k.setAttribute("favId", d.id);
    k.ondblclick = function () {
        Fav.current(k, d);
        Fav.open(d.id);
        FavBlock.start(d.id);
        CheckedList.set([d.id]);
    };
    k.oncontextmenu = function () {
        event.preventDefault();
        if (global.mouseUp.menukey == true) {
            Menu.listCurrent();
            return false;
        }
        if (CheckedList.mixed()) {
            Menu.mixed(k);
        } else {
            Menu.bookmark(k);
        }
        return false;
    };
    k.onmousedown = function () {
        Fav.current(k, d);
        event.preventDefault();
        global.focus = $("favorite-list");
        global.focus.focus();
        if (event.button == 2 || event.button == 1) {
            if (event.button == 1 || !CheckedList.contains(d.id)) {
                FavBlock.start(d.id);
                CheckedList.set([d.id]);
            }
            return false;
        }
        if (event.shiftKey) {
            FavBlock.end(d.id);
        } else {
            FavBlock.start(d.id);
            if (CheckedList.contains(d.id)) {
                global.mouseUp.checked = true;
                global.mouseUp.type = event.ctrlKey ? 1 : 0;
            } else {
                if (event.ctrlKey) {
                    CheckedList.toggle(d.id);
                } else {
                    CheckedList.set([d.id]);
                }
            }
        }
        DragSort.checker();
    };
    k.onmouseup = function () {
        if (global.mouseUp.checked) {
            if (global.mouseUp.type == 1) {
                CheckedList.toggle(d.id);
            } else {
                if (global.mouseUp.type == 0) {
                    CheckedList.set([d.id]);
                }
            }
            global.mouseUp.checked = false;
            global.mouseUp.type = -1;
        }
    };
    return k;
}, hr: function () {
    var a = $new("li");
    a.className = "hr";
    a.innerHTML = '<div class="seprate-line"></div>';
    a.onmousedown = function () {
        event.preventDefault();
        return false;
    };
    a.oncontextmenu = function () {
        event.preventDefault();
        if (global.mouseUp.menukey == true) {
            Menu.listCurrent();
            return false;
        }
        return false;
    };
    return a;
}, more: function () {
    var a = $new("li");
    var b = $new("button");
    a.className = "more";
    b.onclick = function () {
        var c = $("favorite-list");
        c.removeChild(this.parentNode);
        setTimeout(function () {
            Builder.searchMore();
        }, 10);
        return false;
    };
    b.innerHTML = Lang.get("SearchResultMore");
    a.appendChild(b);
    return a;
}};
var Leaf = {toggle: function (a) {
    var g = a.firstChild;
    var f = g.firstChild;
    var d = a.lastChild;
    var b = a.getAttribute("collapsed");
    if (b == "true") {
        a.setAttribute("collapsed", "false");
        f.style.backgroundImage = "url(images/arrow_down.png)";
        d.style.display = "block";
    } else {
        a.setAttribute("collapsed", "true");
        f.style.backgroundImage = "url(images/arrow_right.png)";
        d.style.display = "none";
        var c = g.getAttribute("favId");
        if (c == Data.getRoot().id || global.breadcrumb.indexOf(c) >= 0) {
            Leaf.current(g, Data.getItemById(c));
        } else {
            if (global.breadcrumb.length == 0) {
                $("folder-tree").setAttribute("lastCurrentId", c);
            }
        }
    }
}, current: function (m, c, f) {
    if (m && m.className.match(/current/)) {
        return;
    }
    var j = $("folder-tree");
    var a = j.getAttribute("currentId");
    var l = document.querySelector('#sidebar [favid="' + a + '"]');
    j.setAttribute("currentId", c.id);
    if (global.focus != $("sidebar") && f != "search") {
        global.focus = $("sidebar");
        global.focus.focus();
    }
    if (l) {
        $removeClass(l, "current");
    }
    if (!m) {
        if (!global.leafIndex[c.id]) {
            m = Builder.iterateFolder(c);
        } else {
            m = global.leafIndex[c.id];
        }
    }
    $addClass(m, "current");
    if (c.type == "SPECIAL") {
        var g = [];
        if (c.id == "{MOST_VISITED_LIST}") {
            var h = Data.getMostVisited();
            for (var b = 0; b < h.length; b++) {
                var d = h[b];
                if (d.visitCount > 0) {
                    g.push(d);
                }
            }
            j.setAttribute("lastCurrentId", c.id);
        }
        if (c.id == "{RECENT_VISITED_LIST}") {
            var h = Data.getRecentVisited();
            for (var b = 0; b < h.length; b++) {
                var d = h[b];
                if (d.lastVisit > 0) {
                    g.push(d);
                }
            }
            j.setAttribute("lastCurrentId", c.id);
        }
        if (c.id == "{SEARCH_RESULT_LIST}") {
            g = Data.getSearchResult(c.keywords);
            m.className = "folder-row";
        }
        Builder.favList(g);
        Index.fav();
        global.breadcrumb = [];
        j.setAttribute("specialMode", c.id);
    } else {
        j.removeAttribute("specialMode");
        j.setAttribute("lastCurrentId", c.id);
        Builder.favList(c.childNodes);
        Index.fav();
        Index.breadcrumb(c.id, m);
        for (var b = 1; b < global.breadcrumb.length; b++) {
            var k = global.leafIndex[global.breadcrumb[b]].parentNode;
            if (k.getAttribute("collapsed") == "true") {
                Leaf.toggle(k);
            }
        }
    }
    if (c.id != "{SEARCH_RESULT_LIST}") {
        if (!f) {
            Search.clear();
            global.focus = $("favorite-list");
            global.focus.focus();
        }
    }
    Leaf.scrollFolder(m);
}, trash: function (h, f, c) {
    if (h && h.className.match(/current/)) {
        return;
    }
    var b = $("folder-tree");
    var g = b.getAttribute("currentId");
    var j = global.leafIndex[g];
    b.setAttribute("currentId", f.id);
    if (global.focus != $("sidebar") && c != "search") {
        global.focus = $("sidebar");
        global.focus.focus();
    }
    if (j) {
        $removeClass(j, "current");
    }
    if (!h) {
        h = global.leafIndex[f.id];
    }
    $addClass(h, "current");
    b.setAttribute("specialMode", "TRASH_LIST");
    b.setAttribute("lastCurrentId", f.id);
    Builder.favList(f.childNodes);
    Index.fav();
    Index.breadcrumb(f.id, h);
    for (var d = 1; d < global.breadcrumb.length; d++) {
        var a = global.leafIndex[global.breadcrumb[d]].parentNode;
        if (a.getAttribute("collapsed") == "true") {
            Leaf.toggle(a);
        }
    }
    if (f.id != "{SEARCH_RESULT_LIST}") {
        Search.clear();
        global.focus = $("favorite-list");
        global.focus.focus();
    }
}, scrollFolder: function (b) {
    var f = $("folder-tree");
    var c = b.offsetTop;
    var g = c + b.clientHeight;
    var d = f.offsetTop + f.scrollTop;
    var a = d + f.clientHeight;
    if (c > d && c < a && g > d && g < a) {
        return false;
    }
    if (g > a) {
        f.scrollTop += g - a;
    } else {
        if (c < d) {
            f.scrollTop -= d - c;
        }
    }
}};
var Fav = {current: function (a, c) {
    if (a.className.match(/current/)) {
        return;
    }
    var b = $("favorite-list");
    var d = b.getAttribute("currentId");
    var f = global.favIndex[d];
    b.setAttribute("currentId", c.id);
    if (f) {
        $removeClass(f, "current");
    }
    $addClass(a, "current");
    if (global.focus != b) {
        global.focus = b;
        global.focus.focus();
    }
}, open: function (a) {
    var b = Data.getItemById(a);
    b.visitCount++;
    b.save();
    if (b.type == "ITEM") {
        if (/^[0-9a-zA-Z+-.]+:/.test(b.url)) {
            window.open(b.url);
        } else {
            window.open("http://" + b.url);
        }
        maxthon.browser.UeipService.set2("favorite", "ui", "", "favclick", "favmanager", "", "", "");
    }
}, hide: function (k) {
    var j = k.getAttribute("favId");
    var c = Data.getItemById(j);
    var b = $("folder-tree").getAttribute("currentId");
    if (b == "{MOST_VISITED_LIST}") {
        var a = c.lastVisit;
        c.visitCount = 0;
        c.save();
        c.lastVisit = a;
        c.save();
        var g = [];
        var h = Data.getMostVisited();
        for (var d = 0; d < h.length; d++) {
            var f = h[d];
            if (f.visitCount > 0) {
                g.push(f);
            }
        }
        Builder.favList(g);
        Index.fav();
    }
    if (b == "{RECENT_VISITED_LIST}") {
        c.lastVisit = 0;
        c.save();
        var g = [];
        var h = Data.getRecentVisited();
        for (var d = 0; d < h.length; d++) {
            var f = h[d];
            if (f.lastVisit > 0) {
                g.push(f);
            }
        }
        Builder.favList(g);
        Index.fav();
    }
}};
var Index = {leaf: function () {
    global.leafIndex = {"{MOST_VISITED_LIST}": $("row-most-visited"), "{RECENT_VISITED_LIST}": $("row-recent-visited")};
    var f = $("folder-tree").getElementsByTagName("li");
    var d = f.length;
    for (var c = 0; c < d; c++) {
        var a = f[c];
        if (a.className == "hr") {
            continue;
        }
        var g = a.firstChild;
        if (g) {
            var b = g.getAttribute("favId");
            global.leafIndex[b] = g;
        }
    }
}, fav: function () {
    global.favIndex = {};
    var h = $("favorite-list");
    var g = h.childNodes;
    var b = h.getAttribute("currentId");
    var f = g.length;
    for (var d = 0; d < f; d++) {
        var a = g[d];
        if (a.className == "hr") {
            continue;
        }
        var c = a.getAttribute("favId");
        global.favIndex[c] = a;
        if (a.getAttribute("favId") == b) {
            $addClass(a, "current");
        }
    }
}, hr: function () {
    var c = $("favorite-list").getElementsByTagName("li");
    var d = c.length;
    global.hrIndex = {};
    for (var b = 0; b < d; b++) {
        var a = c[b];
        if (a.className == "hr") {
            continue;
        }
        global.hrIndex[b] = b;
    }
}, breadcrumb: function (a, b) {
    global.breadcrumb = [];
    global.breadcrumb.push(a);
    while (b && b.parentNode.parentNode != $("folder-tree") && !b.getAttribute("rowtype")) {
        b = b.parentNode.parentNode.previousSibling;
        a = b.getAttribute("favId");
        global.breadcrumb.push(a);
    }
}};
var View = {add: function (c, f, g, h) {
    var b = $("folder-tree");
    var m = $("favorite-list");
    var k = global.leafIndex[f];
    var d = b.getAttribute("currentId");
    if (k && (c.type == "FOLDER" || c.type == "ROOT")) {
        Builder.expand(k.parentNode);
        k.firstChild.style.visibility = "";
        k.parentNode.setAttribute("collapsed", false);
        if (global.leafIndex[d]) {
            global.leafIndex[d].className = "folder-row current";
        }
    }
    if (!h && d == f) {
        if (c.type == "FOLDER" || c.type == "ROOT") {
            var l = Factory.folder(c);
        } else {
            var l = Factory.bookmark(c);
        }
        if (m.innerHTML == "") {
            m.appendChild(Factory.hr());
        }
        var a = (m.childNodes.length - 1) / 2;
        if (g > a || g < 0) {
            g = a;
        }
        var j = m.childNodes[g * 2];
        m.insertBefore(l, j);
        m.insertBefore(Factory.hr(), l);
        Index.fav();
        Index.hr();
    }
}, clone: function (d, h) {
    var b = $("folder-tree");
    var n = $("favorite-list");
    var f = b.getAttribute("currentId");
    var k = false;
    var c = f == h ? true : false;
    if (c && n.innerHTML == "") {
        n.appendChild(Factory.hr());
    }
    for (var g = 0, j = d.length; g < j; g++) {
        var a = Data.getItemById(d[g]);
        var m = null;
        if (!k && a.type == "FOLDER") {
            k = true;
        }
        if (!c) {
            continue;
        }
        if (a.type == "FOLDER") {
            m = Factory.folder(a);
        } else {
            m = Factory.bookmark(a);
        }
        n.appendChild(m);
        n.insertBefore(Factory.hr());
    }
    var l = global.leafIndex[h];
    if (k && l) {
        Builder.expand(l.parentNode);
        l.firstChild.style.visibility = "";
        l.parentNode.setAttribute("collapsed", false);
    }
    if (c) {
        Index.fav();
        Index.hr();
    }
}, move: function (k, b, a, g) {
    var x = CheckedList.get() || ClipboardDemo.get();
    var m = $("folder-tree");
    var q = $("favorite-list");
    var j = Data.getItemById(b);
    var h = (a == "insert_before") ? j.parentNode : j;
    var s = m.getAttribute("currentid");
    if (!global.leafIndex[h.id] && h.id != Data.getTrashRoot().id) {
        Builder.iterateFolder(h);
    }
    var z = global.favIndex[b];
    var n = global.leafIndex[j.id];
    var d = null;
    var o = null;
    var v = [];
    var t = a;
    var l = true;
    for (var r = 0, u = k.length; r < u; r++) {
        if (Data.getItemById(k[r]).type == "FOLDER") {
            v.push(k[r]);
        }
    }
    if (!n && v.length) {
        if (h.id != g) {
            t = "append_as_child";
            n = global.leafIndex[h.id];
        } else {
            var w = j;
            while (!n) {
                var w = w.nextSibling;
                if (!w) {
                    break;
                }
                if (w.type != "FOLDER") {
                    continue;
                }
                n = global.leafIndex[w.id];
            }
        }
    }
    if (t == "insert_before" && n && v.indexOf(n.getAttribute("favid")) > -1) {
        n = null;
    }
    if (j.id == Data.getTrashRoot().id || (v.length && n)) {
        if (g != Data.getTrashRoot().id && global.leafIndex[g]) {
            var p = global.leafIndex[g].nextSibling;
            if (p.querySelectorAll("li > div[favid]").length > v.length) {
                l = false;
            }
            for (var r = 0, u = v.length; r < u; r++) {
                o = global.leafIndex[v[r]];
                if (o) {
                    var c = o.parentNode.previousSibling;
                    var f = o.parentNode;
                    p.removeChild(c);
                    p.removeChild(f);
                }
            }
            if (!p.querySelector("[favid]")) {
                p.innerHTML = "";
            }
        }
        if (h.type != "TRASH_ROOT") {
            var B = global.leafIndex[h.id].nextSibling;
            var y = n.parentNode;
            for (var r = 0, u = v.length; r < u; r++) {
                o = global.leafIndex[v[r]];
                var f = o ? o.parentNode : Factory.leaf(Data.getItemById(v[r]));
                if (t == "insert_before" && n != o) {
                    B.insertBefore(f, y);
                    B.insertBefore(Factory.hr(), y);
                } else {
                    if (g != h.id && r == 0) {
                        Builder.expand(B.parentNode);
                    }
                    if (B.innerHTML == "") {
                        B.appendChild(Factory.hr());
                        B.previousSibling.firstChild.style.visibility = "visible";
                    }
                    B.appendChild(f);
                    B.appendChild(Factory.hr());
                }
            }
        }
        if (g != Data.getTrashRoot().id && global.leafIndex[g]) {
            var p = global.leafIndex[g].nextSibling;
            if (!p.querySelector("[favid]") && l) {
                p.previousSibling.firstChild.style.visibility = "hidden";
            }
        }
    }
    if (h.type == "TRASH_ROOT" || z || x.length || g == s || h.id == s) {
        for (var r = 0, u = k.length; r < u; r++) {
            d = global.favIndex[k[r]];
            if (d) {
                var c = d.previousSibling;
                q.removeChild(c);
                q.removeChild(d);
            } else {
                var A = Data.getItemById(k[r]);
                if (A.type == "FOLDER") {
                    d = Factory.folder(A);
                } else {
                    d = Factory.bookmark(A);
                }
            }
            if (h.id == g || (z && a == "insert_before") || (h.id != g && h.id == s)) {
                if (a == "insert_before") {
                    q.insertBefore(d, z);
                    q.insertBefore(Factory.hr(), z);
                } else {
                    if (q.innerHTML == "") {
                        q.appendChild(Factory.hr());
                    }
                    q.appendChild(d);
                    q.appendChild(Factory.hr());
                }
            }
        }
    }
    Index.leaf();
    Index.fav();
    Index.hr();
}, edit: function (c) {
    var a = global.leafIndex[c.id];
    var d = global.favIndex[c.id];
    if (a) {
        a.lastChild.lastChild.nodeValue = c.title;
        a.firstChild.nextSibling.setAttribute("title", c.title);
        Index.leaf();
    }
    if (d) {
        if (c.type == "FOLDER" || c.type == "ROOT") {
            d.firstChild.lastChild.innerText = c.title;
        } else {
            d.firstChild.lastChild.previousSibling.innerText = c.title;
            if (c.mostFav) {
                d.firstChild.lastChild.previousSibling.style.color = "red";
            } else {
                d.firstChild.lastChild.previousSibling.style.color = null;
            }
            d.firstChild.lastChild.innerText = d.firstChild.lastChild.href = c.url;
            var b = $("folder-tree").getAttribute("currentId");
            if (b == "{SEARCH_RESULT_LIST}") {
                d.firstChild.firstChild.nextSibling.innerHTML = highlight(c.title, global.keywords);
            }
        }
        d.firstChild.setAttribute("title", c.title);
        Index.fav();
    }
}, remove: function (b) {
    var a = global.leafIndex[b];
    if (a || b == Data.getTrashRoot().id) {
        var c = Data.getItemById(b);
        if (b != Data.getTrashRoot().id) {
            Leaf.current(a, c, true);
            Builder.expand(a.parentNode);
            if (!a.parentNode.lastChild.querySelector("[favid]")) {
                a.firstChild.style.visibility = "hidden";
            }
        }
        Builder.favList(c.childNodes);
        Index.leaf();
        Index.fav();
        Index.hr();
    }
}, cut: function (c, d) {
    d = d || "L";
    View.clearCut();
    for (var b = 0; b < c.length; b++) {
        var a = d == "L" ? global.leafIndex[c[b]].parentNode : global.favIndex[c[b]];
        $addClass(a, "cut");
    }
}, clearCut: function () {
    var c = document.querySelectorAll(".cut");
    for (var b = 0; b < c.length; b++) {
        var a = c[b];
        $removeClass(a, "cut");
    }
}};
var Search = {focus: function () {
    global.focus = $("keywords");
}, blur: function () {
    var a = $("keywords").value;
    var b = a.match(/^$/);
}, prepare: function () {
    if (event.keyCode == 13) {
        Search.doSearch();
    } else {
        var a = $("keywords").value;
        var b = a.match(/^$/);
        if (global.searchTimer) {
            clearTimeout(global.searchTimer);
        }
        global.searchTimer = setTimeout(function () {
            if ($("keywords").value == a) {
                Search.doSearch();
            }
        }, 500);
    }
}, doSearch: function () {
    var b = $("keywords").value;
    b = b.replace(/^\s*/, "").replace(/\s*$/, "");
    if (b == global.keywords) {
        return;
    }
    global.keywords = b;
    if (b == "") {
        var d = $("folder-tree").getAttribute("lastCurrentId");
        var a, c;
        a = global.leafIndex[d];
        if (d == "{MOST_VISITED_LIST}") {
            c = {id: "{MOST_VISITED_LIST}", type: "SPECIAL", title: Lang.get("MostVisited")};
        } else {
            if (d == "{RECENT_VISITED_LIST}") {
                c = {id: "{RECENT_VISITED_LIST}", type: "SPECIAL", title: Lang.get("RecentVisited")};
            } else {
                c = Data.getItemById(d);
            }
        }
        if (!a) {
            a = $("folder-tree").firstChild.firstChild;
            c = Data.getRoot();
        }
    } else {
        var a = $("row-search-result");
        c = {id: "{SEARCH_RESULT_LIST}", type: "SPECIAL", title: Lang.get("SearchResult"), keywords: b};
    }
    Leaf.current(a, c, "search");
}, clear: function () {
    if (global.searchTimer) {
        clearTimeout(global.searchTimer);
    }
    $("keywords").value = "";
    Search.doSearch();
    global.focus = $("keywords");
    $("keywords").focus();
}};
var Menu = {actionMap: {collapse: function (a, b) {
    Leaf.toggle(a.parentNode);
}, expand: function (a, b) {
    Leaf.toggle(a.parentNode);
}, edit: function (a, b) {
    Data.editFav(b.id);
}, "delete": function (f, j) {
    var a = $("folder-tree");
    var b = $("favorite-list");
    var h = a.getAttribute("specialMode");
    if (event.shiftKey || h == "TRASH_LIST") {
        if (confirm(Lang.get("DeleteConfirm"))) {
            Data.removeItems([j.id]);
        }
    } else {
        if (confirm(Lang.get("Trash"))) {
            var c = Data.getItemById(j.id).parentNode.id;
            var g = [j.id];
            var d = Data.getTrashRoot().id;
            View.move(g, d, "append_as_child", c);
            Data.moveItemList(g, d, "append_as_child");
        }
    }
    if (f.getAttribute("favid") == a.getAttribute("currentid")) {
        b.innerHTML = "";
    }
}, clearTrash: function () {
    if (confirm(Lang.get("ClearTrash"))) {
        Data.clearTrash();
    }
}, moveToRoot: function (f, h) {
    var g = CheckedList.get();
    var d = g.length;
    var c = [];
    for (var b = 0; b < d; b++) {
        var a = g[b];
        c.push(a);
    }
    View.move(c, Data.getRoot().id, "append_as_child", Data.getTrashRoot().id);
    Data.movetoRoot(c);
}, moveCheckedToRoot: function () {
    var a = CheckedList.get();
    View.move(a, Data.getRoot().id, "append_as_child", Data.getTrashRoot().id);
    Data.movetoRoot(a);
}, trashToRoot: function () {
    var a = Data._trashRoot.childNodes;
    var c = [];
    for (var b = 0; b < a.length; b++) {
        c.push(a[b].id);
    }
    View.move(c, Data.getRoot().id, "append_as_child", Data.getTrashRoot().id);
    Data.movetoRoot(c);
}, deleteChecked: function (d, h) {
    var g = $("folder-tree").getAttribute("specialMode");
    var f = CheckedList.get();
    var c = f.length;
    var b = Data.getTrashRoot().id;
    if (event.shiftKey || g == "TRASH_LIST") {
        if (confirm(Lang.get("DeleteConfirm"))) {
            Data.removeItems(f);
        }
    } else {
        if (confirm(Lang.get("Trash"))) {
            var a = Data.getItemById(f[0]).parentNode.id;
            View.move(f, b, "append_as_child", a);
            Data.moveItemList(f, b, "append_as_child");
        }
    }
}, sort: function (a, b) {
    Data.sortByTitle(b.id);
}, sortByVisitCount: function (a, b) {
    Data.sortByVisitCount(b.id);
}, browse: function (b, c) {
    if (c.type == "ITEM") {
        c = c.parentNode;
    }
    var a = global.leafIndex[c.id];
    Leaf.current(a, c);
}, open: function (a, b) {
    Fav.open(b.id);
}, openChecked: function (d, g) {
    var f = CheckedList.get();
    var c = f.length;
    for (var b = 0; b < c; b++) {
        var a = f[b];
        Fav.open(a);
    }
}, CopyUrl: function (a, b) {
    Data.CopyUrl(b.url);
}, hide: function (a, b) {
    Fav.hide(a);
}, newbookmark: function (a, b) {
    if (!b) {
        b = Data.getRoot();
    }
    Data.addBookmark(b.id);
}, newfolder: function (a, b) {
    if (!b) {
        b = Data.getRoot();
    }
    Data.addFolder(b.id);
}, copy: function () {
    var a = CheckedList.get();
    if (a.length == 0) {
        a = $("folder-tree").getAttribute("specialMode") ? [] : [$("folder-tree").getAttribute("currentid")];
    }
    ClipboardDemo.copy(a);
}, cut: function () {
    var b = CheckedList.get();
    var a = "L";
    if (b.length > 0) {
        a = "R";
    } else {
        b = $("folder-tree").getAttribute("specialMode") ? [] : [$("folder-tree").getAttribute("currentid")];
    }
    ClipboardDemo.cut(b);
    View.cut(b, a);
}, paste: function () {
    var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
    var b = $("folder-tree").getAttribute("currentId");
    if (a[b]) {
        return false;
    }
    ClipboardDemo.paste(b);
    View.clearCut();
}, allselect: function () {
    var c = null;
    var b = [];
    c = document.querySelectorAll("#favorite-list li:not(.hr):not(.more)");
    for (var d = 0, a = c.length; d < a; d++) {
        b.push(c[d].getAttribute("favid"));
    }
    CheckedList.set(b);
}}, headerMoreMenu: function () {
    var c = [
        {id: "updateIcon", label: Data.getLang("fav-manager!UpdateSiteIcon")},
        {id: "importExport", label: Data.getLang("fav-manager!Port")}
    ];
    c.push({id: "sync", label: Data.getLang("fav-manager!Sync")});
    if (maxthon.browser.config.ConfigManager.currentUser != "guest") {
        c.push({id: "recover", label: Data.getLang("fav-manager!Recover")});
    }
    var a = $("menu-more");
    var d = {x: a.offsetLeft, y: a.offsetTop + a.offsetHeight};
    var b = NativeMenu.popup(d.x, d.y, c);
    if (!b) {
        return;
    }
    switch (b) {
        case"updateIcon":
            Data.updateSiteIcon();
            break;
        case"importExport":
            Data.showPortDialog();
            break;
        case"sync":
            if (maxthon.browser.config.ConfigManager.currentUser != "guest") {
                Data.showSyncDialog();
            } else {
                maxthon.account.AccountService.showLoginPromptDialog(3);
            }
            break;
        case"recover":
            window.open(mx.config.getServer("browser_svc_fav_recover"), "_blank");
            break;
        default:
            alert(b);
    }
}, trash: function (j) {
    var k = $("folder-tree");
    var d = j.getAttribute("favId");
    var c = Data.getItemById(d);
    var f = j.parentNode;
    var a = (c.countNodes("FOLDER", false) > 0);
    var b = [
        {id: "clearTrash", label: Lang.get("Clear")},
        {id: "trashToRoot", label: Lang.get("Regenerate")}
    ];
    var g = Menu.getPosition(f, true);
    var h = Menu.actionMap[NativeMenu.popup(g.x, g.y, b)];
    if (h) {
        h.call(Menu, j, c);
    }
}, leaf: function (j) {
    var k = $("folder-tree");
    var d = j.getAttribute("favId");
    var c = Data.getItemById(d);
    var f = j.parentNode;
    var a = (c.countNodes("FOLDER", false) > 0);
    var b = [
        {id: "collapse", label: Lang.get("Collapse")},
        {type: "separator"},
        {id: "edit", label: Lang.get("Edit")},
        {id: "delete", label: Lang.get("Delete")},
        {type: "separator"},
        {id: "sortByVisitCount", label: Lang.get("SortByVisitCount")},
        {id: "sort", label: Lang.get("SortByTitle")},
        {type: "separator"},
        {id: "copy", label: Lang.get("Copy")},
        {id: "cut", label: Lang.get("Cut")},
        {id: "paste", label: Lang.get("Paste")},
        {id: "allselect", label: Lang.get("AllSelect")}
    ];
    if (d == Data.getRoot().id) {
        b[0].disabled = true;
        b[2].disabled = true;
        b[3].disabled = true;
        b[8].disabled = true;
        b[9].disabled = true;
    } else {
        if (!a) {
            b[0].disabled = true;
        }
        if (f.getAttribute("collapsed") == "true") {
            b[0].id = "expand";
            b[0].label = Lang.get("Expand");
        }
    }
    if (!ClipboardDemo.isDisabledPaste()) {
        b[10].disabled = true;
    }
    var g = Menu.getPosition(f, true);
    var h = Menu.actionMap[NativeMenu.popup(g.x, g.y, b)];
    if (h) {
        h.call(Menu, j, c);
    }
}, folder: function (g) {
    var f = $("favorite-list");
    var d = g.getAttribute("favId");
    var c = Data.getItemById(d);
    var b = [
        {id: "browse", label: Lang.get("Open")},
        {type: "separator"},
        {id: "edit", label: Lang.get("Edit")},
        {id: "moveToRoot", label: Lang.get("Regenerate"), visible: false},
        {id: "delete", label: Lang.get("Delete")},
        {type: "separator"},
        {id: "sortByVisitCount", label: Lang.get("SortByVisitCount")},
        {id: "sort", label: Lang.get("SortByTitle")},
        {type: "separator"},
        {id: "copy", label: Lang.get("Copy")},
        {id: "cut", label: Lang.get("Cut")},
        {id: "paste", label: Lang.get("Paste")},
        {id: "allselect", label: Lang.get("AllSelect")}
    ];
    var k = CheckedList.get();
    if (k.length > 1) {
        b[0].disabled = true;
        b[2].disabled = true;
        b[4].id = "deleteChecked";
        b[6].disabled = true;
        b[7].disabled = true;
    }
    var a = $("folder-tree").getAttribute("specialMode");
    if (a == "TRASH_LIST") {
        b[0].visible = false;
        b[1].visible = false;
        b[2].visible = false;
        b[3].visible = true;
        b[5].visible = false;
        b[6].visible = false;
        b[7].visible = false;
    }
    if (!ClipboardDemo.isDisabledPaste()) {
        b[11].disabled = true;
    }
    var h = Menu.getPosition(g, false);
    var j = Menu.actionMap[NativeMenu.popup(h.x, h.y, b)];
    if (j) {
        j.call(Menu, g, c);
    }
}, bookmark: function (g) {
    var f = $("favorite-list");
    var d = g.getAttribute("favId");
    var c = Data.getItemById(d);
    var b = [
        {id: "open", label: Lang.get("Open")},
        {type: "separator"},
        {id: "CopyUrl", label: Lang.get("CopyUrl")},
        {type: "separator"},
        {id: "edit", label: Lang.get("Edit")},
        {id: "moveToRoot", label: Lang.get("Regenerate"), visible: false},
        {id: "delete", label: Lang.get("Delete")},
        {type: "separator", visible: false},
        {id: "browse", label: Lang.get("Browse"), visible: false},
        {type: "separator"},
        {id: "copy", label: Lang.get("Copy")},
        {id: "cut", label: Lang.get("Cut")},
        {id: "allselect", label: Lang.get("AllSelect")}
    ];
    var k = CheckedList.get();
    if (k.length > 1) {
        b[0].id = "openChecked";
        b[2].disabled = true;
        b[4].disabled = true;
        b[6].id = "deleteChecked";
    }
    var l = $("folder-tree").getAttribute("specialMode");
    if (l == "{SEARCH_RESULT_LIST}") {
        b[7].visible = true;
        b[8].visible = true;
    }
    var a = $("folder-tree").getAttribute("specialMode");
    if (a == "TRASH_LIST") {
        b[4].visible = false;
        b[5].visible = true;
    }
    var h = Menu.getPosition(g, false);
    var j = Menu.actionMap[NativeMenu.popup(h.x, h.y, b)];
    if (j) {
        j.call(Menu, g, c);
    }
}, mixed: function (f) {
    var d = f.getAttribute("favId");
    var c = Data.getItemById(d);
    var b = [
        {id: "open", label: Lang.get("Open")},
        {type: "separator"},
        {id: "edit", label: Lang.get("Edit")},
        {id: "moveToRoot", label: Lang.get("Regenerate"), visible: false},
        {id: "delete", label: Lang.get("Delete")},
        {type: "separator", visible: false},
        {id: "browse", label: Lang.get("Browse"), visible: false},
        {id: "hide", label: Lang.get("Hide"), visible: false},
        {type: "separator"},
        {id: "copy", label: Lang.get("Copy")},
        {id: "cut", label: Lang.get("Cut")},
        {id: "allselect", label: Lang.get("AllSelect")}
    ];
    var j = CheckedList.get();
    if (j.length > 1) {
        b[0].disabled = true;
        b[2].disabled = true;
        b[3].id = "moveCheckedToRoot";
        b[4].id = "deleteChecked";
    }
    var k = $("folder-tree").getAttribute("specialMode");
    if (k == "{SEARCH_RESULT_LIST}") {
        b[5].visible = true;
        b[6].visible = true;
        if (k != "{SEARCH_RESULT_LIST}") {
            b[7].visible = true;
        }
    }
    var a = $("folder-tree").getAttribute("specialMode");
    if (a == "TRASH_LIST") {
        b[0].visible = false;
        b[1].visible = false;
        b[2].visible = false;
        b[3].visible = true;
    }
    var g = Menu.getPosition(f, false);
    var h = Menu.actionMap[NativeMenu.popup(g.x, g.y, b)];
    if (h) {
        h.call(Menu, f, c);
    }
}, listCurrent: function () {
    var b = $("favorite-list");
    var c = b.getAttribute("currentId");
    var a = global.favIndex[c];
    if ((b.offsetTop + b.scrollTop) > (a.offsetTop + a.offsetHeight)) {
        return false;
    }
    if (CheckedList.get().length > 1) {
        Menu.mixed(a);
        return false;
    }
    if (a.className.indexOf("bookmark") > -1) {
        Menu.bookmark(a);
    } else {
        Menu.folder(a);
    }
    return false;
}, treeCurrent: function () {
    var a = $("folder-tree");
    var b = a.getAttribute("currentId");
    var c = global.leafIndex[b];
    if (b == "{MOST_VISITED_LIST}" || b == "{RECENT_VISITED_LIST}") {
        return;
    } else {
        if (b == Data.getTrashRoot().id) {
            Menu.trash(c);
        } else {
            Menu.leaf(c);
        }
    }
}, blank: function () {
    var c = $("folder-tree").getAttribute("currentId");
    var b = Data.getItemById(c);
    var f = [
        {id: "newbookmark", label: Lang.get("AddBookmark")},
        {id: "newfolder", label: Lang.get("AddFolder")}
    ];
    var a = $("folder-tree").getAttribute("specialMode");
    if (a) {
        f[0].disabled = true;
        f[1].disabled = true;
    }
    var g = Menu.getPosition(null, false);
    var d = Menu.actionMap[NativeMenu.popup(g.x, g.y, f)];
    if (d) {
        d.call(Menu, null, b);
    }
}, blockTree: function () {
    var c = $("folder-tree").getAttribute("currentId");
    var b = Data.getItemById(c);
    var f = [
        {id: "newfolder", label: Lang.get("AddFolder")}
    ];
    var a = $("folder-tree").getAttribute("specialMode");
    if (a) {
        b = Data.getRoot();
    }
    var g = Menu.getPosition(null, false);
    var d = Menu.actionMap[NativeMenu.popup(g.x, g.y, f)];
    if (d) {
        d.call(Menu, null, b);
    }
}, getPosition: function (b, a) {
    var c = a ? $("folder-tree") : $("favorite-list");
    var d = a ? b.firstChild : b;
    if (global.mouseUp.menukey == true && b) {
        return{x: b.offsetLeft + 20, y: b.offsetTop - c.scrollTop + d.offsetHeight - 10};
    } else {
        return{x: event.clientX + document.body.scrollLeft, y: event.clientY + document.body.scrollTop};
    }
}};
var Dialog = {show: function (a, c) {
    var b = "";
    if (global.focus.id == "sidebar") {
        b = $("folder-tree").getAttribute("currentId");
    } else {
        b = $("favorite-list").getAttribute("currentId");
    }
    if (a == "folder-dialog") {
        Data.editFav(b);
    }
    if (a == "bookmark-dialog") {
        Data.editFav(b);
    }
    if (a == "confirm-dialog") {
        Data.removeItems([b]);
    }
}};
var CheckedList = {refresh: function () {
    var a = CheckedList.get();
    CheckedList.set(a);
}, get: function () {
    return global.checkedList;
}, set: function (f) {
    var g = global.checkedList;
    var d = [];
    for (var c = 0; c < g.length; c++) {
        var b = g[c];
        var a = global.favIndex[b];
        if (a) {
            $removeClass(a, "checked");
        }
    }
    for (var c = 0; c < f.length; c++) {
        var b = f[c];
        var a = global.favIndex[b];
        if (a) {
            $addClass(a, "checked");
            d.push(b);
        }
    }
    global.checkedList = d;
}, contains: function (a) {
    var b = global.checkedList;
    return b.indexOf(a) >= 0;
}, toggle: function (a) {
    if (CheckedList.contains(a)) {
        CheckedList.remove(a);
    } else {
        CheckedList.add(a);
    }
}, add: function (b) {
    var d = global.checkedList;
    var c = d.indexOf(b);
    if (c < 0) {
        global.checkedList.push(b);
    }
    var a = global.favIndex[b];
    if (a) {
        $addClass(a, "checked");
    }
}, remove: function (b) {
    var d = global.checkedList;
    var c = d.indexOf(b);
    if (c >= 0) {
        d.splice(c, 1);
    }
    var a = global.favIndex[b];
    if (a) {
        $removeClass(a, "checked");
    }
}, mixed: function () {
    var d = global.checkedList;
    if (d.length > 1) {
        for (var c = 0; c < d.length; c++) {
            var b = d[c];
            var a = global.favIndex[b];
            if (a.className.indexOf("folder") >= 0) {
                return true;
            }
        }
    }
    return false;
}};
var FavBlock = {start: function (a) {
    var b = global.favBlock;
    b.start = a;
    b.end = null;
}, end: function (f) {
    var k = global.favIndex;
    var d = global.favBlock;
    d.end = f;
    var a = k[d.start];
    var b = k[d.end];
    if (a && b) {
        var h = [];
        var m = Data.getItemById(d.start).index;
        var g = Data.getItemById(d.end).index;
        var l = m < g ? a : b;
        var c = m > g ? a : b;
        while (l && l != c) {
            var j = l.getAttribute("favId");
            if (j) {
                h.push(j);
            }
            l = l.nextSibling;
        }
        var j = l.getAttribute("favId");
        if (j) {
            h.push(j);
        }
        CheckedList.set(h);
    }
}};
var Hotkeys = {keydown: function () {
    global.mouseUp.menukey = false;
    var b = event.keyCode;
    if (b == 93 || b == 121) {
        global.mouseUp.menukey = true;
    }
    var a = Hotkeys["_down" + b];
    if (a) {
        return a();
    }
}, keyup: function () {
    var b = event.keyCode;
    var a = Hotkeys["_up" + b];
    if (a) {
        return a();
    }
}, contextmenu: function () {
    if (global.mouseUp.menukey == true) {
        return false;
    }
}, _down37: function () {
    var d = global.focus;
    if (d.id == "sidebar") {
        d = $("folder-tree");
        var b = d.getAttribute("currentId");
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        if (a[b] || b == Data.getRoot().id) {
            return true;
        }
        var c = global.leafIndex[b];
        var j = Data.getItemById(b);
        if (c.parentNode.getAttribute("collapsed") != "true" && j.countNodes("FOLDER", false) > 0) {
            Leaf.toggle(c.parentNode);
        } else {
            var g = j.parentNode;
            var f = g.id;
            var h = global.leafIndex[f];
            Leaf.current(h, g, true);
            Layout.scroll(h, "up", d);
        }
    }
    return true;
}, _down39: function () {
    var f = global.focus;
    if (f.id == "sidebar") {
        f = $("folder-tree");
        var b = f.getAttribute("currentId");
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        if (a[b]) {
            return;
        }
        var d = global.leafIndex[b];
        var g = Data.getItemById(b);
        if (g.countNodes("FOLDER", false) == 0) {
            return true;
        }
        if (d.parentNode.getAttribute("collapsed") == "true" && b != Data.getRoot().id) {
            Leaf.toggle(d.parentNode);
        } else {
            var j = d.nextSibling.firstChild.nextSibling.firstChild;
            var c = j.getAttribute("favId");
            var h = Data.getItemById(c);
            Leaf.current(j, h, true);
            Layout.scroll(j, "down", f);
        }
    }
    return true;
}, _down38: function () {
    var r = global.focus;
    if (r.id == "favorite-list" || r.id == "keywords") {
        r = $("favorite-list");
        var m = r.getAttribute("currentId");
        var h = global.favIndex[m];
        var b = null;
        if (r.childNodes.length == 3) {
            b = h;
        } else {
            b = h.previousSibling.previousSibling;
        }
        if (b) {
            var d = b.getAttribute("favId");
            var p = Data.getItemById(d);
            Fav.current(b, p);
            Layout.scroll(b, "up", r);
            if (event.shiftKey) {
                FavBlock.end(d);
            } else {
                FavBlock.start(d);
                if (!event.ctrlKey) {
                    CheckedList.set([d]);
                }
            }
        }
    }
    if (r.id == "sidebar") {
        r = $("folder-tree");
        var j = r.getAttribute("currentId");
        var s = {"{MOST_VISITED_LIST}": {id: "{MOST_VISITED_LIST}", type: "SPECIAL", title: Lang.get("MostVisited")}, "{RECENT_VISITED_LIST}": {id: "{RECENT_VISITED_LIST}", type: "SPECIAL", title: Lang.get("RecentVisited")}, "{SEATCH_RESULT_LIST}": {}};
        var a = $("folder-tree").getElementsByTagName("div");
        var c = [];
        for (var f = 0; f < a.length; f++) {
            c.push(a[f]);
        }
        var g = null;
        var o = "";
        var n = null;
        if (!s[j] && j != Data.getRoot().id) {
            var l = global.leafIndex[j];
            var q = Data.getItemById(j);
            var k = c.indexOf(l);
            g = c[k - 1];
            while (!g.offsetHeight) {
                g = g.parentNode.parentNode.previousSibling;
            }
            o = g.getAttribute("favId");
            n = Data.getItemById(o);
        } else {
            if (j == Data.getRoot().id) {
                g = $("row-recent-visited");
                n = s["{RECENT_VISITED_LIST}"];
            } else {
                if (j == "{RECENT_VISITED_LIST}") {
                    g = $("row-most-visited");
                    n = s["{MOST_VISITED_LIST}"];
                }
            }
        }
        if (g && n) {
            Leaf.current(g, n, true);
            Layout.scroll(g, "up", r);
        }
    }
    return false;
}, _down40: function () {
    var o = global.focus;
    if (o.id == "favorite-list" || o.id == "keywords") {
        o = $("favorite-list");
        var f = o.getAttribute("currentId");
        var b = global.favIndex[f];
        var l = null;
        if (o.childNodes.length == 3) {
            l = b;
        } else {
            l = b.nextSibling.nextSibling;
        }
        if (l) {
            var m = l.getAttribute("favId");
            var h = Data.getItemById(m);
            Fav.current(l, h);
            Layout.scroll(l, "down", o);
            if (event.shiftKey) {
                FavBlock.end(m);
            } else {
                FavBlock.start(m);
                if (!event.ctrlKey) {
                    CheckedList.set([m]);
                }
            }
        }
    }
    if (o.id == "sidebar") {
        o = $("folder-tree");
        var a = o.getAttribute("currentId");
        var k = {"{MOST_VISITED_LIST}": {id: "{MOST_VISITED_LIST}", type: "SPECIAL", title: Lang.get("MostVisited")}, "{RECENT_VISITED_LIST}": {id: "{RECENT_VISITED_LIST}", type: "SPECIAL", title: Lang.get("RecentVisited")}, "{SEATCH_RESULT_LIST}": {}};
        var j = $("folder-tree").getElementsByTagName("div");
        var r = [];
        for (var q = 0; q < j.length; q++) {
            r.push(j[q]);
        }
        var c = null;
        var p = "";
        var g = null;
        if (!k[a]) {
            var s = global.leafIndex[a];
            var t = Data.getItemById(a);
            var d = r.indexOf(s);
            if (d < r.length - 1) {
                c = r[d + 1];
            }
            while (c && !c.offsetHeight) {
                var n = r[d].nextSibling.getElementsByTagName("div").length + 1;
                if ((d + n) < (r.length - 1)) {
                    c = r[d + n];
                } else {
                    break;
                }
            }
            if (c) {
                p = c.getAttribute("favId");
                g = Data.getItemById(p);
            }
        } else {
            if (a == "{SEARCH_RESULT_LIST}") {
                c = $("row-most-visited");
                g = k["{MOST_VISITED_LIST}"];
            } else {
                if (a == "{MOST_VISITED_LIST}") {
                    c = $("row-recent-visited");
                    g = k["{RECENT_VISITED_LIST}"];
                } else {
                    if (a == "{RECENT_VISITED_LIST}") {
                        c = r[0];
                        g = Data.getRoot();
                    }
                }
            }
        }
        if (c && g) {
            Leaf.current(c, g, true);
            Layout.scroll(c, "down", o);
        }
    }
    return false;
}, _up9: function () {
    global.focus = event.target;
    return true;
}, _down32: function () {
    var a = global.focus;
    if (a.id == "favorite-list") {
        a = $("favorite-list");
        var b = a.getAttribute("currentId");
        if (!CheckedList.contains(b)) {
            CheckedList.add(b);
        } else {
            CheckedList.remove(b);
        }
        return false;
    }
}, _down13: function () {
    var d = global.focus;
    if (d.id == "favorite-list" || d.id == "keywords") {
        var g = CheckedList.get();
        if (g.length == 1) {
            var h = global.favIndex[g[0]];
            h.ondblclick();
        }
    }
    if (d.id == "sidebar") {
        d = $("folder-tree");
        var b = d.getAttribute("currentId");
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        if (a[b]) {
            return;
        }
        var c = global.leafIndex[b];
        var f = Data.getItemById(b);
        if (f.countNodes("FOLDER", false) == 0) {
            return true;
        }
        if (c.parentNode.getAttribute("collapsed") == "true" && b != Data.getRoot().id) {
            Leaf.toggle(c.parentNode);
        }
    }
    return true;
}, _down46: function () {
    var f = $("folder-tree").getAttribute("specialMode");
    var d = CheckedList.get();
    var c = d.length;
    var b = Data.getTrashRoot().id;
    if (c == 0) {
        return true;
    }
    if (event.shiftKey || f == "TRASH_LIST") {
        if (confirm(Lang.get("DeleteConfirm"))) {
            Data.removeItems(d);
        }
    } else {
        if (confirm(Lang.get("Trash"))) {
            var a = Data.getItemById(d[0]).parentNode.id;
            View.move(d, b, "append_as_child", a);
            Data.moveItemList(d, b, "append_as_child");
        }
    }
    return true;
}, _down65: function () {
    if (event.ctrlKey) {
        var c = null;
        var b = [];
        c = document.querySelectorAll("#favorite-list li:not(.hr):not(.more)");
        for (var d = 0, a = c.length; d < a; d++) {
            b.push(c[d].getAttribute("favid"));
        }
        CheckedList.set(b);
        event.stopPropagation();
        event.preventDefault();
    }
}, _down67: function () {
    if (event.ctrlKey) {
        var a = CheckedList.get();
        if (a.length == 0) {
            a = $("folder-tree").getAttribute("specialMode") ? [] : [$("folder-tree").getAttribute("currentid")];
        }
        ClipboardDemo.copy(a);
    }
}, _down86: function () {
    if (event.ctrlKey) {
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        var b = $("folder-tree").getAttribute("currentId");
        if (a[b]) {
            return false;
        }
        ClipboardDemo.paste(b);
        View.clearCut();
    }
}, _down88: function () {
    if (event.ctrlKey) {
        var b = CheckedList.get();
        var a = "L";
        if (b.length > 0) {
            a = "R";
        } else {
            b = $("folder-tree").getAttribute("specialMode") ? [] : [$("folder-tree").getAttribute("currentid")];
        }
        ClipboardDemo.cut(b);
        View.cut(b, a);
    }
}, _down90: function () {
    if (event.ctrlKey) {
        ClipboardDemo.unDo();
    }
}};
var dragConfig = {scrollTimer: null, scrollTrigger: null, dragTarget: [], dragTargetID: [], dragType: null, dragMode: null, dropArea: null, dropParentId: null, insertPos: null, listRoot: null, treeRoot: null, dragGhoster: null, lastNode: null, dargSign: false, selectSign: false};
var DragSort = {checker: function (b) {
    var d = event || window.event;
    var c = Data.getItemById(d.currentTarget.getAttribute("favid"));
    if (c.type == "ROOT") {
        return false;
    }
    if (d.target.tagName.toLowerCase() == "a") {
        return false;
    }
    if (d.button != 1) {
        var a = {left: d.pageX, top: d.pageY};
        document.onmousemove = function (g) {
            var f = {left: g.pageX, top: g.pageY};
            if (Math.max(Math.abs(f.left - a.left), Math.abs(f.top - a.top)) > 5) {
                document.onmousemove = null;
                document.onmouseup = null;
                global.mouseUp.checked = false;
                DragSort._getRoots();
                DragSort._restore();
                b ? DragSort._dragFromTree() : DragSort._dragFromList();
            }
        };
        document.onmouseup = function () {
            document.onmousemove = null;
        };
    }
}, _getRoots: function () {
    dragConfig.listRoot = $("favorite-list");
    dragConfig.treeRoot = $("folder-tree");
}, _dragFromList: function (b) {
    b = event || window.event;
    if (!dragConfig.treeRoot.getAttribute("specialMode") || dragConfig.treeRoot.getAttribute("specialMode") == "TRASH_LIST") {
        var a = DropRuler.getDragInfo();
        dragConfig.dragTargetID = a[0];
        dragConfig.dragTarget = a[1];
        dragConfig.dragType = a[2];
        dragConfig.dragMode = "list";
        DropRuler.build();
        DragGhoster.create(dragConfig.dragTarget, b.pageY, b.pageX);
        DragSort._bindDragEvents();
    }
}, _dragFromTree: function (b) {
    b = event || window.event;
    var c = b.target;
    try {
        while (c) {
            if (c.tagName.toLowerCase() == "div" && c.className.indexOf("folder-row") > -1) {
                break;
            }
            c = c.parentNode;
        }
    } catch (a) {
        return;
    }
    dragConfig.dragTargetID = [c.getAttribute("favid")];
    dragConfig.dragTarget = [c];
    dragConfig.dragType = "folder";
    dragConfig.dragMode = "folder";
    DropRuler.build();
    DragGhoster.create(dragConfig.dragTarget, b.pageY, b.pageX);
    DragSort._bindDragEvents();
}, _bindDragEvents: function () {
    window.onblur = document.oncontextmenu = function () {
        DragSort.unbindEvents();
    };
    document.body.onkeydown = function () {
        if (event.keyCode == 27 || event.keyCode == 9) {
            DragSort.unbindEvents();
        }
    };
    document.onmousemove = function (b) {
        b = b || window.event;
        dragConfig.dropArea = (b.pageX < 200) ? "tree" : "list";
        DropEffect.scrollCheck(b.pageX, b.pageY);
        DragGhoster.moveTo(b.pageX - 25, b.pageY);
        var a = DragSort._getCursorElement({left: b.pageX, top: b.pageY});
        if (a) {
            DropEffect._setDragHover(a);
            if (dragConfig.dropParentId) {
                dragConfig.dragGhoster.className = "favorite-list drag-effect drop-accept";
            }
        } else {
            if (DropEffect.leafExpandeTimer) {
                clearTimeout(DropEffect.leafExpandeTimer);
                DropEffect.leafExpandeTimer = null;
            }
            DropEffect._setDragHover(null);
            dragConfig.dropParentId = null;
            dragConfig.dragGhoster.className = "favorite-list drag-effect drop-refuse";
        }
    };
    document.onmouseup = function (f) {
        document.onmousemove = null;
        if (dragConfig.dropParentId) {
            if (dragConfig.insertPos !== null) {
                dragConfig.insertPos = parseInt(dragConfig.insertPos);
            }
            if (typeof dragConfig.insertPos == "object") {
                dragConfig.insertPos = null;
            }
            var c = Data.getItemById(dragConfig.dropParentId);
            var g = c.childNodes;
            var d = g[dragConfig.insertPos];
            var b = "insert_before";
            if (!d) {
                d = c;
                b = "append_as_child";
            }
            var a = d.id;
            DragSort._moveItemto(a, b);
        }
        DragSort.unbindEvents();
    };
}, _restore: function () {
    dragConfig.dragType = dragConfig.dropArea = dragConfig.insertPos = dragConfig.dragTarget = dragConfig.dropParentId = null;
    DragGhoster.remove();
    DropRuler.reset();
    DropEffect._hoverClear();
    dragConfig.dragSign = false;
}, unbindEvents: function () {
    document.onmousemove = null;
    document.onmouseup = null;
    document.oncontextmenu = null;
    document.body.onkeydown = Hotkeys.keydown;
    window.onblur = null;
    DragSort._restore();
}, restoreUI: function (j, t) {
    var s = global.dropStatusMap;
    var o = s ? s[j] : null;
    var g = false;
    if (!o) {
        return true;
    }
    o[t] = true;
    if (o.INSERTED && o.REMOVED) {
        delete s[j];
        g = true;
    }
    var f = 0;
    for (var p in s) {
        f++;
    }
    if (f == 0) {
        if (!g) {
            return true;
        }
        var l;
        var c = Data.getRoot();
        var k = Data.getItemById(j).parentNode;
        var j = k.id;
        var n = $("folder-tree");
        var b = $("favorite-list");
        var m = n.getAttribute("currentId");
        var a = b.getAttribute("currentId");
        Builder.folderTree(n, [c]);
        Index.leaf();
        global.leafIndex[m].className = "folder-row current";
        Builder.favList(Data.getItemById(m).childNodes);
        Index.fav();
        l = global.favIndex[a];
        if (!l) {
            l = b.childNodes[1];
        }
        if (!l) {
            b.removeAttribute("currentId");
        } else {
            Fav.current(l, Data.getItemById(a));
        }
        var q = dragConfig.dragTargetID;
        var d = q.length;
        var r = [];
        for (var p = 0; p < d; p++) {
            var h = q[p];
            if (global.favIndex[h]) {
                r.push(h);
            }
        }
        CheckedList.set(r);
    }
    return false;
}, _getCursorElement: function (c) {
    var a = null;
    if (document.elementFromPoint) {
        if (dragConfig.dragGhoster) {
            dragConfig.dragGhoster.style.display = "none";
        }
        a = document.elementFromPoint(c.left, c.top);
        if (dragConfig.dragGhoster) {
            dragConfig.dragGhoster.style.display = "block";
        }
    }
    var b = null;
    while (a) {
        if (!a.parentNode) {
            break;
        }
        if ((dragConfig.dropArea == "list") && (a.parentNode == dragConfig.listRoot) && (a.tagName.toLowerCase() == "li")) {
            b = a;
            break;
        }
        if ((dragConfig.dropArea == "tree")) {
            if ((a.className.indexOf("hr") > -1) || (a.className.indexOf("folder-row") > -1)) {
                b = a;
                break;
            }
        }
        a = a.parentNode;
    }
    if (b && (b.getAttribute("dropable") == "true" || b.parentNode.getAttribute("dropable") == "true" || b.getAttribute("rowtype") == "trash")) {
        return b;
    }
    return null;
}, _moveItemto: function (a, d) {
    var g = dragConfig.dragTargetID;
    var c = Data.getItemById(g[0]).parentNode.id;
    if (d != "insert_before" || g.indexOf(a) == -1) {
        View.move(g, a, d, c);
        Data.moveItemList(g, a, d);
    }
    var h = {};
    var f = g.length;
    for (var b = 0; b < f; b++) {
        h[g[b]] = {};
    }
    global.dropStatusMap = h;
}};
var DragGhoster = {create: function (a, j, b) {
    var h = $new("ul");
    h.className = "drag-effect drop-accept";
    h.style.position = "absolute";
    h.style.top = j + "px";
    h.style.left = b + "px";
    for (var d = 0; d < a.length; d++) {
        var g = a[d];
        var k = g.cloneNode(true);
        var f = $new("span");
        var c = k.querySelector("img");
        var l = c.nextSibling;
        if (l.nodeType == 1) {
            l.removeAttribute("class");
        }
        f.appendChild(c);
        f.appendChild(l);
        h.appendChild(f);
        $addClass(g, "drag-target");
    }
    document.body.appendChild(h);
    dragConfig.dragGhoster = h;
}, moveTo: function (b, a) {
    dragConfig.dragGhoster.style.left = b + "px";
    dragConfig.dragGhoster.style.top = a + "px";
}, remove: function () {
    if (dragConfig.dragGhoster) {
        dragConfig.dragGhoster.style.display = "none";
        document.body.removeChild(dragConfig.dragGhoster);
    }
    dragConfig.dragGhoster = null;
    var d = document.querySelectorAll(".drag-target");
    for (var c = 0, a = d.length; c < a; c++) {
        var b = d[c];
        $removeClass(b, "drag-target");
    }
}};
var DropRuler = {build: function () {
    dragConfig.dragSign = true;
    DropRuler.reset();
    var p = dragConfig.dragTargetID;
    var c = p.length;
    var k = {};
    var j = {};
    for (var l = 0; l < c; l++) {
        var a = p[l];
        var g = Data.getItemById(a);
        var h = global.favIndex[a];
        var m = global.leafIndex[a];
        var f = global.favIndex[g.parentNode.id];
        var n = global.leafIndex[g.parentNode.id];
        if (h) {
            h.setAttribute("dropable", "false");
            h.previousSibling.setAttribute("dropable", "false");
            h.nextSibling.setAttribute("dropable", "false");
        }
        if (m) {
            m = m.parentNode;
            m.setAttribute("dropable", "false");
            m.previousSibling.setAttribute("dropable", "false");
            m.nextSibling.setAttribute("dropable", "false");
            var d = m.querySelectorAll("li");
            var b = d.length;
            for (var o = 0; o < b; o++) {
                d[o].setAttribute("dropable", "false");
            }
        }
        if (f) {
            f.setAttribute("dropable", "false");
        }
        if (n) {
            n.setAttribute("dropable", "false");
        }
    }
}, reset: function () {
    var h = $("favorite-list");
    var b = $("folder-tree");
    var d = h.querySelectorAll("li");
    var g = b.querySelectorAll("li");
    var f = d.length;
    for (var c = 0; c < f; c++) {
        var a = d[c];
        if (/bookmark/.test(a.className)) {
            a.setAttribute("dropable", "false");
        } else {
            a.setAttribute("dropable", "true");
        }
    }
    var f = g.length;
    for (var c = 0; c < f; c++) {
        var a = g[c];
        a.setAttribute("dropable", "true");
    }
}, getHrIndex: function (b) {
    var c = b.parentNode;
    var a = c.childNodes.length;
    if (c.childNodes[a - 1] == b) {
        return Data.getItemById(b.previousSibling.firstChild.getAttribute("favId")).index + 1;
    } else {
        return Data.getItemById(b.nextSibling.firstChild.getAttribute("favId")).index;
    }
}, getDragInfo: function () {
    var b = [];
    var f = [];
    var d = "folder";
    var g = global.checkedList;
    for (var c in global.favIndex) {
        var a = global.favIndex[c];
        if (g.indexOf(c) >= 0) {
            f.push(c);
            b.push(a);
            if (a.className.indexOf("bookmark") > -1) {
                d = "link";
            }
        }
    }
    return[f, b, d];
}};
var DropEffect = {leafExpandeTimer: null, _setDragHover: function (b) {
    var a = $("folder-tree").getAttribute("currentid");
    if (dragConfig.dragTargetID.indexOf(a) > -1 && Array.prototype.indexOf.call(dragConfig.listRoot.childNodes, b) > -1) {
        return;
    }
    if (!b) {
        DropEffect._restoreLastNode();
        return;
    }
    if ((b == dragConfig.lastNode && b.className.indexOf("folder") < 0)) {
        return;
    }
    dragConfig.insertPos = 0;
    DropEffect._restoreLastNode();
    if (dragConfig.dropArea == "list") {
        DropEffect._getListHoverElement(b);
    } else {
        DropEffect._getTreeHoverElement(b);
    }
}, _restoreLastNode: function () {
    if (!dragConfig.lastNode) {
        return;
    }
    if (dragConfig.lastNode.className.indexOf("hr") > -1) {
        dragConfig.lastNode.className = "hr";
    } else {
        if (dragConfig.lastNode.className.indexOf("folder") > -1 && dragConfig.lastNode.className.indexOf("folder-row") < 0) {
            dragConfig.lastNode.className = "folder";
            return;
        }
        if (dragConfig.lastNode.className.indexOf("folder-row") > -1) {
            if (dragConfig.lastNode.className.indexOf("current") > -1) {
                dragConfig.lastNode.className = "folder-row current";
            } else {
                dragConfig.lastNode.className = "folder-row";
            }
        }
    }
    dragConfig.lastNode = null;
}, _getListHoverElement: function (a) {
    var l = dragConfig.listRoot.getElementsByTagName("li");
    for (var c = 0; c < l.length; c++) {
        if (l[c] == a) {
            var h = (l[c].className.indexOf("hr") > -1) ? "hr" : (l[c].className.indexOf("folder") > -1) ? "folder" : "bookmark";
            switch (h) {
                case"hr":
                    l[c].className = "hr hr-hover";
                    try {
                        if (c == 0) {
                            dragConfig.insertPos = 0;
                        } else {
                            dragConfig.insertPos = (parseInt(global.hrIndex[c - 1]) + 1) / 2;
                        }
                    } catch (g) {
                        dragConfig.insertPos = 0;
                    }
                    dragConfig.lastNode = l[c];
                    dragConfig.dropParentId = dragConfig.treeRoot.getAttribute("currentId");
                    break;
                case"folder":
                    var j;
                    var b = l[c].offsetTop;
                    var d = l[c].offsetHeight;
                    var m = (b + d / 4 - dragConfig.listRoot.scrollTop) > event.pageY;
                    var f = (b + d * 3 / 4 - dragConfig.listRoot.scrollTop) < event.pageY;
                    try {
                        if (m && l[c].previousSibling.getAttribute("dropable") == "true") {
                            j = l[c].previousSibling;
                            j.className = "hr hr-hover";
                            if (c - 2 < 0) {
                                dragConfig.insertPos = 0;
                            } else {
                                dragConfig.insertPos = (parseInt(global.hrIndex[c - 2]) + 1) / 2;
                            }
                            dragConfig.lastNode = j;
                            dragConfig.dropParentId = dragConfig.treeRoot.getAttribute("currentId");
                        } else {
                            if (f && l[c].nextSibling.getAttribute("dropable") == "true") {
                                j = l[c].nextSibling;
                                j.className = "hr hr-hover";
                                dragConfig.insertPos = (parseInt(global.hrIndex[c]) + 1) / 2;
                                dragConfig.lastNode = j;
                                dragConfig.dropParentId = dragConfig.treeRoot.getAttribute("currentId");
                            } else {
                                dragConfig.insertPos = null;
                                l[c].className = "folder folder-hover";
                                dragConfig.lastNode = l[c];
                                dragConfig.dropParentId = a.getAttribute("favId");
                            }
                        }
                        if (dragConfig.dragMode == "folder" && j == l[l.length - 1]) {
                            dragConfig.insertPos = null;
                            dragConfig.dropParentId = a.getAttribute("favId");
                        }
                    } catch (g) {
                        DropEffect._restoreLastNode();
                        return;
                    }
                    break;
                case"bookmark":
                    var b = l[c].offsetTop;
                    var d = l[c].offsetHeight;
                    var k = (b + d / 2 - dragConfig.listRoot.scrollTop) > event.pageY;
                    var j;
                    try {
                        if (k) {
                            if (l[c].previousSibling.getAttribute("dropable") == "true") {
                                j = l[c].previousSibling;
                                j.className = "hr hr-hover";
                                dragConfig.insertPos = (parseInt(global.hrIndex[c - 2]) + 1) / 2;
                            } else {
                                j = l[c].nextSibling;
                                j.className = "hr hr-hover";
                                dragConfig.insertPos = (parseInt(global.hrIndex[c]) + 1) / 2;
                            }
                        } else {
                            if (l[c].nextSibling.getAttribute("dropable") == "true") {
                                j = l[c].nextSibling;
                                j.className = "hr hr-hover";
                                dragConfig.insertPos = (parseInt(global.hrIndex[c]) + 1) / 2;
                            } else {
                                j = l[c].previousSibling;
                                j.className = "hr hr-hover";
                                dragConfig.insertPos = (parseInt(global.hrIndex[c - 2]) + 1) / 2;
                            }
                        }
                        if (dragConfig.dragMode == "folder" && j == l[l.length - 1]) {
                            dragConfig.insertPos = null;
                        }
                    } catch (g) {
                        dragConfig.insertPos = 0;
                    }
                    dragConfig.dropParentId = dragConfig.treeRoot.getAttribute("currentId");
                    dragConfig.lastNode = j;
                    break;
                default:
                    break;
            }
            break;
        }
    }
}, _getTreeHoverElement: function (a) {
    if (a.className.indexOf("folder-row") > -1) {
        a.className = (a.className.indexOf("current") > -1) ? "folder-row current folder-hover" : "folder-row folder-hover";
    }
    if (DropEffect.leafExpandeTimer) {
        clearTimeout(DropEffect.leafExpandeTimer);
        DropEffect.leafExpandeTimer = null;
    }
    if (a.className.indexOf("hr") > -1) {
        a.className = "hr hr-hover";
        dragConfig.insertPos = parseInt(DropRuler.getHrIndex(a));
        dragConfig.dropParentId = a.parentNode.previousSibling.getAttribute("favId");
    } else {
        dragConfig.insertPos = null;
        dragConfig.dropParentId = a.getAttribute("favId");
        if (a.parentNode.getAttribute("collapsed") == "true") {
            DropEffect.leafExpandeTimer = setTimeout(function () {
                a.parentNode.setAttribute("collapsed", "false");
                a.firstChild.style.backgroundImage = "url(images/arrow_down.png)";
                a.nextSibling.style.display = "block";
            }, 700);
        }
    }
    dragConfig.lastNode = a;
}, _hoverClear: function () {
    DropEffect._restoreLastNode();
}, scrollCheck: function (b, a) {
    dragConfig.scrollTrigger = null;
    if (a > window.innerHeight - 40) {
        dragConfig.scrollTrigger = "down";
    }
    if (a < 130) {
        dragConfig.scrollTrigger = "up";
    }
    if (!dragConfig.scrollTimer && dragConfig.scrollTrigger) {
        if (dragConfig.dropArea == "list" && b > 200) {
            dragConfig.scrollTimer = setTimeout(DropEffect._scrollList, 20);
        }
        if (dragConfig.dropArea == "tree" && b < 200) {
            dragConfig.scrollTimer = setTimeout(DropEffect._scrollFolder, 20);
        }
    }
}, _clearScroll: function () {
    if (dragConfig.scrollTimer) {
        clearTimeout(dragConfig.scrollTimer);
        dragConfig.scrollTimer = null;
    }
}, _scrollList: function () {
    DropEffect._clearScroll();
    var a = dragConfig.scrollTrigger;
    if (a && a == "down" && ($("favorite-list").scrollTop < $("favorite-list").scrollHeight - $("favorite-list").clientHeight)) {
        $("favorite-list").scrollTop += 10;
        dragConfig.scrollTimer = setTimeout(DropEffect._scrollList, 20);
    }
    if (a && a == "up" && ($("favorite-list").scrollTop > 0)) {
        $("favorite-list").scrollTop -= 10;
        dragConfig.scrollTimer = setTimeout(DropEffect._scrollList, 20);
    }
    if (dragConfig.selectSign) {
        AreaSelect.draw();
        AreaSelect.select();
    }
}, _scrollFolder: function () {
    DropEffect._clearScroll();
    var a = dragConfig.scrollTrigger;
    if (a && a == "down" && ($("folder-tree").scrollTop < $("folder-tree").scrollHeight - $("folder-tree").clientHeight - 5)) {
        $("folder-tree").scrollTop += 10;
        dragConfig.scrollTimer = setTimeout(DropEffect._scrollFolder, 20);
    }
    if (a && a == "up" && ($("folder-tree").scrollTop > 0)) {
        $("folder-tree").scrollTop -= 10;
        dragConfig.scrollTimer = setTimeout(DropEffect._scrollFolder, 20);
    }
}};
var AreaSelect = {div: $("select-mask"), scrollY: 0, originY: 0, startX: 0, startY: 0, endX: 0, endY: 0, left: 0, top: 0, childs: [], start: function (a) {
    if (dragConfig.dragSign) {
        AreaSelect.div.style.display = "none";
        return false;
    }
    if (a.target != $("main") && a.target != $("favorite-list") && a.target.className != "seprate-line") {
        return false;
    }
    dragConfig.selectSign = true;
    AreaSelect.childs = $("favorite-list").querySelectorAll(".bookmark,.folder");
    AreaSelect.scrollY = $("favorite-list").scrollTop;
    AreaSelect.left = $("favorite-list").offsetLeft;
    AreaSelect.top = $("favorite-list").offsetTop;
    AreaSelect.startX = AreaSelect.endX = a.pageX;
    AreaSelect.originY = AreaSelect.startY = AreaSelect.endY = a.pageY;
    AreaSelect.div.style.left = AreaSelect.startX + "px";
    AreaSelect.div.style.top = AreaSelect.startY + "px";
    AreaSelect.div.style.width = "0px";
    AreaSelect.div.style.height = "0px";
    if (a.pageX > AreaSelect.left + $("favorite-list").clientWidth || a.pageY > AreaSelect.top + $("favorite-list").clientHeight) {
        return false;
    }
    document.addEventListener("mousemove", AreaSelect.move, false);
    document.addEventListener("mouseup", AreaSelect.up, false);
    a.stopPropagation();
    a.preventDefault();
}, move: function (a) {
    AreaSelect.div.style.display = "block";
    dragConfig.dropArea = (a.pageX < 200) ? "tree" : "list";
    DropEffect.scrollCheck(a.pageX, a.pageY);
    AreaSelect.endX = a.pageX;
    AreaSelect.endY = a.pageY;
    AreaSelect.draw();
    AreaSelect.select();
    a.stopPropagation();
}, up: function (a) {
    AreaSelect.div.style.display = "none";
    document.removeEventListener("mousemove", AreaSelect.move, false);
    document.removeEventListener("mouseup", AreaSelect.up, false);
    DropEffect._clearScroll();
    dragConfig.selectSign = false;
    a.stopPropagation();
    a.preventDefault();
}, fixNum: function (c, a, b) {
    if (c < a) {
        c = a;
    } else {
        if (c > b) {
            c = b;
        }
    }
    return c;
}, checkSelect: function (c, f, j, g, a, b, h, d) {
    if (j > h && j < d || g > h && g < d || h > j && h < g && d > j && d < g) {
        if (c > a && c < b || f > a && f < b || a > c && a < f && b > c && b < f) {
            return true;
        }
    }
    return false;
}, select: function () {
    var j = AreaSelect.originY + AreaSelect.scrollY;
    var h = AreaSelect.endY + $("favorite-list").scrollTop;
    var c = Math.min(AreaSelect.startX, AreaSelect.endX);
    var m = Math.min(j, h);
    var a = Math.max(AreaSelect.startX, AreaSelect.endX);
    var k = Math.max(j, h);
    CheckedList.set([]);
    for (var f = 0, g = AreaSelect.childs.length; f < g; f++) {
        var d = AreaSelect.childs[f];
        if (AreaSelect.checkSelect(d.offsetLeft, d.offsetLeft + d.clientWidth, d.offsetTop, d.offsetTop + d.clientHeight, c, a, m, k)) {
            CheckedList.add(AreaSelect.childs[f].getAttribute("favid"));
        }
    }
}, draw: function () {
    var c = $("favorite-list").scrollTop;
    var b = AreaSelect.left + $("favorite-list").clientWidth;
    var a = AreaSelect.top + $("favorite-list").clientHeight;
    AreaSelect.endX = AreaSelect.fixNum(AreaSelect.endX, AreaSelect.left, b);
    AreaSelect.startY = AreaSelect.originY + AreaSelect.scrollY - c;
    AreaSelect.startY = AreaSelect.fixNum(AreaSelect.startY, AreaSelect.top, a);
    AreaSelect.endY = AreaSelect.fixNum(AreaSelect.endY, AreaSelect.top, a);
    AreaSelect.div.style.width = Math.abs(AreaSelect.endX - AreaSelect.startX) + "px";
    AreaSelect.div.style.height = Math.abs(AreaSelect.endY - AreaSelect.startY) + "px";
    AreaSelect.div.style.left = Math.min(AreaSelect.startX, AreaSelect.endX) + "px";
    AreaSelect.div.style.top = Math.min(AreaSelect.startY, AreaSelect.endY) + "px";
}};
var ClipboardDemo = (function () {
    var c = "";
    var d = [];
    var b = [];
    var g = "";
    var f = null;
    var a = true;
    return{TYPE_ADD: "add", TYPE_MOVE: "move", cut: function (j) {
        c = ClipboardDemo.TYPE_MOVE;
        d = [];
        for (var h = 0; h < j.length; h++) {
            d.push(j[h]);
        }
    }, copy: function (j) {
        c = ClipboardDemo.TYPE_ADD;
        d = [];
        for (var h = 0; h < j.length; h++) {
            d.push(j[h]);
        }
    }, clear: function () {
        d = [];
        c = "";
        b = [];
        g = "";
        f = null;
        a = true;
    }, get: function () {
        return d;
    }, getSign: function () {
        return a;
    }, has: function (j) {
        for (var h = 0; h < j.length; h++) {
            if (d.indexOf(j[h]) >= 0) {
                return true;
            }
        }
        return false;
    }, isAllowCopyAndCut: function (m, j) {
        var l = $("folder-tree");
        for (var k = 0, h = m.length; k < h; k++) {
            if (m[k] == j) {
                return false;
            }
            var n = l.querySelector("[favid='" + m[k] + "']");
            if (n) {
                n = n.nextSibling;
            } else {
                continue;
            }
            var o = n.querySelector("[favid='" + j + "']");
            if (o) {
                return false;
            }
        }
        return true;
    }, isDisabledPaste: function () {
        if (c != "" && d.length) {
            return true;
        }
        return false;
    }, paste: function (h) {
        var m = null;
        var l = null;
        var j = [];
        var k = $("folder-tree").getAttribute("currentId");
        if (d.length == 0 || k == Data.getTrashRoot().id) {
            return;
        }
        if (c == ClipboardDemo.TYPE_MOVE) {
            if (!ClipboardDemo.isAllowCopyAndCut(d, h)) {
                alert(Lang.get("PasteAlarm"));
                return false;
            }
            var n = Data.getItemById(d[0]).parentNode.id;
            View.move(d, h, "append_as_child", n);
            Data.moveItemList(d, h, "append_as_child");
        } else {
            if (!ClipboardDemo.isAllowCopyAndCut(d, h)) {
                alert(Lang.get("PasteAlarm"));
                return false;
            }
            Data.copy(d, h, "append_as_child");
        }
    }, setReInfo: function (j, k, h) {
        g = j;
        b = k;
        switch (g) {
            case ClipboardDemo.TYPE_ADD:
                f = Data.getTrashRoot().id;
                break;
            case ClipboardDemo.TYPE_MOVE:
                f = h;
                break;
        }
    }, unDo: function () {
        if (b.length == 0) {
            return false;
        }
        a = false;
        switch (g) {
            case ClipboardDemo.TYPE_ADD:
                if (confirm(Lang.get("Trash"))) {
                    var h = Data.getItemById(b[0]).parentNode.id;
                    View.move(b, f, "append_as_child", h);
                    Data.moveItemList(b, f, "append_as_child");
                }
                break;
            case ClipboardDemo.TYPE_MOVE:
                var h = Data.getItemById(b[0]).parentNode.id;
                View.move(b, f, "append_as_child", h);
                Data.moveItemList(b, f, "append_as_child");
                break;
        }
    }};
})();
var Hotkeys = {keydown: function () {
    global.mouseUp.menukey = false;
    var b = event.keyCode;
    if (b == 93 || b == 121) {
        global.mouseUp.menukey = true;
    }
    var a = Hotkeys["_down" + b];
    if (a) {
        return a();
    }
}, keyup: function () {
    var b = event.keyCode;
    var a = Hotkeys["_up" + b];
    if (a) {
        return a();
    }
}, contextmenu: function () {
    if (global.mouseUp.menukey == true) {
        return false;
    }
}, _down37: function () {
    var d = global.focus;
    if (d.id == "sidebar") {
        d = $("folder-tree");
        var b = d.getAttribute("currentId");
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        if (a[b] || b == Data.getRoot().id) {
            return true;
        }
        var c = global.leafIndex[b];
        var j = Data.getItemById(b);
        if (c.parentNode.getAttribute("collapsed") != "true" && j.countNodes("FOLDER", false) > 0) {
            Leaf.toggle(c.parentNode);
        } else {
            var g = j.parentNode;
            var f = g.id;
            var h = global.leafIndex[f];
            Leaf.current(h, g, true);
            Layout.scroll(h, "up", d);
        }
    }
    return true;
}, _down39: function () {
    var f = global.focus;
    if (f.id == "sidebar") {
        f = $("folder-tree");
        var b = f.getAttribute("currentId");
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        if (a[b]) {
            return;
        }
        var d = global.leafIndex[b];
        var g = Data.getItemById(b);
        if (g.countNodes("FOLDER", false) == 0) {
            return true;
        }
        if (d.parentNode.getAttribute("collapsed") == "true" && b != Data.getRoot().id) {
            Leaf.toggle(d.parentNode);
        } else {
            var j = d.nextSibling.firstChild.nextSibling.firstChild;
            var c = j.getAttribute("favId");
            var h = Data.getItemById(c);
            Leaf.current(j, h, true);
            Layout.scroll(j, "down", f);
        }
    }
    return true;
}, _down38: function () {
    var r = global.focus;
    if (r.id == "favorite-list" || r.id == "keywords") {
        r = $("favorite-list");
        var m = r.getAttribute("currentId");
        var h = global.favIndex[m];
        var b = null;
        if (r.childNodes.length == 3) {
            b = h;
        } else {
            b = h.previousSibling.previousSibling;
        }
        if (b) {
            var d = b.getAttribute("favId");
            var p = Data.getItemById(d);
            Fav.current(b, p);
            Layout.scroll(b, "up", r);
            if (event.shiftKey) {
                FavBlock.end(d);
            } else {
                FavBlock.start(d);
                if (!event.ctrlKey) {
                    CheckedList.set([d]);
                }
            }
        }
    }
    if (r.id == "sidebar") {
        r = $("folder-tree");
        var j = r.getAttribute("currentId");
        var s = {"{MOST_VISITED_LIST}": {id: "{MOST_VISITED_LIST}", type: "SPECIAL", title: Lang.get("MostVisited")}, "{RECENT_VISITED_LIST}": {id: "{RECENT_VISITED_LIST}", type: "SPECIAL", title: Lang.get("RecentVisited")}, "{SEATCH_RESULT_LIST}": {}};
        var a = $("folder-tree").getElementsByTagName("div");
        var c = [];
        for (var f = 0; f < a.length; f++) {
            c.push(a[f]);
        }
        var g = null;
        var o = "";
        var n = null;
        if (!s[j] && j != Data.getRoot().id) {
            var l = global.leafIndex[j];
            var q = Data.getItemById(j);
            var k = c.indexOf(l);
            g = c[k - 1];
            while (!g.offsetHeight) {
                g = g.parentNode.parentNode.previousSibling;
            }
            o = g.getAttribute("favId");
            n = Data.getItemById(o);
        } else {
            if (j == Data.getRoot().id) {
                g = $("row-recent-visited");
                n = s["{RECENT_VISITED_LIST}"];
            } else {
                if (j == "{RECENT_VISITED_LIST}") {
                    g = $("row-most-visited");
                    n = s["{MOST_VISITED_LIST}"];
                }
            }
        }
        if (g && n) {
            Leaf.current(g, n, true);
            Layout.scroll(g, "up", r);
        }
    }
    return false;
}, _down40: function () {
    var o = global.focus;
    if (o.id == "favorite-list" || o.id == "keywords") {
        o = $("favorite-list");
        var f = o.getAttribute("currentId");
        var b = global.favIndex[f];
        var l = null;
        if (o.childNodes.length == 3) {
            l = b;
        } else {
            l = b.nextSibling.nextSibling;
        }
        if (l) {
            var m = l.getAttribute("favId");
            var h = Data.getItemById(m);
            Fav.current(l, h);
            Layout.scroll(l, "down", o);
            if (event.shiftKey) {
                FavBlock.end(m);
            } else {
                FavBlock.start(m);
                if (!event.ctrlKey) {
                    CheckedList.set([m]);
                }
            }
        }
    }
    if (o.id == "sidebar") {
        o = $("folder-tree");
        var a = o.getAttribute("currentId");
        var k = {"{MOST_VISITED_LIST}": {id: "{MOST_VISITED_LIST}", type: "SPECIAL", title: Lang.get("MostVisited")}, "{RECENT_VISITED_LIST}": {id: "{RECENT_VISITED_LIST}", type: "SPECIAL", title: Lang.get("RecentVisited")}, "{SEATCH_RESULT_LIST}": {}};
        var j = $("folder-tree").getElementsByTagName("div");
        var r = [];
        for (var q = 0; q < j.length; q++) {
            r.push(j[q]);
        }
        var c = null;
        var p = "";
        var g = null;
        if (!k[a]) {
            var s = global.leafIndex[a];
            var t = Data.getItemById(a);
            var d = r.indexOf(s);
            if (d < r.length - 1) {
                c = r[d + 1];
            }
            while (c && !c.offsetHeight) {
                var n = r[d].nextSibling.getElementsByTagName("div").length + 1;
                if ((d + n) < (r.length - 1)) {
                    c = r[d + n];
                } else {
                    break;
                }
            }
            if (c) {
                p = c.getAttribute("favId");
                g = Data.getItemById(p);
            }
        } else {
            if (a == "{SEARCH_RESULT_LIST}") {
                c = $("row-most-visited");
                g = k["{MOST_VISITED_LIST}"];
            } else {
                if (a == "{MOST_VISITED_LIST}") {
                    c = $("row-recent-visited");
                    g = k["{RECENT_VISITED_LIST}"];
                } else {
                    if (a == "{RECENT_VISITED_LIST}") {
                        c = r[0];
                        g = Data.getRoot();
                    }
                }
            }
        }
        if (c && g) {
            Leaf.current(c, g, true);
            Layout.scroll(c, "down", o);
        }
    }
    return false;
}, _up9: function () {
    global.focus = event.target;
    return true;
}, _down32: function () {
    var a = global.focus;
    if (a.id == "favorite-list") {
        a = $("favorite-list");
        var b = a.getAttribute("currentId");
        if (!CheckedList.contains(b)) {
            CheckedList.add(b);
        } else {
            CheckedList.remove(b);
        }
        return false;
    }
}, _down13: function () {
    var d = global.focus;
    if (d.id == "favorite-list" || d.id == "keywords") {
        var g = CheckedList.get();
        if (g.length == 1) {
            var h = global.favIndex[g[0]];
            h.ondblclick();
        }
    }
    if (d.id == "sidebar") {
        d = $("folder-tree");
        var b = d.getAttribute("currentId");
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        if (a[b]) {
            return;
        }
        var c = global.leafIndex[b];
        var f = Data.getItemById(b);
        if (f.countNodes("FOLDER", false) == 0) {
            return true;
        }
        if (c.parentNode.getAttribute("collapsed") == "true" && b != Data.getRoot().id) {
            Leaf.toggle(c.parentNode);
        }
    }
    return true;
}, _down46: function () {
    var f = $("folder-tree").getAttribute("specialMode");
    var d = CheckedList.get();
    var c = d.length;
    var b = Data.getTrashRoot().id;
    if (c == 0) {
        return true;
    }
    if (event.shiftKey || f == "TRASH_LIST") {
        if (confirm(Lang.get("DeleteConfirm"))) {
            Data.removeItems(d);
        }
    } else {
        if (confirm(Lang.get("Trash"))) {
            var a = Data.getItemById(d[0]).parentNode.id;
            View.move(d, b, "append_as_child", a);
            Data.moveItemList(d, b, "append_as_child");
        }
    }
    return true;
}, _down65: function () {
    if (event.ctrlKey) {
        var c = null;
        var b = [];
        c = document.querySelectorAll("#favorite-list li:not(.hr):not(.more)");
        for (var d = 0, a = c.length; d < a; d++) {
            b.push(c[d].getAttribute("favid"));
        }
        CheckedList.set(b);
        event.stopPropagation();
        event.preventDefault();
    }
}, _down67: function () {
    if (event.ctrlKey) {
        var a = CheckedList.get();
        if (a.length == 0) {
            a = $("folder-tree").getAttribute("specialMode") ? [] : [$("folder-tree").getAttribute("currentid")];
        }
        ClipboardDemo.copy(a);
    }
}, _down86: function () {
    if (event.ctrlKey) {
        var a = {"{MOST_VISITED_LIST}": true, "{RECENT_VISITED_LIST}": true, "{SEATCH_RESULT_LIST}": true};
        var b = $("folder-tree").getAttribute("currentId");
        if (a[b]) {
            return false;
        }
        ClipboardDemo.paste(b);
        View.clearCut();
    }
}, _down88: function () {
    if (event.ctrlKey) {
        var b = CheckedList.get();
        var a = "L";
        if (b.length > 0) {
            a = "R";
        } else {
            b = $("folder-tree").getAttribute("specialMode") ? [] : [$("folder-tree").getAttribute("currentid")];
        }
        ClipboardDemo.cut(b);
        View.cut(b, a);
    }
}, _down90: function () {
    if (event.ctrlKey) {
        ClipboardDemo.unDo();
    }
}};
(function () {
    Data.init();
    Data.bindFavEvent(function (p) {
        var f = p.type;
        var y = p.target;
        var j = p.operator;
        if ($("folder-tree").getAttribute("currentId") == "{SEARCH_RESULT_LIST}" && !Data.isFavManager(j, f)) {
            window.location.reload();
            return false;
        }
        if (f == "FOLDER_EMPTIED") {
            var s = $("folder-tree").getAttribute("currentId");
            if (s == Data.getTrashRoot().id) {
                Builder.favList(Data.getTrashRoot().childNodes);
            }
        }
        if (f == "INSERTED") {
            var x = document.getElementById("favorite-list").querySelectorAll('[favid="' + y + '"]');
            if (x.length > 0) {
                return false;
            }
            var k = Data.getItemById(y);
            View.add(k, k.parentId, k.index);
            if (ClipboardDemo.getSign()) {
                ClipboardDemo.setReInfo(ClipboardDemo.TYPE_ADD, [y]);
            }
        }
        if (f == "CLONED") {
            var v = p.ids;
            var a = Data.getItemById(y);
            for (var t = 0, u = v.length; t < u; t++) {
                var k = Data.getItemById(v[t]);
            }
            View.clone(v, y);
            if (ClipboardDemo.getSign()) {
                ClipboardDemo.setReInfo(ClipboardDemo.TYPE_ADD, v);
            }
        }
        if (f == "UPDATED") {
            var k = Data.getItemById(y);
            View.edit(k);
        }
        if (f == "REMOVED") {
            var b = p.removedNodes;
            var h = null;
            var x = [];
            b.forEach(function (z) {
                var A = Data.getItemById(z.parentId);
                if (A && x.indexOf(A.id) < 0) {
                    x.push(A.id);
                }
            });
            x.forEach(function (z) {
                if (!h || Data.checkFamily(z, h)) {
                    h = z;
                }
            });
            View.remove(h);
        }
        if (f == "CHILDS_REMOVED") {
            var s = $("folder-tree").getAttribute("currentId");
            if (s == Data.getTrashRoot().id) {
                Builder.favList(Data.getTrashRoot().childNodes);
            }
        }
        if (f == "CHILDS_CHANGED") {
            var k = Data.getItemById(y);
            var g = Data.getRoot();
            var q = $("folder-tree");
            var d = $("favorite-list");
            var o = q.getAttribute("currentId");
            if (q.getAttribute("specialmode")) {
                return false;
            }
            var m = global.leafIndex[o];
            var l = q;
            var r = [g];
            if (m) {
                l = m.parentNode;
                r = Builder.getSubFolderList(l);
                l = l.lastChild;
            }
            Builder.folderTree(l, r);
            Index.leaf();
            if (m) {
                m.className = "folder-row current";
            }
            if (o == k.id) {
                Builder.favList(k.childNodes);
                Index.fav();
                var c = d.getAttribute("currentId");
                if (c) {
                    var l = global.favIndex[o];
                    if (l) {
                        $addClass(l, "current");
                    }
                }
            }
        }
        if (f == "MOVED") {
            var k = Data.getItemById(y);
            var w = p.movedNodes;
            var v = [];
            for (var t = 0, u = w.length; t < u; t++) {
                v.push(w[t].id);
            }
            if (Data.isFavManager(j, f)) {
                if (ClipboardDemo.getSign()) {
                    if (p.moveType == "append_as_child" && k.id != w[0].oldParentId) {
                        ClipboardDemo.setReInfo(ClipboardDemo.TYPE_MOVE, v, w[0].oldParentId);
                    }
                } else {
                    ClipboardDemo.clear();
                }
            } else {
                var n = $("folder-tree");
                var d = $("favorite-list");
                var s = n.getAttribute("currentId");
                var m = n.querySelector('[favid="' + s + '"]');
                Builder.folderTree(n, [Data.getRoot()]);
                Index.leaf();
                if (s != Data.getTrashRoot().id) {
                    m = Builder.iterateFolder(Data.getItemById(s));
                } else {
                    m = global.leafIndex[s];
                }
                $addClass(m, "current");
                $removeClass(m, "current");
                Leaf.current(m, Data.getItemById(s));
                Index.hr();
            }
        }
        CheckedList.refresh();
    });
    Layout.resize();
    Lang.init();
    window.onresize = Layout.resize;
    setTimeout(function () {
        var c = $("folder-tree");
        var b = Data.getRoot();
        Builder.folderTree(c, [b]);
        Index.leaf();
        var d = c.firstChild.firstChild;
        var a = false;
        if (maxthon.browser.config.ConfigManager.get("maxthon.config", "favorites-manager-sign") == "trash") {
            a = true;
        }
        if (a) {
            b = Data.getTrashRoot();
            d = $("folder-foot").firstElementChild.firstElementChild;
            Leaf.trash(d, b);
            maxthon.browser.config.ConfigManager.set("maxthon.config", "favorites-manager-sign", "");
        } else {
            Leaf.current(d, b);
        }
        Index.hr();
    }, 5);
    global.focus = $("favorite-list");
    global.focus.focus();
    document.body.onkeydown = Hotkeys.keydown;
    document.body.onkeyup = Hotkeys.keyup;
    document.body.oncontextmenu = Hotkeys.contextmenu;
    $("main").oncontextmenu = function (a) {
        if (a.target == this) {
            CheckedList.set([]);
            global.focus = $("favorite-list");
            global.focus.focus();
            Menu.blank();
        }
        return false;
    };
    $("sidebar").oncontextmenu = function () {
        if (global.mouseUp.menukey == true) {
            Menu.treeCurrent();
            return false;
        }
        if (event.target == this) {
            Menu.blockTree();
        }
        return false;
    };
    $("folder-tree").oncontextmenu = function () {
        if (global.mouseUp.menukey == true) {
            event.preventDefault();
            Menu.listCurrent();
            return false;
        }
        var a = event.target.tagName;
        if (a.toLowerCase() != "span") {
            Menu.blockTree();
        }
        return false;
    };
    $("add-folder-link").onclick = function () {
        var b = $("folder-tree").getAttribute("currentId");
        var d = Data.getTrashRoot().id;
        var a;
        if (b != d) {
            a = Data.getItemById(b);
        } else {
            a = Data.getRoot();
        }
        var c = Menu.actionMap.newfolder;
        if (c) {
            c.call(Menu, null, a);
        }
    };
    $("add-bookmark-link").onclick = function () {
        var b = $("folder-tree").getAttribute("currentId");
        var d = Data.getTrashRoot().id;
        var a;
        if (b != d) {
            a = Data.getItemById(b);
        } else {
            a = Data.getRoot();
        }
        var c = Menu.actionMap.newbookmark;
        if (c) {
            c.call(Menu, null, a);
        }
    };
    $("main").addEventListener("selectstart", function () {
        return false;
    }, false);
    $("main").addEventListener("mousedown", AreaSelect.start, false);
    $("sidebar").onmousedown = function () {
        global.focus = $("sidebar");
        global.focus.focus();
    };
    Resizer.init();
})();