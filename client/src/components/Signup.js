import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import LoginImg from './images/boySignup.png';
import {auth} from './Firebase';

function Signup() {

    const history = useHistory();
    
    const [email,setEmail] = useState('');
    const [pass,setPass]    = useState('');
    const [errMsg,setErrMsg] = useState('');


    const setupUser = (e)=>{
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email,pass)
        .then(function(newUser){
            setErrMsg('');
            history.push("/l");
        })
        .catch(error=>{
            setErrMsg(error.message);
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
                <div className="message">
                        <span>{errMsg}</span>
                </div>
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
                                        value = {pass}
                                    required/>
                            </div>
                            <button className="ui button green" type="submit">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
