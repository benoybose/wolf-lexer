/*
 * wolf-lexer
 * https://github.com/benoybose/wolf-lexer
 *
 * Copyright (c) 2016 Benoy Bose
 * Licensed under the GPL license.
 */

'use strict';

function WolfLexer() {
    this.position = 0;
    this.length = 0;
    this.rules = [];
    this.resumeOnError = false;
    this.errorOccured = false;
}

function Rule(p, k) {
    this.pattern = p;
    this.kind = k;
}

function Token() {
    this.position = 0;
    this.symbol = '';
    this.kind = '';
}

function TokenError(msg, pos) {
    this.message = msg;
    this.position = pos;
}

WolfLexer.prototype.addRule = function(pattern, kind) {
    var r = new Rule(pattern, kind);
    if (typeof(pattern.exec) !== 'function') {
        throw new TypeError('The pattern must contain a function called "exec"');
    }
    this.rules.push(r);
};

WolfLexer.prototype.reset = function() {
    this.position = 0;
    this.length = 0;
    this.rules = [];
    this.resumeOnError = false;
    this.errorOccured = false;
};

WolfLexer.prototype.scan = function(source, callback_token, callback_error) {
    this.position = 0;
    while (0 < source.length) {
        var matchFound = false;
        for (var index = 0; index < this.rules.length; index++) {
            var r = this.rules[index];
            if (r) {
                var m = r.pattern.exec(source);
                if (m) {
                    if (0 === m.index) {
                        var t = new Token();
                        t.position = this.position;
                        t.symbol = m[0];
                        t.kind = r.kind;
                        matchFound = true;
                        this.errorOccured = false;
                        this.position += t.symbol.length;
                        try {
                            callback_token(t);
                        } catch (ex) {
                            console.log(ex);
                        }
                        source = source.substr(t.symbol.length);
                        break;
                    }
                }
            }
        }
        if (!matchFound) {
            if (!this.errorOccured) {
                var terr = null;
                if ((callback_error) && (!this.errorOccured)) {
                    terr = new TokenError('Unidentified token.', this.position);
                    try {
                        callback_error(terr);
                    } catch (ex) {
                        console.log(ex);
                    }
                    if (!this.resumeOnError) {
                        break;
                    }
                    this.errorOccured = true;
                } else {
                    terr = new Error('Unidentified token found at ' + this.position + '.');
                    throw terr;
                }
            }
            source = source.substr(1);
            this.position++;
        }
    }
};

module.exports = WolfLexer;
