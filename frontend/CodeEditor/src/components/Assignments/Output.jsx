import React from 'react'
import { useSelector } from "react-redux";
import './Output.css'

const Output = () => {

    const {output, status, isLoading, error} = useSelector((state)=>state.code);

    if(isLoading){
        return(
            <div className="output loading">
                Executing the Code...
            </div>
        )
    }

    if(!output){
        return(
            <div className="output empty">
                Output will appear Here!
            </div>
        )
    }

    return(
        <div className="output">
            {output}
        </div>
    )
}

export default Output
