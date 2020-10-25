import {createStore} from 'redux';
import {reducer} from './User';


const store = createStore(reducer);

export default store;