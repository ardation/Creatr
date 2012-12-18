//= require ./lib/handlebars.js
$(document).ready(function() {
  var content_template = Handlebars.compile( $("#content-template").html() );
  var extra_template = Handlebars.compile( $("#extra-template").html() );

  function render(e) {
    var target = $( $(e.target).attr('href') );
    target.find('.empty, .content').hide();
    target.find('.loading').fadeIn(function() {
      $.get('/dashboard/themes/'+$(e.target).attr('id')+'/' + $(e.target).data('offset') + '.json', function(data) {
        if ( $(e.target).data('offset') > 0 )
          target.find('.previous').removeClass('disabled');
        else
          target.find('.previous').addClass('disabled');

        if (data.themes.length == 0) {
          target.find('.loading').fadeOut(function() {
            target.find('.empty').removeClass('hidden').hide().fadeIn();
          });
        } else {
          target.find('.content').empty().html(content_template(data));
          if (data.themes.length == 4)
            target.find('.next').removeClass('disabled');
          else {
            target.find('.next').addClass('disabled');
          }

          for (var i=0; i < 4 - data.themes.length; i++) {
            target.find('.content').append(extra_template());
          }
          if ( $(e.target).attr('id') == 'me' )
            $('.name').hide();
          $('.likable').click( function(e) {
            if ( $(this).hasClass('un') )
              $.get( '/dashboard/themes/favourites/remove/' + $(this).data('id') );
            else
              $.get( '/dashboard/themes/favourites/add/' + $(this).data('id') );
            $(this).toggleClass('un btn-danger').children('i').toggleClass('icon-heart icon-heart-empty');
            e.preventDefault();
            return false;
          });
          target.find('.loading').fadeOut(function() {
            target.find('.content').removeClass('hidden').hide().fadeIn();
          });
        }
      });
    });
  }

  $('.next').click( function() {
    if ( !$(this).hasClass('disabled') ) {
      $(this).addClass('disabled');
      var e = $('#myTab').find('.active a')[0];
      $(e).data('offset', $(e).data('offset') + 1);
      render({target:e});
    }
  });
  $('.previous').click( function() {
    if ( !$(this).hasClass('disabled') ) {
      $(this).addClass('disabled');
      var e = $('#myTab').find('.active a')[0];
      $(e).data('offset', $(e).data('offset') - 1);
      render({target:e});
    }
  });

  $('a[data-toggle="tab"]').on('shown', render);
  render({target:$('#featured')[0]});
});
