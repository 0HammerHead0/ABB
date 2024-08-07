import { LandingPageTopBar } from "../../components/LandingPageTopBar/LandingPageTopBar";
import { SingupForm } from "../../components/SingupForm/SingupForm";
export function Singup() {
  return (
    <>
      <div className="flex justify-center  border-2 border-b-gray-200">
        <LandingPageTopBar />
      </div>
      <div className="flex flex-row justify-evenly items-center h-[100vh]">
        <SingupForm />
        <img src="signup-img.svg" />
      </div>
    </>
  );
}
