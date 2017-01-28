---
title: Categories
layout: page
permalink: /categories/
---
<ul>
{% for category in site.categories %}
<li><a name="{{ category | first | slugify }}">{{ category | first }}</a>
<ul>
{% for posts in category %}
{% for post in posts %}
{% if post.title.size > 0 %}
<li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endif %}
{% endfor %}
{% endfor %}
</ul>
</li>
{% endfor %}
</ul>
