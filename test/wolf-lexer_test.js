'use strict';

var WolfLexer = require('../lib/wolf-lexer.js');
var assert = require('should');

var patternId = /[a-zA-Z][a-zA-Z0-9\_]/;
var patternWord = /[a-zA-Z]+/;
var patternWhiteSpace = /[\s]/;

var kindId = "identifier";
var kindWord = "word";
var kindSpace = "white_space";

var inputSingleWord = "hoo";
var inputTwoWords = "hello world";
var inputTwoDashes = "hello _* _ world";

describe('WolfLexer', function() {
	describe('#addRule()', function() {
		it('shoulb be a function.', function() {
			var lexer = new WolfLexer();
			lexer.addRule.should.be.type('function');
		});

		it('should accept valid pattern and kind.', function() {
			var lexer = new WolfLexer();
			lexer.rules.should.not.be.type('undefined');
			lexer.addRule(patternId, kindId);
			lexer.rules[0].pattern.should.be.equal(patternId);
			lexer.rules[0].kind.should.be.equal(kindId);
		});
	});

	describe('#scan()', function() {
		it('should be a function.', function() {
			var lexer = new WolfLexer();
			lexer.scan.should.be.type('function');
		});

		it('should scan \'' + inputSingleWord + '\' with pattern \'' + patternWord + '\' and give output.', function() {
			var lexer = new WolfLexer();
			lexer.addRule(patternWord, kindWord);
			lexer.scan(inputSingleWord, function(token) {
				token.symbol.should.be.equal(inputSingleWord);
				token.kind.should.be.equal(kindWord);
				token.position.should.be.equal(0);
			});
		});

		it('should be able to scan multiple words.', function() {
			var lexer = new WolfLexer();
			lexer.addRule(patternWord, kindWord);
    		lexer.addRule(patternWhiteSpace, kindSpace);
    		var tokens = [];
    		lexer.scan(inputTwoWords, function(t) {
        		tokens.push(t);
    		});

    		tokens.length.should.be.equal(3);
    		tokens[0].symbol.should.be.equal('hello'); // The symbol must be 'hello'
		    tokens[0].kind.should.be.equal('word'); // The kind must be 'word'
		    tokens[0].position.should.be.equal(0); // The position must be 0

		    tokens[1].symbol.should.be.equal(' '); // The symbol must be ' '
		    tokens[1].kind.should.be.equal('white_space'); // The kind must be 'white_space'
		    tokens[1].position.should.be.equal(5); // The position must be 5.

		    tokens[2].symbol.should.be.equal('world'); // The symbol must be 'world'
		    tokens[2].kind.should.be.equal('word'); // The kind must be 'word'
		    tokens[2].position.should.be.equal(6); // The position must be 6.
		});

		it('should stop scannig at on error and should throw exception.', function() {
			var lexer = new WolfLexer();
		    lexer.addRule(patternWord, kindWord);
		    lexer.addRule(patternWhiteSpace, kindSpace);
		    var tokens = [];
		    (function() {lexer.scan(inputTwoDashes, function(t) {
		        tokens.push(t);
		    })}).should.throw();
			tokens.length.should.be.equal(2);
		});

		it('should stop scannig at on error and should not throw exception.', function() {
			var lexer = new WolfLexer();
		    lexer.addRule(patternWord, kindWord);
		    lexer.addRule(patternWhiteSpace, kindSpace);
		    var tokens = [];
		    (function() {lexer.scan(inputTwoDashes, function(t) {
		        tokens.push(t);
		    }, function(e) {})}).should.not.throw();
			tokens.length.should.be.equal(2);
		});

		it('should not stop on error.', function() {
		    var lexer = new WolfLexer();
		    lexer.resumeOnError = true;

		    lexer.addRule(patternWord, kindWord);
		    lexer.addRule(patternWhiteSpace, kindSpace);
		    var tokens = [];
		    var errors = [];

		    lexer.scan(inputTwoDashes, function(t) {
		        tokens.push(t);
		    }, function(err) {
		        err.message.should.be.type('string');
		        err.position.should.be.type('number');
		        errors.push(err);
		    });

			tokens.length.should.be.equal(5); // It must identify 5 tokens
		    errors.length.should.be.equal(2); // "There must be two errors
		    errors[0].position.should.be.equal(6); // First error at position (6)
		    errors[1].position.should.be.equal(9); // Second error at position (9)
		});
	});

	describe('#reset()', function() {
		it('should reset the lexer.', function() {
			var lexer = new WolfLexer();
		    lexer.resumeOnError = true;
		    lexer.addRule(patternWord, kindWord);
		    lexer.addRule(patternWhiteSpace, kindSpace);

		    lexer.resumeOnError.should.be.equal(true);
		    lexer.rules.length.should.be.equal(2);

		    (function(){
		    	lexer.reset();
		    }).should.not.throw();

		    lexer.resumeOnError.should.be.equal(false);
		    lexer.rules.length.should.be.equal(0);
		});
	});
});