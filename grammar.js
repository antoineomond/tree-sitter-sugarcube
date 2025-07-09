/**
 * @file Tree-sitter parser for the SugarCube format of Twine
 * @author Antoine Omond <antoine.omond@ntymail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "sugarcube",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
