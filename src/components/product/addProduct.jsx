import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { supabase } from "../supabase"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {v7 as uuidv7} from 'uuid'
import Color from "./color"
const AddProduct = () => {
    const fileInputRef = useRef(null)
    const [preview, setPreview] = useState([])
    const [index, setIndex] = useState(0)
    const [similarImagePreview, setSimilarImagePreview] = useState([])
    // const userId = useSelector(state => state.user1.user)
    const [id,setId]=useState(uuidv7())
    const [groupId,setGroupId]=useState(uuidv7()) //new
    const { state } = useLocation()
    console.log("************state**",state)
    const color = useRef(null)
    const [message, setMessage] = useState("")
    const [btn, setBtn] = useState("Next")
    const [nextPage, setNextPage] = useState([])
    const navigate = useNavigate()
    const {
        register,
        watch,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm()

    const { ref: rhfRef, ...rest } = register("image", !state ? { required: true } : "")
    useEffect(() => {
        state ? reset({
            Description: state.product?state.product.Description:state.Description,
            Location: state.product?state.product.Location:state.Location,
            brandName: state.product?state.product.brandName:state.brandName,
            category: state.product?state.product.category:state.category,
            image: state.product?state.product.imageName:state.imageName,
            price: state.product?state.product.price:state.price,
            productName: state.product?state.product.productName:state.productName,
            fabric: state.product?state.product.fabric:state.fabric,
            similarImage: state.product?state.product.similarImage:state.similarImage,
            // size: state.size,
            discount: state.discount
        }) : ""

        let images = []

        state && watch("image").length != 0 ? watch("image").map((items) => {
            images.push("https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/" + items)
        }) : ""
        setPreview(images)
        let similarImages = []
        state && watch("similarImage").length != 0 ? watch("similarImage").map((items) => {
            similarImages.push("https://jlffsopwqlzahqgrwtee.supabase.co/storage/v1/object/public/myProductsBucket/" + items)
        }) : ""
        setSimilarImagePreview(similarImages)
    }, [])

    async function saveData(data) {
        const sizeQuantity = Object.keys(data.size)
            .filter((item) => data.size[item].checked != false)
            .map((item) => ({
                [item]: Number(data.size[item].quantity),
            }));
        if (sizeQuantity.length == 0) {
            setMessage("Please Select Size")
            setTimeout(() => {
                setMessage("")
            }, 1000);
            return
        }
        
        !state ? setMessage("Product Added") : setMessage("Product Updated")
        setTimeout(() => {
            setMessage("")
        }, 1000);

        let date=Date.now()
        const { data: { user }, error } = await supabase.auth.getUser()
        if (!state) {     
            let nextPageArray = []
            for (let file of data.similarImage) {
                const fileName = `category/${data.category}/` + file.name + date
                nextPageArray.push(fileName)
            }
            let image=[]
            for (let file of data.image) {
                    const fileName = `category/${data.category}/` + file.name + date
                    image.push(fileName)
                    break
                }
            
            setNextPage({
                Description: data.Description,
                Location: data.Location,
                brandName: data.brandName,
                category: data.category,
                imageName: image,
                price: data.price,
                productName: data.productName,
                fabric: data.fabric,
                similarImage: nextPageArray,
                size: sizeQuantity,
                discount: data.discount,
                ownerId: user.id,
                groupId:groupId
            })
            setTimeout(()=>{
                try{
                color.current.scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                })}
                catch{

                }

            },500)
        }
            let fileNames = []
            if (state) {
                for (let file of data.image) {
                    let oldImage
                    if(!state.product){
                        oldImage = state["imageName"].filter(x => x.slice(0, x.lastIndexOf(".")) == ((Boolean(file.name) ? `category/${data.category}/` + file.name : file)).slice(0, x.lastIndexOf(".")))
                    }
                    else{
                        oldImage = state.product["imageName"].filter(x => x.slice(0, x.lastIndexOf(".")) == ((Boolean(file.name) ? `category/${data.category}/` + file.name : file)).slice(0, x.lastIndexOf(".")))
                    }
                    if (oldImage.length == 0) {
                        const fileName = `category/${data.category}/` + file.name + date
                        const { data: uploadData, uploadError } = await supabase.storage.from("myProductsBucket").upload(fileName, file)
                        if (uploadError) {
                        console.log("uploadError",uploadError)

                        }
                        else {
                            fileNames.push(fileName)
                        }
                    }
                    else {
                        fileNames.push(oldImage[0])
                    }
                }
            }
            else {
                console.log("do it come here")
                for (let file of data.image) {
                    const fileName = `category/${data.category}/` + file.name + date
                    const { data: uplodData, uploadError } = await supabase.storage.from("myProductsBucket").upload(fileName, file)
                    if (uploadError) {
                        console.log("uploadError",uploadError)
                    }
                    else {
                        fileNames.push(fileName)
                    }
                }
            }
            const ids=[id+"__"+data.image[0].name]
            let similarImageFile = []
            for (let file of data.similarImage) {
                const fileName = `category/${data.category}/` + file.name + date
                const { data: uploadData, uploadError } = await supabase.storage.from("myProductsBucket").upload(fileName, file)
                if (uploadError) {
                }
                else {
                    similarImageFile.push(fileName)
                    ids.push(id+"__"+file.name)
                }

            }
            
            const myProductData = {
                id:id,
                Description: data.Description,
                Location: data.Location,
                brandName: data.brandName,
                category: data.category,
                imageName: fileNames,
                price: data.price,
                productName: data.productName,
                fabric: data.fabric,
                similarImage: !state ? similarImageFile : !state.product? state.similarImage:state.product.similarImage,
                size: sizeQuantity,
                discount: data.discount,
                ownerId: user.id,
                groupId:!state ? groupId: !state.product? state.groupId:state.product.groupId
            }
            if (!state) { 
                console.log("regular")
                const { data1, error } = await supabase.from("myProductInfo").insert(myProductData).single()
                if (error) {
                }
                else {
                }
                // navigate("/myproducts")
            }
            else if(state.mode=="Add variant"){
                console.log("add variant")
                const { data1, error } = await supabase.from("myProductInfo").insert(myProductData).single()
                if(error){
                    console.log("error hai",error)
                }
                Navigate("/myproducts")
            }
            else {
                console.log("update")
                setMessage("Product Updated")
                setTimeout(() => {
                    setMessage("")
                }, 1000);
                const { data: updated, updatedError } = await supabase.from("myProductInfo").update(myProductData).eq("id", state.id)
                if (updatedError) {
                }
                else {
                }
                navigate("/myproducts")

            }
        }
        function imageClicked() {
            if (fileInputRef.current) {
                fileInputRef.current.click()
            }
        }

        const handleImage = (e) => {
            let images = []
            Object.values(e.target.files).map((items) => {
                images.push(URL.createObjectURL(items))
            })

            setPreview(images)
            // preview.map((items)=>{
            // })

        }

        const handleSimilarImage = (e) => {
            let images = []
            Object.values(e.target.files).map((items) => {
                images.push(URL.createObjectURL(items))
            })

            setSimilarImagePreview(images)
            setTimeout(() => {
            }, 3000);
            // preview.map((items)=>{
            // })

        }
        return (

            <div className="pt-20 overflow-y-auto  scrollbar-hide p-2 bg-slate-200 ">

                <h1 className="font-bold text-3xl ml-4">Add Your Product</h1>
                <form onSubmit={handleSubmit(saveData)} >
                    <div className="grid grid-cols-1 gap-4 sm:gap-2 sm:grid-cols-[0.55fr_0.45fr] md:grid-cols-[0.55fr_0.45fr] lg:grid-cols-[0.50fr_0.25fr_0.25fr]   mt-1   [&_input]:my-2 [&_input]:mr-2" >
                        <div className="border-1 rounded-2xl bg-white pl-2 order-2 sm:order-2 lg:order-none ">
                            <h2 className="font-medium text-xl ">Product Details</h2>
                            <hr />
                            <label htmlFor='Category' className="h-50">Category</label>
                            <select className={errors.category ? "border-red-500 border-2 m-2 bg-black text-white mt-2" : "border-2 m-2  bg-black text-white mt-2"} id="Category"{...register("category", {
                                required: { value: true, message: "please select category" }
                            })}>
                                <option value={""}>Choose-Category</option>
                                <option value={"saree"}>Saree</option>
                                <option value={"kurti"}>Kurti</option>
                                <option value={"chaniya choli"}>Chaniya Choli</option>
                                <option value={"rajputi poshak"}>Rajputi Poshak</option>
                                <option value={"shirt-pant"}>Shirt-pant</option>
                                <option value={"shirt"}>Shirt</option>
                                <option value={"pant"}>Pant</option>
                                <option value={"marwadi suit"}>Marwadi suit</option>
                                <option value={"top"}>Top</option>
                                <option value={"jeans"}>Jeans</option>
                            </select>

                            <div className="">
                                <div>
                                    <label htmlFor='brandName'>Brand Name </label>
                                    <br />
                                    < input placeholder='Brand name' id="brandName" {...register("brandName", {
                                        required: true,
                                        maxLength: { value: 50, message: "product name should not be more than 50 letters" }
                                    })} className={errors.brandName ? "border-2 border-red-500 w-[90%] min-w-50  pl-2" : " border-1 w-[90%] min-w-50  pl-2"} />
                                </div>

                                <div>
                                    <label htmlFor='productName'>Product Name </label>
                                    <br />
                                    < input type='text' placeholder='product name' id="productName"  {...register("productName", {
                                        required: { value: true, message: "product name required" },
                                        minLength: { value: 3, message: "product name should be atleast of 3 letters" },
                                        maxLength: { value: 50, message: "product name should not be more than 50 letters" }
                                    })} className={errors.productName ? "border-2 border-red-500 w-[90%] min-w-50  pl-2" : " border-1 w-[90%] min-w-50  pl-2"} />
                                </div>
                            </div>
                            <div className="">

                                <div className="sm:pr-2 " >
                                    <label htmlFor='fabric'  >Fabric</label>
                                    <br></br>
                                    <select className={errors.fabric ? "border-2 border-red-500 w-[90%] min-w-50  pl-2 my-2" : " border-1 w-[90%] min-w-50  pl-2 my-2"} id="fabric"  {...register("fabric", {
                                        required: true
                                    })}>
                                        <option value={""}>Choose-Fabric</option>
                                        <option value={"cotton"}>cotton</option>
                                        <option value={"Polyester"}>Polyester</option>
                                        <option value={"Nylon"}>Nylon</option>
                                        <option value={"Wool"}>Wool</option>
                                        <option value={"Silk"}>Silk</option>
                                        <option value={"Linen"}>Linen</option>
                                        <option value={"Cashmere"}>Cashmere</option>
                                        <option value={"Hemp"}>Hemp</option>
                                        <option value={"Denim"}>Denim</option>
                                        <option value={"Velvet"}>Velvet</option>
                                        <option value={"Satin"}>Satin</option>
                                        <option value={"Poplins"}>Poplin</option>
                                        <option value={"Lycra"}>Lycra</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor='Location'>Available At</label>
                                    <br />
                                    <select className={errors.Location ? "border-2 border-red-500 w-[90%] min-w-50  pl-2 my-2" : " border-1 w-[90%] min-w-50  pl-2 my-2"} id="Location"  {...register("Location", {
                                        required: { value: true, message: "please give location" }
                                    })}>
                                        <option value={""}>Choose-Location</option>
                                        <option value={"palanpur"}>Palanpur</option>
                                        <option value={"gandhinagar"}>Gandhinagar</option>
                                        <option value={"ahmedabad"}>Ahmedabad</option>
                                        <option value={"rajkot"}>Rajkot</option>
                                        <option value={"deesa"}>Deesa</option>
                                        <option value={"dhanera"}>Dhanera</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex">

                                <div>
                                    <div className="flex justify-evenly gap-2 mt-3  w-[22dvw]  ">
                                        <div >
                                            <p>Size:</p>
                                            <p className="mt-4">Quantity:</p>
                                        </div>
                                        <div className="flex">
                                            {["S", "M", "L", "XL", "XXL"].map(item => {
                                                return <label>
                                                    <input type="checkbox" value={item} className="peer hidden"  {...register(`size.${item}.checked`)} />
                                                    <div className="w-8 h-8  flex items-center justify-center rounded-full border-1  ml-1.5 cursor-pointer   peer-checked:border-blue-600 peer-checked:bg-blue-200 hover:bg-gray-200"> {item}</div>
                                                    <input type="number" className="border-1 w-11 pl-1" {...register(`size.${item}.quantity`, { min: 1 })}></input>
                                                </label>
                                            })
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <label htmlFor='Description'>Description </label>
                                <br />
                                < textarea className=" w-[90%] h-20  border-1 mb-5" placeholder='Description' id="Description" {...register("Description", {
                                    minLength: { value: 3, message: " Description should be atleast of 3 letters" },
                                    maxLength: { value: 300, message: "Description should not be more than 300 letters" }
                                })} />
                            </div>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-[0.55fr_0.45fr] gap-4 sm:gap-2 sm:col-span-2 lg:col-span-1    justify-between    [&_input]:w-[95%] order-3 lg:order-none ">
                            <div className="border-1 rounded-2xl px-2   bg-white h-50">
                                <h2 className="font-medium text-xl ">Pricing</h2>

                                <div>
                                    <label htmlFor='price'>Price</label>
                                    <br />
                                    < input type="number" placeholder='Price' id="price" {...register("price", {
                                        required: { value: true, message: "price required" },
                                        min: 1
                                    })} className={errors.price ? "border-2 border-red-500 w-[90%] min-w-50  pl-2" : " border-1 w-[90%] min-w-50  pl-2"} />
                                </div>

                                <div>
                                    <label htmlFor='discount'>Discount</label>
                                    <br />
                                    < input type="number" placeholder='Discount' defaultValue={0} id="discount" {...register("discount")} className="border-1" />
                                    <hr />
                                </div>
                                <div>
                                    <label htmlFor='discount' className="font-medium">Total</label>

                                </div>

                                {/* <div>
                                <label htmlFor='Quantity'>Quantity</label>
                                <br />
                                < input defaultValue={1} type="number" placeholder='Quantity' id="Quantity" {...register("Quantity", {
                                    min: { value: 1, message: "Quantity should be atleast of 1" },
                                    required: { value: true, message: "please give number of quantity" }
                                })} />
                            </div> */}

                            </div>
                            <div className="border-1 rounded-2xl pl-2 bg-white order-1 md:order-3 ">
                                <h2 className="font-medium text-xl ">Colors</h2>
                                <div className="">

                                    <div className="flex mb-2   overflow-x-scroll scrollbar-hide">
                                        {
                                            similarImagePreview.length != 0 ?
                                                similarImagePreview.map((items, index) => {
                                                    return <div className="shrink-0 py-2 pl-2 ">
                                                        <img src={items} className="w-25 h-30 rounded-2xl" />
                                                    </div>
                                                }) : <div className="bg-gray-200 w-[95%] h-30"></div>
                                        }
                                    </div>
                                    {/* {!state? */}
                                    < input className="w-[80%] " onInput={handleSimilarImage} type='file' multiple accept='image/*' {...register("similarImage")} disabled={state} />
                                    {/* } */}
                                </div>
                            </div>
                        </div>

                        <div className="border-1 rounded-2xl flex flex-col  items-center bg-white order-1 sm:order-2 lg:order-none ">
                            <div className="w-[100%]">
                                <h2 className="font-medium text-xl ml-3 mb-3">Image</h2>
                            </div>
                            <div className={errors.image ? "border-2 border-red-400 h-80 bg-gray-200 rounded-2xl w-65  sm:w-[80%] md:w-[80%]  flex justify-center items-center " : "h-80 bg-gray-200 rounded-2xl w-65  sm:w-[80%] md:w-[80%]  flex justify-center items-center "} onClick={imageClicked} >
                                {
                                    preview.length != 0 ? <img src={preview[index]} className=" h-80  rounded-2xl  sm:w-[100%] "></img> : <div> click here to upload image</div>
                                }
                            </div>

                            < input className=" hidden " onInput={handleImage} type='file' multiple accept='image/*' 
                                {...rest}
                                ref={(e) => {
                                    rhfRef(e)
                                    fileInputRef.current = e

                                }}
                            />
                            {
                                errors.image && <div className="bg-red-200  border-1 mt-2">please upload image </div>
                            }

                            <div className="flex h-35 w-[90%] overflow-x-scroll scrollbar-hide">
                                {
                                    preview.length != 0 ?
                                        preview.map((items, index) => {
                                            return <div className="shrink-0 py-2 pl-2 " onClick={() => setIndex(index)}>
                                                <img src={items} className="w-25 h-30 rounded-2xl" />
                                            </div>
                                        }) : <div className="w-[100%] mt-3 flex justify-center ">
                                            <div className="bg-gray-200 w-[100%] h-30">
                                                <div className="h-30 w-5  animate-loadingImage bg-white blur-3xl"> </div>
                                            </div></div>
                                }
                            </div>
                        </div>
                    </div>
                    <button type={state ? "submit" : btn == "ADD" ? "submit" : "button"} disabled={isSubmitting} value={isSubmitting ? "Submitting" : "submit"} className="border-2 px-2 w-30 h-10 m-3 bg-green-500 hover:bg-green-600 active:bg-black" onClick={() => setBtn("ADD")}>{state ? "Update" : btn == "Next" ? btn : btn}</button>

                </form>
                {/* {
                message != "" ? <div className="flex h-[100dvh] w-[100dvw] absolute left-0 top-0 justify-center items-center">
                    <div className="h-15 w-70 bg-green-500  grid place-items-center">
                        <p className="justify-self-center  font-medium">   {message}</p>
                    </div>
                </div> : ""
            } */}
                {message != "" &&
                    <div className="grid place-items-center ">
                        <div className="bg-stone-800 text-white w-[50%] lg:w-[40%] h-15 grid place-items-center font-medium fixed top-[80dvh] ">{message}</div>
                    </div>
                }
                {
                    nextPage.length != 0 ?
                        similarImagePreview.map((item, index) => {
                            return <div ref={color}>
                                <Color similar={similarImagePreview} nextPage={nextPage} item={item} index={index}></Color>
                            </div>
                        }) : ""
                }
            </div>


        )
    }
    export default AddProduct 
