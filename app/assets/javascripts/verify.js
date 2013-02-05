$(document).ready(function() {
  $('#code').keyup(function(event) {
    if($('#code').val().length == 5) {
      $.post('/verify', {num: $('#code').val()}, function(data) {
        console.log(data);  
        if(data == true) {
          $("body").css("background-color", "green");
          $('#code').val("");
        }
        else 
         $("body").css("background-color", "red"); 
      });
    }
    else {
      $("body").css("background-color", "white");
    }
  });
}); 