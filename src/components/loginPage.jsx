import { useState } from "react"
import { supabase } from "./supabase"
import {useForm} from "react-hook-form"
const Login=(props)=>{
    const [isSignIn,setIsSignIn]=useState(true)
    const [isInfo,setIsInfo]=useState(true)
    const {
        register,
        watch,
        handleSubmit,
        formState:{errors}
    }=useForm()

    async function onSubmit(userData) {
        console.log("********************",userData)
        const email=userData.email
        const password=userData.password
        if(isSignIn){
            const {data,error}=await supabase.auth.signInWithPassword({email,password})
            if(error){
                if(error.message=="Invalid login credentials"){
                    alert(error.message)
                }
                else{
                    alert("login another message",error.message)
                }
            }
            else{
                console.log("data",data)
                props.setIsLoggedIn(true)

            }
            const {data:dataId,errorId}=await supabase.from("Users").select("*").eq("id",data["user"]["id"])
            if(errorId){
                console.log("error Id",errorId)
            }
            // console.log("dataId",dataId,"   ", dataId.length==0)
            if(dataId.length==0){  
            const {insertData,errors}=await supabase.from("Users").insert({id:data["user"]["id"]}).single()
            if(errors){
                console.log("login error",errors)
            }
            else{
                console.log("login data",insertData)
                window.location.reload()
                
            }
            }
        }
        else{
            const {data,error}=await supabase.auth.signUp({email,password})
            console.log("d",data)
            if(error){
                console.log("error while singup",error)
            }

        }
        props.setIsLoginButtonClicked(false)
    }

    return(
        <div className=" absolute w-[100dvw] h-[100dvh] flex justify-center items-center">
        <div className=" w-100 h-80 bg-blue-50 fixed opacity-80 flex justify-center items-center ">
            
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <button  className="relative left-68 bottom-11"  onClick={()=>props.setIsLoginButtonClicked(false)}><b>X</b></button>
                    <p className="justify-self-center"><b>{isSignIn?"Login":"SignUp"}</b></p>
                    <div className="text-black justify-self-center">
                        <input type="email"  className="border-2 w-60 m-3"  placeholder="email" {...register("email",{
                            required:{value:true,message:"please give email"}
                        })}></input>
                    </div>
                    <div className="justify-self-center"> 
                        <input type="password" placeholder="password" className="border-2 w-60 m-3" {...register("password",{
                            required:{value:true ,message:"please enter password"}
                        })}></input>
                    </div>
                  
                    <div className="flex justify-center">            
                        <button className="border-2 w-30 mt-10" ><b>{isSignIn?"Login":"SignUp"}</b></button>
                    </div>
                </div>
                
                <p onClick={()=>{setIsSignIn(!isSignIn)}
                } className="mt-3 mx-14 flex">click here for &nbsp;<p style={{color:"blue"}}>{isSignIn?"signUp":"login"}</p></p>
    
            </form>

        </div>
        </div>
    )
}

export default Login
