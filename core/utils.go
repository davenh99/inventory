package pbmodules

import (
	"strings"
	"unicode"
)

func camelCaseToLabel(s string) string {
	var result strings.Builder
	for i, char := range s {
		if unicode.IsUpper(char) && i > 0 {
			result.WriteRune(' ')
		}
		if i == 0 {
			result.WriteRune(unicode.ToUpper(char))
		} else {
			result.WriteRune(char)
		}
	}
	return result.String()
}
