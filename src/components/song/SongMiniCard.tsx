import { faCircleInfo } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import React from 'react';
import { parseTokenURI } from 'utils/index';

import { SongMetadata } from '../../types';

const style = {
  '--fa-primary-color': '#353535',
  '--fa-secondary-color': '#EF476F',
  '--fa-primary-opacity': 1,
  '--fa-secondary-opacity': 0.4,
} as React.CSSProperties;

export default function SongMiniCard({
  onClick,
  id,
  songMeta,
}: {
  onClick: () => void;
  id: string | number;
  songMeta: SongMetadata | null | undefined;
}) {
  return (
    <div onClick={onClick} className={'rounded-3xl w-64 bg-light-gray-2 p-4'} data-testid={`category-list-item-${id}`}>
      {/* todo img below must be an iframe link to youtube video*/}
      <img
        alt="choice"
        src={parseTokenURI(
          songMeta?.image ||
            'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png',
        )}
        className={'rounded-xl'}
      />
      <div className={'px-2 pt-2'}>
        <p className={'font-bold text-xl'}>{songMeta?.name}</p>

        <a
          href={`https://opensea.io/assets/${SONGADAY_CONTRACT_ADDRESS}/${songMeta?.token_id}`}
          className={'flex gap-1.5 mt-2'}
        >
          <FontAwesomeIcon fontSize={24} icon={faCircleInfo} style={style} />
          <span className={'text-primary font-semibold text-under underline'}>More Details</span>
        </a>
      </div>
    </div>
  );
}
