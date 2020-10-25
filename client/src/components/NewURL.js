import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {isURL, isEmpty}from 'validator';
import { connect } from 'react-redux';
import {useHistory} from 'react-router-dom';

function NewURL(props) {

    const history               = useHistory();
    const [name,setName]        = useState('');
    const [url,setUrl]          = useState('');
    const [errMsg,setErrMsg]    = useState('');
    const [newUrl,setNewUrl]    = useState('');
    const [succMsg, setSuccMsg] = useState('');

    useEffect(()=>{
        const loggedInUser = localStorage.getItem('user');
        if(!loggedInUser){
            history.push("\l");
        }
    },[]);

    const copyContent = ()=>{
        var copyText = document.querySelector("#input");
        copyText.select();
        document.execCommand("copy");
        if(copyText.value.length===0)
            setErrMsg('Nothing to copy');
        else{
            setSuccMsg('Copied to Clipboard');
            setNewUrl('');
        }  
    }

    const checkAndSend = (e)=>{
        e.preventDefault();
        const rules= { 
            protocols: ['http','https','ftp'], 
            require_tld: true, 
            require_protocol: true, 
            require_host: true, 
            require_valid_protocol: true, 
            allow_underscores: true, 
            host_whitelist: false, 
            host_blacklist: false, 
            allow_trailing_dot: false, 
            allow_protocol_relative_urls: true, 
            disallow_auth: false 
        }
        const validUrl = isURL(url,rules);
        
        if(isEmpty(name,{ ignore_whitespace:true})){
            setErrMsg('Name cannot be only whitespaces, right?');
            return;            
        }
        if(!validUrl){
            setErrMsg('Not a valid URL');
            return;
        }
        else{
            const obj = {
                name,
                url,
                uid:props.uid
            }
            let localUrl = 'http://localhost:8085/ul/add';

            try {
                axios.post(localUrl,obj, {
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    withCredentials: true
                  })
                .then(res=>{
                    setUrl('');
                    setName('');
                    setErrMsg('');
                    setSuccMsg(res.data.msg);
                    setNewUrl(res.data.tempURL);
                    console.log(res.data);
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
                    
                    try {
                        if(msg)
                            setErrMsg(msg);
                        else
                            throw Error('Not Logged In anymore');
                    } catch (error) {
                        history.push("\h");
                        setErrMsg('Please logout and login again');
                        localStorage.clear();
                    }
    
                });
            } catch (error) {
                history.push("\h");
                setErrMsg('Please logout and login again');
                localStorage.clear();
            }


        }
    }

    return (
        <div className="logForm">
            <form className="ui form" onSubmit={checkAndSend}>
                <div className="field">
                    <label>Catchy Name for URL</label>
                    <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Name"
                            onChange={(e)=>{setName(e.target.value)}} 
                            name="name" 
                            value = {name}
                        required/>
                </div>
                <div className="field">
                    <label>The URL</label>
                    <input 
                            type="text" 
                            className="form-control" 
                            placeholder="URL"
                            onChange={(e)=>{setUrl(e.target.value)}} 
                            name="url" 
                            value = {url}
                        required/>
                </div>
                <button className="ui button yellow" type="submit">Srty</button>
            </form>
            {
                // set error
                errMsg.length ? <div className="ui red message">{errMsg}</div> : <span></span>
            } 
            {
                // set error
                succMsg.length ? <div className="ui green message">{succMsg}</div> : <span></span>
            } 
            {
                newUrl.length ? 
                (            
                    <div className="newURL">
                        <input type="text" value={newUrl} id="input" className="form-control" readOnly/>
                        <button className="ui icon button" onClick={copyContent}><i className="copy icon"></i></button>
                    </div>
                )
                :
                (<span></span>)
            }
        </div>
    )
}


const mapStateToProps = (state) =>{
    return {
        isUser: state.isUser,
        uid: state.uid
    }
}

export default connect(mapStateToProps,null)(NewURL);
