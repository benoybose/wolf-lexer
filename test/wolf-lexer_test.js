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

		it('should throw error if the pattern doesn\'t have a function called exec', function() {
			var lexer = new WolfLexer();
			(function() {lexer.addRule({}, kindId);}).should.throw();
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

        it('should rethrow exception from the callback function', function() {
            var lexer = new WolfLexer();
            lexer.addRule(patternWord, kindWord);
            lexer.addRule(patternWhiteSpace, kindSpace);
            (function() {lexer.scan(inputTwoDashes, function(t) {
                throw new Error('Exception from token callback.');
            }, function(e) {})}).should.throw();
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

		it('should omit white space characters in between tokens', function() {
			var numberPattern = /[0-9]+/;
			var numberKind = "number";
			var varPattern = /(var)/;
			var varKind = "var";
			var idPattern = /\w+/;
			var idKind = "id";
			var assignPattern = /\=/;
			var assignKind = "assign";
			var semiColonPattern = /\;/;
			var semiColonKind = "semi-colon";
			var lexer = new WolfLexer();

			var input = "var count = 123;";

			lexer.addRule(numberPattern, numberKind);
			lexer.addRule(varPattern, varKind);
			lexer.addRule(idPattern, idKind);
			lexer.addRule(assignPattern, assignKind);
			lexer.addRule(semiColonPattern, semiColonKind);

			var tokens = [];
			lexer.scan(input, function(t) { tokens.push(t); });
			tokens.length.should.be.equal(5);
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

    describe('#scan #next (in step mode)', function() {
        it('may accept wth no callback to work in step mode.', function () {
            var lexer = new WolfLexer();
            lexer.addRule(patternWord, kindWord);
            var handler = lexer.scan('hello world');
            handler.text.should.be.eql('hello world');
            handler.lexer.should.be.eql(lexer);

            var t1 = handler.next();
            t1.symbol.should.be.eql('hello');
            handler.text.should.be.eql(' world');

            t1.position.should.be.eql(0);
            handler.position.should.be.eql(5);

            var t2 = handler.next(true);
            t2.symbol.should.be.eql('world');
            t2.kind.should.be.eql('word');
        });

        it('should throw exception on encoutering invalid characters', function () {
            var lexer = new WolfLexer();
            lexer.addRule(patternWord, kindWord);
            var handler = lexer.scan('hello, world');
            (function () {
                handler.next();
                handler.next();
            }).should.throw();
        });

        it('should not throw exception on encoutering invalid characters in resumeOnError', function () {
            var lexer = new WolfLexer();
            lexer.addRule(patternWord, kindWord);
            lexer.resumeOnError = true;
            var handler = lexer.scan('hello, world');
            (function () {
                var t1 = handler.next();
                var t2 = handler.next();
                t1.symbol.should.be.eql('hello');
                t2.symbol.should.be.eql('world');
            }).should.not.throw();
            handler.hasErrors().should.be.ok;
            var t2 = handler.next(true);
            assert.equal(t2, null);
        });
    });
});
