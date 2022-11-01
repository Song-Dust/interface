import { faHexagonVerticalNft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongTags } from 'components/song/SongTags';
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

export default function SongCard({
  onClick,
  id,
  songMeta,
}: {
  onClick?: () => void;
  id: string | number;
  songMeta: SongMetadata;
}) {
  return (
    <div
      onClick={onClick}
      className={'bg-squircle w-[311px] h-[316px] bg-cover p-5'}
      data-testid={`category-list-item-${id}`}
    >
      {/* todo img below must be an iframe link to youtube video*/}
      <img
        alt="choice"
        src={parseTokenURI(
          songMeta.image ||
            'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png',
        )}
        className={'rounded-xl'}
      />
      <div className={'px-2 pt-1 flex flex-col justify-between h-40'}>
        <div className={'pt-1.5'}>
        <p className={'font-bold text-xl'}>{songMeta.name}</p>
        {songMeta.attributes && <SongTags attributes={songMeta.attributes} />}
        </div>

        <div>
        <p className={'text-dark-gray text-sm mt-4 mb-1'} data-testid={`category-list-item-${id}-meta`}>
          Added by <span className={'text-black font-semibold'}>{songMeta.created_by}</span>
          {songMeta.Date && (<>at {songMeta.Date}</>)}
        </p>
        <a
          href={`https://opensea.io/assets/${SONGADAY_CONTRACT_ADDRESS}/${songMeta.token_id}`}
          className={'flex gap-1.5'}
        >
          <FontAwesomeIcon fontSize={24} icon={faHexagonVerticalNft} style={style} />
          <span className={'text-primary font-semibold text-under underline'}>View on Opensea</span>
        </a>
        </div>
      </div>
    </div>
  );
}
