$(function() {
  
  
    GetAlbums.getAlbumCollection();
});

var GetAlbums = {
    
    alert_me: function(){
        
        //console.log("i got called")
        //alert("i got called also !! :)")
    },
    getAlbumCollection: function(){
        
        var groupAlbums = $('.fbphotofeed');
        var tag_id = "";
        var html = "<ul class='multiple_columns'>";
        $.ajax({
            type: "GET",
            url: "http://graph.facebook.com/Community.of.Yahweh.Worldwide/albums?callback=?",
            dataType: "json",
            success: function(json) {
                $.each(json.data, function(i, fb){
                    if(fb.name=="Profile Pictures" || fb.name=="Wall Photos" || fb.name=="Community of Yahweh Women Association Conference 2010"){
                        // console.log("ID is: "+fb.id+" Album name is: "+fb.name+" Not Included :)");
                    }else{
                        tag_id = "album-cover-"+fb.id;
                        GetAlbums.getFirstPhoto(fb.id);
                        html += "<li id="+tag_id+">";
                        html += "<span>" + fb.name + "</span><br/> <input class='album_id' type='hidden' value="+fb.id+" ></li>";
                        //console.log("Finished loop number: "+i)
                        // console.log("ID is: "+fb.id+" Album name is: "+fb.name);
                    }
                });
                  html += "</ul>";
                // console.log(html);
                groupAlbums.animate({ opacity:0}, 500, function(){
                    // console.log(html);
                    groupAlbums.html(html);
                    // $('.facebookfeed').append(html);
                });
                groupAlbums.animate({opacity:1}, 500);
                
            }
        });
    },
    getPhotos: function(album_id){
        
        var groupPhotos = $('.fbphotofeed');
        var html = "<ul class='multiple_columns'>";
        $.getJSON("http://graph.facebook.com/"+album_id+"/photos?callback=?", function(json) {
            //  console.log("inside getJson call, I got clicked "+album_id);
           

            $.each(json.data, function(i, fb){
               
                html += "<li><img src=" + fb.source + " width='180' height='180' border='1'/>";
                html += "<span>"+ (typeof fb.name === "undefined" ? "CYW Photos" : fb.name)+"</span></li>";
                // console.log("This is the name "+fb.name+" this is the count "+i);
            });
            html += "</ul>";
            // console.log(html)
          
            groupPhotos.animate({ opacity:0}, 500, function(){
                   groupPhotos.html(html);
                }) 
        
            groupPhotos.animate({opacity:1}, 500);
        })
       // GetAlbums.callOverlay();
        
    },
    getFirstPhoto : function (album_id){
        var photo;
        var pselector = "#album-cover-"+album_id;
        // console.log("i got called");
        $.getJSON("http://graph.facebook.com/"+album_id+"/photos?callback=?", function(json) {
            photo ="<a href='#' class='album-cover-image-"+album_id+"' onclick='GetAlbums.getPhotos("+album_id+")' ><img src="+ json.data[0].source+" width='180' height='180'  border='1' /></a><br/>";
            $($.trim(pselector)).prepend(photo);
            // console.log("ID is: "+album_id+" Photo from getJson: "+photo);
            
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
    }
    
};
