import { Navbar } from "../../components/Navbar/Navbar";
import { Card } from "../../components/Card/Card";
import axios from "axios";
import {useState, useEffect} from "react";
export function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [cards, setCards] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("genixToken");
        console.log("TOKEN",token);
        if (token) {
            axios.get("http://localhost:3001/api/users", {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                setUser(response.data);
                setLoggedIn(true);
                axios.get(`http://localhost:3001/api/auction-items/user/available-products`, {
                    headers: {
                      authorization: token,
                    },
                })
                .then((response) => {
                    setCards(response.data);
                    console.log("CARDS",response.data);
                })
                .catch(() => {
                    setCards([]);
                });
            })
            .catch(() => {
                setLoggedIn(false);
            });
        }
        else{
            setLoggedIn(false);
            axios.get("http://localhost:3001/api/auction-items")
            .then((response) => {
                setCards(response.data);
            })
            .catch(() => {
                setCards([]);
            });
        }
    }, []);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <Navbar className="fixed" loggedIn={loggedIn} user={user}/>
      </div>
      <div className="flex flex-col justify-center items-left w-[80%] font-manrope mt-[100px]">
        {!loggedIn && <img src="home.svg" className="w-full h-[700px] mt-2" />}
        <div className="flex justify-start my-3 items-center">
          <h1 className="text-[40px] mr-2 font-bold">
            {loggedIn ? 'Welcome' : 'Explore'}
          </h1>
          <h1 className="text-blue-700 text-[40px] font-bold">
            {(loggedIn && user) ? capitalizeFirstLetter(user.firstName)+'!' : 'Auctions'}
          </h1>
        </div>
        <div className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
         gap-4">
            {
                cards.map((card) => (
                    <Card key={card._id} card={card} loggedIn={loggedIn} user={user}/>
                ))
            }
        </div>
      </div>
    </div>
  );
}
