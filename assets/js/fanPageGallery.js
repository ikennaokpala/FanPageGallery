/*
    Fan Page Gallery 
    
    By Ikenna Okpala: http://ikennaokpala.wordpress.com

    To use you must have an facebook fan page ready.
    Also you are required to provide your facebook fan page name. For more on fan page username visit this link: https://www.facebook.com/help/?page=900
    Make sure to pass in valid facebook fan page username.
    
    example:
    <script type="text/javascript" language="javascript">
    $(".fbphotofeed").fanPageGallery({ 

         fanPageName: 'Community.of.Yahweh.Worldwide' //this is the username of the fan page. For more visit this link: https://www.facebook.com/help/?page=900

     });
     </script>
*/

(function($) {
    $.fn.fanPageGallery = function (callerSettings) {
        var settings = $.extend({
            fanPageName: 'ThoughtWorks' // this is the name of the fan page
            
        }, callerSettings||{});
        var fanPageName = settings.fanPageName  
        var fanPhotoTagClass = this.selector.toString()
        
        $(function() {
            if(UtilHelper.isInt(UtilHelper.getUrlVars().id) & UtilHelper.getUrlVars().id > 0)
                FBGallery.getPhotos(UtilHelper.getUrlVars().id, unescape(UtilHelper.getUrlVars().albumname), fanPhotoTagClass);
            else
                FBGallery.getAlbumCollection(fanPageName, fanPhotoTagClass);
        });
        
    };
    var FBGallery = { 
        
        getAlbumCollection: function(fanPageName, fanPhotoTagClass){
            
            return this.ajaxCallForAlbums(fanPageName, fanPhotoTagClass);
        },
        getPhotos: function(album_id, album_name, fanPhotoTagClass){
            var fanPhotoTagClass = $(fanPhotoTagClass);
            var html = "<a href='javascript:history.go(-1)'> BACK TO PHOTO ALBUMS</a> <br/><h1>Pictures from "+album_name+" Album. </h1><br/><ul class='multiple_columns'>";
            $.getJSON("http://graph.facebook.com/"+album_id+"/photos?limit=200&callback=?", function(json) {
                $.each(json.data, function(i, fb){
                    var imagestring = "<img src='"+fb.source+"' alt='Fan Page Gallery for "+album_name+" Album' width='180' height='180' border='1' onmouseover='return overlib(&quot;&lt;img src=\\&quot;"+fb.source+"\\&quot;&gt;&quot;, CAPTION, &quot;"+(typeof fb.name === "undefined" ? UtilHelper.replaceSingleDoubleQuotes(album_name) : UtilHelper.replaceSingleDoubleQuotes(fb.name))+"&quot;, CENTER);' onmouseout='nd();'/>"
                    
                    html += "<li>"+imagestring;
                    html += "<span><br>"+ (typeof fb.name === "undefined" ? album_name : fb.name)+"</span></li>";
                });
                html += "</ul>";
                fanPhotoTagClass.animate({ opacity:0}, 500, function(){
                    fanPhotoTagClass.html(html);
                }) 
                fanPhotoTagClass.animate({opacity:1}, 500);
            }).error(function() { fanPhotoTagClass.html("<a href='javascript:history.go(-1)'> BACK TO PHOTO ALBUMS</a> <br/><span style='background: red; color: white;'><h1> 500: Internal server error. Refresh your browser and try again. </h1></span>"); })
        },
        getFirstPhoto : function (album_id, album_name){
            var photo;
            var pselector = "#album-cover-"+album_id;
            $.getJSON("http://graph.facebook.com/"+album_id+"/photos?callback=?", function(json) {
                photo ="<a href='?id="+album_id+"&albumname="+album_name+"' class='album-cover-image-"+album_id+"' onmouseover='return overlib(\&quot;Click here to view more pictures from the "+album_name+" Album.\&quot;);' onmouseout='nd();' ><img src="+ json.data[0].source+" width='180' alt='Fan Page Gallery for "+album_name+" Album' height='180'  border='1' /></a><br/>";
                $($.trim(pselector)).prepend(photo);
            });
        },
        ajaxCallForAlbums: function(fanPageName, fanPhotoTagClass){
            var fanPhotoTagClass = $(fanPhotoTagClass);
            var tag_id = "";
            var html = "<ul class='multiple_columns'>";
            $.ajax({
                type: "GET",
                url: "http://graph.facebook.com/"+fanPageName+"/albums?callback=?",
                dataType: "json",
                success: function(json, textStatus, jpXHR) {
                    $.each(json.data, function(i, fb){
                        
                        tag_id = "album-cover-"+fb.id;
                        FBGallery.getFirstPhoto(fb.id, fb.name);
                        html += "<li id="+tag_id+">";
                        html += "<span>" + fb.name + "</span><br/> <input class='album_id' type='hidden' value="+fb.id+" ></li>";
                        
                    });
                    html += "</ul>";
                    
                    fanPhotoTagClass.animate({ opacity:0}, 500, function(){
                        fanPhotoTagClass.html(html);
                    });
                    fanPhotoTagClass.animate({opacity:1}, 500);
                    
                }, 
                error: function(httpObject, textStatus, jpXHR){
                    fanPhotoTagClass.html("<span style='background: red; color: white;'><h1> 500: Internal server error. Refresh your browser and try again. </h1></span>")
                }
            });
        }
    };
    var UtilHelper = {
        getUrlVars: function() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                vars[key] = value;
            });
            return vars;
        },
        
        isInt: function(x) { 
            var y = parseInt(x); 
            if (isNaN(y)) 
                return false; 
            else
                return true; 
        },
        replaceSingleDoubleQuotes: function(title){
            var title = title.replace(/\'/g, "\\&#39;")
            title = title.replace(/\"/g, "\\&#34;")
            return title;
        },

        makeClickable: function(title) {
            var pattern = /(ftp|https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
            if (title.match(pattern) == null || title.match(pattern).length == 0) {
             return title;
            } else {
            var href = title.match(pattern)[0];
            var newtitle = title.replace(pattern, "<a target='_blank' href='" + href + "'>" + href + "</a>");
            return newtitle
           }     
        }
    };
    
})(jQuery);

 
