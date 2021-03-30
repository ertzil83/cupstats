
//TIMELINE FUNCTIONS
function animateTimeline()
{
  
   var scroll=$('#tline_info');
  scroll.animate({scrollTop: scroll.prop("scrollHeight")},20000,function(){
    animateTimelineTop();   
   });
}
function animateTimelineTop()
{
  var scroll=$('#tline_info');
  scroll.animate({scrollTop: 0},20000,function(){
    animateTimeline();   
   });
}

function loadTimeline()
{
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      timeline_json= JSON.parse(this.responseText);
      console.log(timeline_json);
      document.querySelectorAll(".overlay_button").forEach(a=>a.style.display = "block");
    }
  });
  var jwt="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJza2lwIjowLCJpZFBhcnRpZG8iOjE0NjkxLCJ0YWtlIjoxMDAsImlkaW9tYSI6ImVzIn0.PAHwZQOVsl6j2mGCfQJCZ2MUytSjMzuto4CTNKNQGtE";
  var url="https://api.realsociedad.com/api/Timeline/GetTimelinePartido?jwt="+jwt;
  xhr.open("GET", url);
  
  
  xhr.send();
}

var timeline_json;