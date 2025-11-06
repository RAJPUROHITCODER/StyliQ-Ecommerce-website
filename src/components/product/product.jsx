import { Link } from "react-router-dom"

const Product = (props) => {
    console.log("props category", props.category)
    return (
        <div>

            <div className=" flex overflow-x-auto pl-2 scrollbar-hide items-center">
                {
                    props.category.slice(0, 8).map((item, index) => {
                        return <div key={index} className="border-1 m-1 p-3 my-2 min-w-45 rounded-xl bg-white border-slate-500 shrink-0 hover:shadow-2xl flex justify-center ">
                            <Link to={`/product/${item.id}`}>
                                <div>
                                    <img src={`https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/${item.imageName[0]}`} alt="not found" className="h-45 w-40 min-w-33" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-400">{item["brandName"]}</p>
                                    <p>{item["productName"].length < 15 ? item["productName"] : item["productName"].slice(0, 19) + "..."}</p>
                                    <div className="flex">
                                        <p>₹{item.discount != 0 ? Math.round(item["price"] - (item["price"] * item["discount"]) / 100) : item["price"]}&nbsp;</p>
                                        <p className="text-gray-500 text-[15px] line-through">{item.discount != 0 ? "₹" + item["price"] : ""} &nbsp;</p>
                                        <p className="text-green-600">{item.discount != 0 ? item["discount"] + "% off" : ""}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>


                    })
                }
                {
                    props.category.length>=8?
                    <Link to={`/category/${props.category[0]["category"]}`} state={props.category}>
                        <button className="border-1 rounded-full h-15 w-15 bg-gray-300 active:bg-gray-400">View All</button>
                    </Link>:""
                }

            </div>
        </div>
    )
}
export default Product