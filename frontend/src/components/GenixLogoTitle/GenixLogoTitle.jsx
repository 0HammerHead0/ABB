import React from 'react';

export function GenixLogoTitle({ relPath = './' }) {
  return (
    <div className="landing-top-bar flex flex-row items-center p-4"> {/* Adjusted padding to be more consistent */}
      <img
        className="landing-top-bar-icon p-1"
        src={`${relPath}GenixLogo.svg`}
        alt="Genix Logo"
      />
      <h1 className="genix-name text-nowrap ml-2"> {/* Added margin-left for spacing */}
        Genix Auctions
      </h1>
    </div>
  );
}
