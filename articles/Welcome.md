#meta-start
Title:Welcome Page
Created:3-18-2020
Category:home
#meta-end
# Welcome

> This is a blockquote

*Sample Code Snippet*
```js
function TEST() {
    console.log("Hello World");
}
```
# Technology Stack 'n Terms

SOLID
	Single Responsibility
	Open for extension, Closed for modification
	Liskov Substitution
	Interface Segregation
	Dependency Inversion

DRY (Don't Repeat Yourself)

N-Tier / Multi-Tier

Onion Architecture

SDLC (Software Development Life Cycle)
	Planning
	Implementation
	Testing
	Documentation
	Deployment and Maintenance
	Maintaining

RPA (Robotic Process Automation)
	TAGUI - Github project
	Automation Anywhere
	UiPath
	Blue Prism


HTML (Hypertext Markup Language)
HTML5 
	5th version 
	Audio and video integration,
	Vector graphic; Canvas and SVG
	Storage; application cache, web SQL database, and web storage
	JS Web Worker API, allow to run in background
	Standard DocType; <!Doctype html>
	new elements; header, footer, article, section

CSS (Cascading Style Sheets)
LESS (Leaner CSS)CSS Preprocessor
SASS (Syntactically Awesome StyleSheets) CSS Preprocessor !More Popular
SCSS (Sassy CSS)
	•variables: instead of repeating #fce473 throughout your CSS file, just set $yellow: #fce473 once
	•nesting: CSS rules can be nested within each other
	•mixins: custom functions that can accept parameters and will prevent useless repetitions
	•extensions: an easy way to inherit the same properties of another selector
	•operators: adding/substracting/multiplying/dividing values


Vanilla JavaScript (POJS; Plain Old JavaScript)
Ecma2015
ES6

## JS Libraries
JQuery
Knockout
Backbone

## Data Format
XML
JSON
CSV
INI

## JS Modules
AMD (Asynchronous Module Definition)
CommonJS [ var Foo = require("Bar") ]
UMD
ES
IIFE (Immediately Invoked Function Expression)
  which will prevent us from polluting the global namespace

  Tips: Invoke function by adding another pair of parentheses to the end of it
(function () {
  console.log('Pronounced IF-EE')
})()

What are the benefits to the IIFE Module Pattern? First and foremost, we avoid dumping everything onto the global namespace. 
This will help with variable collisions and keeps our code more private. Does it have any downsides? It sure does. 
We still have 1 item on the global namespace, APP. If by chance another library uses that same namespace, we’re in trouble. 
Second, you’ll notice the order of the <script> tags in our index.html file matter. If you don’t have the scripts in the 
exact order they are now, the app will break.


AJAX
Fetch

Promise

## Module Loader
RequireJS
Browserify

## Bundlers
WebPack (CSS+JS)
TypeScript (AMD & SystemJS only)
RollupJS
ParcelJS (CSS+JS)
Browserify

Node
NPM
Yarn

## Linting
ESLint
TSLint
Flow (React)

## Compiler
BabelJS
TypeScript

## Task Runner
GruntJS

## Unit Testing (Test Runner, Assertion, Mocks, Spys)
  (BDD Behavior-driven development vs. TDD Test-driven development)

Moq
JSUnit - testing Java based web application
UnitJS - assertion library, works with popular test-runners
QUnit - JQuery
Mocha - NodeJS
Jamine -BDD
Karma
Jest - Facebook
AVA

Web Assembly

## Tree-Shaking
 All imports must be place top of file. The reason this design decision was made was because 
 by forcing modules to be static, the loader can statically analyze the module tree, figure out 
 which code is actually being used, and drop the unused code from your bundle.



## Media Queries vs. Element Queries

Media queries: Imagine a design with a sidebar and a content area. In a responsive, 
fluent design both the sidebar and the content has "unknown" widths. 
Trying to add e.g. a responsive grid into the content area which relies on media queries, 
where you have no knowledge of how much space your content occupies, is in my opinion almost an 
impossible task.

Element queries: An element query is similar to a media query in that, if a condition is met, 
some CSS will be applied. Element query conditions (such as min-width, max-width, min-height and 
max-height) are based on elements, instead of the browser viewport.


## DI Lifetime services

### Transient
Transient lifetime services (AddTransient) are created each time they're requested from the 
service container. 
This lifetime works best for lightweight, stateless services.


### Scoped
Scoped lifetime services (AddScoped) are created once per client request (connection).


### Singleton
Singleton lifetime services (AddSingleton) are created the first time they're requested 
(or when Startup.ConfigureServices is run and an instance is specified with the service 
registration). Every subsequent request uses the same instance. If the app requires 
singleton behavior, allowing the service container to manage the service's lifetime 
is recommended. Don't implement the singleton design pattern and provide user code to 
manage the object's lifetime in the class.