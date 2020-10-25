import React,{useState,useEffect} from 'react'
import './common.css';
import {Link} from 'react-router-dom';
import SrtyLogo from './images/srty.png';
import {useHistory} from 'react-router-dom';
import { connect } from 'react-redux';
import {logoutUser} from '../ReduxStore/User';
import axios from 'axios';

function Navbar(props) {

    const history               = useHistory();
    const [errMsg,setErrMsg]    = useState('');


    const handleLogout = (e)=>{
        e.preventDefault();
        let url = 'http://localhost:8085/g/lo';

        axios.get(url, {withCredentials:true})
            .then(async res=>{
                await props.logoutUser();
                localStorage.clear();
                history.push("/h");
            })
            .catch(error=>{
                setErrMsg('Unable to logout successfully. Contact the admins');
            });
    }

    return (
        <div className="login-main-text">
            <img className="ui centered medium bordered image" src={SrtyLogo} alt="srtyLogo" id="appLogo"></img>
            {
                props.isUser ? 
                (
                <div>
                    <h2>
                        <span style={{"color":"#ffb100d4"}}>2 </span>
                            Srty 
                        <span style={{"color":"#ffb100d4"}}> 4</span> u
                        <br/>
                    </h2>
                    <button className="ui button blue" onClick={handleLogout} type="submit">Logout</button>
                    {
                        // set error
                        errMsg.length ? <div className="ui red message">{errMsg}</div> : <span></span>
                    } 
                </div>
                ) 
                : 
                (
                <div>
                    <h2>
                        <Link to="/">
                            <span style={{"color":"#ffb100d4"}}>2 </span>
                            Srty 
                            <span style={{"color":"#ffb100d4"}}> 4</span> u
                        </Link>
                        <br/> Registration Page
                    </h2>
                    <p><Link to="/l">Login</Link> or <Link to="/s">Register</Link> from here to access.</p>

                </div>
                )
            }

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
        logoutUser: ()=>dispatch(logoutUser()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navbar)
