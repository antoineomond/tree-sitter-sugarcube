/**
 * @file Tree-sitter parser for the SugarCube format of Twine
 * @author Antoine Omond <antoine.omond@ntymail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
module.exports = grammar({
  name: "sugarcube",
  extras: $ => [
    $.comment,
    /[\s\f\uFEFF\u2060\u200B]|\r?\n/,
    $.line_continuation,
  ],
  conflicts: $ => [
    [$.expression, $.literal],
    [$.item, $.expression, $.literal],
    [$.item, $.expression],
    [$.naked_variable, $.word],
  ],
  rules: {
    source_file: $ => repeat($.item),
    item: $ => prec.left(choice(
      $.escaped_naked_variable,
      $.naked_variable,
      $.expression,
      $.word,
      $.triple_quotes_naked_variable,
      $.nowiki_naked_variable,
      $.code_naked_variable,
      $.link
    )),
    comment: $ => seq(
      '<!--', 
      repeat(choice(
        /[^-]/,
        /-[^-]/,
        /--[^>]/
      )), '-->'
    ),
    line_continuation: $ => token(seq('\\', choice(seq(optional('\r'), '\n'), '\0'))),
    word: $ => token(prec(-10, /\S*/)),
    word_link: $ => token(/[^ \|\[\]]*/),

    // https://www.motoslave.net/sugarcube/2/docs/#markup-naked-variable
    naked_variable: $ => {
      const identifier = /[a-zA-Z][a-zA-Z0-9]*/
      return seq(
        '$',
        identifier,
        repeat(choice($.dotProperty, $.squareProperty)),
      )
    },
    dotProperty: $ => {
      const identifier = /[a-zA-Z][a-zA-Z0-9]*/
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
      const word = /[^"']*/
      return choice(
        token(seq('"', word, '"')),
        token(seq('\'', word, '\'')),
      )
    },

    // https://www.motoslave.net/sugarcube/2/docs/#twinescript-expressions
    expression: $ => choice(
      prec.left(seq($.expression, choice('+','-'), $.expression)),
      prec(5, prec.left(seq($.expression, choice('*','/'), $.expression))),
      $.naked_variable,
      $.literal,
    ),
    triple_quotes_naked_variable: $ => seq(
      '"""', $.naked_variable, '"""'
    ),
    code_naked_variable: $ => seq(
      '{{{', $.naked_variable, '}}}'
    ),
    nowiki_naked_variable: $ => seq(
      '<nowiki>', $.naked_variable, '</nowiki>'
    ),
    escaped_naked_variable: $ => seq(
      '$', $.naked_variable
    ),
    link: $ => seq(
      '[[',
        choice(
          seq($.word_link),
          seq($.word_link, '|', $.word_link),
          seq($.word_link, '][', $.word_link),
          seq($.word_link, '|', $.word_link, '][', $.word_link),
      ),
      ']]'
    ),
    literal: $ => choice($.number, $.string)
  }
});

