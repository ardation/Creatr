//= require ./lib/jquery.hotkeys.js
//= require ./lib/jquery.event.drag.js
//= require mode-css.js
//= require mode-html.js
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

  html.getSession().on('change', function (e) {
    html_val = html.getSession().getValue();
    $('#type').find(':selected').data('default', html_val );
  });

  $(document).bind('keydown', 'Alt+Ctrl+1', switch_to_css);
  $(document).bind('keydown', 'Alt+Ctrl+2', switch_to_html);
  $(document).bind('keydown', 'Alt+Ctrl+R', play);
  setup_binds(css);
  setup_binds(html);
  $('.play').click(play);

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

  $('#settings').on('show', function () {
    $('.capable').prop('disabled', false);
    $('#' + $('.size.selected').data('size')).prop('disabled', true);
  });

  $('#input_theme_name').change(function() {
    $('#theme_name').text( $(this).val() );
  });

  $('#theme-code .resize').bind('dragstart',function( event ){
    $('.frame-cover').fadeIn();
    $('#theme-code, #page, #image-manager').addClass('dragged');
  });

  $('#theme-code .resize').bind('drag',function( event ){
    var height = $(window).height() - event.pageY;
    if (height < 100)
      height = 100;
    else if (height >= 400)
      height = 400;
    $('#theme-code').height( height );
    $('#page').css( 'bottom', height );
    $('#image-manager').css( 'bottom', height + 20 );
    $('.css .relative, .html .relative').height( height - 50 );
  });

  $('#theme-code .resize').bind('dragend',function( event ){
    $('.frame-cover').fadeOut();
    $('#theme-code, #page, #image-manager').removeClass('dragged');
    css.resize();
    html.resize();
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
