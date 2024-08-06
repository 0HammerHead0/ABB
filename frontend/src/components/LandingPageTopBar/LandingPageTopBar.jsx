import { GenixLogoTitle } from "../GenixLogoTitle/GenixLogoTitle";
import "./LandingPageTopBar.css"
export function LandingPageTopBar() {
  return (
    <div className="w-[80%] flex justify-start">
      <div className="flex justify-center ">
        <GenixLogoTitle/>
      </div>
    </div>
  );
}