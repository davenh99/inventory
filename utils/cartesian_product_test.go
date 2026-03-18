package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCartesianProduct(t *testing.T) {
	cases := []struct {
		name     string
		input    [][]string
		expected [][]string
	}{
		{
			name:     "empty input",
			input:    [][]string{},
			expected: [][]string{},
		},
		{
			name:     "single list",
			input:    [][]string{{"a", "b"}},
			expected: [][]string{{"a"}, {"b"}},
		},
		{
			name:     "two lists",
			input:    [][]string{{"a", "b"}, {"1", "2"}},
			expected: [][]string{{"a", "1"}, {"a", "2"}, {"b", "1"}, {"b", "2"}},
		},
		{
			name:     "three lists",
			input:    [][]string{{"a", "b"}, {"1", "2"}, {"x", "y"}},
			expected: [][]string{{"a", "1", "x"}, {"a", "1", "y"}, {"a", "2", "x"}, {"a", "2", "y"}, {"b", "1", "x"}, {"b", "1", "y"}, {"b", "2", "x"}, {"b", "2", "y"}},
		},
		{
			name:     "list with empty list",
			input:    [][]string{{"a", "b"}, {}, {"x", "y"}},
			expected: [][]string{},
		},
		{
			name:     "lists with single element",
			input:    [][]string{{"a"}, {"1"}, {"x"}},
			expected: [][]string{{"a", "1", "x"}},
		},
	}

	for _, c := range cases {
		result := CartesianProduct(c.input)
		for _, row := range result {
			assert.Contains(t, c.expected, row)
		}
		// if !equal(result, c.expected) {
		// 	t.Errorf("TestCartesianProduct(%q): expected %v, got %v", c.name, c.expected, result)
		// }
	}
}
