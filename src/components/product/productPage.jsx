import { useEffect, useState } from "react"
import { data, Link, useParams } from "react-router-dom"
import { supabase } from "../supabase"
import Product from "./product"
import { useSelector } from "react-redux"
const ProductPage = () => {
    const { id } = useParams()
    const [data, setData] = useState([])
    const [suggestion, setSuggestion] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [quantityCount, setQuantityCount] = useState(1)
    const [size, setSize] = useState("")
    const [productMainImage, setProductMainImage] = useState(null)
    const [message, setMessage] = useState("")
    const [liked, setLiked] = useState(false)
    const userId = useSelector(state => state.user1.user)
    // console.log("id**********", id)
    useEffect(() => {
        async function showProductInfo(params) {
            const { data, error } = await supabase.from("myProductInfo").select("*").eq("id", id)
            if (error) {
                // console.log("page info error", error)
            }
            else {
                // console.log("page info", data, "asds", data[0]["category"])
            }
            setData(data)
            setIsLoading(true)
            // console.log("data", data)
            if(data.length!=0){
            console.log(data[0]["size"])
            setProductMainImage(data[0]["imageName"][0])
            console.log("is laoding false hua kya data deho****",data)
            setIsLoading(false)
            

            const { data: { user } } = await supabase.auth.getUser()
            // setUserId(user)
            // console.log("kjshdsdlsjdljslkdscnklsnciejwe;we", user)
            const { data: similarData, similarDataError } = await supabase.from("myProductInfo").select("*").eq("category", data[0]["category"])
            if (similarDataError) {
                // console.log("similar data error", similarDataError)
            }
            else {
                // console.log("similar data", similarData)
            }
            let  wishlistCategory;

            try{
            const { data: liked, error: likedError } = await supabase.from("wishlist").select("*").eq("userId", user.id).eq("productId", data[0]["id"])
            if (liked.length > 0) {
                setLiked(true)
            }
            const { data: wishlistData, error: wishlistError } = await supabase.from("wishlist").select("productId").eq("userId", user.id)
            const productIdWishlist = wishlistData.map((item) => item.productId)
            const { data: wishlistProduct, wishlistProductError } = await supabase.from("myProductInfo").select("*").in("id",productIdWishlist)
            wishlistCategory = wishlistProduct.map((item) => item.category)
            wishlistCategory = wishlistCategory.filter(item => item != data[0]['category'])
            }
            catch{

            }
            // console.log("wishlist category", wishlistCategory)
            const { data: youMayLike, youMayLikeError } = await supabase.from("myProductInfo").select("*").in("category", wishlistCategory)
            // console.log("you may like", youMayLike)
            // console.log("similar", similarData)

            setSuggestion(youMayLike.length != 0 ? [similarData, youMayLike] : [similarData])
            console.log("************suggestion****************",suggestion)
        }}
        showProductInfo()
    }, [id, userId])

    // console.log("dasdsadjljclcj", data)

    async function handleCart() {
        console.log("in add to cart")
        // const { data: { user } } = await supabase.auth.getUser()
        // if(user)
        if (userId == null) {
            setMessage("Please Login")
        }
        else {
            if (!Boolean(size)) {
                setMessage("Select size")
            }
            else {
                setMessage("Product Added")
                const { data: cartData, error } = await supabase.from("cart").insert({ "userId": userId.id, "productId": data[0]["id"], quantity: quantityCount, "size": size, "image": productMainImage }).single()
                if (error) {
                    console.log("cart error",error)
                }
                else {
                    console.log("cart data",cartData)
                }
            }

        }
        setTimeout(() => {
            // console.log("shdsahdlajslj*****************")
            setMessage("")
        }, 1000);

    }
    async function handleBuy(params) {
        if (!Boolean(size)) {
            setMessage("Select size")
        }
        else if(userId == null) {
            setMessage("Please Login")
        }
        setTimeout(() => {
            setMessage("buy")
        }, 800)
    }

    async function handleWishlist() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!liked) {
            setLiked(!liked)
            const { data: wishlistdata, error } = await supabase.from("wishlist").insert({ "userId": userId.id, "productId": data[0]["id"], "liked": true })
            const { data: productData, productDataError } = await supabase.from("myProductInfo").update({ "likes": data[0]["likes"] + 1 }).eq("id", data[0]["id"])
        }
        else {
            setLiked(!liked)
            const { data: wishlistdata, error } = await supabase.from("wishlist").delete().eq("userId", userId.id).eq("productId", data[0]["id"])
            const { data: productData, productDataError } = await supabase.from("myProductInfo").update({ "likes": data[0]["likes"] - 1 }).eq("id", data[0]["id"])
        }

    }
    return (
        <div className="pt-22    overflow-x-auto scrollbar-hide h-[100dvh] bg-slate-200 ">
            <div className="grid place-items-center fixed w-[100dvw] mt-[65dvh] z-10">
                {message == "Please Login" &&
                    <div className="bg-stone-800 text-red-600 w-100 h-20 grid place-items-center font-medium">{message}</div>
                }
                {message == "Product Added" &&
                    <div className="bg-stone-800 text-green-600 w-100 h-20 grid place-items-center font-medium">{message}</div>
                }
                {message == "Select size" &&
                    <div className="bg-stone-800 text-blue-600 w-100 h-20 grid place-items-center font-medium">{message}</div>
                }
                
            </div>

            {
                !isLoading &&
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-[0.8fr_3fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[0.3fr_1fr_2fr]">
                        <div className="order-2 flex overflow-auto scrollbar-hide items-center sm:flex-col sm:order-none md:order-3 md:flex-row  lg:flex-col lg:order-none ">
                            {
                                data[0]["imageName"].slice(0, 4).map((item, index) => {
                                    return <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item}`} className="w-25 min-w-22 h-25 mt-2 ml-4  md:ml-1 rounded-xl active:border-2 " onClick={() => setProductMainImage(item)}></img>

                                })
                            }
                        </div>
                        <div className="order-1 justify-self-center sm:justify-self-start md:order-1   relative md:ml-2 lg:order-none ">
                            <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${productMainImage}`} className="w-[93dvw] sm:w-100 md:w-full h-[65dvh] sm:h-115 rounded-2xl "></img>
                            <button className="border-1 rounded-full bg-gray-200 w-10 h-10 z-0 place-items-center justify-center absolute  right-5 top-3 mt-5  text-xl ml-6  flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "yellow" : "none"} stroke="yellow" className="w-8 h-8 stroke-black stroke-2 size-6" onClick={handleWishlist}>
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="sm:flex hidden justify-around">
                                <button className="bg-transparent border-2 rounded-[5px] m-2 ml-3 h-10 mr-3 min-w-35 w-40  text-xl  hover:bg-gradient-to-b from-transparent to-neutral-400 hover:shadow-2xs" onClick={handleCart}>ADD TO CART</button>
                                <Link to={size && userId  ? `/checkout?product=${id}` : ""} state={[{ "product": data[0], "size": size, "image": productMainImage, "userId": Boolean(userId) ? userId["id"] : 0, "quantity": quantityCount }]}>
                                    <button className="bg-green-600 border-2 rounded-[5px] m-2 h-10 min-w-30 w-40 text-xl  hover:bg-gradient-to-b from-green-600 to-green-700 hover:shadow-2xs" onClick={handleBuy}>Buy</button>
                                </Link>
                            </div>
                        </div>
                        <div className="ml-3 order-3 sm:col-span-2 md:col-span-1 md:order-2 md:w-[60dvw]  shrink lg:w-[55dvw] lg:order-none ">

                            <h1 className="text-gray-600 text-4xl">{data[0]["brandName"]}</h1>
                            <h1 className="font-serif text-2xl">{data[0]["productName"].slice(0, 50)}</h1>
                            <div className="hidden sm:flex">
                                <p className=" font-serif text-xl">Price-{Math.round(data[0]["price"] - data[0]["price"] * data[0]["discount"] / 100)}rs &nbsp; </p>
                                <p className=" text-gray-500 line-through mt-1">{data[0]["price"]}rs</p>
                                <p className=" text-xl text-green-700">&nbsp; {data[0]["discount"]}% off</p>
                            </div>
                            {
                                data[0]["similarImage"] != null ? <div>
                                    <p className="font-serif text-xl">More colors</p>
                                    <div className="flex overflow-x-auto gap-1  m-2 mb-6  scrollbar-hide">
                                        {
                                            data[0]["similarImage"].slice(0, 8).map((item) => {
                                                return <Link to={"/product/" + data[0]["id"].slice(0, data[0]["id"].indexOf("_")) + "_" + item.replaceAll("/", '')}>
                                                    <div className="border-2  border-gray-500 flex justify-center items-center p-1  rounded-2xl">
                                                        <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item}`} onClick={() => setProductMainImage(item)} className=" min-w-20 h-23  rounded-xl" />
                                                    </div>
                                                </Link>

                                            })
                                        }
                                    </div>
                                </div> : ""
                            }

                            <p className="font-serif text-xl mb-2">Select size</p>

                            <div className=" flex gap-2">
                                {
                                    data.length != 0 ? data[0]["size"].map((item) => {
                                        return <label>
                                            <input type="radio" value={Object.keys(item)} className="peer hidden" name="size" />
                                            <div className="w-15 h-15 sm:w-12 sm:h-12 flex text-xl items-center justify-center rounded-full border-1  cursor-pointer   peer-checked:border-blue-600 peer-checked:bg-blue-200 hover:bg-gray-200" onClick={() => setSize(Object.keys(item))}> {Object.keys(item)} </div>
                                        </label>
                                    }) : ""
                                }
                            </div>
                            <p className="font-serif text-xl"> Available at:{data[0]["Location"]}</p>
                            <p className="font-serif text-[16px]">Description: {data[0]["Description"]}</p>
                            <p>Quantity : <button className="bg-gray-400 h-8 w-8 m-2 rounded-full" onClick={() => setQuantityCount(quantityCount - 1)} disabled={quantityCount == 1}>-</button >{quantityCount}<button className="bg-gray-400 h-8 w-8 mx-2 rounded-full" disabled={quantityCount > 10} onClick={() => setQuantityCount(quantityCount + 1)}>+</button></p>



                        </div>


                    </div>

                    <div className="h-25 items-center flex justify-between sticky bottom-[calc(env(safe-area-inset-bottom))]  bg-white w-full sm:hidden">
                        <div className="pl-3">
                            <div className="flex">
                                <p className="font-bold text-xl ">{Math.round(data[0]["price"] - data[0]["price"] * data[0]["discount"] / 100)}rs</p>
                                <p className="mt-1 text-green-700">&nbsp; {data[0]["discount"]}% off</p>
                            </div>

                            <div className="flex text-[13px]"><p className="text-gray-600">MRP &nbsp;</p><p className="text-gray-600 line-through"> {data[0]["price"]}rs </p><p>&nbsp; incl. of taxes</p></div>
                        </div>
                        <button className="bg-transparent border-2 rounded-[5px] m-2 ml-3 h-15 mr-3 min-w-35 w-40  text-xl  hover:bg-gradient-to-b from-transparent to-neutral-400 hover:shadow-2xs" onClick={handleCart}>ADD TO CART</button>
                        {/* <Link to={size?`/checkout?product=${id}`:""} state={[{ "product": data[0], "size": size, "image": productMainImage, "userId": Boolean(userId) ? userId["id"] : 0, "quantity": quantityCount }]}>
                                    <button className="bg-green-600 border-2 rounded-[5px] m-2 h-10 min-w-30 w-40 text-xl  hover:bg-gradient-to-b from-green-600 to-green-700 hover:shadow-2xs" onClick={handleBuy}>Buy</button>
                                </Link> */}
                        {/* <button className="border-2 rounded-[5px] mt-5 w-40 text-xl ml-6 flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked?"yellow":"none"} stroke="yellow"   className="w-8 h-8 stroke-black stroke-2 size-6" onClick={()=>setLiked(true)}>
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                    WISHLIST    
                            </button> */}
                    </div>

                    <div className="mt-2">
                        {

                            suggestion.length != 0 ? suggestion.map((item, index) => {
                                return <div key={index}>
                                    <p className="font-bold text-xl mx-2">{["similar products", "Recommended for you"][index]}</p>
                                    <Product category={item}></Product>
                                </div>
                            }) : <div className="bg-slate-200 w-[100dvw] h-100 "></div>
                        }
                    </div>
                </div>

            }


        </div>
    )
}
export default ProductPage


//                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
//   <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
// </svg>

