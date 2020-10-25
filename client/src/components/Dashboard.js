import React,{useState,useEffect} from 'react';
import NewURL from './NewURL';
import Showall from './Showall';
import { connect } from 'react-redux';
import {useHistory} from 'react-router-dom';


export const DashboardContext = React.createContext();

function Dashboard(props) {

    const [neew,setNeew] = useState(true);
    const history        = useHistory();


    useEffect(()=>{
        // if user already exists
        const loggedInUser = localStorage.getItem('user');
        if(!loggedInUser){
            history.push('\l');
        }
    },[])

    const aClicked = ()=>{
        setNeew(!neew);
        const dash = document.querySelectorAll('#dash div');
        for(let i=0;i<2;i++)
            dash[i].classList.toggle('active');
    }

    return (
        <div>
            <div className="Homepage">
                <div className="homeHeadFixed">
                    <h3>Dashboard</h3><br/>
                    <span>Manage all your links from here</span>
                </div>
            </div>
            <div className="dashboard">
                <div className="ui top attached tabular menu" id="dash">
                    <div className="item spec" onClick={aClicked}>
                        Show All
                    </div>
                    <div className="item active spec" onClick={aClicked}>
                        New URL
                    </div>
                </div>
                <div className="ui bottom attached segment">
                    {
                        neew  ? (<NewURL/>):(<Showall/>)
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>{
    return {
        isUser: state.isUser,
        uid: state.uid
    }
}

export default connect(mapStateToProps,null)(Dashboard)
