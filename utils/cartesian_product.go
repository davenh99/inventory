package utils

// generate cartesian product of slices of slices (i.e. ids)
func CartesianProduct[T any](slices [][]T) [][]T {
	if len(slices) == 0 {
		return [][]T{}
	}

	result := make([][]T, 0)
	for _, item := range slices[0] {
		result = append(result, []T{item})
	}

	for i := 1; i < len(slices); i++ {
		nextSet := slices[i]
		newResult := make([][]T, 0)
		for _, tuple := range result {
			for _, item := range nextSet {
				newTuple := append([]T{}, tuple...)
				newTuple = append(newTuple, item)
				newResult = append(newResult, newTuple)
			}
		}
		result = newResult
	}

	return result
}
