import { useState } from "react"
import Login from "./loginPage"
import Footer from "./Menu/footer"
import { useContext } from "react"
import { MenuContext } from "../App"
const Heading = (props) => {
    const { isFooter, setIsFooter } = useContext(MenuContext)
    return (
        <div className="bg-gradient-to-r z-10 from-gray-500 to-black h-20 items-center text-white flex justify-between w-[100dvw] fixed">
            <div className="flex gap-[5%] ml-2 w-[30dvw] ">
                {/* <img src={null} alt="M"></img> */}
                {/* <h1 className=" font-bold text-3xl">Styliq</h1>  */}
                {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between"> */}
                    <h1
                        className="text-4xl sm:text-5xl font-extrabold tracking-wide
                       bg-clip-text text-transparent
                       bg-gradient-to-r from-amber-300 via-amber-200 to-rose-200
                       drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] select-none"
                        style={{ fontFamily: '"Bodoni Moda", serif' }}
                    >
                        StyliQ
                    </h1>
                {/* </div> */}



            </div>
            <div className="flex gap-1 w-[50dvw] justify-end [&>*]:bg-black">
                {/* <select onChange={(e)=>props.setMyLocation(e.target.value)} className="" id="location" name="location">
                    <option value={""}>Choose-Location</option>
                    <option value={"palanpur"}>Palanpur</option>
                    <option value={"gandhinagar"}>Gandhinagar</option>
                    <option value={"ahmedabad"}>Ahmedabad</option>
                    <option value={"rajkot"}>Rajkot</option>
                    <option value={"deesa"}>Deesa</option>
                    <option value={"dhanera"}>Dhanera</option>
                </select> */}
                {
                    props.isLoggedIn ? <button className="mx-5">not</button> : <div className="mx-5">
                        <button onClick={() => props.setIsLoginButtonClicked(true)}>Login</button>
                    </ div>
                }
                <div className="mr-5 font-extrabold text-2xl " onClick={() => setIsFooter(!isFooter)}>≡</div>
            </div>

        </div>
    )
}
export default Heading