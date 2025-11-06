import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { supabase } from "../supabase"
import MyOrderDetails from "./myOrderDetails"
const MySales = () => {
    // const userId = useSelector(state => state.user1.user)
    const [myOrderItems, setMyOrderItems] = useState([])
    const [pending, setPending] = useState([])
    const [success, setSuccess] = useState([])
    const [orderPage,setOrderPage]=useState(null)
    useEffect(() => {
        async function getMyOrders(params) {
            const { data: { user } } = await supabase.auth.getUser()
            const { data: myOrderData, error } = await supabase.from("orderItems").select("*").eq("ownerId", user.id)
            // console.log("*****data****",data)
            console.log('myorderdata', myOrderData)
            const pendingData = myOrderData.filter(items => items["status"] == "pending" || items["status"] == "cancel")
            console.log("pendinglakj", pendingData)
            setMyOrderItems(pendingData)
            setPending(pendingData)
            const successfullData = myOrderData.filter(items => items["status"] == "success")
            setSuccess(successfullData)
        }
        getMyOrders()
    }, [])
    function handleSuccessfullData() {
        setMyOrderItems(success)
    }

    function handlePendingData() {
        setMyOrderItems(pending)

    }
    async function handleCancelOrder(itemId) {
        const data = await supabase.from("orderItems").update({ "status": "cancel" }).eq("id", itemId)
    }
    return (
        < div >
        { orderPage==null?<div className=" overflow-y-auto  h-[75dvh] scrollbar-hide md:w-[75dvw]">
            <div className="flex justify-around h-9">
                <button className="border-1 w-[49%] active:border-2" onClick={handlePendingData}>Pending</button>
                <button className="border-1 w-[49%]  active:border-2" onClick={handleSuccessfullData}>Successfull</button>
            </div>

            {
                myOrderItems.length != 0 ? myOrderItems.map((item, index) => {
                    let DeliveryDate = new Date()
                    let orderDate = new Date(item["create_at"])
                    DeliveryDate.setDate(orderDate.getDate() + 2)
                    return <div className="grid sm:grid-cols-[5fr_2fr_4fr]  m-2 bg-gray-200" onClick={()=>setOrderPage(item)} >
                        <div className="flex items-center">
                            <div>
                                    <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item["image"]}`} className="h-25 w-22  my-3 ml-2" />
                            </div>
                            <div className="mx-3 ">
                                <div className="sm:hidden"> {item["status"] == "pending" ? "Delivery by " + DeliveryDate.toDateString() : item["status"] == "cancel" ? <p className="text-red-500">Order Cancelled</p> : <p>Delivered On</p>}</div>
                                    <p className="hover:text-blue-400 font-sans ">{item["productName"].slice(0, 20) + "..."}</p>
                                    <div className="flex sm:flex-col">
                                        <p>Quantity:{item.quantity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <p>Size:{item.size[2]} </p>
                                    </div>
                                    <p className="sm:hidden">Price:{item.price}</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex m-2 items-center">
                            <p>Price:{item["price"]}rs</p>
                        </div>
                        <div className="hidden sm:flex items-center">
                            <div className="m-1"> {item["status"] == "pending" ? "Delivery by " + DeliveryDate.toDateString() : item["status"] == "cancel" ? <p className="text-red-500">Order Cancelled</p> : <p>Delivered</p>}</div>
                        </div>

                    </div>

                }) : <div className="grid place-items-center h-[75dvh] w-[75dvw] font-bold text-2xl
                    "><div>No items</div></div>
            }
        </div>:<MyOrderDetails details={orderPage} state="mySales"></MyOrderDetails>
        }
        </div >
        
    )
}
export default MySales