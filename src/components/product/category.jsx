import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import Product from "./product"

const Category=()=>{
    const [myProductData,setMyProductData]=useState([])
    console.log("length",myProductData.length)
    const grouped={}
    console.log(supabase)
    useEffect(()=>{
        async function getProduct(params) {
            const {data,error}=await supabase.from("myProductInfo").select("*")
            if(error){
                console.log("fecth error",error)
            }
            else{
                console.log("fecth data",data)
            }
            if(Boolean(data)){
            setMyProductData(data)
            }
        }
        getProduct()

    },[])
    for(let i=0;i<myProductData.length;i++){
            if(!grouped[myProductData[i].category]){
                grouped[myProductData[i].category]=[]
            }
            grouped[myProductData[i].category].push(myProductData[i])
    }
    return(
        <div className="pt-22 overflow-x-auto  bg-slate-100">
            {
                Object.values(grouped).map((item,index)=>{

                    return <div key={index}>
                        
                        <p className="pl-2 font-semibold text-xl">{Object.keys(grouped)[index]}</p>
                        <Product category={item}></Product>
                        </div>
                })
            }
        </div>      
    )
}
export default Category