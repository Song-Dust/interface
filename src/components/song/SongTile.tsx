import React from 'react';
import { parseIpfsUri } from 'utils/index';

import { SongMetadata } from '../../types';

export default function SongTile({
  onClick,
  id,
  songMeta,
  className,
}: {
  onClick?: () => void;
  id: string | number;
  songMeta: SongMetadata | null | undefined;
  className: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-64 h-24 bg-cover relative rounded-xl overflow-hidden border-2 border-black ${className}`}
      data-testid={`category-list-item-${id}-choose`}
    >
      {/* todo img below must be an iframe link to youtube video*/}
      <img
        alt="choice"
        src={parseIpfsUri(
          songMeta?.image ||
            'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png',
        )}
        className={'w-full h-full'}
      />
      <div className={'p-2 absolute inset-0 bg-gradient-2 flex items-center'}>
        <p className={'font-bold text-xl text-white h-fit'}>{songMeta?.name}</p>
      </div>
    </div>
  );
}
