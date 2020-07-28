import React,{useState,useEffect} from 'react';
import Showone from './Showone';
import axios from 'axios';

function Showall({uid}) {

    const [allUrl,setAllUrl]     = useState([]);
    const [refresh,setRefresh]   = useState(false);
    const [err,setErr]           = useState('');
    const [errColor,setErrColor] = useState('red');


    const deleteContent = (index)=>{
        var copy = document.getElementById(`${index}`).value;
        copy = copy.split('/').pop();
        
        const url = `https://srtyapp.herokuapp.com/user/del/${copy}`
        axios.delete(url)
        .then(res=>{
            setErrColor('green');
            setErr('Delete Successful');
            setRefresh(!refresh);
        })
        .catch(error=>{
            console.log(error);
        })
        
    }
    
    const sendContent = (index)=>{
        var copy = document.getElementById(`${index}`).value;
        window.open(copy);
    }


    useEffect(()=>{
        const url = `https://srtyapp.herokuapp.com/user/${uid}`;
        axios.get(url)
        .then(res=>{

            setAllUrl(res.data);
            setErrColor('red');
            setErr('');
        })
        .catch(error=>{
            setErrColor('red');
            setErr(error.message);
        })
    },[refresh,uid]);


    return (
        <div className="showall">
            <div className="message" style={{"color":errColor}}>
                {err}
            </div>
            <div className="remainingAll">
                {
                    allUrl.length ? (allUrl.map((url,index)=>(
                        <Showone key={index} url={url} index={index} deleteContent={deleteContent} sendContent={sendContent} />
                    ))):(<h3 style={{"textAlign":"center"}}>Shortify some links...go ahead</h3>)
                }
            </div>
        </div>
    )
}

export default Showall
