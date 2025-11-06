import { useEffect, useState } from "react"
import { useLocation, useNavigate    } from "react-router-dom"
import { supabase } from "../supabase"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid";
const BuyPage = (props) => {
    const { state } = useLocation()
    const [userOrder, setUserOrder] = useState(state)
    const [isEditable, setIsEditable] = useState(false)
    const [myAccountDetail, setMyAccountDetail] = useState()
    const [quantity, setQuantity] = useState([])
    const [orderId, setOrderId] = useState(uuidv4())
    const [message, setMessage] = useState("")
    const navigate=useNavigate()
    console.log("s,mdnasda", state)
    console.log("state", state)
    console.log("user detail", userOrder)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        if (!props.isLoggedIn) {
            props.setIsLoginButtonClicked(true)
            console.log("asdsda**********")
        }
        async function getUserId(params) {
            const { data: userDetail } = await supabase.from("Users").select("*").eq("id", state[0]["userId"])
            console.log("profile user email", userDetail)
            console.log("profile user", userDetail[0])
            setMyAccountDetail(userDetail[0])
            console.log("myAccount", Boolean(myAccountDetail))
            const productQuantity = await state.map(item => item.quantity)
            setQuantity(productQuantity)
            // setIsLoading(false)
            // console.log(user.email)
        }
        getUserId()
    }, [isEditable])
    async function saveData(data) {
        // console.log("data")

        const { data: updatedData, error } = await supabase.from("Users").update(data).eq("id", state[0]["userId"])
        if (error) {
            console.log("update error", error)
        }
        else {
            console.log("updated data", updatedData)
        }
        setIsEditable(!isEditable)


    }
    function handleQuantity(item, index, value) {
        const newQuantity = [...quantity]
        newQuantity[index] = newQuantity[index] + value
        setQuantity(newQuantity)
        userOrder[index]["quantity"] = newQuantity[index]
    }
    function handleRemove(index) {
        let newUserOrder = [...userOrder]
        newUserOrder.splice(index, 1)
        console.log("index", index)
        setUserOrder(newUserOrder)
        // console.log("new order",userOrder)
        console.log("new", newUserOrder)

        // setUserOrder()
        // console.log("sate deller",userOrder)
    }
    async function handleOrderTable(params) {

        if (!Boolean(myAccountDetail["userName"])) {
            setMessage("Please enter your username")
            setIsEditable(true)
            setTimeout(()=>{
                setMessage("")
            },500)
        }
        
        else if (!Boolean(myAccountDetail["address"])) {
            setMessage("Please enter your address")
            setIsEditable(true)
            setTimeout(()=>{
                setMessage("")
            },1000)
        }
        else if (!Boolean(myAccountDetail["phone"] )) {
            setMessage("Please enter your phone number")
            setIsEditable(true)
            setTimeout(()=>{
                setMessage("")
            },1000)

        }
        else if (!Boolean(myAccountDetail["pincode"])) {
            setMessage("Please enter your pincode")
            setIsEditable(true)
            setTimeout(()=>{
                setMessage("")
            },1000)
        }
        else if (!Boolean(myAccountDetail["landmark"])) {
            setMessage("Please enter your landmark")
            setIsEditable(true)
            setTimeout(()=>{
                setMessage("")
            },1000)
        }
        else if (!Boolean(myAccountDetail["district"])) {
            setMessage("Please enter your district name")
            setIsEditable(true)
            setTimeout(()=>{
                setMessage("")
            },1000)
        }
        else {
            console.log("myAccountDetail",Boolean(myAccountDetail["landmark"])) 
            // setMessage("✅ Purchase Successful!")
            const { data: userDetail, userDetailError } = await supabase.from("Users").select("*").eq("id", userOrder[0]["userId"])
            console.log("address", userDetail)
            const { data: orderData, orderError } = await supabase.from("orders").insert({ "id": orderId, "userId": userOrder[0]["userId"], total: userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0) - userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"] / 100, 0) + 10, "address": userDetail[0]["address"], "district": userDetail[0]["district"], "pincode": userDetail[0]["pincode"], "landmark": userDetail[0]["landmark"], "phone": userDetail[0]["phone"] })

            const AllItems = userOrder.map((item) => ({
                "orderId": orderId,
                "productId": item["product"]["id"],
                "size": item["size"],
                "status": "pending",
                "quantity": item["quantity"],
                "image": item["image"],
                "price": item["product"]["price"] - item["product"]["price"] * item["product"]["discount"] / 100,
                "productName": item["product"]["productName"],
                "userId": userOrder[0]["userId"],
                "ownerId": item["product"]["ownerId"]
            }))
        const { data: orderItemData, orderItemError } = await supabase.from("orderItems").insert(AllItems)
        navigate("/myaccount",{state:"order"})


        }

    }
    return (
        <div className="grid grid-cols-1  md:grid-cols-[2fr_1fr] pt-22 justify-self-center w-full px-2">

            {message == "✅ Purchase Successful!" ? <div className="w-[100dvw] h-[100dvh] fixed flex justify-center items-center">
                <div className="bg-stone-800 text-green-600  px-5 h-20 grid place-items-center font-medium">{message}</div>
            </div> : ""}
            
            {message != "✅ Purchase Successful!" && message!="" ? <div className="w-[100dvw] h-[100dvh] fixed flex justify-center items-center">
                <div className="bg-stone-800 text-red-600  px-5 h-20 grid place-items-center font-medium">{message}</div>
            </div> : ""}
            <div className="sm:mx-4 ">
                {Boolean(myAccountDetail) &&
                    <div >
                        {!isEditable ?
                            <div className=" bg-white grid grid-cols-[2fr_0.4fr] mb-2 p-2   ">
                                <div>
                                    <p className="text-xl text-gray-500 font-semibold">Delivery Details</p>
                                    <p className="">{`${myAccountDetail["userName"] == null ? "" : myAccountDetail["userName"]} ${myAccountDetail["phone"] == null ? "" : myAccountDetail["phone"]} ${myAccountDetail["address"] == null ? "" : myAccountDetail["address"]} ${myAccountDetail["district"] == null ? "" : myAccountDetail["district"]}  ${myAccountDetail["pincode"] == null ? "" : myAccountDetail["pincode"]}`}</p>
                                </div>
                                <div className="p-3">
                                    <button className="text-blue-500 border-1 border-black w-30" onClick={() => setIsEditable(!isEditable)}>{!isEditable ? "Change" : "Save"}</button>
                                </div>
                            </div> :
                            <form onSubmit={handleSubmit(saveData)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 bg-white p-3">
                                    <div>

                                        <p>Name</p>
                                        <input type="text" className={`bg-gray-200 border-2 border-gray-300 w-60 h-11 }`} placeholder="Enter name" defaultValue={myAccountDetail["userName"] == null ? "" : myAccountDetail["userName"]} {...register("userName", { required: true })} ></input>

                                    </div>
                                    <div >
                                        <h2 className="">Moblie Number </h2>
                                        <input type="text" className="bg-gray-200 border-2 border-gray-300 w-60 h-11 " placeholder="Enter phonenumber" defaultValue={myAccountDetail["phone"] == null ? "" : myAccountDetail["phone"]} {...register("phone", { required: true, pattern: /[0-9]{10}$/ })} ></input>
                                    </div>
                                    <div >
                                        <h2 className="">Pincode</h2>
                                        <input type="text" className="bg-gray-200 border-2 border-gray-300 w-60 h-11 " placeholder="Enter pincode" defaultValue={myAccountDetail["pincode"] == null ? "" : myAccountDetail["pincode"]} {...register("pincode", { required: true, pattern: /[0-9]{6}$/ })} ></input>
                                    </div>
                                    <div >
                                        <h2>Address</h2>
                                        <input type="text" placeholder="Your Address" className="bg-gray-200 border-2 border-gray-300 w-60 h-11" defaultValue={myAccountDetail["address"] == null ? "" : myAccountDetail["address"]} {...register("address", { required: true, minLength: { value: 10, message: "Please give full Address" } })} />
                                    </div>
                                    <div >
                                        <h2>Landmark</h2>
                                        <input type="text" placeholder="Landmark" className="bg-gray-200 border-2 border-gray-300 w-60 h-11" defaultValue={myAccountDetail["landmark"] == null ? "" : myAccountDetail["landmark"]} {...register("landmark",{required:true})} />
                                    </div>

                                    <div >
                                        <h2>District</h2>
                                        <input type="text" placeholder="District" className="bg-gray-200 border-2 border-gray-300 w-60 h-11" defaultValue={myAccountDetail["district"] == null ? "" : myAccountDetail["district"]} {...register("district", { required: true })} />
                                    </div>
                                </div>
                                <button type="submit" className="bg-green-600 text-white  h-13 w-60" >Save and deliver here"</button>
                            </form>
                        }
                    </div>
                }
                <div className="bg-white overflow-y-auto h-[62dvh] scrollbar-hide mt-5">
                    <div className="bg-blue-500 text-white font-semibold text-xl h-12 p-3 mb-2">Order Summary</div>
                    {
                        userOrder.map((item, index) => {
                            return <div className="flex">
                                <div>
                                    <Link to={`/product/${item["product"]["id"]}`}>
                                        <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item["image"]}`} className="h-28 w-22 m-3 mb-1" />
                                    </Link>
                                    <div>
                                        <button className="bg-gray-400 h-8 w-8 m-3 ml-2 rounded-full active:border-1" disabled={quantity[index] <= 1} onClick={() => handleQuantity(item, index, (-1))}>-</button>
                                        {quantity[index]}
                                        <button className="bg-gray-400 h-8 w-8 m-3 rounded-full active:border-red-100" onClick={() => handleQuantity(item, index, 1)}>+</button>
                                    </div   >
                                </div>
                                <div className="pt-2 sm:mx-5">
                                    <Link to={`/product/${item["product"]["id"]}`}>
                                        <p className="hover:text-blue-400 font-sans ]">{item["product"]["brandName"] + item["product"]["productName"].slice(0, 20) + "..."}</p>
                                    </Link>
                                    <p>size:{item["size"][2]}</p>
                                    <div className="flex">
                                        <p className="">Price:{Math.round(item["product"]["price"] - item["product"]["price"] * item["product"]["discount"] / 100)}rs &nbsp; </p>
                                        <p className=" text-gray-500 line-through">{+item["product"]["price"]}rs</p>
                                        <p className=" text-green-700">&nbsp; {item["product"]["discount"]}% off</p>
                                    </div>
                                    <button className="font-bold mt-10 border-1 w-30 active:border-2 " onClick={() => handleRemove(index)}>Remove</button>
                                </div>
                            </div>
                        })
                    }
                </div>

                <div className="flex justify-between bg-stone-700 h-15   w-full place-items-center  top-[90dvh]">
                    <p className="text-white ml-2">₹{Math.round(userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0)) - Math.round(userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"] / 100, 0) + 10)}</p>
                    {/* <Link to={message=="✅ Purchase Successful!"?"/myaccount":""} state={"orders"}> */}
                        <button className="bg-green-600 text-2xl w-50 h-12 mx-2 active:bg-green-700 z-50" onClick={handleOrderTable}>Pay</button>
                    {/* </Link> */}
                </div>
            </div>


            {state.length == 0 ? (<div>Loading details...</div>) :
                <div className="  sm:w-full my-2  bg-white   lg:w-[30dvw] sm:m-0  h-65 sm:h-100">
                    <h2 className="font-semibold text-xl text-gray-400 m-2">Price Details</h2>
                    <div className="flex justify-between m-2">
                        <p>Price:</p><span>₹{Math.round(userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0))}</span>
                    </div>
                    <div className="flex justify-between m-2">
                        <p>Discount:</p><span className="text-green-600">-₹{Math.round(userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"] / 100, 0))}</span>
                    </div>
                    <div className="flex justify-between m-2">
                        <p>platform charge:</p><span>₹10</span>
                    </div>
                    <hr />
                    <div className=" flex justify-between m-2 font-bold">
                        <p>Total Amount:</p><span className="text-green">₹{Math.round(userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0)) - Math.round(userOrder.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"] / 100, 0)) + 10}</span>
                    </div>
                </div>
            }
        </div>
    )
}

export default BuyPage