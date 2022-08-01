# Vue-Powered Blogger with Markdown

This is a static blogging website powered by Vue JS and fuel with Markdown. I wanted a simple blogging site to store some tips and thoughts that I stumbled upon on my journey.

I attempted `VuePress` *(a static site generator)*, and after 500+ downloaded packages later. The cli failed to build. I stopped there and created this. Doesn't have all the bells and whistles, but simple and clean.

## PowerShell
"Build Article Database" is shell task is used to scan the articles directory for markdown files and generate the `db\articles.json` file.  
The following metadata in collected.

**Title**: first `# ` markdown found in the article  
**Created**: file created date  
**Category**: parent folder name of file  
**Link**: name of file (NOTE: replace whitespace with a dash '-')

As of Sept. 2020, I edit the PS script to move away from storing the markdown content in the JSON database. Now, all article content is loaded via HTTP request. This change become available once my company whitelist `https://raw.githubusercontent.com`.

> NOTE: db/category.json is to be edit manually.

## Layout
The layout is a Bulma type theme. Just thought I would try it. Vue components are build manually in the `js\app.js`. No bundlers and other stuff that gets in the way. Really not that hard once you understand the mechanics.

## IIS Express - Markdown Support
To enable support for Markdown files in IIS Express, you will need to adjust the `applicationhost.config` file. You might get lucky with the following command, but some reason it failed to work for me.

```
cd C:\Program Files (x86)\IIS Express

appcmd set config /section:staticContent /+[fileExtension='.md',mimeType='text/markdown']
```

> NOTE! if IIS Express is already running, you will need to restart.

Or you may manually set the static type.
* Browse and open: `C:\Program Files (x86)\IIS Express\AppServer\applicationhost.config`
* Scroll down to roughly line 524 and paste the following:
```xml
<mimeMap fileExtension=".md" mimeType="text/markdown" />
```
