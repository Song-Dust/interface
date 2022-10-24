import React from 'react';
import { parseTokenURI } from 'utils/index';

import { SongMetadata } from '../../types';

export default function SongTile({
  onClick,
  id,
  songMeta,
}: {
  onClick: () => void;
  id: string | number;
  songMeta: SongMetadata | null | undefined;
}) {
  return (
    <div onClick={onClick} className={'w-64 h-24 bg-cover relative'} data-testid={`category-list-item-${id}-choose`}>
      {/* todo img below must be an iframe link to youtube video*/}
      <img
        alt="choice"
        src={parseTokenURI(
          songMeta?.image ||
            'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png',
        )}
        className={'rounded-xl w-full h-full'}
      />
      <div className={'px-2 pt-1 absolute inset-0'}>
        <p className={'font-bold text-xl'}>{songMeta?.name}</p>
      </div>
    </div>
  );
}
