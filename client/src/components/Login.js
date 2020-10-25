import React,{useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import LoginImg from './images/girlLogin.png';
import axios from 'axios';
import {isEmail} from 'validator';
import { connect } from 'react-redux';
import {loginUser} from '../ReduxStore/User';
import {logoutUser} from '../ReduxStore/User';

function Login(props) {

    //const setUser = useContext(AppContext);

    const history                  = useHistory();
    const [email,setEmail]         = useState('');
    const [password,setPass]       = useState('');
    const [errMsg,setErrMsg]       = useState('');


    useEffect(()=>{
        const loggedInUser = localStorage.getItem('user');
        if(loggedInUser){
            history.push("\d");
        }
        else{
            props.logoutUser();
        }
    },[])


    const handleSubmit = (e)=>{
        e.preventDefault();


        // check if email is valid

        if(!isEmail(email)){
            setErrMsg('Not a valid email address');
            return;
        }

        // check if there is a single white space

        if(password.includes(' ')){
            setErrMsg('Password should not include any whitespace(s)');
            return;
        }


        const url = 'https://srtyapp.herokuapp.com/g/l';
        axios.post(url,{email,password},{
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
            .then(res=>{
                let uid = res.data.uid;
                props.loginUser(uid);
                localStorage.setItem('user',true);
                history.push(`/d`);
            })
            .catch(error=>{
                let errorData;
                if(!error.response.data.email){
                    errorData = error.response.data.password;
                }
                else if(!error.response.data.password){
                    errorData = error.response.data.email;
                }
                else{
                    errorData = error.response.data.email+"\n"+error.response.data.password;
                }
                
                setErrMsg(errorData);
                //console.log(error.response);
            })

    }


    return (
        <div>
            <div className="Homepage">
                <div className="homeHead">
                    <h3>Log In</h3><br/>
                     <span>Let's go and create some short links</span>
                </div>
            </div>
            <img className="ui centered small bordered image" src={LoginImg} alt="srtyLogo"></img>
            <div className="login" id="myForm">
                <div>
                    <div className="logForm">
                        <form className="ui form" onSubmit={handleSubmit}>
                            <div className="field">
                                <label>Email Address</label>
                                <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Email"
                                        onChange={(e)=>{setEmail(e.target.value)}} 
                                        name="email" 
                                        value = {email}
                                    required/>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Password"
                                        onChange={(e)=>{setPass(e.target.value)}}
                                        name="password" 
                                        value = {password}
                                    required/>
                            </div>
                            <button className="ui button blue" type="submit">LogIn</button>
                        </form>
                    </div>
                    {
                        // set error
                        errMsg.length ? <div className="ui red message">{errMsg}</div> : <span></span>
                    } 
                </div>
            </div>
        </div>

    )
}


const mapStateToProps = (state) =>{
    return {
        isUser: state.isUser
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        loginUser: (uid)=>dispatch(loginUser(uid)),
        logoutUser: ()=>dispatch(logoutUser()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)
