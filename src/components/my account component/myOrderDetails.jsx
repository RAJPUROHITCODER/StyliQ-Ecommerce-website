import { useEffect, useState } from "react"
import { supabase } from "../supabase"

const MyOrderDetails = (props) => {
    console.log("props.state",props.state)
    console.log("***details**", props.details)
    let DeliveryDate = new Date()
    let orderDate = new Date(props.details["create_at"])
    DeliveryDate.setDate(orderDate.getDate() + 2)
    const [address, setAddress] = useState()
    useEffect(() => {
        async function getAddress() {
            const
                { data, error } = await supabase.from("orders").select("address,pincode,district,landmark,phone").eq("id", props.details["orderId"])
            setAddress(data)
            console.log("address", Boolean(address))
            console.log("address", address)
        }
        getAddress()
    }, [])
    async function handleCancelOrder(itemId) {
        const data = await supabase.from("orderItems").update({ "status": "cancel" }).eq("id", itemId)
    }
    async function handleDelivered(itemId) {
        console.log("itemId",typeof itemId,itemId)
        const {data,error} = await supabase.from("orderItems").update({ "status": "success" }).eq("id", itemId).select().single();
        console.log('delivered',data,error)
    }
    return (
        <div className=" m-2  bg-gray-200 md:w-[75dvw]"  >
            <div className="flex props.detailss-center py-2">
                <div className="flex-1.5">
                    <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${props.details["image"]}`} className="sm:h-50 sm:w-45  w-40 h-45 my-3 ml-2" />
                </div>
                <div className="m-2 sm:m-5 flex-2">
                    <p className="hover:text-blue-400 font-sans  text-xl">{props.details["productName"]}</p>
                        <p className="text-xl">Size:{props.details.size[2]} </p>
                        <p className="text-xl">Quantity:{props.details.quantity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <p className="text-xl">Price:{props.details.price}</p>
                    <hr />
                    <p className="text-xl font-semibold">Total:{props.details["quantity"] * props.details["price"]}</p>

                </div>
            </div>
            <div >
                <div className="mx-1 flex"><p className="bg-green-700 mr-5 rounded-full text-white text-[13px] w-5 h-5 grid place-items-center">✓</p>Order confirmed:{orderDate.toDateString()}</div>
                <div className="h-8 w-[2px]"><p className="h-8 w-[2px] bg-green-700  relative bottom-0.5 left-3 animate-delivery"></p></div>
                <div className="mx-1 flex "> <p className=" mr-5 rounded-full text-white text-[13px] w-5 h-5 grid place-items-center" id="tick" style={props.details["status"] == "success" ? { backgroundColor: "green", opacity: 0 } : props.details["status"] == "cancel" ? { backgroundColor: "red", opacity: 0 } : { backgroundColor: "gray", opacity: 0 }}>✓</p>{props.details["status"] == "pending" ? "Delivery by " + DeliveryDate.toDateString() : props.details["status"] == "cancel" ? <p className="text-red-500">Order Cancelled</p> : <p>Delivered</p>}</div>
            </div>
            <div>
                <p className="text-xl font-semibold px-2 mt-2">Address</p>
                {Boolean(address) ?
                    <div className="px-5">
                        <p>{address[0]["address"] + " " + address[0]["landmark"] + " " + address[0]["district"] + " " + address[0]["pincode"]}</p>
                        <p>Phone Number:{address[0]["phone"]}</p>
                    </div>
                    : ""

                }
            </div>

            <div className="flex justify-end bg-stone-700 h-15  mt-10 w-full place-items-center  top-[95dvh]">
                {
                    props.state == "mySales" && props.details["status"]=="pending" ? <button className="bg-green-500 w-25 h-8 mr-2 rounded-[3px]  border-1 active:border-2  " onClick={() => handleDelivered(props.details["id"])}>Delivered</button> :props.details["status"]=="pending"?
                        <button className="bg-red-500 w-25 h-8 mr-2 rounded-[3px]  border-1  active:border-2  " onClick={() => handleCancelOrder(props.details["id"])}>Cancel</button>:""
                }


            </div>
        </div>
    )
}
export default MyOrderDetails


// <div className="bg-amber-100">
//     <div className="flex m-5 ">
//         <img className="h-40 w-30" src={"https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/" + props.details["image"]} />
//         <div className="m-5">
//             <p>{props.details["productName"]}</p>
//             <p>{props.details["quantity"]}</p>
//             <p>{props.details["size"][2]}</p>
//             <p>{props.details["price"]}</p>
//         </div>
//         <div className="hidden sm:flex props.detailss-center">
//             <div className="m-1"> {props.details["status"] == "pending" ? "Delivery by " + DeliveryDate.toDateString() : props.details["status"] == "cancel" ? <p className="text-red-500">Order Cancelled</p> : <p>Delivered On</p>}</div>
//         </div>
//     </div>
// </div>