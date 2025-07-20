/**
 * @file Tree-sitter parser for the SugarCube format of Twine
 * @author Antoine Omond <antoine.omond@ntymail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
// <!- not a comment -->
// <!-- not a comment -> <!-- inline comment -->

module.exports = grammar({
  name: "sugarcube",
  extras: $ => [
    $.comment,
    /[\s\f\uFEFF\u2060\u200B]|\r?\n/,
    $.line_continuation,
  ],
  conflicts: $ => [
    [$.expression, $.literal]
  ],
  rules: {
    source_file: $ => repeat($.item),
    item: $ => choice(
      $.naked_variable,
      $.text,
    ),
    comment: $ => seq(
      '<!--', 
      repeat(choice(
        /[^-]/,
        /-[^-]/,
        /--[^>]/
      )), '-->'
    ),
    line_continuation: $ => token(seq('\\', choice(seq(optional('\r'), '\n'), '\0'))),
    text: $ => token(prec(-1, /[^$][a-zA-Z0-9\]\[ :.]*/)),
    identifier: $ => /[a-z][a-zA-Z0-9]*/,

    // https://www.motoslave.net/sugarcube/2/docs/#markup-naked-variable
    naked_variable: $ => {
      const identifier = /[a-z][a-zA-Z0-9]*/
      return seq(
        '$',
        identifier,
        repeat(choice($.dotProperty, $.squareProperty)),
      )
    },
    dotProperty: $ => {
      const identifier = /[a-z][a-zA-Z0-9]*/
      return seq(
        '.',
        identifier,
      )
    },
    squareProperty: $ => seq(
      '[',
      $.expression,
      ']'
    ),
    number: $ => /\d+/,
    string: $ => {
      const text = /[^$][a-zA-Z0-9\]\[ :.]*/
      return choice(
        token(seq('"', text, '"')),
        token(seq('\'', text, '\'')),
      )
    },

    // https://www.motoslave.net/sugarcube/2/docs/#twinescript-expressions
    expression: $ => choice(
      prec.left(seq($.expression, '+', $.expression)),
      prec.left(seq($.expression, '-', $.expression)),
      prec(5, prec.left(seq($.expression, '*', $.expression))),
      prec(5, prec.left(seq($.expression, '/', $.expression))),
      $.naked_variable,
      $.literal,
    ),
    literal: $ => choice($.number, $.string, $.naked_variable)
  }
});

