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
  //precedences: $ => [
  //  [$.text, $.naked_variable, $.naked_variable_property]
  //],
  //conflicts: $ => [
  //  [$.text, $.naked_variable, $.naked_variable_property]
  //],
  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.item),

    item: $ => choice(
      $.naked_variable,
      //prec(2, $.naked_variable_property),
      //prec(-1, $.text),
      //$.naked_variable_property,
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
    text: $ => token(prec(-1, /[^$][a-zA-Z0-9 :.]*/)),
    identifier: $ => /[a-z][a-zA-Z0-9]*/,
    naked_variable: $ => {
      const identifier = /[a-z][a-zA-Z0-9]*/
      return seq(
        '$',
        identifier,
        repeat($.property),
      )
    },
    //naked_variable_property: $ => {
    //  const identifier = /[a-z][a-zA-Z0-9]*/
    //  return seq(
    //    '$',
    //    identifier,
    //    repeat($.property),
    //  )
    //  //return token(seq(
    //  //  '$',
    //  //  identifier,
    //  //  repeat(seq('.',
    //  //  identifier)),
    //  //))
    //},
    property: $ => {
      const identifier = /[a-z][a-zA-Z0-9]*/
      return prec(3,token(seq(
        '.',
        identifier,
      )))
    }
  }
});

