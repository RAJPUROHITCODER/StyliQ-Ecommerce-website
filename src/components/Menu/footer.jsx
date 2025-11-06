import { useContext, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { MenuContext } from "../../App"
import { supabase } from "../supabase"
const Footer = (props) => {
    const { isFooter, setIsFooter } = useContext(MenuContext)
    const [refresh,setRefresh]=useState(false)
    async function handleLogout() {
        console.log("logout")
        const { data, error } = await supabase.auth.signOut()
        if (error) {
            console.log('logout error', error)
        }
        else {
            console.log("logout data", data)
            window.location.reload()

            
        }
    }
    return (

        <div className="fixed z-20 top-20 " onMouseLeave={()=>setIsFooter(false)}>

            {isFooter ?
                <div className=" fixed  w-60 top-20  right-1 opacity-85 bg-stone-900 text-white p-1   rounded-xl">
                    <NavLink to={"/"}><p className="h-8 p-1 text-xl opacity-100      rounded-[5px] hover:bg-white hover:text-black my-1 flex">
                        <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd" />
                        </svg>
                        Home</p></NavLink>
                    <NavLink to={"/myaccount"}><p className="h-8 p-1 text-xl   rounded-[5px] hover:bg-white hover:text-black my-1 flex">
                        <svg className="w-6 h-6 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 73.825a182.175 182.175 0 1 0 182.18 182.18A182.177 182.177 0 0 0 256 73.825zm0 71.833a55.05 55.05 0 1 1-55.054 55.046A55.046 55.046 0 0 1 256 145.658zm.52 208.723h-80.852c0-54.255 29.522-73.573 48.885-90.906a65.68 65.68 0 0 0 62.885 0c19.363 17.333 48.885 36.651 48.885 90.906z" data-name="Profile" fill="currentColor" className="bg-white" /></svg>
                        My Account</p></NavLink>
                    <NavLink to={"/cart"}><p className="h-8 p-1 text-xl rounded-[5px] hover:bg-white hover:text-black my-1 flex">
                        <svg className="w-6 h-6 hover:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
                        </svg>

                        Cart</p></NavLink>
                    <NavLink to={"/addProduct"}><p className="h-8 p-1 text-xl rounded-[5px] hover:bg-white hover:text-black  my-1 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Add product"><path d="M6 8v9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8" /><path d="M8 8a4 4 0 0 1 8 0" /><path d="M18 15v6M15 18h6" /></svg>
                        Add Product</p></NavLink>
                    <NavLink to={"/myproducts"}><p className="h-8 p-1 text-xl rounded-[5px] hover:bg-slate-50 hover:text-black my-1 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0    24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="My products list"><rect x="6" y="6" width="12" height="14" rx="2" /><path d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2z" /><path d="M8.5 12h7" /><path d="M8.5 16h7" /></svg>
                        My Products</p></NavLink>
                    <div>
                        <div>
                            <button className="bg-white text-black text-xl my-5  flex justify-self-center px-2  rounded-xl   " onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
                : ""
            }
        </div>
    )
}
export default Footer














// <div className=" fixed  flex  bottom-0 h-50   bg-black text-white p-1 sm:hidden">
//                 <NavLink to={"/"}>
//                     <p className="h-6 px-1 rounded-[5px] hover:bg-white hover:text-black my-1 ">
//                         <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//                             <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd" />
//                         </svg>
//                         Home
//                     </p>
//                 </NavLink>
//                 <NavLink to={"/myaccount"}>
//                     <p className="h-6 px-1 rounded-[5px] hover:bg-white hover:text-black my-1 ">
//                         <svg height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 73.825a182.175 182.175 0 1 0 182.18 182.18A182.177 182.177 0 0 0 256 73.825zm0 71.833a55.05 55.05 0 1 1-55.054 55.046A55.046 55.046 0 0 1 256 145.658zm.52 208.723h-80.852c0-54.255 29.522-73.573 48.885-90.906a65.68 65.68 0 0 0 62.885 0c19.363 17.333 48.885 36.651 48.885 90.906z" data-name="Profile" fill="white" className="bg-white " /></svg>
//                         My Account
//                     </p>
//                 </NavLink>
//                 <NavLink to={"/cart"}>
//                     <p className="h-6 px-1 rounded-[5px] hover:bg-white hover:text-black my-1 ">
//                         <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//                             <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
//                         </svg>

//                         Cart
//                     </p>
//                 </NavLink>
//                 <NavLink to={"/addProduct"}>
//                     <p className="h-6 px-1 rounded-[5px] hover:bg-white hover:text-black  my-1 ">
//                         <svg height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fil="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Add product"><path d="M6 8v9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8" /><path d="M8 8a4 4 0 0 1 8 0" /><path d="M18 15v6M15 18h6" /></svg>
//                         Add Product
//                     </p>
//                 </NavLink>
//                 <NavLink to={"/myproducts"}>
//                     <p className="h-6 px-1 rounded-[5px] hover:bg-slate-50 hover:text-black my-1 ">
//                         <svg height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="My products list"><rect x="6" y="6" width="12" height="14" rx="2" /><path d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2z" /><path d="M8.5 12h7" /><path d="M8.5 16h7" /></svg>
//                         My Products
//                     </p>
//                 </NavLink>
//             </div>