import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';


import docs from './docs';
import collections from './collections';
import files from './files';
import auth from './auth';
import tfidf from './tfidf';
/**
 * function used to combine reducers into a single reducer
 * See: http://redux.js.org/docs/recipes/reducers/UsingCombineReducers.html
 */
export const reducers = combineReducers({
    routing: routerReducer,
    form: formReducer,
    docs: docs,
    collections: collections,
    files: files,
    auth: auth,
    tfidf: tfidf,
});

/**
 * function that is wrapping reducer calls
 * to ensure that reducers remain pure
 * See: http://redux.js.org/docs/basics/Reducers.html for more details
 *
 * @param {object} current state
 * @param {object} action sent to the reducer
 * @param {object} reducer being called
 */
export function reducerCall(state, action, reducerClass) {
    // get the action class method
    const [, method] = action.type.split('.');

    // get all the class methods
    const methods = Object.getOwnPropertyNames(reducerClass).filter(name => {
        if ('length' !== name && 'name' !== name && 'prototype' !== name) {
            return name;
        }
    });

    // check if the action method exists in the static class
    if (methods.find(x => x === method)) {
        // clone the state/sub-state
        const new_state = cloneObject(state);

        // return the static method call
        return reducerClass[method](new_state, action);
    } else {
        // there's no valid action, so just return the state
        return state;
    }
}

/**
 * Clone object helper function needed to make sure the copied object is immutable
 * Object.assign() copies by reference when deep cloning, so we can't use it
 *      https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * Even though JSON functions don't work well with Date(), Regex() and functions,
 * this implementation is perfect for our needs. Redux needs the state to be serializable and sent to the redux tools,
 * which means that we couldn't store Date() in state even if we wanted to. Unless we screw the tools.
 *
 * @param object
 * @returns {*}
 */
function cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}
