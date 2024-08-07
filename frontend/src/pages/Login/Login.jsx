import { LandingPageTopBar } from "../../components/LandingPageTopBar/LandingPageTopBar";
import { LoginForm } from "../../components/LoginForm/LoginForm";
export function Login() {
  return (
    <>
      <div className="flex justify-center  border-2 border-b-gray-200">
        <LandingPageTopBar/>
      </div>
      <div className="flex flex-row justify-evenly items-center h-[100vh]">
        <LoginForm/>
        <img src="login-img.svg" />
      </div>
    </>
  );
}