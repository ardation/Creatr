// JavaScript Document
$('.m-number-dialog').live('pagecreate', function() {
	$(this).find('.m-number-pad a').live('vmousedown', function() {
		$(this).addClass('down');
	}).on('tap', function() {
		var top = $(this).closest('.m-number');
		var content = top.find('.m-number-pad-entry input');
		if (content.val().length < top.data('size')) {
			content.val(content.val() + $(this).text());
			if (content.val().length == top.data('size')) {
				 top.find('.m-number-pad a').addClass('ui-disabled');
				 top.parent().siblings('.m-dialog-footer').find('.m-number-button').removeClass('ui-disabled');
			} else {
				 top.find('.m-number-pad a').removeClass('ui-disabled');
				 top.parent().siblings('.m-dialog-footer').find('.m-number-button').addClass('ui-disabled');
			}
		}
		$(this).removeClass('down');
	}).on('vmouseout', function() {
		$(this).removeClass('down');
	});
	$(this).find('.m-number-pad-entry a.backspace').live('tap', function() {
		var top = $(this).closest('.m-number');
		var content = top.find('.m-number-pad-entry input');
		top.parent().siblings('.m-dialog-footer').find('.m-number-button').addClass('ui-disabled');
		if (content.val().length > 0) {
			content.val(content.val().substring(0, content.val().length - 1));
			top.find('.m-number-pad a').removeClass('ui-disabled');
		}
	});
}).live('pagebeforeshow', function() {
	$(this).find('.m-number-pad-entry input').val('');
	$(this).find('.m-number-pad a, a.backspace').removeClass('ui-disabled');
	$(this).find('.m-number-button').addClass('ui-disabled');
});
$('#page-campaign').live('pagebeforeshow', function() {
	var data = $.jStorage.get($.jStorage.get('current'));
	$('#m-campaign-title').text(data.name);
	$('#m-stats h1').text(data.total);
	$('#m-campaign-address').text(data.cached_domain);
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
			$('#campaign-list').append( '<li class="ui-li ui-li-static ui-body-g m-campaign" data-campaign="'+campaign.campaign_code+'"><a href="index.html" data-role="button" data-icon="delete" class="m-campaign-delete" data-campaign="'+campaign.campaign_code+'">Delete</a><div class="ui-li-aside m-list-post-time m-campaign-data"><div class="m-icon-arrow"></div>'+campaign.start_date+'<br><span>'+campaign.campaign_code+'</span></div><div class="m-list-prompt"><p class="m-list-author ui-li-desc"><span class="m-list-author-name">'+campaign.name+'</span><span class="m-list-author-handle">'+campaign.cached_domain+'</span></p></div></li>' )
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

$('#add-campaign').live('pageinit', function() {
	$('#add-campaign-button').click(function() {
		if($.jStorage.get(parseInt($('#add-campaign-number-pad-entry').val()), false)) {
			$('#add-campaign-error').text("You've already added this campaign ID. Try again!").slideDown(100);
			$('#add-campaign-button, #add-campaign a.backspace').removeClass('ui-disabled');
		} else {
			$('#add-campaign-error').slideUp(100);
			$('#add-campaign-button, #add-campaign-cancel, #add-campaign a.backspace').addClass('ui-disabled');
			$('#add-campaign .m-loader').fadeIn(function () {
				$.ajax({ url:'http://www.creatr.io/api/campaign_code/' + $('#add-campaign-number-pad-entry').val() + '.json?callback=?', dataType: 'jsonp', success: function(campaign) {
					$.jStorage.set(campaign.campaign_code, campaign);
					$.mobile.changePage("#page-home");
				}, error: function() {
					$('#add-campaign-button, #add-campaign-cancel, #add-campaign a.backspace').removeClass('ui-disabled');
					$('#add-campaign .m-loader').fadeOut();
					$('#add-campaign-error').text("That's an invalid Campaign ID. Try again!").slideDown(100);
					
				} });
			});
		}
	});
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

$('#validator').live('pageinit', function() {
	$('#validator-button').click(function() {	
		var data = $.jStorage.get($.jStorage.get('current'));
		$('#validator-error, #validator-success').stop().slideUp(100);
		$('#validator-button, #validator a.backspace').addClass('ui-disabled');
		$('#validator .m-loader').fadeIn(function () {
			$.ajax({ url:'http://'+data.cached_domain+'/sms_code/' + $('#validator-number-pad-entry').val() + '.json?callback=?', dataType: 'jsonp', success: function(campaign) {
				//$.jStorage.set(campaign.campaign_code, campaign);
				//$.mobile.changePage("#page-home");
				$('#validator-number-pad-entry').val('');
				$('#validator-cancel, #validator a.backspace').removeClass('ui-disabled');
				$('#validator .m-loader').fadeOut();
				$('#validator-success').slideDown(100).delay(3000).slideUp(100);
				$('#validator .m-number-pad a, a.backspace').removeClass('ui-disabled');
			}, error: function() {
				$('#validator-button, #validator-cancel, #validator a.backspace').removeClass('ui-disabled');
				$('#validator .m-loader').fadeOut();
				$('#validator-error').slideDown(100);
			} });
		});
	});
}).live('pagebeforeshow', function() {
	$('#validator .m-loader').hide();
	$('#validator-error, #validator-success').hide();
});

$('#photo-booth').live('pageinit', function() {
	$('#photo-booth-button').click(function() {	
		var data = $.jStorage.get($.jStorage.get('current'));
		$('#photo-booth-error').stop().slideUp(100);
		$('#photo-booth-button, #photo-booth a.backspace').addClass('ui-disabled');
		$('#photo-booth .m-loader').fadeIn(function () {
			$.ajax({ url:'http://'+data.cached_domain+'/sms_code/' + $('#photo-booth-number-pad-entry').val() + '.json?callback=?', dataType: 'jsonp', success: function(campaign) {
				//$.jStorage.set(campaign.campaign_code, campaign);
				//$.mobile.changePage("#page-home");
				window.photo_sms_code = $('#photo-booth-number-pad-entry').val();
				$('#photo-booth-number-pad-entry').val('');
				$('#photo-booth-cancel, #photo-booth a.backspace').removeClass('ui-disabled');
				$('#photo-booth .m-loader').fadeOut();
				$('#photo-booth .m-number-pad a, a.backspace').removeClass('ui-disabled');
				
				$.mobile.changePage('#photo-booth-wait', { transition: "slide"})
				capturePhoto();
				
			}, error: function() {
				$('#photo-booth-button, #photo-booth-cancel, #photo-booth a.backspace').removeClass('ui-disabled');
				$('#photo-booth .m-loader').fadeOut();
				$('#photo-booth-error').slideDown(100);
			} });
		});
	});
}).live('pagebeforeshow', function() {
	$('#photo-booth .m-loader').hide();
	$('#photo-booth-error, #photo-booth-success').hide();
});

function onPhotoURISuccess(imageURI) {
		var data = $.jStorage.get($.jStorage.get('current'));
		
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
        options.mimeType="text/plain";

        var params = new Object();

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI('http://'+data.cached_domain+'/fb_image/' +  window.photo_sms_code), win, fail, options);
		window.photo_sms_code = null;
    
}

function win(r) {
	$.mobile.changePage('#photo-booth-thanks', { transition: "pop"})
}

function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
	destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.CAMERA });
}

// Called if something bad happens.
// 
function onFail(message) {
  alert('Failed because: ' + message);
}