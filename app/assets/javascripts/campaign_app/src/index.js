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
			$('#campaign-list').append( '<li class="ui-li ui-li-static ui-body-g m-campaign" data-campaign="'+campaign.campaign_code+'"><a href="index.html" data-role="button" data-icon="delete" class="m-campaign-delete" data-campaign="'+campaign.campaign_code+'">Delete</a><div class="ui-li-aside m-list-post-time m-campaign-data"><div class="m-icon-arrow"></div>'+campaign.total+' Complete<br><span>'+campaign.campaign_code+'</span></div><div class="m-list-prompt"><p class="m-list-author ui-li-desc"><span class="m-list-author-name">'+campaign.name+'</span><span class="m-list-author-handle">'+campaign.cached_domain+'</span></p></div></li>' )
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
  $('#fileupload').fileupload({
    url: '/api/'+$.jStorage.get($.jStorage.get('current')).campaign_code+'/fb_image/' +  window.photo_sms_code,
    dataType: 'json',
    send: function (e, data) {
      $.mobile.changePage('#photo-booth-wait', { transition: "slide"})
    },
    done: function (e, data) {
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
