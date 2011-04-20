jQuery(function($) {
   
    if(GetAlbums.isInt(GetAlbums.getUrlVars().id) & GetAlbums.getUrlVars().id > 0)
        GetAlbums.getPhotos(GetAlbums.getUrlVars().id, unescape(GetAlbums.getUrlVars().albumname));
    else
        GetAlbums.getVideos();
        GetAlbums.getAlbumCollection();
});

var GetAlbums = { 
    getVideos: function(){  
        var groupVideos = $('.fbvideofeed');
 var html = "<ul class='multiple_columns'>";
        $.getJSON("http://graph.facebook.com/Community.of.Yahweh.Worldwide/videos?callback=?", function(json) {
            console.log(json)
           /* $.each(json.data, function(i, fb){
                html += "<li > "+fb.source+"</li>"
            })*/
                })
        html += "</ul>";
        groupVideos.animate({ opacity:0}, 500, function(){
            groupVideos.html(html);
        });
        groupVideos.animate({opacity:1}, 500);
                
    },
    getAlbumCollection: function(){
        
        var groupAlbums = $('.fbphotofeed');
        var tag_id = "";
        var html = "<ul class='multiple_columns'>";
        $.ajax({
            type: "GET",
            url: "http://graph.facebook.com/Community.of.Yahweh.Worldwide/albums?callback=?",
            dataType: "json",
            success: function(json, textStatus, jpXHR) {
               
                $.each(json.data, function(i, fb){
                    if(fb.name=="Profile Pictures" || fb.name=="Wall Photos" || fb.name=="Community of Yahweh Women Association Conference 2010"){
                       
                    }else{
                        tag_id = "album-cover-"+fb.id;
                        GetAlbums.getFirstPhoto(fb.id, fb.name);
                        html += "<li id="+tag_id+">";
                        html += "<span>" + fb.name + "</span><br/> <input class='album_id' type='hidden' value="+fb.id+" ></li>";
                        //console.log("Finished loop number: "+i)
                        // console.log("ID is: "+fb.id+" Album name is: "+fb.name);
                    }
                });
                  html += "</ul>";
                groupAlbums.animate({ opacity:0}, 500, function(){
                    groupAlbums.html(html);
                });
                groupAlbums.animate({opacity:1}, 500);
                
            }, 
            error: function(httpObject, textStatus, jpXHR){
                $('.fbphotofeed').html("<span style='background: red; color: white;'><h1> 500: Internal server error. Refresh your browser and try again. </h1></span>")
            }
        });
    },
    getPhotos: function(album_id, album_name){
        $('.fbvideofeed').hide();
        var groupPhotos = $('.fbphotofeed');
        var html = "<a href='javascript:history.go(-1)'> BACK TO PHOTO ALBUMS</a> <br/><h1>Pictures from "+album_name+" Album. </h1><br/><ul class='multiple_columns'>";
        $.getJSON("http://graph.facebook.com/"+album_id+"/photos?callback=?", function(json) {
            $.each(json.data, function(i, fb){
              var imagestring = "<img src='"+fb.source+"' alt='CYW' width='180' height='180' border='1' onmouseover='return overlib(&quot;&lt;img src=\\&quot;"+fb.source+"\\&quot;&gt;&quot;, CAPTION, &quot;"+ (typeof fb.name === "undefined" ? album_name : fb.name)+"&quot;, CENTER);' onmouseout='nd();'/>"
                
                html += "<li>"+imagestring;
                html += "<span>"+ (typeof fb.name === "undefined" ? album_name : fb.name)+"</span></li>";
            });
            html += "</ul>";
            groupPhotos.animate({ opacity:0}, 500, function(){
                groupPhotos.html(html);
                }) 
        
            groupPhotos.animate({opacity:1}, 500);
        }).error(function() { $('.fbphotofeed').html("<a href='javascript:history.go(-1)'> BACK TO PHOTO ALBUMS</a> <br/><span style='background: red; color: white;'><h1> 500: Internal server error. Refresh your browser and try again. </h1></span>"); })
    },
    getFirstPhoto : function (album_id, album_name){
        var photo;
        var pselector = "#album-cover-"+album_id;
        $.getJSON("http://graph.facebook.com/"+album_id+"/photos?callback=?", function(json) {
            photo ="<a href='?id="+album_id+"&albumname="+album_name+"' class='album-cover-image-"+album_id+"' onclick='GetAlbums.getPhotos("+album_id+")' onmouseover='return overlib(\&quot;Click here to view more pictures from the "+album_name+" Album.\&quot;);' onmouseout='nd();' ><img src="+ json.data[0].source+" width='180' height='180'  border='1' /></a><br/>";
            $($.trim(pselector)).prepend(photo);
        });
    },
    getUrlVars: function() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    },
    callOverlay: function(){
       var imgwidth=  $('li img').width();
        $('#box').css({
            width:"800px",
            }).show();
        $('#overlay').fadeIn('fast', function() {
            $('#box').animate({
                'top':'70px'
            }, 500);
        });
    },
    isInt: function(x) { 
        var y=parseInt(x); 
        if (isNaN(y)) 
            return false; 
        else
            return true; 
 } 
    
};

