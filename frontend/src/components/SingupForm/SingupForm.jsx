import React from "react";
import axios from "axios";
export function SingupForm() {
    async function submitForm(event) {
        event.preventDefault();
        const url = "http://localhost:3001/api/users/register";
        const data = {
            firstName: document.getElementById("signup-firstname").value,
            lastName: document.getElementById("signup-lastname").value,
            email: document.getElementById("signup-email").value,
            password: document.getElementById("signup-password").value,
            receiveOutbidEmails: document.getElementById("signup-terms").checked,
        };
        console.log(data)
    }
  return (
    <>
      <div className="font-manrope text-[14px] w-[392px]">
        <h2 className="text-[22px] font-bold">Sign Up</h2>
        <p className="font-normal mb-[20px] text-gray-600">
          New bidders, as soon as you have submitted your information you will
          be eligible to bid in the auction.
        </p>
        <form className="flex flex-col items-left ">
          <label for="signup-firstname" className="font-semibold">
            First Name
          </label>
          <input
            id="signup-firstname"
            required
            className="font-medium w-full h-[30px] rounded border-2 p-4 mb-[20px] border-gray-400 "
            type="text"
            placeholder="First Name"
          />
          <label for="signup-lastname" className="font-semibold">
            Last Name
          </label>
          <input
            required
            id="signup-lastname"
            className="font-medium w-full h-[30px] rounded border-2 p-4 mb-[20px] border-gray-400"
            type="text"
            placeholder="Last Name"
          />
          <label for="signup-email" className="font-semibold">
            Email
          </label>
          <input
            required
            id="signup-email"
            className="font-medium w-full h-[30px] rounded border-2 p-4 mb-[20px] border-gray-400"
            type="email"
            placeholder="Email"
          />
          <label for="signup-password" className="font-semibold">
            Password
          </label>
          <input
            id="signup-password"
            className="font-medium w-full h-[30px] rounded border-2 p-4 border-gray-400"
            type="password"
            placeholder="Password"
          />
          <p className="mb-[20px] font-light">Password criteria check</p>
          <div className="flex flex-row items-center mb-[20px] font-normal">
            <input type="checkbox" id="signup-terms" className="mr-[10px] gradient-checkbox  " />
            <label for="signup-terms" className="font-normal ">
              Receive outbid emails
            </label>
          </div>
          <button onClick="submitForm" className="bg-blue-gradient-button font-semibold w-full h-[44px] rounded bg-blue-500 text-white">
            Submit
          </button>
          <img src="container.svg" className="mt-[20px]" />
          <div className="flex items-center justify-center font-medium mt-[10px]">
            Want to know more?{" "}
            <a href="#" className="text-blue-500 ml-[5px]">
              Auction rules
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
