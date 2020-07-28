import React,{useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import LoginImg from './images/girlLogin.png';
import {auth} from './Firebase';
import {AppContext} from '../App';

function Loign() {

    const setUser = useContext(AppContext);

    const history = useHistory();

    const [email,setEmail] = useState('');
    const [pass,setPass]    = useState('');
    const [errMsg,setErrMsg] = useState('');

    const handleSubmit = (e)=>{
        e.preventDefault();

        auth.signInWithEmailAndPassword(email,pass)
        .then(response=>{
            setEmail('');
            setPass('');
            const uid = response.user.uid;
            setUser.userState.uid = uid;
            setUser.userFunc({type:'LOGIN'});
            history.push(`/d/${uid}`);
        })
        .catch(error=>{
            setErrMsg(error.message);
            setPass('');
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
                <div className="message">
                        <span>{errMsg}</span>
                </div>
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
                                        value = {pass}
                                    required/>
                            </div>
                            <button className="ui button blue" type="submit">LogIn</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Loign
