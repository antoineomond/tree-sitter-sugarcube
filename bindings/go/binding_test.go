package tree_sitter_sugarcube_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_sugarcube "github.com/tree-sitter/tree-sitter-sugarcube/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_sugarcube.Language())
	if language == nil {
		t.Errorf("Error loading SugarCube grammar")
	}
}
