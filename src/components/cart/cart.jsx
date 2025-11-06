import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const Cart = () => {
    const [myCart, setMyCart] = useState([])
    const [quantity, setQuantity] = useState([])
    const [refresh, setRefresh] = useState(true)
    const state=useSelector(state=>state.user1.user)
    useEffect(() => {
        async function getCartData() {
            const start = performance.now()
            // const { data: { user }, idError } = await supabase.auth.getUser()
            
            // console.log("user id",user.id)
            const { data, error } = await supabase.from("cart").select("*").eq("userId",    state.id  ).order("created_at", { ascending: false })
            setTimeout(() => {
                const end = performance.now()
                // console.log(`********* render update time: ${end-start}`)
            }, 0)
            if (error) {
                // console.log("cart",error)
            }
            else {
                // console.log("cart data",data)
            }
            const productIds = data.map((item) => item.productId)
            const productQuantity = data.map((item) => Number(item.quantity))
            console.log(productIds)
            const { data: productData, productError } = await supabase.from("myProductInfo").select("*").in("id", productIds)
            console.log(productData)
            const myCartProducts = data.map((item) => ({
                ...item,product: productData.find(p => p.id === item.productId)
            }))
            console.log("mycart", myCartProducts)
            setMyCart(myCartProducts)
            console.log("myc2", myCart)
            setQuantity(productQuantity)
            console.log("qt", quantity)

        }
        getCartData()

    }, [refresh,state])
    async function handleQuantity(item, index, value) {
        console.log("**************", value)
        const newQuantity = [...quantity]
        newQuantity[index] = newQuantity[index] + value
        console.log(quantity)
        setQuantity(newQuantity)
        const { data, error } = await supabase.from('cart').update({ "quantity": newQuantity[index] }).eq("id", item["id"])
        console.log("updated", data)
        setRefresh(!refresh)
    }
    async function handleRemove(item) {
        const { data, error } = await supabase.from("cart").delete().eq("id", item.id)
        setRefresh(!refresh)
        console.log("refreesh", refresh)
    }
    return (
        <div className="pt-22  overflow-y-auto scrollbar-hide p-2 sm:flex ">
            <div className="sm:mx-5 sm:w-[65dvw]">
                <div className="bg-white overflow-y-auto  h-[78dvh] scrollbar-hide">
                    {
                        myCart.map((item, index) => {
                            return <div className="flex">
                                <div>
                                    <Link to={`/product/${item["product"]["id"]}`}>
                                        <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item["image"]}`} className="h-28 w-22 m-3 mb-1" />
                                    </Link>
                                    <div>
                                        <button className="bg-gray-400 h-8 w-8 m-3 ml-2 rounded-full" disabled={quantity[index] <= 1} onClick={() => handleQuantity(item, index, (-1))}>-</button>
                                        {quantity[index]}
                                        <button className="bg-gray-400 h-8 w-8 m-3 rounded-full" onClick={() => handleQuantity(item, index, 1)}>+</button>
                                    </div>
                                </div>
                                <div className="pt-2 sm:mx-5">
                                    <Link to={`/product/${item["product"]["id"]}`}>
                                        <p className="hover:text-blue-400 font-sans ]">{item["product"]["brandName"]+item["product"]["productName"].slice(0,20)+"..."}</p>
                                    </Link>
                                    <p>size:{item["size"][2]}</p>
                                    <div className="flex">
                                        <p className="">₹{Math.round(item["product"]["price"] - item["product"]["price"] * item["product"]["discount"] / 100)} &nbsp; </p>
                                        <p className=" text-gray-500 line-through">₹{+item["product"]["price"]}</p>
                                        <p className=" text-green-700">&nbsp; {item["product"]["discount"]}% off</p>
                                    </div>
                                    <button className="font-bold mt-10 border-1 w-30 active:border-2 " onClick={() => handleRemove(item)}>Remove</button>
                                </div>
                            </div>
                        })
                    }   
                </div>
                <div>
                    <div className="flex justify-between items-center bg-stone-800">
                        <div className="text-white text-xl mx-2">₹{Math.round(myCart.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0))-Math.round(myCart.reduce((sum,item)=>sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"]/100,0)+10)}</div>
                        <Link to={"/checkout"} state={myCart}>
                            <button className="bg-green-500 w-50 h-12 m-1" >Place Order</button>
                        </Link>
                    </div>
                </div>
            </div>
            {myCart.length == 0 ? (<div>Loading cart...</div>) :
                <div className=" sm:w-[30dvw] bg-white ">
                    <h2 className="font-bold text-xl text-gray-400 m-2">Price Details</h2>
                    <div className="flex justify-between m-2">
                        <p>Price:</p><span>₹{Math.round(myCart.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0))}</span>
                    </div>
                    <div className="flex justify-between m-2">
                        <p>Discount:</p><span className="text-green">-₹{Math.round(myCart.reduce((sum,item)=>sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"]/100,0))}</span>
                    </div>
                    <div className="flex justify-between m-2">
                        <p>platform charge:</p><span>₹10</span>
                    </div>
                    <hr/>
                    <div className="flex justify-between m-2 font-bold">
                        <p>Total Amount:</p><span className="text-green">₹{Math.round(myCart.reduce((sum, item) => sum + item["product"]["price"] * item["quantity"], 0))-Math.round(myCart.reduce((sum,item)=>sum + item["product"]["price"] * item["quantity"] * item["product"]["discount"]/100,0)+10)}</span>
                    </div>


                </div>
            }
        </div>

    )
}
export default Cart