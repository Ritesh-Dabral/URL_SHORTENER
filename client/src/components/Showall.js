import React,{useState,useEffect} from 'react';
import Showone from './Showone';
import axios from 'axios';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import {useHistory} from 'react-router-dom';

function Showall(props) {
    
    const history                = useHistory();
    const [allUrl,setAllUrl]     = useState([]);
    const [errMsg,setErrMsg]     = useState('');
    const [succMsg, setSuccMsg]  = useState('');
    const [refresh,setRefresh]   = useState(false);


    const deleteContent = (index)=>{
        var id = document.getElementById(`${index}`).value;
            id = id.split('/').pop(); // last element 
        
        const url = `https://urlsrty.herokuapp.com/ul/del/${id}`;
        axios.delete(url,{withCredentials:true})
        .then(res=>{
            setErrMsg('');
            setSuccMsg(res.data.msg);
            setRefresh(!refresh);
        })
        .catch(error=>{
            setSuccMsg('');
            let msg ;
            if(!error.response.data.name && !error.response.data.oriURL){
                msg = error.response.data.createdBy;
            }
            else if(!error.response.data.createdBy && !error.response.data.oriURL){
                msg = error.response.data.name;
            }
            else if(!error.response.data.name && !error.response.data.createdBy){
                msg = error.response.data.oriURL;
            }
            else{
                msg = error.response.data.createdBy+' ,\n'+error.response.data.name+' ,\n'+error.response.data.oriURL;
            }
            setErrMsg(msg);
            
        })
        
    }
    
    const sendContent = (index)=>{
        var copy = document.getElementById(`${index}`).value;
        window.open(copy);
    }


    useEffect(()=>{

        const url = `https://urlsrty.herokuapp.com/ul/read`;

        // check whether cookie exists

        try {
            const loggedInUser = localStorage.getItem('user');
            if(!loggedInUser){
                history.push("\l");
            }
            
            axios.get(url, {withCredentials: true})
            .then(res=>{
                let myUrl = [...res.data];
                setAllUrl(myUrl);
                setErrMsg('');
            })
            .catch(error=>{
                let msg='' ;
                if(!error.response.data.name && !error.response.data.oriURL){
                    msg = error.response.data.createdBy;
                }
                else if(!error.response.data.createdBy && !error.response.data.oriURL){
                    msg = error.response.data.name;
                }
                else if(!error.response.data.name && !error.response.data.createdBy){
                    msg = error.response.data.oriURL;
                }
                else{
                    msg = error.response.data.createdBy+' ,\n'+error.response.data.name+' ,\n'+error.response.data.oriURL;
                }
                try {
                    if(msg)
                        setErrMsg(msg);
                    else
                        throw Error('Not Logged In anymore');
                } catch (error) {
                    history.push("\h");
                    setErrMsg('Please logout and login again');
                    setAllUrl([]);
                    localStorage.clear();
                }
                
            })   
        } catch (error) {
            setErrMsg('Please logout and login again');
            setAllUrl([]);
            localStorage.clear();
            history.push("\h");
        }
    },[refresh]);


    return (
        <div className="showall">
            {
                // set error
                errMsg.length ? <div className="ui red message">{errMsg}</div> : <span></span>
            }
            {
                // set success
                succMsg.length ? <div className="ui green message">{succMsg}</div> : <span></span>
            } 
            <div className="remainingAll">
                {
                    allUrl.length ? (allUrl.map((each_url,index)=>(
                        <Showone key={index} each_url={each_url} index={index} deleteContent={deleteContent} sendContent={sendContent} />
                    ))):(<h3 style={{"textAlign":"center"}}>Shortify some links...go ahead</h3>)
                }
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

export default connect(mapStateToProps,null)(Showall)
