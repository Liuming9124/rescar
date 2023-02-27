$(document).ready(function(){
  $("#showsto").hide();
  $("#cus").click(function(){
    $("#showcus").show();
    $("#showsto").hide();
  });
  $("#sto").click(function(){
    $("#showcus").hide();
    $("#showsto").show();
  });
});

n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = y + "/" + m + "/" + d;
