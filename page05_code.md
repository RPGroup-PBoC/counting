---
layout: page
title: Code
img: code.png # Add image post (optional)
permalink: code
sidebar: true
---

---

During this course, you will develop a computational prowess that will aid in
your understanding of evolution. We will post Jupyter Notebooks of the tutorial
sessions here. 

{% for topic in site.data.code %}
# {{topic[0]}}

{% for script in topic[1] %}

* [**{{script.title}}**](/assets/code/{{script.filename}}) \|
  {{script.description}}  {%if script.links %} <i>{%for l in script.links
  %}[**\[{{l[0]}}\]**](assets/code/{{l[1]}}){%endfor%}</i>{%endif%}
{% endfor %}
{%endfor%}