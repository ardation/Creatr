var stripeResponseHandler;

stripeResponseHandler = function(status, response) {
  var token;
  if (response.error) {
    $(".payment-errors").html("<div class=\"alert alert-error\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">×</button><strong>Error</strong> " + response.error.message + "</div>");
    return $(".submit-button").attr("disabled", "");
  } else {
    token = response["id"];
    $.getJSON("/dashboard/billing/credit_card", {token: token}, function(data) {
      $("#payment-form")[0].reset();
      $(".payment-errors").html("<div class=\"alert alert-success\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">×</button>Saved Successfully</div>");
    }).error(function() { $(".payment-errors").html("<div class=\"alert alert-error\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">×</button> Unable to save your billing information. Contact <a href=\"maito:creator@godmedia.org.nz\">Support</a> if the problem persists.</div>"); });
  }
};

$(document).ready(function() {
  $("#payment-form").submit(function(event) {
    $(".submit-button").attr("disabled", "disabled");
    Stripe.createToken({
      number: $(".card-number").val(),
      name: $(".card-name").val(),
      cvc: $(".card-cvc").val(),
      exp_month: $(".card-expiry-month").val(),
      exp_year: $(".card-expiry-year").val()
    }, stripeResponseHandler);
    return false;
  });

  // Javascript to enable link to tab
  var url = document.location.toString();
  if (url.match('#')) {
      $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
  }

  // Change hash for page-reload
  $('.nav-tabs a').on('shown', function (e) {
      window.location.hash = e.target.hash;
  });
});
