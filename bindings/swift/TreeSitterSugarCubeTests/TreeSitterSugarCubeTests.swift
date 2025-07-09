import XCTest
import SwiftTreeSitter
import TreeSitterSugarcube

final class TreeSitterSugarcubeTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_sugarcube())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading SugarCube grammar")
    }
}
