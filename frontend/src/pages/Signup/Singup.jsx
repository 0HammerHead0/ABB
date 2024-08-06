import { LandingPageTopBar } from "../../components/LandingPageTopBar/LandingPageTopBar";
import { SingupForm } from "../../components/SingupForm/SingupForm";
import "./Singup.css";
export function Singup() {
  return (
    <>
      <div className="flex justify-center  border-2 border-b-gray-200">
        <LandingPageTopBar/>
      </div>
      <div className="flex justify-center items-center h-[100vh]">
        <SingupForm/>
      </div>
    </>
  );
}