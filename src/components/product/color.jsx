import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { supabase } from "../supabase"
const Color = (prop) => {
    const [preview, setPreview] = useState([])
    const userId = useSelector(state => state.user1.user)
    const [addBtnClicked,setAddBtnClicked]=useState(false)
    const {
        register,
        handleSubmit,

    } = useForm()
    console.log("next page",prop.nextPage)
    const handleSimilarImage = (e) => {
        let images = []
        Object.values(e.target.files).map((items) => {
            images.push(URL.createObjectURL(items))
        })
        setPreview(images)
    }
    async function saveData(data) {
        console.log("data in next",data)
        const sizeQuantity = Object.keys(data.size)
            .filter((item) => data.size[item].checked != false)
            .map((item) => ({
                [item]: Number(data.size[item].quantity),
            }));
        console.log("size", sizeQuantity)
        if (sizeQuantity.length == 0) {
            setMessage("Please Select Size")
            setTimeout(() => {
                setMessage("")
            }, 1000);
            return
        }

        let imageName = []
        for (let file of data.imageName) {
            console.log("i am runing similar")
            const fileName = `category/${prop.nextPage.category}/` + file.name + Date.now()
            const { data: uploadData, uploadError } = await supabase.storage.from("myProductsBucket").upload(fileName, file)
            if (uploadError) {
                console.log("upload Error")
            }
            else {
                console.log("upload data", uploadData)
                imageName.push(fileName)
            }
            console.log("data image file", file)
        }
        imageName.unshift(prop.nextPage.similarImage[prop.index])
        prop.nextPage.similarImage.push(prop.nextPage.imageName[0])
        console.log("prop.nextimage",prop.nextPage.similarImage)
        console.log("next page",prop.nextPage)
        const myProductData = {
            id:prop.nextPage.id+"_"+prop.nextPage.similarImage[prop.index].replaceAll("/",""),
            Description: prop.nextPage.Description,
            Location: prop.nextPage.Location,
            brandName: prop.nextPage.brandName,
            category: prop.nextPage.category,
            price: prop.nextPage.price,
            imageName:imageName,
            productName: prop.nextPage.productName,
            fabric: prop.nextPage.fabric,
            similarImage: prop.nextPage.similarImage,
            size: sizeQuantity,
            discount: prop.nextPage.discount,
            ownerId: userId.id
        }
        console.log("myprodcut ",myProductData)
        const { data: updated, updatedError } = await supabase.from("myProductInfo").insert(myProductData).eq("id", userId.id)
        if (updatedError) {
            console.log('error while insert', updatedError)
        }
        else {
            // console.log("data", updated)
        }
        prop.nextPage.similarImage.pop()
        setAddBtnClicked(true)

    }

    return (

        <div>
        {!addBtnClicked?
        <form onSubmit={handleSubmit(saveData)}>
            <div className="grid grid-cols-1 md:grid-cols-[0.8fr_2fr_2fr]  my-2 bg-gray-100 pt-2.5 px-2 justify-between place-items-center ">
                <img src={prop.similar[prop.index]} className="w-35 h-40  rounded-2xl"></img>
                <div className="flex">

                    <div>
                        <div className="flex justify-evenly gap-2 mt-3 ml-2 ">
                            <div >
                                <p>Size:</p>        
                                <p className="mt-4">Quantity:</p>
                            </div>
                            <div className="flex">
                                {["S", "M", "L", "XL", "XXL"].map(item => {
                                    return <label>
                                        <input type="checkbox" value={item} className="peer hidden"  {...register(`size.${item}.checked`)} />
                                        <div className="w-8 h-8 flex ml-2.5 items-center justify-center rounded-full border-1  cursor-pointer   peer-checked:border-blue-600 peer-checked:bg-blue-200 hover:bg-gray-200"> {item}</div>
                                        <input type="number" className="w-10 border-1 m-1 my-2" {...register(`size.${item}.quantity`, { min: 1 })}></input>
                                    </label>
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center place-items-center border-1 rounded-2xl  mb-3 ">
                    <div className="">
                        <div className="flex  justify-center h-30 w-[98%] rounded-2xl mt-3 overflow-x-scroll scrollbar-hide">
                            {
                                preview.length != 0 ?
                                    preview.map((items, index) => {
                                        return <div className="shrink-0 py-2 pl-2 ">
                                            <img src={items} className="w-25 h-28 rounded-2xl" />
                                        </div>
                                    }) : <div className="bg-gray-300 w-[90%] h-30"></div>
                            }
                        </div>
                        < input className="w-[68%]  mx-4 m-2 border-1 " onInput={handleSimilarImage} type='file' multiple accept='image/*' capture='environment' {...register("imageName",{required:true})} />
                        <button type="submit" className="w-[19%] border-1 rounded-xl bg-green-500 hover:bg-green-600 active:border-2" >ADD</button>
                    </div>
                </div>
            </div>
        </form>:""
}
        </div>
    )
}
export default Color