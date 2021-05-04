traceFictionJS = [];
//=============================================
TFJS_DOM_Helper = {
    ObjToStr : function (obj){
        var str = JSON.stringify(obj, null, 4);
        return str;
    },
    AddFontFamily : function(name, url) {
            var newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode( '@font-face { font-family: ' + name + '; src: url("' + url + '"); }'));
            document.head.appendChild(newStyle);
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
    },
    AddScript : function(url) {
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = url;
            document.head.appendChild(newScript);
        },
    CheckRemoveItem : function(element, filter) {
        var name, type;
        if(Array.isArray(filter)){
            name = filter[0];
            type = filter[1]||'id';
        } else if(typeof(filter) == "string"){
            name = filter;
            type = 'id';
        } else {
            return false;
        }
        if(type == "class") {
            if(element.classList.contains(name)){
                element.parentNode.removeChild(element);
                return true;
            }
        }
        else if(type == "tag") {
            if(element.tagName == name){
                element.parentNode.removeChild(element);
                return true;
            }
        }
        else if(type == "id") {
            if(element.id == name){
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
        var element = null, name, type, index;
        if(node){
            if(Array.isArray(node)) {
                name = node[0];
                type = node[1]||'id';
                index = node[2]||0;
            } else if(typeof(node) == "string"){
                name = node;
                type = 'id';
            } else {
                return {element:null,name:null,type:null,index:null};
            }

            if(type == "class") {
                var elements = document.getElementsByClassName(name);
                if(elements.length > index)
                    element = elements[index];
            }
            else if(type == "tag") {
                var elements = document.getElementsByTagName(name);
                if(elements.length > index)
                    element = elements[index];
            }
            else if(type == "id") {
                element = document.getElementById(name);
            }
        }
        return {element:element,name:name,type:type,index:index};
    },
    CheckNodeExist : function(node) {
        var result = this.SearchNode(node);
        if (result.element)
            return "yes";
        else
            return "no";
    },
    RemoveNodes : function(nodes) {
        for(var i=0; i < nodes.length; i++) {
            while(true) {
                var result = this.SearchNode(nodes[i]);
                if (result.element) {
                    result.element.parentNode.removeChild(result.element);
                }
                else
                    break;
            }
        }
    },
    GetInnerHTML : function(node, filters) {
        var result = this.SearchNode(node);
        if(!result.element)
            return " [GetInnerHTML from type:'"+result.type+"' name:'"+result.name+"' index:'"+ result.index +"' not found] ";
        this.removeItemFilter(result.element, filters);
        return result.element.innerHTML;
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
    getFirstElementOfScreen : function() {
        for(var y = 5 ; y < window.innerHeight; y += 5){
            for(var x = 5; x < window.innerWidth; x += 5)
            {
                var start = document.caretRangeFromPoint(x, y);
                var node = start.startContainer;
                if(node && node.nodeType == 3)
                    return {node:node,offset:start.startOffset};
            }
        }
        return null;
    },
    DataCollect : function (newStart, fromTop ,yoff) {
        var rate=1.0;
        if(window['devicePixelRatio'])
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
    SupportHosts: function () {
        var ret = "";
        for (var e of Object.keys(traceFictionJS)) {
            ret += e +';';
        }
        return ret;
    }
};

//=============================================
TraceFictionJSUtil = class {
    constructor(options) {
        this.options = options;
        traceFictionJS[options.site]=this;
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

        if(this.options.hasOwnProperty("pageNode")){
            var pageNode = this.GetOptionValue("pageNode", ["page", "id", 0]);
            pages = "<p>" + TFJS_DOM_Helper.GetInnerHTML(pageNode, this.options.pageFilter) + "</p>";
        }
       
        var i, elements = document.getElementsByTagName("link");
        var FontSize = (typeof TraceFictionFontSize === 'undefined')? 32 : TraceFictionFontSize;
        var ForegroundColor = (typeof TraceFictionForegroundColor === 'undefined')? '#000000' : TraceFictionForegroundColor;
        var BackgroundColor = (typeof TraceFictionBackgroundColor === 'undefined')? '#dfdfcf' : TraceFictionBackgroundColor;
        var style = 'style="color:' + ForegroundColor + ";font-size:" + FontSize + "px;line-height:" + (FontSize + FontSize / 3) + 'px;letter-spacing:2px;padding-left:10px; padding-right:10px;"';
        var ctx = "<div " + style + ">" + TFJS_DOM_Helper.GetInnerHTML(titleNode, this.options.titleFilter) + "</div>";
        ctx += pages + '<p id="TraceFictionStartOfChapter"> TraceFictionDetectStartOfChapter</p><div id="TFAllContent" ' + style + ">";
        for (i = 0; i < elements.length; i++)
            elements[i].disabled = !0;
        document.body.style.background = BackgroundColor;
        
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
        if(!this['nextPageUrl']  || this['nextPageUrl'] == "") {
            if(this['nextPage'])
                this.nextPageUrl = this['nextPage']();
            else
                this.nextPageUrl = "";
        }
        return this.nextPageUrl;
    }
}

//=============================================                                                                                                                  
                                                                                                                                
var tempTFObj;
// czbooks.net
tempTFObj = new TraceFictionJSUtil({site:'czbooks.net', titleNode:['name', 'class', 0], contentNode: ['content', 'class', 0], pageNode: ['chapter-nav','class',0] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['content', 'class', 0]);};
tempTFObj.nextPage = function(){return document.getElementsByClassName('next-chapter')[0].href;};

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
tempTFObj.nextPage = function(){return document.getElementsByClassName('button')[0].children[2].children[0].href;};

// 101novel.com
tempTFObj = new TraceFictionJSUtil({site:'101novel.com',  titleNode:['h1', 'tag'], contentNode: ['content'], pageNode: ['thumb'] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist('content');};
tempTFObj.nextPage = function(){return document.getElementById('thumb').children[2].href;};

// jjwxc.net
tempTFObj = new TraceFictionJSUtil({site:'jjwxc.net',  titleNode:['h2', 'tag'], contentNode: ['noveltext','class'], bodyFilter:[['div','tag', 54],'favorite_3'], pageNode: ['noveltitle','class',2] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['noveltext','class']);};
tempTFObj.nextPage = function(){return document.getElementsByClassName('noveltitle')[2].children[0].children[1].href;};
tempTFObj.needComplete = true;

// lcread.com
tempTFObj = new TraceFictionJSUtil({site:'lcread.com',  titleNode:['h2', 'tag'], contentNode: ['ccon'], pageNode: ['tpbtn','class'] });
tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist('ccon');};
tempTFObj.nextPage = function(){return document.getElementById('next').href;};

//traceFictionJS['ck101.org'].getContent();
//TFJS_DOM_Helper.DataCollect(false,false,100);
//TFJS_DOM_Helper.getFirstElementOfScreen();