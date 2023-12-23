import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

export default function Header() {
  return (
    <div className="flex justify-between pb-4">
      <div className="flex items-center gap-2 relative">
        <img src="/songDustLogo.png" alt="Logo" />
        <p className="text-black font-semibold text-3xl z-10">SongDust</p>
        <p className="text-primary-light font-semibold text-3xl absolute left-14 top-2">SongDust</p>
      </div>
      <ConnectButton />
    </div>
  );
}
