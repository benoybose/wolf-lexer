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
WolfLexer is the main class that exposes the functions for adding rules and scan the text input. Instance of this will act as lexical analyzer or tokenizer.

#### addRule
```javascript
addRule(pattern, kind);
```
The *addRule* function of WolfLexer can be used to add a new rule to the lexical analyzer. The rule consist of
a *pattern* that matches a given *kind* of token and its kind to be identified as an unique string.

##### pattern

An instance of RegExp that matches the expected token. However, its not neccessary that it should be a RegExp instance, rather it could be any object which expose a function called 'exec' that behaves as exactly as that of RegExp.

##### kind

A unique string that represents kind of token. eg. 'id', 'function', 'variable' etc.

#### Example
```javascript
var WolfLexer = require('wolf-lexer.js');
var lexer = new WolfLexer();
lexer.addRule(/[a-zA-Z_][a-zA-Z0-9\_]*/, "identifier");
```

### scan
```javascript
scan(source, callback_token, callback_error)
```
The "scan" function of WolfLexer initiates a scanning process of the lexical analyzer. It scans the given input string and thus produces results as set of tokens through the call back functions.

##### source


An input string to scan

##### callback_token

Callback function of type **fucntion(_token_)** that receives tokens that macthes each rules in the sequence of scanning.

The parameter *token* to the call back function will be an object consiting of following properties.
- *position* Position of the token in the given string
- *symbol* The matching token as string
- *kind* The kind of patten actually the token matches to.

##### callback_error

Callback function of type **function(_err_)** that receives error information whenever an error is produced during the scanning.

#### Example
```javascript
var WolfLexer = require('wolf-lexer.js');
var lexer = new WolfLexer();
lexer.addRule(/\w+/, "word");
lexer.addRule(/\s+/, "space");

var tokens = [];
lexer.scan("hello world", function(t) {
    tokens.push(t);
});
```

### reset
The *reset* function of WolfLexer lexcial analyzer will reset the state of tokenizer. It will clear all the rules added and reset all states and parameters.

```javascript
lexer.reset();
```

### resumeOnError
The *resumeOnError* property can be used to control the error handling behaviour of WolfLexer lexcial analyzer (tokenizer). The lexer prodcuces an error whenever it encounter any unmatching sequence of character with respect to given rules. The one exception is white space. Even if there are no rules are added to handle white space it will identify white space by defualt and omit them.

When the property *resumeOnError* is set to false, then it will have two behaviours. If the scan function passes the error handler as thrid parameter, it will invoke the error handler with JavaScript Error object as parameter. Otherwise it will throw an exception with proper error message.

When the property *resumeOnError* is set to true, then it simply omit any error unmatching sequence of character it encounters and resumes the scanning without reprting the error.

```javascript
lexer.resumeOnError = true;
```


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
