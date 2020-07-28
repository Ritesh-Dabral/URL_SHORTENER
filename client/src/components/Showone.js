import React from 'react';

function Showone({url,index,deleteContent,sendContent}) {

    return (
    <div className="showone">
        <div className="ui list">
            <div className="item">
            <span className="ui avatar image" >{index+1}</span>
            <div className="content">
                <h4 className="header" style={{"color":"blue"}}>{url.name}</h4>
                <input className="description showOneLink" value={url.newURL} id={index} disabled/>
            </div>
            </div>
        </div>
        <div className="showoneBtn">
            <i 
                className="location arrow icon" 
                onClick={()=>{sendContent(index)}} 
                style={{"cursor":"pointer"}}
                alt="Open Link"
            >   
            </i>
            <i className="trash icon" onClick={()=>{deleteContent(index)}} style={{"cursor":"pointer"}}></i>
        </div>
    </div>
    )
}

export default Showone
