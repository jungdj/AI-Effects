import React from 'react';
import storage from "../utils/storage"
import { useHistory, useLocation } from 'react-router-dom';

export default () => {
	const location = useLocation ();
	const history = useHistory();
	if (location.pathname !== '/' && !storage.getItem('profile')) {
		history.push ('/');
	}
	return null;
}
