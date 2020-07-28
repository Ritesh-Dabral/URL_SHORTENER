import React,{useState} from 'react';
import NewURL from './NewURL';
import Showall from './Showall';

export const DashboardContext = React.createContext();

function Dashboard({uid}) {

    const [neew,setNeew] = useState(false);


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
                        New
                    </div>
                    <div className="item active spec" onClick={aClicked}>
                        Show All
                    </div>
                </div>
                <div className="ui bottom attached segment">
                    {
                        neew  ? (<NewURL uid={uid} />):(<Showall uid={uid} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard
