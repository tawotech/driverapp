import {createStore, applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'
import makeAppReducer from './reducers'
import {createLogger} from 'redux-logger'

//import createSocketMiddleware from "redux-socket.io"
//import io from "socket.io -client/dist/socket.io"

//let socket = io("http://localhost:3000",{jsonp:false});
//let socketIoMiddleware  = creatSocketIoMiddleware(socket,"server/");

const log = createLogger ({diff: true, collapsed: true});

const generateStore  = (initialState = {}) => {

    const middleware = [thunk,log];
    const enhancers = [];
    const store = createStore(
        makeAppReducer(),
        initialState,
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    )
    return store;
}

const store = generateStore({});
export default store;
