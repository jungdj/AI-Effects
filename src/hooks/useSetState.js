import { useReducer } from 'react';

const reducer = (prevState, updatedProperty) => ({
	...prevState,
	...updatedProperty,
});

export default function useSetState (initialForm) {
	return useReducer (reducer, initialForm);
}
