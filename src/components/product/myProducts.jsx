import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const MyProducts = () => {
    const userId = useSelector(state => state.user1.user)
    const [myProductData, setMyProductData] = useState([])
    const [remove, setRemove] = useState(null)
    useEffect(() => {
        async function getMyProducts(params) {
            if (userId) {
                const { data } = await supabase.from('myProductInfo').select("*").eq("ownerId", userId.id)
                console.log("data*ds*fd*d*f*df*d*f*d*f*ds*", data)
                setMyProductData(data)
            }

        }
        getMyProducts()
    }, [userId])
    async function handleRemove(id) {
        console.log("id", id)
        const { data, error } = await supabase.from("myProductInfo").delete().eq("id", id)
        console.log(data)
        setMyProductData(myProductData.filter(item => item.id != id))
        setRemove(null)

    }
    async function handleUpdate(params) {

    }
    return (
        <div className="pt-22">
            {
                <div>
                    <h2 className="font-bold text-3xl ml-4">My Products</h2>
                    <div className="overflow-y-auto   scrollbar-hide">
                        {
                            myProductData.map((item, index) => {
                                return <div className="flex justify-between m-2 bg-white">
                                    <div className="flex">
                                        <Link to={`/product/${item["id"]}`}>
                                            <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item["imageName"][0]}`} className="h-32 w-30 m-3 mb-1" />
                                        </Link>

                                        <div className="pt-2 ">
                                            <Link to={`/product/${item["id"]}`}>
                                                <p className="hover:text-blue-400 font-sans ]">{item["brandName"] + " " + item["productName"].slice(0, 20) + "..."}</p>
                                            </Link>
                                            <div className="flex">
                                                <p>Size: </p>
                                                {item["size"] ? item.size.map(x => {
                                                    return <div>
                                                        <p>{Object.keys(x) + ""}, &nbsp;</p>
                                                    </div>
                                                }) : ""}
                                            </div>
                                            <div className="flex">
                                                <p className="">{Math.round(item["price"] - item["price"] * item["discount"] / 100)}rs &nbsp; </p>
                                                <p className=" text-gray-500 line-through">{+item["price"]}rs</p>
                                                <p className=" text-green-700">&nbsp; {item["discount"]}% off</p>

                                            </div>
                                            <div className="flex  sm:hidden">
                                                <Link to="/addProduct" state={item} >
                                                    <button className="font-bold  border-1 w-22 active:border-2 m-2 h-7" onClick={() => handleUpdate(item.id)}>Update</button>
                                                </Link>
                                                <button className="font-bold my-2 border-1 w-22 active:border-2 h-7" onClick={() => setRemove(item.id)}>Remove</button>
                                                <div>
                                                    {
                                                        remove == item.id ? <div className="flex justify-center items-center h-[100dvh] w-[100dvw] absolute left-0 top-0 ">
                                                            <div className="border-1 w-100 h-22 py-1 bg-white ">
                                                                <p className="justify-self-center mb-6 font-medium">Do you want to remove product</p>
                                                                <div className="flex justify-end ">
                                                                    <button className="border-1 w-25 active:border-2 mx-2" onClick={() => setRemove(false)}>Cancel</button>
                                                                    <button className="border-1 w-25 active:border-2 mx-2  bg-red-500" onClick={() => handleRemove(item.id)}>Remove</button>

                                                                </div>
                                                            </div>
                                                        </div> : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:flex mr-3 hidden items-center">
                                        <Link to="/addProduct" state={item} >
                                            <button className="font-bold  border-1 w-30 active:border-2 m-2 h-10" onClick={() => handleUpdate(item.id)}>Update</button>
                                        </Link>
                                        <button className="font-bold  border-1 w-30 active:border-2 h-10" onClick={() => setRemove(item.id)}>Remove</button>
                                        <div>
                                            {
                                                remove == item.id ? <div className="flex justify-center items-center h-[100dvh] w-[100dvw] absolute left-0 top-0 ">
                                                    <div className="border-1 w-100 h-22 py-1 bg-white ">
                                                        <p className="justify-self-center mb-6 font-medium">Do you want to remove product</p>
                                                        <div className="flex justify-end ">
                                                            <button className="border-1 w-25 active:border-2 mx-2" onClick={() => setRemove(false)}>Cancel</button>
                                                            <button className="border-1 w-25 active:border-2 mx-2  bg-red-500" onClick={() => handleRemove(item.id)}>Remove</button>

                                                        </div>
                                                    </div>
                                                </div> : ''
                                            }
                                        </div>
                                    </div>


                                </div>
                            })
                        }
                    </div>
                </div>

            }
        </div>
    )
}
export default MyProducts