---
title: Wayfinding
layout: page
permalink: /wayfinding/
---

{::nomarkdown}
<script>
$(document).ready(function(){
  $(".choice-list li").click(function(){
    var target = $( $(this).find("a").attr("href") );
    target.siblings().removeClass("chosen");
    target.addClass("chosen");
    return false;
  });
  $(".calendar").addClass("closed");
  $(".opener").click(function(){
    var target = $( "#calendar-" + $(this).attr("id").split("-")[1] );
    target.siblings("table").addClass("closed");
    target.removeClass("closed");
  });
});
</script>

{% assign topics = site.categories | sort %}
<section class="wayfinding-block">

  <div class="wayfinding-choices">
    <h2 id="topic-archive">By Topic</h2>
    <ul class="inline-list choice-list">
      {% for topic in topics %}
      <li><a href="#topic-{{ topic | first | slugify }}">{{ topic | first }}</a>
        {% endfor %}
    </ul>
  </div>

  <div class="wayfinding-results">
    {% for topic in topics %}
    <div class="wayfinding-section" id="topic-{{ topic | first | slugify }}">
      <h4>{{ topic | first }}</h4>
      <ul class="dated-list">
        {% for posts in topic %}
        {% for post in posts %}
        {% if post.title.size > 0 %}
        <li>
          <span class="li-date">
            {{ post.date | date: '%b %-d, %Y' }}
          </span>
          <a href="{{ post.url }}">{{ post.title | markdownify | replace: "<p>","" | replace: "</p>","" }}</a></li>
        {% endif %}
        {% endfor %}
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>

<hr class="visible" />

{% assign places = site.tags | sort %}
<section class="wayfinding-block">
  <div class="wayfinding-choices">
    <h2 id="place-archive">By Place</h2>
    <ul class="inline-list choice-list">
      {% for place in places %}
      <li><a href="#place-{{ place | first | slugify }}">{{ place | first }}</a>
        {% endfor %}
    </ul>
  </div>

  <div class="wayfinding-results">
    {% for place in places %}
    <div class="wayfinding-section" id="place-{{ place | first | slugify }}">
      <h4>{{ place | first }}</h4>
      <ul class="dated-list">
        {% for posts in place %}
        {% for post in posts %}
        {% if post.title.size > 0 %}
        <li>
          <span class="li-date">
            {{ post.date | date: '%b %-d, %Y' }}
          </span>
          <a href="{{ post.url }}">{{ post.title | markdownify | replace: "<p>","" | replace: "</p>","" }}</a></li>
        {% endif %}
        {% endfor %}
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>

<hr class="visible" />

<section class="wayfinding-block fullwidth">
<h2>By Date</h2>
{% for post in site.posts  %}
  {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
  {% capture this_month %}{{ post.date | date: "%B" }}{% endcapture %}
  {% capture prev_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
  {% capture prev_month %}{{ post.previous.date | date: "%B" }}{% endcapture %}
  {% if forloop.first %}
  <h2 class="opener" id="opener-{{ this_year }}"><span>{{ this_year }}</span></h2>
  <table class="calendar" id="calendar-{{ this_year }}"><tbody><tr>
    <td><h4>{{ this_month }}</h4></td>
    <td><ul class="dated-list">
  {% endif %}
  <li>
    <span class="li-date">{{ post.date | date: '%b %-d, %Y' }}</span>
    <a href="{{ post.url }}">{{ post.title | markdownify | replace: "<p>","" |
    replace: "</p>","" }}</a>
  </li>
  {% if forloop.last %}
    </ul></td></tr></tbody></table>
  {% else %}
    {% if this_month != prev_month %}
      </ul></td></tr>
      {% if this_year != prev_year %}
  </tbody></table>
  <h2 class="opener" id="opener-{{ prev_year }}"><span>{{ prev_year }}</span></h2>
  <table class="calendar" id="calendar-{{ prev_year }}"><tbody>
      {% endif %}
      <tr><td><h4>{{ prev_month }}</h4></td>
        <td><ul class="dated-list">
    {% endif %}
  {% endif %}
{% endfor %}

</section>

<hr class="visible" />

<section class="wayfinding-block">
<h2>By Searching</h2>
<script>
$(document).ready(function(){
  $("#search-submit").click(function(){
    var query = $("#search-input").val();
    var googUrl = "https://encrypted.google.com/#q=" + encodeURI(query) + "+site:{{ site.url }}";
    location.href = googUrl;
  });

  $("input").keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#search-submit").click();
      //$("form").submit();
    }
  });
});
</script>
<div class="text-center" style="width: 100%;">
  <input type="text" style="min-width: 50%;" placeholder="Type here to search" id="search-input" id="js-super-search__input">
  <button id="search-submit" class="button">Search</button>
</div>
</section>
{:/nomarkdown}
