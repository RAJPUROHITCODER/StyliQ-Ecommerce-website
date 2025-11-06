import { useEffect, useRef, useState } from "react"
import { Link,useLocation } from "react-router-dom"
const IndividualCategory=(props)=>{
    const intervalId=useRef(null)
    const {state}=useLocation()
    const [hoverIndex,setHoverIndex]=useState([])
    let ids={}
    useEffect(()=>{
        state.map((item)=>[
            ids[item.id]=0

        ])
        setHoverIndex(ids)
    },[])
    return(
        <div className="pt-22 bg-slate-200 overflow-auto h-[95dvh] scrollbar-hide">
            <h2 className="text-black ml-4 font-bold text-3xl">{state[0].category}</h2>
            <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5">
                {
                    state.map((item,index)=>{
                        return <div key={index} className="border-1 m-1 p-3 my-2  rounded-xl bg-white  shrink-0 hover:shadow-2xl flex justify-center ">
                            <Link to={`/product/${item.id}`}>
                                {hoverIndex!=undefined?<div className="flex justify-self-center"
                                    onMouseEnter={()=>{
                                        intervalId.current=setInterval(()=>{
                                            setHoverIndex(prev=>({...prev,[item.id]:(prev[item.id]+1)%item.imageName.length}))

                                        },1000)

                                    }}
                                    onMouseLeave={()=>{
                                        setHoverIndex(prev=>({...prev,[item.id]:0}))
                                        clearInterval(intervalId.current)
                                    }}
                                >

                                <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item.imageName[hoverIndex[item.id]]}`} alt="not found" className="h-55 w-45 lg:h-65 lg:w-50 min-w-33 rounded-2xl"/>
                                </div>:""}
                                <div>
                                    <p className="font-bold text-gray-400">{item["brandName"]}</p>
                                    <p className="text-black">{item["productName"]}</p>
                                    <div className="flex">
                                        <p className="text-black">₹{item.discount!=0?Math.round(item["price"]-(item["price"]*item["discount"])/100):item["price"]}&nbsp;</p>
                                        <p className="text-gray-500 text-[15px] line-through">{item.discount!=0?"₹"+item["price"]:""} &nbsp;</p>
                                        <p className="text-green-600">{item.discount!=0?item["discount"]+"% off":""}</p>
                                    </div>
                                </div>
                            </Link>
                            </div>
                    }) 
                }
            </div>
        </div>
    )
}
export default IndividualCategory