const LOGIN_USER  = 'LOGIN_USER',
      LOGOUT_USER  = 'LOGOUT_USER';


const initialSetting = {
    isUser : false,
    uid: ''
}


// action creator

export const loginUser = (uid)=>{
    return{
        type:LOGIN_USER,
        payload:uid,
        info: 'Login User'
    }
}


export const logoutUser = ()=>{
    return{
        type:LOGOUT_USER,
        info: 'Logout User'
    }
}


//reducer

export const reducer = (state=initialSetting, action)=>{

    switch(action.type){
        case LOGIN_USER: return{
            ...state,
            isUser : true,
            uid: action.payload
        }

        case LOGOUT_USER: return{
            ...state,
            isUser : false,
            uid: ''
        }

        default : return{
            ...state,
            isUser : false,
            uid: ''
        }
    }
}