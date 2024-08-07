import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function LoginForm() {
  const navigate=useNavigate();
  useEffect(() => {
    document.getElementById("login-password").addEventListener("input", () => {
      document.getElementById("login-password-field").style.opacity = 0;
    });
    document.getElementById("login-email").addEventListener("input", () => {
      document.getElementById("login-email-field").style.opacity = 0;
    });
  }, []);
  async function submitForm(event) {
    event.preventDefault();
    const url = "http://localhost:3001/api/users/login";
    const data = {
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value,
    };
    axios
      .post(url, data)
      .then((response) => {
        if (response.status === 200) {
          alert("Logged in successfully");
          console.log("Token -> ", response.data.token);
          window.localStorage.setItem("genixToken", response.data.token);
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            document.getElementById("login-email-field").style.opacity = 1;
          } else if (error.response.status === 401) {
            document.getElementById("login-password-field").style.opacity = 1;
          } else {
            alert("An error occurred. Please try again.");
          }
        }
      });
  }
  return (
    <>
      <div className="font-manrope text-[14px] w-[392px]">
        <h2 className="text-[22px] font-bold">Login</h2>
        <p className="font-normal mb-[20px] text-gray-600">
          Welcome back. Enter your credentials to access your account
        </p>
        <form className="flex flex-col items-left ">
          <label for="login-email" className="font-semibold">
            Email Address
          </label>
          <input
            id="login-email"
            required
            className="font-medium w-full h-[30px] rounded border-2 p-4  border-gray-400 "
            type="email"
            placeholder="Email"
          />
          <p
            className="mb-[20px] font-light text-red-600 opacity-0"
            id="login-email-field"
          >
            User not found
          </p>
          <div className="flex flex-row justify-between">
            <label for="login-password" className="font-semibold">
              Password
            </label>
            <a href="#" className="text-blue-500 font-medium">
              Forgot password?
            </a>
          </div>
          <input
            required
            id="login-password"
            className="font-medium w-full h-[30px] rounded border-2 p-4 border-gray-400"
            type="password"
            placeholder="Password"
          />
          <p
            className="mb-[20px] font-light text-red-600 opacity-0"
            id="login-password-field"
          >
            Please enter correct password
          </p>
          <div className="flex flex-row items-center mb-[20px] font-normal">
            <input type="checkbox" id="login-signed-in" className="mr-[10px]" />
            <label for="login-signed-in" className="font-normal">
              Keep me signed in
            </label>
          </div>
          <button
            type="submit"
            onClick={(e) => submitForm(e)}
            className="bg-blue-gradient-button font-semibold w-full h-[44px] rounded bg-blue-500 text-white"
          >
            Continue
          </button>
          <img src="container.svg" className="mt-[20px]" />
          <div className="flex items-center justify-center mt-[10px] font-normal">
            Don't have an Account?{" "}
            <a href="/signup" className="text-blue-500 ml-[5px]">
              Sign up here
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
