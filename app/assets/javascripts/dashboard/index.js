// JQuery Framework
//= require jquery
//= require jquery_ujs
//= require jquery.ui.datepicker
//= require jquery.ui.sortable
//
// CodeMirror Editor
//= require codemirror
//= require codemirror/modes/javascript
//
// Ace Editor
//= require ace
//= require mode-javascript
//= require mode-css
//= require mode-html
//
// Frameworks
//= require bootstrap
//= require handlebars
//= require ember
//
// Gem Scripts
//= require s3_direct_upload
//= require cocoon
//
// Dashboard
//= require_tree .
//
// Code
$(function() {
  var page = $("body").data("page");
  if("object" === typeof window[page])
    window[page].init();
});
