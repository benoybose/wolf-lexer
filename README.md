# wolf-lexer 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status](https://coveralls.io/repos/github/benoybose/wolf-lexer/badge.svg?branch=master)](https://coveralls.io/github/benoybose/wolf-lexer?branch=master)

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
- _pattern_ An instance of RegExp that matches the expected token. However, its not neccessary that it should be a RegExp instance, rather it could be any object which expose a function called 'exec' that behaves as exactly as that of RegExp.
- _kind_ A unique string that represents kind of token. eg. 'id', 'function', 'variable' etc

### scan
```javascript
scan(source, callback_token, callback_error)
```
Scans the given input strings that gives result against previously added rules.
- _source_ An input string to scan
- *callback_token* Call back function of type fucntion(token) that receives tokens that macthes each rules in the sequence of scanning
- *callback_error* Call back function of type function(err) that receives error information whenever an error is produced during the scanning


## License

Copyright (c) 2016 Benoy Bose. Licensed under the MIT license.


[npm-url]: https://npmjs.org/package/wolf-lexer
[npm-image]: https://badge.fury.io/js/wolf-lexer.svg
[travis-url]: https://travis-ci.org/benoybose/wolf-lexer
[travis-image]: https://travis-ci.org/benoybose/wolf-lexer.svg?branch=master
[daviddm-url]: https://david-dm.org/benoybose/wolf-lexer.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/benoybose/wolf-lexer
[coveralls-url]: https://coveralls.io/r/benoybose/wolf-lexer
[coveralls-image]: https://coveralls.io/repos/benoybose/wolf-lexer/badge.png
