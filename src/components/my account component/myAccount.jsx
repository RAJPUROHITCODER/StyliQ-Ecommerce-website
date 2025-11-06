import { useEffect, useState } from "react"
import Profile from "./profile"
import MyOrders from "./myOrders"
import WishList from "./mywishlist"
import { supabase } from "../supabase"

import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import MySales from "./mySales"

const MyAccount=()=>{
    const [myAccountComponent,setMyAccountComponent]=useState(null)
    const [userData,setUserData]=useState(null)
    const {state}=useLocation()
    useEffect(()=>{
        if(state){
            setMyAccountComponent("orders")
        }
        else{
            setMyAccountComponent("profile")
        }
        async function getUserData(params) {
            const { data: { user } } = await supabase.auth.getUser()
            const {data,error}=await supabase.from("Users").select("*").eq("id",user["id"])
            console.log("data my acoount",data)
            setUserData(data)
        }
        getUserData()
    },[])
    async function handleLogout() {
        console.log("logout")
        const {data,error}=await supabase.auth.signOut()
        if(error){
            console.log('logout error',error)
        }
        else{
            console.log("logout data",data)
        }
    }
    return(
        <div className="pt-25 p-2 h-[100dvh] bg-slate-200  md:flex overflow-x-auto ">
            <div className="md:w-[25dvw]">
                <div className="flex p-2 bg-white">
                    <div className="mr-3">
                        <img src="profile-pic-male_4811a1.svg" alt="no image"></img>
                    </div>
                    <div>
                        <p>hello</p>
                        <h3 className="font-bold">{userData!=null?userData[0]["userName"]:"Guest"}</h3>
                    </div>
                </div>
                <div className="bg-white mt-3 p-2 text-[18px] md:h-[63dvh] grid grid-cols-2 md:items-start md:content-start md:grid-cols-1 gap-2 [&>*]:border-1 md:[&>*]:border-none">
                    <p onClick={()=>setMyAccountComponent("profile")} className="flex justify-center items-center h-6 md:justify-start" style={myAccountComponent=="profile"?{color:'blue',border:"1px solid blue"}:{color:"black"}}>Profile</p>
                    <p onClick={()=>setMyAccountComponent("orders")} className="flex justify-center items-center md:justify-start h-6" style={myAccountComponent=="orders"?{color:'blue',border:"1px solid blue"}:{color:"black"}}>My orders</p>
                    <p onClick={()=>setMyAccountComponent("mySales")} className="flex justify-center h-6 items-center md:justify-start" style={myAccountComponent=="mySales"?{color:'blue',border:"1px solid blue"}:{color:"black"}}>My Sales</p>
                    <p onClick={()=>setMyAccountComponent("wishlist")} className="flex justify-center h-6 items-center md:justify-start" style={myAccountComponent=="wishlist"?{color:'blue',border:"1px solid blue"}:{color:"black"}}>My WishList</p>
                    <button className="hidden md:flex justify-center h-6 items-center md:justify-start" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="md:mx-3 mt-3 md:mt-0 bg-white ">
                {myAccountComponent=="profile"  && <Profile userData={userData} ></Profile>}
                {myAccountComponent=="orders" && <MyOrders></MyOrders>}
                {myAccountComponent=="mySales" && <MySales></MySales>}
                {myAccountComponent=="wishlist" && <WishList></WishList>}
            </div>
        </div>
    )
}
export default MyAccount