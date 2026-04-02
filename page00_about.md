---
layout: page
title: About
description: Winnie the Pooh counts his honey pots. 
img: pooh_counting.png 
caption: "The House at Pooh Corner, A. A. Milne"
permalink: index.html
sidebar: true
---

# {{site.data.about.title}}
{{site.data.about.authors}}

{% for entry in site.data.about %}

{% if entry[0] != 'title' %}
{% if entry[0] != 'authors' %}
## {{entry[0]}}
{{entry[1]}}
{% endif %}
{% endif %}
{% endfor %}