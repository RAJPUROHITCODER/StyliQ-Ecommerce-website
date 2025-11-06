import { useForm } from "react-hook-form"
import { supabase } from "../supabase"

import { useEffect, useState } from "react"
const Profile = () => {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm()
    const [myEmail, setEmail] = useState([])
    const [myAccountDetail, setMyAccountDetail] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [gender, setGender] = useState("")
    const [isEditable, setIsEditable] = useState(false)
    useEffect(() => {
        async function getUserId(params) {
            const { data: { user } } = await supabase.auth.getUser()
            const { data: userDetail } = await supabase.from("Users").select("*").eq("id", user["id"])
            // const {data:userData,error}=await supabase.from("Users").select("*").eq("id",)
            // if(error){
            //     console("error while select",error)
            // }
            // else{
            //     console.log("userData",userData)

            // }
            console.log("profile user email", user.id)
            console.log("profile user", userDetail[0])
            setMyAccountDetail(userDetail[0])
            setGender(userDetail[0]["gender"])
            setEmail(user)
            // console.log("myAccount",myAccountDetail["firstName"])
            setIsLoading(false)
            console.log("user id", myEmail["id"])
            // console.log(user.email)

        }
        getUserId()
    }, [])
    async function saveData(data) {
        console.log("data", data)
        const updateData = {}
        for (let i in data) {
            console.log("data ", data[i])
            if (data[i] != "") {
                updateData[i] = data[i]
            }
        }
        console.log("updated data")
        const { data: updatedData, error } = await supabase.from("Users").update(updateData).eq("id", myEmail["id"])
        if (error) {
            console.log("update error", error)
        }
        else {
            console.log("updated data", updatedData)
        }
    }
    console.log("isEdit", isEditable)
    return (
        <div className="p-4 overflow-y-auto h-[75dvh] scrollbar-hide bg-white md:w-[75dvw]">
            <div >
                <form onSubmit={handleSubmit(saveData)}>
                    <div className="flex justify-between relative">
                        <h2 className="font-semibold ">Personal Information </h2>
                        <button className=" border-1 bg-orange-500 w-20 h-8" style={!isEditable ? { backgroundColor: "orange" } : { backgroundColor: "green" }} onClick={() => setIsEditable(!isEditable)} type={isEditable ? "button" : "submit"}>{!isEditable ? "Edit" : "Save"}</button>
                    </div>
                    <div className={`py-4 ${!isEditable ? "[&>*]:cursor-not-allowed" : ""}`}>
                        <input type="text" className={`bg-gray-200 border-2 border-gray-300 w-60 md:w-65 h-11 mr-3 `} placeholder="Enter first name" defaultValue={!Boolean(myAccountDetail["firstName"]) == null ? "" : myAccountDetail["firstName"]} {...register("firstName")} readOnly={!isEditable}></input>
                        <input type="text" className={`bg-gray-200 border-2 border-gray-300 w-60 md:w-65 h-11 my-2`} placeholder="Enter last name" defaultValue={myAccountDetail["name"] == null ? "" : myAccountDetail["name"]} {...register("name")} readOnly={!isEditable}></input>
                    </div>
                    <div className={` [&>*]:mr-3 ${!isEditable ? "[&>*]:cursor-not-allowed" : ""}`}>
                        <p className="font-semibold mb-2">Gender</p>
                        <input type="radio" id="male" name="gender" value={"male"}  {...register("gender")} readOnly={!isEditable} checked={gender == "male"} onChange={() => setGender("male")}></input>
                        <label htmlFor="male">Male</label>

                        <input type="radio" id="female" name="gender" value={"female"} {...register("gender")} readOnly={!isEditable} checked={gender == "female"} onChange={() => setGender("female")}></input>
                        <label htmlFor="female">Female</label>
                    </div>
                    <div className={`py-4 [&>*]:mr-3 ${!isEditable ? "[&>*]:cursor-not-allowed" : ""}`}>
                        <h2 className="pb-3  font-semibold">Email Address </h2>
                        <input type="text" className="bg-gray-200 border-2 border-gray-300 w-60 md:w-65  h-11 mr-3" defaultValue={myEmail["email"]} readOnly ></input>

                    </div>
                    <div className={`pb-4 [&>*]:mr-3 ${!isEditable ? "[&>*]:cursor-not-allowed" : ""}`}>
                        <h2 className="py-3 font-semibold">Moblie Number </h2>
                        <input type="number" className="bg-gray-200 border-2 border-gray-300 w-60 md:w-65  h-11 mr-3" placeholder="Enter phonenumber" defaultValue={myAccountDetail["phone"] == null ? "" : myAccountDetail["phone"]} {...register("phone", { pattern: /[0-9]{10}$/ })} readOnly={!isEditable}></input>
                    </div>
                    <div className={`[&>*]:mr-3 ${!isEditable ? "[&>*]:cursor-not-allowed" : ""}`}>
                        <h2 className="font-semibold py-3">Address</h2>
                        <input type="text" placeholder="Your Address" className="bg-gray-200 border-2 border-gray-300 w-60 md:w-65  h-11 mr-3  " defaultValue={myAccountDetail["address"] == null ? "" : myAccountDetail["address"]} {...register("address")} readOnly={!isEditable} />
                    </div>
                </form>
            </div>

        </div>
    )
}
export default Profile