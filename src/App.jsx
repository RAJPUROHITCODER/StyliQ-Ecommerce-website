import { useCallback, useEffect, useState } from "react"
import Heading from "./components/heading"
import AddProduct from "./components/product/addProduct"
import Category from "./components/product/category"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProductPage from "./components/product/productPage"
import Login from "./components/loginPage"
import Footer from "./components/Menu/footer"
import MyAccount from "./components/my account component/myAccount"
import Cart from "./components/cart/cart"
import IndividualCategory from "./components/product/individualCategory"
import BuyPage from "./components/buy/buyPage"
import { supabase } from "./components/supabase"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "./store/userSlicer"
import MyProducts from "./components/product/myProducts"
import HandleOffline from "./components/handleOffline"
import MyOrderDetails from "./components/my account component/myOrderDetails"
import { createContext } from "react"
const MenuContext=createContext()
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const userId = useSelector(state => state.user1.user)
  const dispatch = useDispatch()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [myLocation, setMyLocation] = useState("")
  const [isLoginButtonClicked, setIsLoginButtonClicked] = useState(false)
  const [isFooter,setIsFooter]=useState(false)
  const [userSession, setUserSession] = useState(null);
  const [refresh,setRefresh]=useState(true)

  const fecthUserData = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      dispatch(setUser(user))
      if (!user) {
        setIsLoggedIn(false)
      }
      else {
        setIsLoggedIn(true)
      }
    }
    catch(error){
    }
    }, [])
  useEffect(() => {

    fecthUserData()

  }, [fecthUserData])
  
  useEffect(() => {
    fecthUserData()
    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))

  }, [fecthUserData])
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element:
          <div>
            <Category></Category>
            
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
          </div>
      },
      {
        path: "/cart",
        element:
          <div>
            <Cart></Cart>
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
          </div>

      },
      {
        path: "product/:id",
        element:
          <div>
            <ProductPage />
            
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
            {/* <Footer></Footer> */}
          </div>

      },
      {
        path:"/myaccount",
        element:
          <div>
            <MyAccount></MyAccount>
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
          </div>
      },
      {
        path: 'category/:id',
        element:
          <div>
            <IndividualCategory></IndividualCategory>
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
          </div>
      },
      {
        path: "checkout",
        element:
          <div>
            <BuyPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isLoginButtonClicked={isLoginButtonClicked} setIsLoginButtonClicked={setIsLoginButtonClicked}></BuyPage>
            {/* <Footer></Footer> */}
            
          </div>
      },
      {
        path: "addProduct",
        element:
          <div>
            <AddProduct></AddProduct>
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
          </div>
      },
      {
        path: "myproducts",
        element:
          <div>
            <MyProducts></MyProducts>
            <MenuContext value={{isFooter,setIsFooter}}>
            <Footer></Footer>
            </MenuContext>
          </div>
      },
      {
        path:"myOrderDetail",
        element:
          <div>
            <MyOrderDetails></MyOrderDetails>
          </div>
      }
    ]
  )
  return (
    <div>
      <MenuContext value={{isFooter,setIsFooter}}>
      <Heading   setMyLocation={setMyLocation} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setIsLoginButtonClicked={setIsLoginButtonClicked}></Heading>
      </MenuContext>
      {/* <Category></Category> */}

      {isLoginButtonClicked ? <Login setIsLoginButtonClicked={setIsLoginButtonClicked} setIsLoggedIn={setIsLoggedIn}> </Login> : ""}
      {
        isOnline ? <RouterProvider router={router}></RouterProvider> : <HandleOffline></HandleOffline>

      } 
      {/* <RouterProvider router={router}></RouterProvider> */}
    </div>
  )


}
export default App
export {MenuContext}