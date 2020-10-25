import React,{useState, useEffect} from 'react';
import LoginImg from './images/boySignup.png';
import axios from 'axios';
import {isEmail} from 'validator';
import {useHistory} from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

function Signup(props) {
    const history               = useHistory();
    const [email,setEmail]      = useState('');
    const [password,setPass]    = useState('');
    const [errMsg,setErrMsg]    = useState('');
    const [succMsg, setSuccMsg] = useState('');


    useEffect(()=>{
        // if user already exists
        const loggedInUser = localStorage.getItem('user');
        if(loggedInUser){
            history.push("\d");
        }
    },[])


    const setupUser = (e)=>{
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


        // now password and email are valid, send them to backend
        const url = 'http://localhost:8085/g/s';
        axios.post(url,{email,password})
            .then(res=>{
                let msg = res.data.msg+' with email: '+ res.data.email+ '. A confirmation email has been sent to you.'+
                    '\nThank You for signing up';
                setErrMsg('');
                setSuccMsg(msg);
                setEmail('');
                setPass('');
            })
            .catch(error=>{
                setSuccMsg('');
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
            })
    }

    return (
        <div>
            <div className="Homepage">
                <div className="homeHead">
                    <h3>Sign Up</h3><br/>
                    <span>Register Now, Create short links with 'Srty'</span>
                </div>
            </div>
            <img className="ui centered small bordered image" src={LoginImg} alt="loginImg"></img>
            <div className="login">
                <div className="">
                    <div className="logForm">
                        <form className="ui form" onSubmit={setupUser}>
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
                            <button className="ui button green" type="submit">Sign Up</button>
                        </form>
                    </div>
                    
                    {
                        // set error
                        errMsg.length ? <div className="ui red message">{errMsg}</div> : <span></span>
                    } 

                    {
                        // set success
                        succMsg.length ? <div className="ui green message">{succMsg}</div> : <span></span>
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

export default connect(mapStateToProps,null)(Signup)
