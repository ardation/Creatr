// JavaScript Document
$('.m-number-dialog').live('pagecreate', function() {
	$(this).find('.m-number-pad-entry input').bind( 'propertychange keyup input paste', function() {
		var top = $(this).closest('.m-number');
    if ( $(this).val().length == top.data('size') )
      top.parent().siblings('.m-dialog-footer').find('.m-number-button').removeClass('ui-disabled');
    else
      top.parent().siblings('.m-dialog-footer').find('.m-number-button').addClass('ui-disabled');
  }).keydown(function(event) {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });
}).live('pagebeforeshow', function() {
	$(this).find('.m-number-pad-entry input').val('');
	$(this).find('.m-number-button').addClass('ui-disabled');
});
$('#page-campaign').live('pagebeforeshow', function() {
  var data = $.jStorage.get($.jStorage.get('current'));
	$('#m-campaign-title').text(data.name);
	$('#m-stats h1').text(data.total);
	$('#m-campaign-address').text(data.cached_domain);
}).live('pagebeforecreate', function() {
  if(!window.PhoneGap) {
    //$('#photobooth-link').remove();
  }
});
$('#page-home').live('pageinit', function() {

	var data = $.jStorage.index();
	//get all from server

	$('#campaign-list li').live('swipe', function() {
		$(this).children('.m-campaign-delete').fadeToggle(100)
		$(this).children('.m-campaign-data').fadeToggle(100);
	}).live('tap', function() {
		if ( $(this).children('.m-campaign-delete:visible').length == 0 ) {
			$.jStorage.set('current', $(this).data('campaign'));
			$.mobile.changePage('#page-campaign', { transition: "slide"})
		}
	});
}).live('pagebeforeshow', function() {
	$('#campaign-list').empty();
	var data = $.grep($.jStorage.index(), function(value) {
  		return value != 'current';
	});
	if (data.length == 0) {
		$('#campaign-list').append( '<li class="ui-li ui-li-static ui-body-g m-campaign"><div class="m-list-prompt"><p class="m-list-empty ui-li-desc">List empty. Try adding a campaign!</p></div></li>' );
	} else {
		$.each(data, function(index, value) {
			var campaign = $.jStorage.get(value);
      if (window.navigator.onLine) {
        $.ajax({
          url:'/api/campaign_code/' + campaign.campaign_code,
          dataType: 'json',
          success: function(campaign) {
            $.jStorage.set(campaign.campaign_code, campaign);
            $('#campaign-list').append( '<li class="ui-li ui-li-static ui-body-g m-campaign" data-campaign="'+campaign.campaign_code+'"><a href="index.html" data-role="button" data-icon="delete" class="m-campaign-delete" data-campaign="'+campaign.campaign_code+'">Delete</a><div class="ui-li-aside m-list-post-time m-campaign-data"><div class="m-icon-arrow"></div>'+campaign.total+' Complete<br><span>'+campaign.campaign_code+'</span></div><div class="m-list-prompt"><p class="m-list-author ui-li-desc"><span class="m-list-author-name">'+campaign.name+'</span><span class="m-list-author-handle">'+campaign.cached_domain+'</span></p></div></li>' )
          }
        });
      } else {
			 $('#campaign-list').append( '<li class="ui-li ui-li-static ui-body-g m-campaign" data-campaign="'+campaign.campaign_code+'"><a href="index.html" data-role="button" data-icon="delete" class="m-campaign-delete" data-campaign="'+campaign.campaign_code+'">Delete</a><div class="ui-li-aside m-list-post-time m-campaign-data"><div class="m-icon-arrow"></div>'+campaign.total+' Complete<br><span>'+campaign.campaign_code+'</span></div><div class="m-list-prompt"><p class="m-list-author ui-li-desc"><span class="m-list-author-name">'+campaign.name+'</span><span class="m-list-author-handle">'+campaign.cached_domain+'</span></p></div></li>' )
		  }
    });
		$('#campaign-list .m-campaign-delete').click(function () {
			$.jStorage.deleteKey($(this).data('campaign'));
			$(this).closest('li').slideUp(100, function() {
				var ul = $(this).parent();
				$(this).remove();
				if ( $(ul).children('li').length == 0 )
					$(ul).append( '<li class="ui-li ui-li-static ui-body-g m-campaign"><div class="m-list-prompt"><p class="m-list-empty ui-li-desc">List empty. Try adding a campaign!</p></div></li>' ).children().hide().slideDown();
			});
		});
	}
});

var add_campaign_submit = function() {
  if($.jStorage.get(parseInt($('#add-campaign-number-pad-entry').val()), false)) {
    $('#add-campaign-error').text("You've already added this campaign ID. Try again!").slideDown(100);
    $('#add-campaign-button').removeClass('ui-disabled');
  } else {
    $('#add-campaign-error').slideUp(100);
    $('#add-campaign-button, #add-campaign-cancel').addClass('ui-disabled');
    $('#add-campaign .m-loader').fadeIn(function () {
      $.ajax({ url:'/api/campaign_code/' + $('#add-campaign-number-pad-entry').val(), dataType: 'json', success: function(campaign) {
        $.jStorage.set(campaign.campaign_code, campaign);
        $.mobile.changePage("#page-home");
      }, error: function() {
        $('#add-campaign-button, #add-campaign-cancel').removeClass('ui-disabled');
        $('#add-campaign .m-loader').fadeOut();
        $('#add-campaign-error').text("That's an invalid Campaign ID. Try again!").slideDown(100);
        $('#add-campaign-number-pad-entry').focus();
      } });
    });
  }
  return false;
}

$('#add-campaign').live('pageinit', function() {
  $('#add-campaign-button').click(add_campaign_submit);
  $('#add-campaign-form').submit(add_campaign_submit);
}).live('pagebeforeshow', function() {
	$('#add-campaign .m-loader').hide();
	$('#add-campaign-error').hide();
});

$('#page-survey').live('pageinit', function() {
	$('#go').click(function() {
    var data = $.jStorage.get($.jStorage.get('current'));
		window.location.href = 'http://'+data.cached_domain+'/';
	});
});

var validator_submit = function () {
  var data = $.jStorage.get($.jStorage.get('current'));
  $('#validator-error, #validator-success').stop().slideUp(100);
  $('#validator-button').addClass('ui-disabled');
  $('#validator .m-loader').fadeIn(function () {
    $.ajax({ url:'/api/'+data.campaign_code+'/sms_code/' + $('#validator-number-pad-entry').val(), dataType: 'json', success: function(data) {
      if (data.validate) {
        $('#validator-number-pad-entry').val('');
        $('#validator-cancel').removeClass('ui-disabled');
        $('#validator .m-loader').fadeOut();
        $('#validator-success').slideDown(100).delay(15000).slideUp(100);
        $('#validator-number-pad-entry').focus();
      } else {
        $('#validator-button, #validator-cancel').removeClass('ui-disabled');
        $('#validator .m-loader').fadeOut();
        $('#validator-error').slideDown(100);
        $('#validator-number-pad-entry').focus();
      }
    }, error: function(data) {
      $('#validator-button, #validator-cancel').removeClass('ui-disabled');
      $('#validator .m-loader').fadeOut();
      $('#validator-error').text($.parseJSON(data.responseText).error);
      $('#validator-error').slideDown(100);
      $('#validator-number-pad-entry').focus();
    } });
  });
  return false;
}

$('#validator').live('pageinit', function() {
	$('#validator-button').click(validator_submit);
  $('#validator-form').submit(validator_submit);
}).live('pagebeforeshow', function() {
	$('#validator .m-loader').hide();
	$('#validator-error, #validator-success').hide();
});

var photo_booth_valid_sms = function () {
  window.photo_sms_code = $('#photo-booth-number-pad-entry').val();
  $('#photo-booth-number-pad-entry').val('');
  $('#photo-booth-cancel').removeClass('ui-disabled');
  $('#photo-booth .m-loader').fadeOut();
  $.mobile.changePage('#photo-booth-ios6 ', { transition: "slide"});
}

var photo_booth_submit = function () {
  var data = $.jStorage.get($.jStorage.get('current'));
    $('#photo-booth-error').stop().slideUp(100);
    $('#photo-booth-button').addClass('ui-disabled');
    $('#photo-booth .m-loader').fadeIn(function () {
      $.ajax({ url:'/api/'+data.campaign_code+'/sms_code/' + $('#photo-booth-number-pad-entry').val(), dataType: 'json', success: photo_booth_valid_sms,
      error: function(data) {
        var decoded = $.parseJSON(data.responseText);
        $('#photo-booth-button, #photo-booth-cancel').removeClass('ui-disabled');
        $('#photo-booth-error').text(decoded.error);
        $('#photo-booth .m-loader').fadeOut();
        $('#photo-booth-error').slideDown(100);
        $('#photo-booth-number-pad-entry').focus();
      } });
    });
    return false;
}

$('#page-sms').live('pageinit', function() {
  var data = $.jStorage.get($.jStorage.get('current'));
  var timer;
  $('#page-sms-search').bind( 'propertychange keyup input paste', function() {
    clearTimeout(timer);
    var ms = 200; // milliseconds
    var val = this.value;

    $('#page-sms-results').html('<div class="m-wrapper"><ul class="ui-listview" data-role="listview" data-theme="g"></div>');
    if ($('#page-sms-search').val() != '') {
      timer = setTimeout(function() {
        $.post('/api/'+data.campaign_code+'/search', { name: $('#page-sms-search').val()}, function(data) {
          $('#page-sms-results').html('<div class="m-wrapper"><ul class="ui-listview" data-role="listview" data-theme="g"></div>');
          $.each(data, function(index, obj) {
            $('#page-sms-results .m-wrapper ul').append('<li class="ui-li ui-li-static ui-body-g m-campaign"><div class="ui-li-aside m-list-post-time m-campaign-data"><a class="btn change_mobile" data-mini="true" data-mobile="'+obj.mobile+'" data-person="'+obj.id+'">Edit</a>&nbsp;&nbsp;<a class="btn btn-success resend_sms" data-mini="true" data-person="'+obj.id+'">Resend</a></div><div class="m-list-prompt"><p class="m-list-author ui-li-desc"><span class="m-list-author-name">'+obj.first_name+' '+obj.last_name+'</span><span class="m-list-author-handle">0'+obj.mobile+'</span></p></div></li>');
          });
          $('.resend_sms').bind('tap', function() {
            var data = $.jStorage.get($.jStorage.get('current'));
            $.get('/api/'+data.campaign_code+'/person/'+$(this).data('person')+'/sms');
            $(this).text('SMS Sent!').addClass('ui-disabled');
          });


          $('.change_mobile').bind('tap', function() {
            window.person = $(this).data('person');
            window.mobile = $(this).data('mobile');
            $.mobile.changePage("#change-mobile");
          });
        }, 'json');
      }, ms);
    }
  });
});
$('#change-mobile').live('pageinit', function() {
  $('#change-mobile-apply').bind('tap', function() {
    var data = $.jStorage.get($.jStorage.get('current'));
    $.post('/api/'+data.campaign_code+'/person/'+window.person+'/mobile', {mobile: $('#change-mobile-pad-entry').val()} );
    $.mobile.changePage('#page-sms');
  });
}).live('pagebeforeshow', function() {
  $('#change-mobile-pad-entry').val("0" + window.mobile);
});

$('#photo-booth').live('pageinit', function() {
  $('#photo-booth-button').click(photo_booth_submit);
  $('#photo-booth-form').submit(photo_booth_submit);
}).live('pagebeforeshow', function() {
	$('#photo-booth .m-loader').hide();
	$('#photo-booth-error, #photo-booth-success').hide();
});

$('#photo-booth-ios6').live('pageinit', function() {
  $('.fileinput-button').click(function() {
      $('#fileupload').trigger('click');
  });
}).live('pagebeforeshow', function() {
  $('#fileupload').fileupload({
    url: '/api/'+$.jStorage.get($.jStorage.get('current')).campaign_code+'/fb_image/' +  window.photo_sms_code,
    dataType: 'json',
    send: function (e, data) {
      $.mobile.changePage('#photo-booth-thanks', { transition: "slide"})
    },
    error: function(data) {
      var decoded = $.parseJSON(data.responseText);
      $('#photo-booth-wait-error').text(decoded.error);
      $('#photo-booth-wait-error').slideDown(100);
      $('#photo-booth-wait .m-loader').fadeOut();
    }
  });
});
