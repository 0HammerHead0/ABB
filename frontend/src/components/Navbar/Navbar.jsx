import { GenixLogoTitle } from "../GenixLogoTitle/GenixLogoTitle";
import { LandingPageTopBar } from "../LandingPageTopBar/LandingPageTopBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
export function Navbar({relPath='./', loggedIn, user }) {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("genixToken") || window.localStorage.getItem("Genix-Token");
  const logIn = () => {
    navigate("/login");
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
      <div className="flex justify-center  border-2 border-b-gray-200 top-navbar w-screen">
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
                <button onClick={logIn} className="text-blue-800">
                  Login
                </button>
                <button className="rounded text-white bg-blue-gradient-button p-3 px-4">
                  Get Started
                </button>
              </>
            ) : (
              <button
                className="rounded text-white bg-blue-gradient-button p-3 px-4"
                onClick={logOut}
                type="submit"
              >
                Logout
              </button>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
