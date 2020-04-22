# Vue-Powered Blogger with Markdown

This is a static blogging website powered by Vue js and fuel with Markdown. I wanted a simple blogging site to store some tips and thoughts that I stumbled upon on my journey.

I attempted `VuePress` *(a static site generator)*, and after 500+ downloaded packages later. The cli failed to build. I stopped there and created this. Doesn't have all the bells and whistes, but simple and clean.

## Powershell
The powershell shell task is used to scan the articles directory for markdown files and generate the `db\articles.json` file.

It also reads the metadata on the top of each file.

```
#meta-start
Title:Welcome Page
Created:3-18-2020
Category:other
#meta-end
```

> Category.db edit manually.

## Layout
The layout is a Bulma type theme. Just thought I would try it. Vue components are build manually in the `js\app.js`. No bundlers and other sutff that gets in the way. Really not that hard once you understand the mechanics.