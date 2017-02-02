---
title: Wayfinding
layout: page
permalink: /wayfinding/
---

{::nomarkdown}

{% assign topics = site.categories | sort %}
<div class="wayfinding-block">

  <div class="wayfinding-choices">
    <h2>By Topic</h2>
    <ul class="inline-list">
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

</div>
{% assign places = site.tags | sort %}
<div class="wayfinding-block"> 

  <div class="wayfinding-choices">
    <h2>By Place</h2>
    <ul class="inline-list">
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

</div>


<div class="wayfinding-block">
</div>

## By Date



## By Searching

{:/nomarkdown}
