# wolf-lexer 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Wolf-Lexer is a general purpose lexcial analysis module for nodejs applications to implement features of tokenize and parse a given text.

## Install

```bash
$ npm install --save wolf-lexer
```


## Basic Usage

```javascript
var WolfLexer = require('wolf-lexer');

var patternWord = /[a-zA-Z]+/;
var patternWhiteSpace = /[\s]/;

var kindWord = "word";
var kindSpace = "white_space";
var inputTwoDashes = "hello _* _ world";

var lexer = new WolfLexer();
lexer.resumeOnError = true; // Do not stop scanning if invalid patterns found

lexer.addRule(patternWord, kindWord); // Adding rules
lexer.addRule(patternWhiteSpace, kindSpace);

var tokens = [];
var errors = [];

lexer.scan(inputTwoDashes, function(t) {
    tokens.push(t); // Saving tokens
}, function(err) {
    errors.push(err); // Getting errors
});

```

## API Documentation
### WolfLexer
WolfLexer is the main class that exposes the functions for adding rules and scan the text input.

#### addRule
```javascript
addRule(pattern, kind);
```
Adds a rule to scan the text.


## License

Copyright (c) 2016 Benoy Bose. Licensed under the GPL license.



[npm-url]: https://npmjs.org/package/wolf-lexer
[npm-image]: https://badge.fury.io/js/wolf-lexer.svg
[travis-url]: https://travis-ci.org/benoybose/wolf-lexer
[travis-image]: https://travis-ci.org/benoybose/wolf-lexer.svg?branch=master
[daviddm-url]: https://david-dm.org/benoybose/wolf-lexer.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/benoybose/wolf-lexer
[coveralls-url]: https://coveralls.io/r/benoybose/wolf-lexer
[coveralls-image]: https://coveralls.io/repos/benoybose/wolf-lexer/badge.png
