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
    console.log( $(this).attr("id").split("-"));
    var target = $( "#calendar-" + $(this).attr("id").split("-")[1] );
    console.log( target )
    target.siblings("ul").addClass("closed");
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
          <a href="{{ post.url }}">{{ post.title }}</a></li>
        {% endif %}
        {% endfor %}
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>

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
          <a href="{{ post.url }}">{{ post.title }}</a></li>
        {% endif %}
        {% endfor %}
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>


<section class="wayfinding-block">
  <h2 id="date-archive">By Date</h2>
  <div class="wayfinding-choices">

    {% for post in site.posts  %}
      {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
      {% capture this_month %}{{ post.date | date: "%b" | downcase }}{% endcapture %}
      {% capture prev_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
      {% capture prev_month %}{{ post.previous.date | date: "%b" | downcase }}{% endcapture %}
      {% if forloop.first %}
        <h2 class="opener" id="opener-{{ this_year }}"><span>{{ this_year }}</span></h2>
        <ul class="calendar choice-list" id="calendar-{{ this_year }}">
          <li class="{{ this_month }}"><a href="#date-{{ this_year }}-{{ this_month }}">{{ this_month }}</a></li>
      {% endif %}
      {% if forloop.last %}
        </ul>
      {% else %}
        {% if this_year != prev_year %}
        </ul>
        <h2 class="opener" id="opener-{{ prev_year }}"><span>{{ prev_year }}</span></h2>
        <ul class="calendar choice-list" id="calendar-{{ prev_year }}">{{ next_year }}
          <li class="{{ prev_month}}"><a href="#date-{{ prev_year }}-{{ prev_month }}">{{ prev_month }}</a></li>
        {% else %}
          {% if this_month != prev_month %}
          <li class="{{ prev_month}}"><a href="#date-{{ this_year }}-{{ prev_month }}">{{ prev_month }}</a></li>
          {% endif %}
        {% endif %}
      {% endif %}
      {% endfor %}

  </div>

  <div class="wayfinding-results">

    {% for post in site.posts %}
      {% assign currentdate = post.date | date: "%Y-%m" %}
      {% if currentdate != date %}
        {% unless forloop.first %}
          </ul>
        </div>
        {% endunless %}
        <div class="wayfinding-section" id="date-{{post.date | date: "%Y-%b" | downcase }}">
          <h4>{{ post.date | date: "%B %Y" }}</h4>
          <ul class="dated-list">
        {% assign date = currentdate %}
      {% endif %}
            <li>
              <span class="li-date">
                {{ post.date | date: '%b %-d, %Y' }}
              </span>
              <a href="{{ post.url }}">{{ post.title }}</a></li>
      {% if forloop.last %}
          </ul>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</section>

<section class="wayfinding-block">
<h2>By Searching</h2>
<script>
$(document).ready(function(){
  $("#search-submit").click(function(){
    var query = $("#search-input").val();
    var googUrl = "https://encrypted.google.com/#q=" + encodeURI(query) + "+site:{{ site.url }}";
    location.href = googUrl;
  });
});
</script>
<div class="text-center">
  <input type="text" placeholder="Type here to search" id="search-input" id="js-super-search__input">
  <button id="search-submit" class="button">Search</button>
</div>
</section>
{:/nomarkdown}
