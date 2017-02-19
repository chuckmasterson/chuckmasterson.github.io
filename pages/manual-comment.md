---
title: Comment Manually
layout: page
permalink: /manual-comment/
---

If the comment form is unavailable, try this instead: it sends me an email that I can manually turn into a comment and put up. This will definitely take longer than a normal comment.
{: .no-drop }

{::nomarkdown}
<script>
$(document).ready(function(){

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var jsSlug = getParameterByName("slug");
  if (jsSlug) {
    $("#comment-post-id").val(jsSlug); 
  } else {
    $("#js-notice-text").text("This page wasn't able to pick up anything to identify the post you want to comment on. You'll have to copy-paste the address of the post into this box:");
    $("#slug-fieldset").show();
  }

  var timestamp = Date.now();
  $("#filename").val("/data/comments/" + jsSlug + "/comment-" + timestamp + ".yml");
  $("#timestamp").val(timestamp);

  var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
    function(c) 
    {
      var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  $("#post-id").val(guid);

});

</script>
<form action="https://formspree.io/comment@chuckmasterson.com" method="POST">
  <fieldset>
  <textarea type="text" rows="6" class="comment-message" id="comment-form-message" placeholder="Your comment" name="text" spellcheck="true"></textarea>
  </fieldset>

  <fieldset>
  <input type="text" id="comment-form-name" name="author" spellcheck="false" />
  <label for="comment-form-name">Name <span class="required">&#42;</span></label>
  </fieldset>

  <fieldset>
  <input type="email" id="comment-form-email" name="authoremail" spellcheck="false" />
  <label for="comment-form-email">Email <small>(optional—for avatar images via <a href="https://en.gravatar.com/">Gravatar</a>)</small></label>
  </fieldset>

  <fieldset>
  <input type="url" id="comment-form-url" name="authorurl" spellcheck="false" />
  <label for="comment-form-url">Website <small>(optional)</small></label>
  </fieldset>

  <fieldset class="hidden" style="display:none;">
  <input type="hidden" id="filename" name="filename" value=""/>
  <input type="hidden" id="timestamp" name="timestamp" value=""/>
  <input type="hidden" id="post-id" name="_id" value=""/>
  <label for="comment-form-location">Leave blank if you are a human</label>
  <input type="text" id="comment-form-location" name="_gotcha" autocomplete="off"/>
  </fieldset>

  <span id="js-notice-text"></span>
  <fieldset style="display:none;" id="slug-fieldset">
  <input type="text" id="comment-post-id" name="slug" value="">
  </fieldset>

  <fieldset>
  <button type="submit" id="comment-form-submit" class="button">Submit Comment</button>
  </fieldset>
</form>
{:/nomarkdown}
