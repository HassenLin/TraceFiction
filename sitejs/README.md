# sitejs.json format

## global
 For all site
 
 ### removeAllScript
    Trigger on site load every component complete. It will remove original JavaScript tags's childs.
 ### toCHS.macro
    Trigger on site user request. It will change CHT to CHS using tongwen service.
 ### toCHT.macro
    Trigger on site user request. It will change CHS to CHT using tongwen service.
    
## sites
 ### "site name"-needComplete
    Trigger on site load every component complete. This is flag only, when exist, it will stop load other another component in this site, may help disalbe non-stop site.
 ### "site name"-check
    Trigger on site load every component complete. It help detect main content wad loaded. 
    Return "yes" or "no".
 ### "site name"
    Trigger on site load complete (site check pass). 
    Get readable text context form html.
    1 TraceFiction will call with arguments: size (html font size) ,fcolor (html font color) and bcolor (html background color)
    2 add "TraceFictionDetectStartOfChapter" in content start
    3 add "TraceFictionDetectEndOfChapter" in content end
    Return readable text context.
 ### "site name"-nextPage
    Trigger on TTS read to TraceFictionDetectEndOfChapter.
    return next page url.
    
# Tools
 ## Javascript editor
    Unpack online json:string content to human viewable  
    https://beautifier.io/
 ## Javascript packer
    Pack javascript into one line json:string
    http://dean.edwards.name/packer/
        
