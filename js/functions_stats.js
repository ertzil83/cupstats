// Side menu functions

function startStats()
{
  
  //loadExampleFromLocal();
  
  setInterval(function(){ 
    console.log("Actualizando información: ");
    loadExampleOnline();
    
  }, 120*1000);
  loadExampleOnline();
}

function loadExampleOnline()
{
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      stats= JSON.parse(this.responseText);
      
      home_playerlist=stats.SoccerFeed.SoccerDocument.Team[0].Player;
      home_teamInfo=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[0];
      away_playerlist=stats.SoccerFeed.SoccerDocument.Team[1].Player;
      away_teamInfo=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[1];
      teamInfo=away_teamInfo;
      playerlist=away_playerlist;
      // getMatchResult();
      loadMatchData();     
      loadLineUp();
      completeCarrousel();
      
      document.querySelectorAll(".overlay_button").forEach(a=>a.style.display = "block");
    }
  });
  
  xhr.open("GET", "https://cors.bridged.cc/https://secure.omo.akamai.opta.net/?game_id=2136448&feed_type=f9&user=RealSociedad&psw=zcgmFn8QFd&json=%22%22");
  
  
  xhr.send();

}
function showTeamAndPlayer()
{
  document.querySelectorAll("#p_car_div").forEach(a=>a.style.display = "none");
  document.querySelectorAll("#match_stats").forEach(a=>a.style.display = "block");
  document.querySelectorAll("#lineup_div").forEach(a=>a.style.display = "block");
  document.querySelectorAll("#player_stats").forEach(a=>a.style.display = "none");
}

function showPlayerData()
{
  document.querySelectorAll("#lineup_div").forEach(a=>a.style.display = "none");
  document.querySelectorAll("#match_stats").forEach(a=>a.style.display = "none");
  document.querySelectorAll("#player_stats").forEach(a=>a.style.display = "none");
  document.querySelectorAll("#p_car_div").forEach(a=>a.style.display = "block");
}

function showSinglePlayerData()
{
  
  document.querySelectorAll("#match_stats").forEach(a=>a.style.display = "none");
  document.querySelectorAll("#player_stats").forEach(a=>a.style.display = "block");
  
}

function animateData()
{
 
  var all = document.getElementsByClassName('data_box');
  for (var i = 0; i < all.length; i++) {
    
    animateCSS(all[i], 'flash');
   
  }
}

function loadMatchData()
{
  
  document.getElementById("h_shots").textContent=getStatInfo(home_teamInfo,"total_scoring_att");
  document.getElementById("h_shots_ot").textContent=getStatInfo(home_teamInfo,"ontarget_scoring_att");
  document.getElementById("h_pass").textContent=getStatInfo(home_teamInfo,"total_pass");
  document.getElementById("h_poss").textContent="%"+getStatInfo(home_teamInfo,"possession_percentage");
  document.getElementById("h_fouls").textContent=getStatInfo(home_teamInfo,"fk_foul_lost");
  document.getElementById("h_corners").textContent=getStatInfo(home_teamInfo,"won_corners");
  document.getElementById("h_yellow").textContent=getStatInfo(home_teamInfo,"total_yel_card");
  document.getElementById("h_red").textContent=getStatInfo(home_teamInfo,"total_red_card");
  document.getElementById("a_shots").textContent=getStatInfo(away_teamInfo,"total_scoring_att");
  document.getElementById("a_shots_ot").textContent=getStatInfo(away_teamInfo,"ontarget_scoring_att");
  document.getElementById("a_pass").textContent=getStatInfo(away_teamInfo,"total_pass");
  document.getElementById("a_poss").textContent="%"+getStatInfo(away_teamInfo,"possession_percentage");
  document.getElementById("a_fouls").textContent=getStatInfo(away_teamInfo,"fk_foul_lost");
  document.getElementById("a_corners").textContent=getStatInfo(away_teamInfo,"won_corners");
  document.getElementById("a_yellow").textContent=getStatInfo(away_teamInfo,"total_yel_card");
  document.getElementById("a_red").textContent=getStatInfo(away_teamInfo,"total_red_card");
  if (!isFirstLoad)
    animateData();
  else
    isFirstLoad=false;
  
}

function getStatInfo(team,name)
{
  var value=0;
  for(var i=0; i<team.Stat.length; i++)
  {
    if(team.Stat[i]["@attributes"].Type==name)
    {
      
      value=team.Stat[i]["@value"];
      break;
    }
    
  }
 
  return value;
}

function loadPlayerData()
{
  loadLineUp();
}

function loadExloadExampleFromLocalample()
{
  stats= JSON.parse(match_end);
 // console.log(stats);
  document.querySelectorAll(".basic_button").forEach(a=>a.style.display = "block");
  playerlist=stats.SoccerFeed.SoccerDocument.Team[0].Player;
  teamInfo=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[0];
  getMatchResult();
}

function loadLineUp()
{
  lineup=teamInfo.PlayerLineUp.MatchPlayer;
 
  var lineup_content="";
  for (var i = 0; i < 11; i++) {
    var player=lineup[i];
    var player_id=player["@attributes"].PlayerRef;
    var number=player["@attributes"].ShirtNumber;
    var name=getPlayerName(player_id);
    if (i==11)
      lineup_content=lineup_content+"<h1>Ordezkoak</h1></br>";
    lineup_content=lineup_content+"<button  class='player_button' onclick='loadPlayerInfo(\"" + player_id + "\")'>"+ number + " "+ name+" "+checkCards(player_id)+" "+checkGoals(player_id)+"</button>"+" "+checkSubstitutions(player_id)+"</br>";
 }
 var div = document.getElementById('lineup_div');
 div.innerHTML ="";
 div.innerHTML = lineup_content;
 stopCarAnim();
}

function checkSubstitutions(id)
{
  var result="";
  var subOnID;
  if(teamInfo.hasOwnProperty('Substitution'))
  {
    var sub_list=teamInfo.Substitution;
    if(Array.isArray(sub_list))
      for (var i = 0; i < sub_list.length; i++)
      {
        if(sub_list[i]["@attributes"].SubOff==id)
        {
          subOnID=sub_list[i]["@attributes"].SubOn;
          result=" ⇆ "+"<button  class='player_button' onclick='loadPlayerInfo(\"" + subOnID + "\")'>"+getPlayerNumber(subOnID) + " "+ getPlayerName(subOnID) + " "+checkCards(subOnID) +" "+checkGoals(subOnID)+"</button>";
          break;
        }
      }
    else
    {
      if(sub_list["@attributes"].SubOff==id)
        {
          subOnID=sub_list["@attributes"].SubOn;
          result=" ⇆ "+"<button  class='player_button' onclick='loadPlayerInfo(\"" + subOnID + "\")'>"+getPlayerNumber(subOnID) + " "+ getPlayerName(subOnID) + " "+checkCards(subOnID) +" "+checkGoals(subOnID)+"</button>";
          
        }
    }
    
  }
  return result;
}

function checkCards(id)
{
  var result="";
  if(teamInfo.hasOwnProperty('Booking'))
  {
    var book_list=teamInfo.Booking;
    if(Array.isArray(book_list))
    {
      for (var i = 0; i < book_list.length; i++)
      {
        if(book_list[i]["@attributes"].PlayerRef==id)
        {
          if(book_list[i]["@attributes"].Card=="Yellow")
            result=result+"🟨";
          if(book_list[i]["@attributes"].Card=="Red")
            result=result+"🟥";
        }
      }
    }
    else
    {
      if(book_list["@attributes"].PlayerRef==id)
        {
          if(book_list["@attributes"].Card=="Yellow")
            result=result+"🟨";
          if(book_list["@attributes"].Card=="Red")
            result=result+"🟥";
        }
    }
    
    
    
  }
  return result;
}

function checkGoals(id)
{
  var result="";
  if(teamInfo.hasOwnProperty('Goal'))
  {
    
    var goal_list=teamInfo.Goal;
    
    if(Array.isArray(goal_list))
    {
      for (var i = 0; i < goal_list.length; i++)
      {
        if(goal_list[i]["@attributes"].PlayerRef==id)
        {
          result=result+"⚽";
        }
      }
    }
    else
    {
     
      if(goal_list["@attributes"].PlayerRef==id)
        {
          
          result=result+"⚽";
        }
    }
    
  }
  return result;
}

function getPlayerName(id)
{
  var name="";
  for (var i = 0; i < playerlist.length; i++)
  {
    var player=playerlist[i];
    if(id==player["@attributes"].uID)
    {
      if(player.PersonName.hasOwnProperty('Known'))
        name=player.PersonName.Known;
      else
        name=player.PersonName.First+" "+player.PersonName.Last;
      break;
    }
  }
  return name;
}

function getPlayerNumber(id)
{
  var number="";
  for (var i = 0; i < lineup.length; i++)
  {
    var player=lineup[i];
    if(id==player["@attributes"].PlayerRef)
    {
      number=player["@attributes"].ShirtNumber;
      break;
    }
      
  }
  return number;
}

//Overlay functions



function loadPlayerInfo(id)
{
  var player_name=getPlayerName(id);
  var player_number=getPlayerNumber(id);
 
  document.getElementById("p_name").textContent=player_name;
  document.getElementById("p_number").textContent=player_number;("../img/background.png");
  document.getElementById("player_sp").src ="https://raw.githubusercontent.com/ertzil83/cupstats/master/img/Jugadores/"+id+".png";
  document.getElementById("p_pass").textContent=loadPlayerStat(id,"total_pass");
  document.getElementById("p_g_pass").textContent="%"+loadPlayerStat(id,"accurate_pass");
  document.getElementById("p_rec").textContent=loadPlayerStat(id,"ball_recovery");
  document.getElementById("p_p_min").textContent=loadPlayerStat(id,"mins_played");
  showSinglePlayerData();
 // document.querySelectorAll("#player_stats").forEach(a=>a.style.display = "block");
}

function loadPlayerStat(id,stat_name)
{
  var selected_player;
  var value=0;
  for (var i = 0; i < lineup.length; i++)
  {
    var player=lineup[i];
    var player_id=player["@attributes"].PlayerRef;
    if(id==player_id)
    {
      selected_player=player;
      break;
    }
  }
  
  for(var j=0; j<selected_player.Stat.length;j++)
  {
    if(selected_player.Stat[j]["@attributes"].Type==stat_name)
    {
      value=selected_player.Stat[j]["@value"];
      break;
    }
   
  }
  return value;
}

function loadPlayerStats(id)
{
  var selected_player;
  for (var i = 0; i < lineup.length; i++)
  {
    var player=lineup[i];
    var player_id=player["@attributes"].PlayerRef;
    if(id==player_id)
    {
      selected_player=player;
      break;
    }
  }
  var stats_info="";
  for(var j=0; j<selected_player.Stat.length;j++)
  {
    
    stats_info=stats_info+"<span class='player_stat'>"+selected_player.Stat[j]["@attributes"].Type+" : "+selected_player.Stat[j]["@value"]+"</span></br>";
  }
  return stats_info;
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

//Team Stats funcstions
function loadTeamStats()
{
  document.getElementById("myNav").style.width = "100%";
  var info_txt="<img class='player_img' src='https://www.realsociedad.eus/Content/img/Escudo-head.png'  style='width:200px'></br>";
  var div = document.getElementById('player_overlay_div');
  div.innerHTML="";
  div.innerHTML += info_txt + getTeamStatInfo();
}

function getTeamStatInfo()
{
  var team_stat="";
  for(var i=0; i<teamInfo.Stat.length; i++)
  {
    team_stat=team_stat+"<span class='player_stat'>"+teamInfo.Stat[i]["@attributes"].Type+" : "+teamInfo.Stat[i]["@value"]+"(FH: "+teamInfo.Stat[i]["@attributes"].FH+" - SH: "+teamInfo.Stat[i]["@attributes"].SH+")</span></br>";
  }
  return team_stat;
}

//Result functions
function getMatchResult()
{
  var home=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[0]["@attributes"].Score;
  var away=stats.SoccerFeed.SoccerDocument.MatchData.TeamData[1]["@attributes"].Score;
  console.log(home+" - "+away);
  var div = document.getElementById('result_div');
  div.innerHTML += "<h1>"+home+" - "+away+"</h1></br><h2>"+getMatchTime()+"</h2></br>";
}
//Time functions
function getMatchTime()
{
  var time="";
  var match_stats=stats.SoccerFeed.SoccerDocument.MatchData.Stat;
  for(var i=0; i< match_stats.length;i++)
  {
    if(match_stats[i]["@attributes"].Type=="match_time")
    {
      time=match_stats[i]["@value"];
      break;
    }
  }
 return time;
}

//carrousel functions

function startCarAnim()
{
  console.log("START");
  var slider = $('#myCarousel').carousel();
  slider.carousel('cycle');
}


function stopCarAnim()
{
  console.log("PAUSE");
  var slider = $('#myCarousel').carousel();
  slider.carousel('pause');
  console.log(slider);
}
function completeCarrousel()
{
  var car_items="";
  for (var i = 0; i < 11; i++)
  {
    var player=lineup[i];
    var player_id=player["@attributes"].PlayerRef;
    if(i==0)
      car_items=car_items+ getCarrouselItem(player_id,"active");
    else
      car_items=car_items+ getCarrouselItem(player_id,"");
    var subID=getSubstitutionId(player_id);
    if(subID!="")
      car_items=car_items+ getCarrouselItem(subID,"");
  }
  document.getElementById("player_stat_car").innerHTML =car_items;
  $("#myCarousel").carousel({interval: 500});
  
}


function getSubstitutionId(id)
{
  var result="";
  
  if(teamInfo.hasOwnProperty('Substitution'))
  {
    var sub_list=teamInfo.Substitution;
    if(Array.isArray(sub_list))
      for (var i = 0; i < sub_list.length; i++)
      {
        if(sub_list[i]["@attributes"].SubOff==id)
        {
          result=sub_list[i]["@attributes"].SubOn;
          break;
        }
      }
    else
    {
      if(sub_list["@attributes"].SubOff==id)
        {
          result=sub_list["@attributes"].SubOn;
          
        }
    }
    
  }
  return result;
}

function getCarrouselItem(id,active)
{
  var number=getPlayerNumber(id);
  var name=getPlayerName(id);
  var photo="https://raw.githubusercontent.com/ertzil83/cupstats/master/img/Jugadores/"+id+".png"//"https://tag.realsociedad.eus/contenido/media/2021/03/"+id+".png";
  var stat1=loadPlayerStat(id,"total_pass");
  var stat2="%"+loadPlayerStat(id,"accurate_pass");
  var stat3=loadPlayerStat(id,"ball_recovery");
  var stat4=loadPlayerStat(id,"mins_played");
  var car_item='<div class="carousel-item '+active+'">'+
  '<div class="overlay_stat_div">'+  
    '<div class="player_stats_name">'+
      '<span class="player_name" id="p_name">'+name+'</span>'+
    '</div>'+    
    '<div class="player_stats_photo">'+      
      '<img id="player_sp" src="'+photo+'"/>'+    
      '<span class="player_number" >'+number+'</span>'+
    '</div>'+  
    '<div class="player_stats_info">'+
      '<div class="player_stat_row">'+
        '<div class="player_stats_row_name">'+
          '<span class="p_stat_name">Paseak guztira</span>'+
        '</div>'+
        '<div class="player_stats_row_value">'+
          '<div class="data_box_player">'+
            '<span class="p_stat_data" >'+stat1+'</span>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="player_stat_row">'+
        '<div class="player_stats_row_name">'+
          '<span class="p_stat_name">Loren ipsum</span>'+
        '</div>'+
        '<div class="player_stats_row_value">'+
          '<div class="data_box_player">'+
            '<span class="p_stat_data" >'+stat2+'</span>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="player_stat_row">'+
        '<div class="player_stats_row_name">'+
          '<span class="p_stat_name">Berreskuratzeak</span>'+
        '</div>'+
        '<div class="player_stats_row_value">'+
          '<div class="data_box_player">'+
            '<span class="p_stat_data" >'+stat3+'</span>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="player_stat_row">'+
        '<div class="player_stats_row_name">'+
          '<span class="p_stat_name">Jokatutako minutuak</span>'+
        '</div>'+
        '<div class="player_stats_row_value">'+
          '<div class="data_box_player">'+
            '<span class="p_stat_data" >'+stat4+'</span>'+
          '</div>'+
        '</div>'+
      '</div>'+             
    '</div>'+
  '</div>'+
'</div>';
return car_item;
}

//OVERLAY SOCIAL CARROUSEL
function showSocialCarrousel()
{
  document.querySelectorAll("#s_car_div").forEach(a=>a.style.display = "block");
}



var stats;
var lineup;
var isFirstLoad=true;
var home_playerlist;
var home_teamInfo;
var away_playerlist;
var away_teamInfo;
var playerlist;
var teamInfo;
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
   // const node = document.querySelector(element);

    element.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    element.addEventListener('animationend', handleAnimationEnd, {once: true});
  });

