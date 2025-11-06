import { useState } from "react"

const Search=(prop)=>{
    const [s,ss]=useState('')
    return(
        <div className="flex justify-center">
            <input className="border-2 w-[90vw] my-3 h-8 border-r-8 rounded-2xl pl-2 mt-23" type="text" placeholder=" Search" onChange={(e)=>prop.setSearchItem(e.target.value)}></input>
        </div>
    )
}
export default Search