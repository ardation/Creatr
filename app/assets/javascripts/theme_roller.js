//= require ./lib/jquery.hotkeys.js
//= require mode-css.js
//= require mode-html.js
$(document).ready(function() {
  var iFrameDoc = $('#demo').contents()[0];
  var css_val = '', html_val = '';
  $('#show-css').click(toggleCoder);

  $('.size').click(function() {
    $('.size').removeClass('selected');
    $(this).addClass('selected');
    $('#page').removeClass().addClass($(this).data('size'));
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
  });

  $(document).bind('keydown', 'Alt+Ctrl+1', switch_to_css);
  $(document).bind('keydown', 'Alt+Ctrl+2', switch_to_html);
  $(document).bind('keydown', 'Alt+Ctrl+R', play);
  setup_binds(css);
  setup_binds(html);
  $('.play').click(play);

  $('#css-render').change(function(e) {
    css.getSession().setMode("ace/mode/" + $(this).val());
  });

  $('#type').change(function(e) {
    html.getSession().setValue($(this).find(':selected').data('default'));
  });

  function play() {
    $('.frame-loading').fadeIn();
    $.post('/dashboard/iframe', {
      css_render:$('#css-render').val(),
      html_render:$('#html-render').val(),
      css:css_val,
      html:html_val
    }, function(data) {
      iFrameDoc.write(data);
      iFrameDoc.close();
      $('.frame-loading').fadeOut();
    });
  }

  function toggleCoder() {
    $('#theme-code').toggleClass('visible');
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
