import { useNavigate } from "react-router-dom";
import { LandingPageTopBar } from "../LandingPageTopBar/LandingPageTopBar";

export function SignupSuccessfull() {
  const navigate = useNavigate();
  function login() {
    navigate("/login");
  }
  return (
    <>
      <div className="flex justify-center  border-2 border-b-gray-200">
        <LandingPageTopBar />
      </div>
      <div className="flex flex-col justify-center items-center p-8 gap-12">
        <img className="w-screen h-[550px]" src="signupsuccessfull.svg" />
        <button
          type="submit"
          onClick={login}
          className="bg-blue-gradient-button font-semibold rounded bg-blue-500 text-white w-[190px] h-[44px] "
        >
          Login now
        </button>
      </div>
    </>
  );
}
