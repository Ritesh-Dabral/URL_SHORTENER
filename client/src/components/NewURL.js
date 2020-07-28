import React,{useState} from 'react';
import axios from 'axios';
import isURL from 'validator/lib/isURL';

function NewURL({uid}) {

    const [name,setName] = useState('');
    const [url,setUrl] = useState('');
    const [err,setErr] = useState('');
    const [errColor,setErrColor] = useState('red');
    const [newUrl,setNewUrl] = useState('');

    const copyContent = ()=>{
        var copyText = document.querySelector("#input");
        copyText.select();
        document.execCommand("copy");
        setErrColor('blue');
        if(copyText.value.length===0)
            setErr('Nothing to copy');
        else{
            setErr('Copied to Clipboard');
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
        
        if(!validUrl){
            setErrColor('red');
            setErr('Not a valid URL');
            setUrl('');
        }
        else{
            const obj = {
                name,
                url,
                uid
            }
            axios.post('https://srtyapp.herokuapp.com/user/add',obj)
            .then(res=>{
                setUrl('');
                setName('');
                setErrColor('green');
                setErr('Phew!!! Everything is OK');
                setNewUrl('https://srtyapp.herokuapp.com/'+res.data);
  
            })
            .catch(error=>{
                setErrColor('red');
                setErr(error.message)
            });
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
            <div style={{"color":errColor}}>
                {err}
            </div>
            <div className="newURL">
                <input type="text" value={newUrl} id="input" className="form-control" readOnly/>
                <button className="ui icon button" onClick={copyContent}><i className="copy icon"></i></button>
            </div>
        </div>
    )
}

export default NewURL
