//=============================================
TFJS_DOM_Helper = {
    ObjToStr : function (obj){
        var str = JSON.stringify(obj, null, 4);
        return str;
    },
    RemoveTag : function(tag) {
                var hs = document.getElementsByTagName(tag);
                for (var i=0, max = hs.length; i < max; i++) {
                    try{
                        if(hs[i]) {
                            if(hs[i] && hs[i].hasOwnProperty("parentNode") && hs[i].parentNode!=null)
                                hs[i].parentNode.removeChild(hs[i]);
                            else {
                                try{ document.removeChild(hs[i]); } catch (e)  {}
                                try{ document.head.removeChild(hs[i]); } catch  (e) {}
                            }
                        }
                    }
                    catch(e) {
                        console.log(hs[i]);
                        console.log(e);
                    }
                }
            },
    RemoveUnuseTag : function() {
        TFJS_DOM_Helper.RemoveTag('style');
        TFJS_DOM_Helper.RemoveTag('script');
        TFJS_DOM_Helper.RemoveTag('link');
        TFJS_DOM_Helper.RemoveTag('meta');
    },
    GenStyleString : function() {
        var FontSize = (typeof TraceFictionFontSize === 'undefined')? 32 : TraceFictionFontSize;
        var ForegroundColor = (typeof TraceFictionForegroundColor === 'undefined')? '#000000' : TraceFictionForegroundColor;
        var BackgroundColor = (typeof TraceFictionBackgroundColor === 'undefined')? '#dfdfcf' : TraceFictionBackgroundColor;
        var FontName = (typeof TraceFictionFontName === 'undefined')? 'myfont' : TraceFictionFontName;
        var style = '.TFContentStyle {\n color:' + ForegroundColor + ";\n  font-size:" + FontSize + "px;\n  line-height:" + (FontSize + FontSize / 3) + 'px;\n  letter-spacing:2px;\n  padding-left:10px;\n  padding-right:10px;\n}\n';
        style = style + 'body {\n  background-color:'+BackgroundColor+';\n  font-family : "' + FontName + '";\n}\n';
        if((typeof TraceFictionFontUrl !== 'undefined'))
            style = style + '@font-face {\n  font-family: ' + FontName + ';\n  src: url("' + TraceFictionFontUrl + '");\n}\n';
        return style;
    },
    SetupStyle : function() {
        TFJS_DOM_Helper.RemoveUnuseTag();
        var newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(TFJS_DOM_Helper.GenStyleString()));
        document.head.appendChild(newStyle);
    },
    GenHtml : function(prevPage, nextPage, listPage) {
        var bookTitleEl = document.getElementById('chapterTitle');
        if(!bookTitleEl)
            return null;
        var bookContentEl = document.getElementById('TFAllContent');
        if(!bookContentEl)
            return null;
        var bookTitle = '<div id="chapterTitle" class="TFContentStyle" >'  + bookTitleEl.innerHTML  + "</div>";
        var pages = "<p>";
        if(prevPage.length > 0)
            pages += '<a href="'+prevPage+'">上一頁</a><p/>\n';
        if(nextPage.length > 0)
            pages += '<a class="TraceFictionNextPage" href="'+nextPage+'">下一頁</a><p/>\n';
        if(listPage.length > 0)
            pages += '<a href="'+listPage+'">章節列表</a><p/>\n';

        var ctx = "<!DOCTYPE html>\n<html><head>\n<meta charset=\"UTF-8\">\n<title>"+document.title+"</title>\n<style>"+TFJS_DOM_Helper.GenStyleString()+"</style>\n</head>\n<body>\n" + bookTitle +
        pages + '<p id="TraceFictionStartOfChapter"> TraceFictionDetectStartOfChapter</p><div id="TFAllContent" class="TFContentStyle">\n' + bookContentEl.innerHTML + '\n</div>\n<p>TraceFictionDetectEndOfChapter</p>\n' + pages + '\n</body>\n</html>';
        return ctx;
    },
    AddScript : function(url) {
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.src = url;
        document.head.appendChild(newScript);
    },
    Filter : function(filter){
        var ret = {name:null, type:null, index:0};
        if(Array.isArray(filter)){
            ret.name = filter[0];
            ret.type = filter[1]||'id';
            ret.index = filter[2]||0;
        } else if(typeof(filter) == "string"){
            ret.name = filter;
            ret.type = 'id';
            ret.index = 0;
        } else {
            return null;
        }
        return ret;
    },
    CheckRemoveItem : function(element, filter) {
        var _filter = TFJS_DOM_Helper.Filter(filter);
        if(!_filter) {
            return false;
        }
        if(_filter.type == "class") {
            if(element.classList.contains(_filter.name)){
                element.parentNode.removeChild(element);
                return true;
            }
        }
        else if(_filter.type == "tag") {
            if(element.tagName == _filter.name){
                element.parentNode.removeChild(element);
                return true;
            }
        }
        else if(_filter.type == "id") {
            if(element.id == _filter.name){
                element.parentNode.removeChild(element);
                return true;
            }
        }
        return false;
    },
    removeItemFilter : function(element, filters) {
        var i;
        element.removeAttribute("style");
        if(filters) {
            if(Array.isArray(filters)) {
                for (i = 0; i < filters.length; i++) {
                    if(this.CheckRemoveItem(element, filters[i])) {
                        return;
                    }
                }
            }
        }
        var children = element.children;
        for (i = 0; i < children.length; i++) {
            this.removeItemFilter(children[i], filters);
        }
    },
    SearchNode : function(node) {
        var element = null;
        var _node = TFJS_DOM_Helper.Filter(node);
        if(_node){

            if(_node.type == "class") {
                var elements = document.getElementsByClassName(_node.name);
                if(elements.length > _node.index)
                    element = elements[_node.index];
            }
            else if(_node.type == "tag") {
                var elements = document.getElementsByTagName(_node.name);
                if(elements.length > _node.index)
                    element = elements[_node.index];
            }
            else if(_node.type == "id") {
                element = document.getElementById(_node.name);
            }
        }
        return element;
    },
    CheckNodeExist : function(node) {
        if (this.SearchNode(node))
            return "yes";
        else
            return "no";
    },
    RemoveNodes : function(nodes) {
        for(var i=0; i < nodes.length; i++) {
            while(true) {
                var element = this.SearchNode(nodes[i]);
                if (element) {
                    element.parentNode.removeChild(element);
                }
                else
                    break;
            }
        }
    },
    GetInnerHTML : function(node, filters) {
        var element = this.SearchNode(node);
        if(!element) {
            var _node = TFJS_DOM_Helper.Filter(node);
            return " [GetInnerHTML from type:'"+_node.type+"' name:'"+_node.name+"' index:'"+ _node.index +"' not found] ";
        }
        this.removeItemFilter(element, filters);
        return element.innerHTML;
    },
    getNextNode : function (node) {
        if (!node.parentNode)
            return null;
        if (node.firstChild)
            return node.firstChild;
        if (node.nextSibling)
            return node.nextSibling;
        while (node) {
            if (node.parentNode && node.parentNode.nextSibling)
                return node.parentNode.nextSibling;
            node = node.parentNode;
        }
        return null;
    },
    getNextTextNode: function(node) {
        while(node && node.nodeType != 3)
            node = this.getNextNode(node);
        return node;
    },
    getNextHTMLNode: function(node) {
        while(node && !node.tagName)
            node = this.getNextNode(node);
        return node;
    },
    caretRangeFromPoint: function(x, y) {
        var log = "";

        function inRect(x, y, rect) {
            return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        }

        function inObject(x, y, object) {
            var rects = object.getClientRects();
            for (var i = rects.length; i--;)
                if (inRect(x, y, rects[i]))
                    return true;
            return false;
        }

        function getTextNodes(node, x, y) {
            if (!inObject(x, y, node))
                return [];

            var result = [];
            node = node.firstChild;
            while (node) {
                if (node.nodeType == 3)
                    result.push(node);
                if (node.nodeType == 1)
                    result = result.concat(getTextNodes(node, x, y));

                node = node.nextSibling;
            }

            return result;
        }

        var element = document.elementFromPoint(x, y);
        var nodes = getTextNodes(element, x, y);
        if (!nodes.length)
            return null;
        var node = nodes[0];

        var range = document.createRange();
        range.setStart(node, 0);
        range.setEnd(node, 1);

        for (var i = nodes.length; i--;) {
            var node = nodes[i],
                text = node.nodeValue;


            range = document.createRange();
            range.setStart(node, 0);
            range.setEnd(node, text.length);

            if (!inObject(x, y, range))
                continue;

            for (var j = text.length; j--;) {
                if (text.charCodeAt(j) <= 32)
                    continue;

                range = document.createRange();
                range.setStart(node, j);
                range.setEnd(node, j + 1);

                if (inObject(x, y, range)) {
                    range.setEnd(node, j);
                    return range;
                }
            }
        }
        return null;
    },
    getFirstElementOfScreen : function() {
        for(var y = 5 ; y < window.innerHeight; y += 5){
            for(var x = 5; x < window.innerWidth; x += 5)
            {
                var start;
                if(document.caretRangeFromPoint)
                    start = document.caretRangeFromPoint(x, y);
                else 
                    start = TFJS_DOM_Helper.caretRangeFromPoint(x, y);
                if(start && start.startContainer && start.startContainer.nodeType == 3)
                    return {node:start.startContainer,offset:start.startOffset};
            }
        }
        return null;
    },

    DataCollect : function (newStart, fromTop ,yoff) {
        var rate=1.0;
        if(window['devicePixelRatio'] && (typeof TraceFictionCallByiOS === 'undefined'))
            rate = window.devicePixelRatio;
        var selection = window.getSelection();
        var node = null, result = '', esc = ';' + String.fromCharCode(27);
        if(newStart) {
            if(fromTop) {
                node = document.getElementById('TraceFictionStartOfChapter');
                result='StartMark';
            }
        }
        else {
            if(selection.anchorNode) {
                node = selection.anchorNode;
                if(node)
                    result = node.nodeValue.substr(selection.anchorOffset);
            }
        }
        if(!node) {
            var result = this.getFirstElementOfScreen();
            if(!result)
                return;
            node = result.node;
            result = node.nodeValue.substr(result.offset);
        }

        while (node = this.getNextNode(node)) {
            if (node.nodeType == 3 && node.nodeValue && node.nodeValue.length) {
                selection.removeAllRanges();
                var range = document.createRange();
                range.selectNodeContents(node);
                var rects = range.getClientRects();
                if (rects.length) {
                    result = result + esc + (rects[0].top * rate + yoff) + ';' + (rects[0].bottom * rate + yoff) + ';' + node.nodeValue;
                } else {
                    result = result + node.nodeValue;
                }
            }

        }
        return result;
    },
    InitSupportHosts : function () {
        for (var e of Object.keys(TFJS_DOM_Helper.AllSites)) {
            if(window.location.hostname.includes(e)) {
                TFJS_DOM_Helper.Site = TFJS_DOM_Helper.AllSites[e];
                return;
            }
        }
    },
    IsSiteSupported : function () {
        if(TFJS_DOM_Helper.Site  == null) {
            if(document.getElementById('TraceFictionStartOfChapter')) {
                TFJS_DOM_Helper.Site = TFJS_DOM_Helper.AllSites['default_saved'];
                return "yes";
            }
            return "no";
        }
        else
            return "yes";
    },
    Site : null,
    AllSites : []
};

//=============================================
TraceFictionJSUtil = class {
    constructor(options) {
        this.options = options;
        TFJS_DOM_Helper.AllSites[options.site]=this;
        this.getContent = this.SingleChapterContent;
    }

    GetOptionValue(name, defvalue) {
        if(this.options.hasOwnProperty(name))
            return this.options[name];
        return defvalue;
    }

    SingleChapterContent() {
        var pages = "";
        var titleNode = this.GetOptionValue("titleNode", ["title", "id", 0]);
        var contentNode = this.GetOptionValue("contentNode", ["content", "id", 0]);
        this.GetNextPage();
        TFJS_DOM_Helper.RemoveNodes([['iframe','tag'],['adsbygoogle','class']]);
        if(this.options.hasOwnProperty("bodyFilter")) {
            TFJS_DOM_Helper.RemoveNodes(this.options.bodyFilter);
        }

        var ListText = (typeof TraceFictionListText === 'undefined')? 'List' : TraceFictionListText;
        if(this.options.hasOwnProperty("pageNode")) {
            var pageNode = this.GetOptionValue("pageNode", ["page", "id", 0]) ;
            pages = "<p>" + TFJS_DOM_Helper.GetInnerHTML(pageNode, this.options.pageFilter) + "</p>";

        }
        if(this['ChapterList']) {
            pages += "<p> <a href='"+this.ChapterList()+"'>" + ListText + "</a> </p>";
        }
        var i, elements = document.getElementsByTagName("link");

        var ctx = '<div id="chapterTitle" class="TFContentStyle" >' + TFJS_DOM_Helper.GetInnerHTML(titleNode, this.options.titleFilter) + "</div>";
        ctx += pages + '<p id="TraceFictionStartOfChapter"> TraceFictionDetectStartOfChapter</p><div id="TFAllContent" class="TFContentStyle" >';
        for (i = 0; i < elements.length; i++)
            elements[i].disabled = !0;
        ctx = (ctx = ctx + '<div class="TFTextContent">' + TFJS_DOM_Helper.GetInnerHTML(contentNode, this.options.contentFilter) + "</div>") + "</div><p>TraceFictionDetectEndOfChapter</p>" + pages;
        if(typeof TraceFictionToCHT !== 'undefined' && TraceFictionToCHT)
            ctx = NewTongWenConvert.toTrad(ctx);
        if(typeof TraceFictionToCHS !== 'undefined' && TraceFictionToCHS)
            ctx = NewTongWenConvert.toSimp(ctx);
        
        document.body.innerHTML = ctx;
    }
    CheckNeedWaitComplete() {
        if(this['needComplete'])
            return 'yes';
        else
            return 'no'
    }
    GetNextPage() {
        try {
            if(!this['nextPageUrl']  || this['nextPageUrl'] == "") {
                if(this['nextPage'])
                    this.nextPageUrl = this['nextPage']();
                else {
                    var nextPageEls = document.getElementsByClassName('TraceFictionNextPage');
                    if(nextPageEls.length>0) {
                        this.nextPageUrl=nextPageEls[0].href;
                    }
                    else
                        this.nextPageUrl = "";
                }
            }
        }
        catch(e) {
        }
        if((typeof this.nextPageUrl === 'undefined' )||this.nextPageUrl.length == 0)
            return 'no';
        return this.nextPageUrl;
    }
}

//=============================================

var tempTFObj;
// czbooks.net
tempTFObj = new TraceFictionJSUtil({site:'default_saved'});
tempTFObj.getContent = function(){};
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['TFAllContent']);};
tempTFObj.nextPage = function(){return TFJS_DOM_Helper.SearchNode(['TraceFictionNextPage','class']).href;}

// czbooks.net
tempTFObj = new TraceFictionJSUtil({site:'czbooks.net', titleNode:['name', 'class', 0], contentNode: ['content', 'class', 0], pageNode: ['chapter-nav','class',0] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['content', 'class', 0]);};
tempTFObj.nextPage = function(){return TFJS_DOM_Helper.SearchNode(['next-chapter','class']).href;}
tempTFObj.ChapterList = function(){return TFJS_DOM_Helper.SearchNode(['position','class']).children[2].href;}
//tempTFObj.nextPage = function(){return document.getElementsByClassName('next-chapter')[0].href;};

// uukanshu.com
tempTFObj = new TraceFictionJSUtil({site:'uukanshu.com',  titleNode:['h3', 'tag',0], contentNode: 'bookContent',contentFilter:[['ad_content','class'],['box','class']], pageNode: ['rp-switch', 'class', 0] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist('bookContent');};
tempTFObj.nextPage = function(){return document.getElementById('read_next').href;};

// qidian.com
tempTFObj = new TraceFictionJSUtil({site:'qidian.com',  titleNode:['j_chapterName', 'class'], contentNode: ['j_readContent','class'], pageNode: ['chapter-control', 'class'] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['j_readContent','class']);};
tempTFObj.nextPage = function(){return document.getElementById('j_chapterNext').href;};

// ck101.org
tempTFObj = new TraceFictionJSUtil({site:'ck101.org',  titleNode:['h1', 'tag'], contentNode: ['content'], pageNode: ['button', 'class'] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist('content');};
tempTFObj.nextPage = function(){return TFJS_DOM_Helper.SearchNode(['button','class']).children[2].children[0].href;};

// 101novel.com
tempTFObj = new TraceFictionJSUtil({site:'101novel.com',  titleNode:['h1', 'tag'], contentNode: ['content'], pageNode: ['thumb'] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist('content');};
tempTFObj.nextPage = function(){return document.getElementById('thumb').children[2].href;};

// jjwxc.net
tempTFObj = new TraceFictionJSUtil({site:'jjwxc.net',  titleNode:['h2', 'tag'], contentNode: ['noveltext','class'], bodyFilter:[['div','tag', 54],'favorite_3'], pageNode: ['noveltitle','class',2] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['noveltext','class']);};
tempTFObj.nextPage = function(){return TFJS_DOM_Helper.SearchNode(['noveltitle','class', 2]).children[0].children[1].href;};
tempTFObj.needComplete = true;

// lcread.com
tempTFObj = new TraceFictionJSUtil({site:'lcread.com',  titleNode:['h2', 'tag'], contentNode: ['ccon'], pageNode: ['tpbtn','class'] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist('ccon');};
tempTFObj.nextPage = function(){return document.getElementById('next').href;};
TFJS_DOM_Helper.InitSupportHosts();
//TFJS_DOM_Helper.Site.getContent();
//TFJS_DOM_Helper.DataCollect(false,false,100);
//TFJS_DOM_Helper.getFirstElementOfScreen();
