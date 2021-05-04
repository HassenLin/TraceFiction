# util.js


 util.js include 3 parts. <br/>
 There first 2 parts are TFJS_DOM_Helper object and TraceFictionJSUtil object. <br/>
 The 3rd part is site configure code, play see next section. <br/>

 ## filter 
  `filter has Several types. 
   "name" : match id == name 
   ["name"] : match id == name 
   ["name", "id"] : match id == name 
   ["name", "tag"] : match first tag == name 
   ["name", "class"] : match first class == name 
   ["name", "tag", index] : get index of all match tag == name 
   ["name", "class", index] : get index of all match class == name` 
   
 ## TFJS_DOM_Helper
   TFJS_DOM_Helper is DOM util code, please DO NOT modify by user.

   ### ObjToStr : function (obj)
     Debug function. Convbert object to string.

   ### AddFontFamily : function(name, url) // call by app  
     Add font file to html head.

   ### AddScript : function(url) // call by app
     Add Java Script file to html head.
   
   ### Filter:
     Create filter object 

   ### CheckRemoveItem : function(element, filter) 
     Remove element and it's childs when filter pass. then returen result.

   ### removeItemFilter : function(element, filters)
     filters is filter array. <br/>
     traversal element tree. Remove each element and it's childs when one of filter pass.
       
   ### SearchNode : function(node) {
     Search document element by filter. return {element:element,name:name,type:type,index:index};
    
   ### CheckNodeExist : function(node) 
     node is filter. <br/>
     Convert SearchNode result to 'yes' or 'no'
    
   ### RemoveNodes : function(nodes)
     nodes is filte array. <br/>
     Search document element by nodes array. And remove it when one of filter pass.

   ### GetInnerHTML : function(node, filters)
     node is filter. <br/>
     filters is filter array. <br/>
     get document element by node, and remove not required elements by filters. return element's innerHTML.

   ### getNextNode : function (node)
     node is element.<br/>
     get next node in html order.

   ### getNextTextNode: function(node)
     node is element.<br/>
     get next text node in html order.

   ### getNextHTMLNode: function(node) 
     node is element.<br/>
     get next html tag node in html order.

   ### getFirstElementOfScreen : function()
     get first element of current screen.
   
   ### DataCollect : function (newStart, fromTop ,yoff) // call by app
     get text collection for speech format.

   ### InitSupportHosts : function () 
     init site collection.

   ### IsSiteSupported : function () 
      retrun 'yes' when site is supported.

 ## TraceFictionJSUtil

   ### constructor(options)
    `options :
       site : text, require, site name. 
       titleNode : filter, require, document title. 
       titleFilter : filter array, optional, remove unnecessary inforamtion in title. 
       contentNode : filter, require, document content. 
       contentFilter : filter array, optional, remove unnecessary inforamtion in content. 
       pageNode : filter, require, prev chapter, next chapter. 
       pageFilter : filter array, optional, remove unnecessary inforamtion in pageNode. 
     save options and init.`

   ### GetOptionValue(name, defvalue)
     get option item.

   ### SingleChapterContent() // call by app
     convert html to read friendly mode.

   ### CheckNeedWaitComplete() // call by app
    `check needComplete member exist. 
     when needComplete member exist, app will wait all item loaded. 
     when needComplete member no exist, app will only wait html page loaded. `
   
   ### GetNextPage()
      check nextPageUrl member exist and return it's value.

   ### check : function()
      user defined, check document loaded flag.

   ### nextPage : function()
      user defined, next chapter url.

   ### ChapterList : function()
      user defined, next chapter list url.

   ### needComplete : bool
      user defined, see CheckNeedWaitComplete().

# site configure code
 `var tempTFObj;
 // czbooks.net
 tempTFObj = new TraceFictionJSUtil({site:'czbooks.net', titleNode:['name', 'class', 0], contentNode: ['content', 'class', 0], pageNode: ['chapter-nav','class',0] });
 tempTFObj.check = function(){return TFJS_DOM_Helper.CheckNodeExist(['content', 'class', 0]);};
 tempTFObj.nextPage = function(){return TFJS_DOM_Helper.SearchNode(['next-chapter','class']).href;}
 tempTFObj.ChapterList = function(){return TFJS_DOM_Helper.SearchNode(['position','class']).children[1].href;}
 ...
 TFJS_DOM_Helper.InitSupportHosts();`

    
# Tools
 ## Javascript editor
    Unpack online json:string content to human viewable  
    <https://beautifier.io/>
 ## Javascript packer
    Pack javascript into one line json:string
    <http://dean.edwards.name/packer/>
        
