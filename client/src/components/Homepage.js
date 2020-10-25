import React,{useEffect} from 'react'
import Confused from './images/1Confused.png';
import Phone from './images/2srty.png';
import Happy from './images/3Happy.png';
import { connect } from 'react-redux';
import {useHistory} from 'react-router-dom';
import {logoutUser} from '../ReduxStore/User';

function Homepage(props) {

    const history = useHistory();

    useEffect(()=>{
        // if user already exists
        const loggedInUser = localStorage.getItem('user');
        if(loggedInUser){
            history.push("\d");
        }
        else{
            props.logoutUser();
        }
    },[])

    return (
        <div className="Homepage">
            <div className="homeHead">
                <h3>Click-Worthy Links, Just Few Clicks Away</h3><br/>
                <span>Build your brand using powerful short links.</span>
                <p>-"Convert any link of any size to just <span style={{"color":"blue"}}>24</span> characters long"</p>
            </div>
            <div style={{ "textAlign": "center", "fontSize": "2rem", "margin": "2rem 0"}}>
                <i className="angle double down icon"></i>
            </div>
            <div className="centered homeDesc">
                <div className="ui items">
                    <div className="item">
                        <div className="content">
                            <img src={Confused} className="ui centered small bordered image" alt="confused"/>
                            <div style={{"textAlign":"center"}}>
                                <h4 className="header ">Confused?</h4><br/>
                                <div className="description" style={{"letterSpacing": "2px"}}>
                                    <p>Want to share some links? But size too big for a message !!!</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="ui items">
                    <div className="item">
                        <div className="content">
                            <img src={Phone} className="ui centered small bordered image" alt="phone"/>
                            <div style={{"textAlign":"center"}}>
                                <h4 className="header ">Here's a tip!</h4><br/>
                                <div className="description" style={{"letterSpacing": "2px"}}>
                                    <p>Use 'Srty' to convert any link to just 24 charcters long</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="ui items">
                    <div className="item">
                        <div className="content">
                            <img src={Happy} className="ui centered small bordered image" alt="happy"/>
                            <div style={{"textAlign":"center"}}>
                                <h4 className="header ">Happy</h4><br/>
                                <div className="description" style={{"letterSpacing": "2px"}}>
                                    <p>Create short links, without worries</p>
                                </div>
                            </div>

                        </div>
                    </div>
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
        logoutUser: ()=>dispatch(logoutUser())
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Homepage)
