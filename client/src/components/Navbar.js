import React,{useContext} from 'react'
import './common.css';
import {Link} from 'react-router-dom';
import SrtyLogo from './images/srty.png';
import {AppContext} from '../App';
import {useHistory} from 'react-router-dom';

function Navbar() {

    const setUser = useContext(AppContext);
    const history = useHistory();

    const handleLogout = (e)=>{
        e.preventDefault();
        setUser.userFunc({type:'LOGOUT'});
        history.push("/h");
    }

    return (
        <div className="login-main-text">
            <img className="ui centered medium bordered image" src={SrtyLogo} alt="srtyLogo" id="appLogo"></img>
            {
                setUser.userState.isUser ? 
                (<div>
                    <h2>
                        <span style={{"color":"#ffb100d4"}}>2 </span>
                            Srty 
                        <span style={{"color":"#ffb100d4"}}> 4</span> u
                        <br/>
                    </h2>
                    <button className="ui button blue" onClick={handleLogout} type="submit">Logout</button>
                </div>) 
                : 
                (<div>
                    <h2>
                        <Link to="/">
                            <span style={{"color":"#ffb100d4"}}>2 </span>
                            Srty 
                            <span style={{"color":"#ffb100d4"}}> 4</span> u
                        </Link>
                        <br/> Registration Page
                    </h2>
                    <p><Link to="/l">Login</Link> or <Link to="/s">Register</Link> from here to access.</p>

                </div>)
            }

        </div>
    )
}

export default Navbar
