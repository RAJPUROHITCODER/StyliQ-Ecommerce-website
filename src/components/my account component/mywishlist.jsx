import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const WishList = () => {
    const userId = useSelector(state => state.user1.user)
    const [wishlistProduct, setWishlistProduct] = useState([])
    console.log("userId", userId)
    useEffect(() => {
        async function getwishlist(params) {
            const { data: wishlistData } = await supabase.from("wishlist").select("*").eq("userId", userId.id)
            const productId = wishlistData.map((item) => item.productId)
            const { data: productDetail, productDetailError } = await supabase.from("myProductInfo").select("*").in('id', productId)
            setWishlistProduct(productDetail)
            console.log("set ", wishlistData)
            console.log("product deti", productDetail)
        }
        getwishlist()
    }, [])
    async function handleRemove(item) {
        console.log("item", typeof item["likes"])
        const { data: wishlistdata, error } = await supabase.from("wishlist").delete().eq("userId", userId.id).eq("productId", item["id"])
        const { data: productData, productDataError } = await supabase.from("myProductInfo").update({ "likes": item["likes"] - 1 }).eq("id", item["id"])
        console.log("remove")
    }
    return (
        <div className="md:w-[75dvw]">
            <p className="m-2 text-2xl">My Wishlist</p>
            <hr />
            <div className="overflow-y-auto h-[69dvh] scrollbar-hide">
                {
                    wishlistProduct.map((item) => {
                        return <div className="grid m-2 bg-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div>
                                        <Link to={`/product/${item["id"]}`}>
                                            <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item["imageName"][0]}`} className="h-30 w-25 m-2 rounded-xl " />
                                        </Link>
                                    </div>
                                    <div className="pt-2 mx-2">
                                        <Link to={`/product/${item["id"]}`}>
                                            <p className="hover:text-blue-400 font-sans">{item["brandName"] + " " + item["productName"].slice(0, 20) + "..."}</p>
                                        </Link>
                                        <div className="flex">
                                            <p className=" ">Price:{Math.round(item["price"] - item["price"] * item["discount"] / 100)}rs&nbsp; </p>
                                            <p className=" text-gray-500 line-through hidden sm:flex">{item["price"]}rs</p>
                                            <p className=" text-green-700 hidden sm:flex">&nbsp; {item["discount"]}% off</p>
                                        </div>
                                        <button className="border-1 w-35 mr-2 active:border-2 sm:hidden" onClick={() => handleRemove(item)}>Remove</button>

                                    </div>
                                </div>
                                <button className="border-1 w-35 mr-2 active:border-2 hidden sm:flex justify-center " onClick={() => handleRemove(item)}>Remove</button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default WishList