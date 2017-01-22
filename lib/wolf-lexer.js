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
    this.defaultRules = false;
    this.source = '';
    this.inStepMode = false;
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
    this.source = '';
    this.inStepMode = false;
};

WolfLexer.prototype.findMatch = function(text, position) {
    for (var index = 0; index < this.rules.length; index++) {
        var r = this.rules[index];
        var m = r.pattern.exec(text);
        if (!m) {
            continue;
        }

        if (0 !== m.index) {
            continue;
        }

        var t = new Token();
        t.position = position;
        if (m.extract) {
            t.symbol = m.extract;
        }
        t.symbol = m[0];
        t.kind = r.kind;
        return t;
    }
    return null;
};

WolfLexer.prototype.scan = function(text, callback_token, callback_error) {
    if (!this.defaultRules) {
        var whiteSpace = new Rule(/\s+/, '$_whiespace');
        this.rules.push(whiteSpace);
    }

    if (!callback_token) {
        var Stepper = function(t, l) {
            this.text = t;
            this.lexer = l;
            this.position = 0;
            this.errors = [];
        };

        Stepper.prototype.hasErrors = function() {
            return (0 < this.errors.length);
        };

        Stepper.prototype.next = function(skipWhiteSpace) {
            if (typeof(skipWhiteSpace) === 'undefined') {
                skipWhiteSpace = true;
            }

            var token = this.lexer.findMatch(this.text, this.position);
            if (token) {
                this.position += token.symbol.length;
                this.text = this.text.substr(token.symbol.length);

                if ((skipWhiteSpace) && (token.kind === '$_whiespace')) {
                    token = this.next(skipWhiteSpace);
                }
            } else {
                if (0 < this.text.length) {
                    if (!this.lexer.resumeOnError) {
                        throw new Error('Invalid character is found at ' + this.position);
                    } else {
                        this.errors.push('Invalid character is found at ' + this.position);
                        while (true) {
                            this.text = this.text.substr(1);
                            this.position += 1;
                            token = this.next(skipWhiteSpace);
                            if (token) {
                                return token;
                            }
                        }
                    }
                } else {
                    return null;
                }
            }
            return token;
        };

        var stepper = new Stepper(text, this);
        return stepper;
    }

    this.source = text;
    this.position = 0;

    while (0 < this.source.length) {
        var t = this.findMatch(this.source, this.position);
        if (t) {
            this.errorOccured = false;
            this.position += t.symbol.length;
            try {
                if (t.kind !== '$_whiespace') {
                    if (callback_token) {
                        callback_token(t);
                    } else {
                        // todo: in step mode
                    }

                }
            } catch (ex) {
                throw new Error('Error on invoking callback function. ' + ex.message);
            }
            this.source = this.source.substr(t.symbol.length);
        } else {
            var currrentPosition = this.position;
            this.source = this.source.substr(1);
            this.position++;

            if (this.errorOccured) {
                continue;
            }

            var terr = null;
            if ((callback_error) && (!this.errorOccured)) {
                terr = new TokenError('Unidentified token.', currrentPosition);
                try {
                    callback_error(terr);
                } catch (ex) {
                    // todo: Nothing
                }
                if (!this.resumeOnError) {
                    break;
                }
                this.errorOccured = true;
            } else {
                terr = new Error('Unidentified token found at ' + currrentPosition + '.');
                throw terr;
            }
        }
    }
};

module.exports = WolfLexer;
