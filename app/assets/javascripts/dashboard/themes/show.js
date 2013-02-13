var ThemesShow = new function() {
  var self = this;

  self.init = function() {
    // code which may call other functions in self
    $(document).ready(function() {
      var css_val = '', html_val = '';
      $('#show-css').click(toggleCoder);

      $('.size').click(function() {
        $('.size').removeClass('selected');
        $(this).addClass('selected');
        $('#page').removeClass('desktop laptop tablet phone').addClass($(this).data('size'));
      });

      var css = ace.edit("css");
      css.getSession().setMode("ace/mode/css");
      css.setShowPrintMargin(false);
      css.setShowInvisibles(true);

      var html = ace.edit("html");
      html.getSession().setMode("ace/mode/html");
      html.setShowPrintMargin(false);
      html.setShowInvisibles(true);

      css.getSession().on('change', function (e) {
        css_val = css.getSession().getValue();
      });

      css_val = css.getSession().getValue();

      html.getSession().on('change', function (e) {
        html_val = html.getSession().getValue();
        $('#type').find(':selected').data('default', html_val );
        $('#type').find(':selected').data('edited', true );
      });

      $(document).bind('keydown', 'Alt+Ctrl+1', switch_to_css);
      $(document).bind('keydown', 'Alt+Ctrl+2', switch_to_html);
      $(document).bind('keydown', 'Alt+Ctrl+R', play);
      setup_binds(css);
      setup_binds(html);
      $('.play').click(play);

      $("#myS3Uploader").S3Uploader();

      $('.upload').click(function() {
        $(this).toggleClass('selected');
        $('.page-right.icons').toggleClass('panel');
      });

      $('#css-render').change(function(e) {
        css.getSession().setMode("ace/mode/" + $(this).val());
      });

      $('#type').change(function(e) {
        select_content_type();
      });

      $('.capable').change(function(e) {
        $('.' + $(this).attr('id') ).toggle();
      });

      $('#input_theme_name').change(function() {
        $('#theme_name').text( $(this).val() );
      });

      $('#alert-header').bind('closed', function() {
        $('#page').removeClass('alertbox');
      });

      $('.save').click(function() {
        var templates = [];

        $('.frame-loading').fadeIn();
        $('#type').children().each(function() {
          if ( !isNaN($(this).val()) && $(this).data('edited') ) {
            templates.push( { content_type_id : $(this).val(), content : $(this).data('default') });
          }
        });
        $.ajax({
          url: location.pathname +
          '.json',
          type: 'PUT',
          data: {
            theme: {
              css: css_val,
              templates_attributes: templates,
              container_template: $('#app').data('default')
            }
          },
          success: function(data) {
            $('.frame-loading').fadeOut();
            $('#alerts').html('<div class="alert alert-success"><strong>Saved</strong> Theme has been synced successfully.</div>');
            $('#page').addClass('alertbox');
            setTimeout(function() {
              $('#alerts .alert').fadeOut(function() {
                $(this).remove();
                $('#page').removeClass('alertbox');
              });
            }, 2000);
          },
          error: function(data) {
            $('.frame-loading').fadeOut();
            $('#alerts').html('<div class="alert alert-error"><strong>Error</strong> There has been a problem saving your theme.</div>');
            $('#page').addClass('alertbox');
            setTimeout(function() {
              $('#alerts .alert').fadeOut(function() {
                $(this).remove();
                $('#page').removeClass('alertbox');
              });
            }, 2000);
          }
        });
      });

      $('#theme-code .resize').bind('dragstart',function( event ){
        $('.frame-cover').fadeIn();
        $('#theme-code, #page, #image-manager, .page-right').addClass('dragged');
      });

      $('#theme-code .resize').bind('drag',function( event ){
        var height = $(window).height() - event.pageY;
        if (height < 100)
          height = 100;
        else if (height >= 400)
          height = 400;
        $('#theme-code').height( height );
        $('#page').css( 'bottom', height );
        $('#image-manager, .page-right').css( 'bottom', height + 20 );
        $('.css .relative, .html .relative').height( height - 50 );
      });

      $('#theme-code .resize').bind('dragend',function( event ){
        $('.frame-cover').fadeOut();
        $('#theme-code, #page, #image-manager, .page-right').removeClass('dragged');
        css.resize();
        html.resize();
      });

      $('#myS3Uploader').bind("s3_upload_complete", function(e, content) {
        $('.gallery').append('<a href="'+content.url+'" target="_blank"><img style="background-image:url('+content.url+');"></a>');
      });

      function play() {
        $('.frame-loading').fadeIn();
        $.post('/dashboard/iframe', {
          css_render:$('#css-render').val(),
          html_render:$('#html-render').val(),
          css:css_val,
          html:html_val,
          content_type:$('#type').val(),
          app_html:$('#app').data('default')
        }, function(data) {
          $('#iframe-container').empty().append('<iframe height="100%" id="demo" width="100%"></iframe>');
          var iFrameDoc = $('#demo').contents()[0];
          iFrameDoc.write(data);
          iFrameDoc.close();
          $('.frame-loading').fadeOut();
        });
      }
      function select_content_type() {
        html.getSession().setValue( $('#type').find(':selected').data('default') );
      } select_content_type();

      function toggleCoder() {
        $('#theme-code').toggleClass('noheight visible');
        $('.page-right, .page-left, #page').toggleClass('builder').toggleClass('no-builder');
        $('#theme-code-spacer').toggle();
        $('#show-css').children('i').toggleClass('icon-chevron-down');
      }

      function switch_to_html(editor) {
        if ( !$('#theme-code').hasClass('visible') )
          toggleCoder();
        html.focus();
        return false;
      }

      function switch_to_css(editor) {
        if ( !$('#theme-code').hasClass('visible') )
          toggleCoder();
        css.focus();
        return false;
      }

      function setup_binds(editor) {
        editor.commands.addCommand({name: 'switchToCss', bindKey: 'Alt-Ctrl-1', exec: switch_to_css});
        editor.commands.addCommand({name: 'switchToHtml', bindKey: 'Alt-Ctrl-2', exec: switch_to_html});
        editor.commands.addCommand({name: 'play', bindKey: 'Alt-Ctrl-R|F5', exec: play});
      }

    });
  };
};

