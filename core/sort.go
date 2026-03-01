package pbmodules

import (
	"fmt"
)

func sortModules(modules []Module) ([]Module, error) {
	// Map module names to their index for quick lookup
	nameToIndex := make(map[string]int)
	for i, mod := range modules {
		nameToIndex[mod.Name] = i
	}

	// Build in-degree and adjacency list
	inDegree := make(map[string]int)
	adj := make(map[string][]string)
	for _, mod := range modules {
		inDegree[mod.Name] = 0
	}
	for _, mod := range modules {
		for _, dep := range mod.Dependencies {
			if _, ok := inDegree[dep]; !ok {
				return nil, fmt.Errorf("missing dependency: %s", dep)
			}
			adj[dep] = append(adj[dep], mod.Name)
			inDegree[mod.Name]++
		}
	}

	// Collect modules with no dependencies
	queue := []string{}
	for name, deg := range inDegree {
		if deg == 0 {
			queue = append(queue, name)
		}
	}

	var sorted []Module
	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]
		idx := nameToIndex[curr]
		sorted = append(sorted, modules[idx])
		for _, neighbor := range adj[curr] {
			inDegree[neighbor]--
			if inDegree[neighbor] == 0 {
				queue = append(queue, neighbor)
			}
		}
	}

	if len(sorted) != len(modules) {
		return nil, fmt.Errorf("circular dependency detected or missing dependency")
	}
	return sorted, nil
}
