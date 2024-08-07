import { GenixLogoTitle } from "../GenixLogoTitle/GenixLogoTitle";
import { LandingPageTopBar } from "../LandingPageTopBar/LandingPageTopBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./Navbar.css";
export function Navbar({relPath='./', loggedIn, user }) {
  const navigate = useNavigate();
  const [viewProfileMenu, setViewProfileMenu] = useState(false);
  const toggleProfileMenu = () => {
    setViewProfileMenu(!viewProfileMenu);
  };
  const token = window.localStorage.getItem("genixToken") || window.localStorage.getItem("Genix-Token");
  const logIn = () => {
    navigate("/login");
  };
  const singup = () => {
    navigate("/signup");
  };
  const myBidsRedirect = () => {
    navigate("/my-bids", { state: { loggedIn: true, user: user } });
  };
  const logOut = (e) => {
      e.preventDefault();
      console.log("LOGGING OUT",token)
      axios.post("http://localhost:3001/api/users/logout", {},{
        headers: {
          authorization: token,
        },
    })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        console.log("LOGGED OUT")
        window.localStorage.removeItem("genixToken");
        window.localStorage.removeItem("Genix-Token");
        if (window.location.pathname === "/") {
          window.location.reload();
        }
        else{
          navigate("/", { state: { loggedIn: false, user: null } });
        }
      }
    })
    .catch((e) => {
      console.log(e)
    });
    
  };
  return (
    <>
      <div className="flex fixed justify-center  border-2 border-b-gray-200 top-navbar w-screen">
        <div className="w-[80%] flex justify-between">
          <GenixLogoTitle relPath={relPath} />
          <ul className="flex justify-evenly items-center gap-8">
            <li>Auctions</li>
            <li>Bidding</li>
            <li>About us</li>
            <li>English</li>
            {console.log("LOGGED IN", loggedIn, user)}
            {!loggedIn && !user ? (
              <>
                <button onClick={logIn} className="text-blue-800 cursor-pointer">
                  Login
                </button>
                <button onClick={singup} className="rounded text-white bg-blue-gradient-button p-3 px-4 cursor-pointer">
                  Get Started
                </button>
              </>
            ) : (
              // <button
              //   className="rounded text-white bg-blue-gradient-button p-3 px-4"
              //   onClick={logOut}
              //   type="submit"
              // >
              //   Logout
              // </button>
              <>
                <img src={`${relPath}Avatar.png`} onClick={toggleProfileMenu} alt="User" className="w-10 h-10 cursor-pointer" />
                <div className={`profile-menu block fixed top-[105px] right-[10%] bg-white w-fit px-3 rounded font-manrope text-[14px] font-light shadow-lg border-[1px] border-gray-300 ${viewProfileMenu ? "show" : "hidden"}`}>
                  <ul className="flex flex-col justify-left items-center gap-3">
                    <li className="w-full pt-1">
                      <div className="flex flex-row w-full border-b-[1px] pb-2 border-gray-200">
                        <img src={`${relPath}Avatar.png`} alt="User" className="w-10 h-10" />
                        <div className="flex flex-col justify-center items-start ml-2">
                          <h1 className="font-semibold">{user.firstName} {user.lastName}</h1>
                          <p className="text-[14px]">{user.email}</p>
                        </div>
                      </div>
                    </li>
                    <li className="w-full">View profile</li>
                    <li className="w-full">Settings</li>
                    <li className="w-full border-b-[1px] pb-2 border-gray-200 cursor-pointer" onClick={myBidsRedirect}>My bids</li>
                    <li className="w-full">Credit cards</li>
                    <li className="w-full">My Auctions</li>
                    <li className="w-full border-b-[1px] pb-2 border-gray-200">Invite colleagues</li>
                    <li className="w-full">Notifcations</li>
                    <li className="w-full">Community</li>
                    <li className="w-full">Support</li>
                    <li className="w-full border-b-[1px] pb-2 border-gray-200">API</li>
                    <li className="w-full pb-3 cursor-pointer" type="submit" onClick={logOut}>Logout</li>
                  </ul>
                </div>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
