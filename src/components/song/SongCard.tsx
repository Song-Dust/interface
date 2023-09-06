// import { faHexagonVerticalNft } from '@fortawesome/pro-duotone-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongTags } from 'components/song/SongTags';
import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import React from 'react';
import { parseTokenURI } from 'utils/index';

import { SongMetadata } from '../../types';

// const style = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#EF476F',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;

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
          <p className={'font-bold text-xl mb-2'}>{songMeta.name}</p>
          {songMeta.attributes && <SongTags attributes={songMeta.attributes} />}
        </div>

        <div>
          <p className={'text-dark-gray text-sm mt-4 mb-1'} data-testid={`category-list-item-${id}-meta`}>
            Added by <span className={'text-black font-semibold'}>{songMeta.created_by}</span>
            {songMeta.Date && <>at {songMeta.Date}</>}
          </p>
          <a
            href={`https://opensea.io/assets/${SONGADAY_CONTRACT_ADDRESS}/${songMeta.token_id}`}
            className={'flex gap-1.5'}
          >
            {/*<FontAwesomeIcon fontSize={24} icon={faHexagonVerticalNft} style={style} />*/}
            <div className='flex items-center gap-2'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.10938 7.54688C5.48438 7.5 5.8125 7.6875 5.95312 8.01562L7.5 11.9062V8.29688C7.5 7.875 7.875 7.54688 8.25 7.54688C8.67188 7.54688 9 7.875 9 8.29688V15.7969C9 16.1719 8.76562 16.4531 8.39062 16.5469C8.0625 16.5938 7.6875 16.4062 7.59375 16.0781L6 12.1875V15.7969C6 16.2188 5.67188 16.5469 5.25 16.5469C4.875 16.5469 4.5 16.2188 4.5 15.7969V8.29688C4.5 7.92188 4.78125 7.64062 5.10938 7.54688ZM10.5 8.29688C10.5 7.875 10.875 7.54688 11.25 7.54688H13.5C13.9219 7.54688 14.25 7.875 14.25 8.29688C14.25 8.71875 13.9219 9.04688 13.5 9.04688H12V11.2969H13.5C13.9219 11.2969 14.25 11.625 14.25 12.0469C14.25 12.4688 13.9219 12.7969 13.5 12.7969H12V15.7969C12 16.2188 11.6719 16.5469 11.25 16.5469C10.875 16.5469 10.5 16.2188 10.5 15.7969V8.29688ZM18.75 7.54688C19.1719 7.54688 19.5 7.875 19.5 8.29688C19.5 8.71875 19.1719 9.04688 18.75 9.04688H18V15.7969C18 16.2188 17.6719 16.5469 17.25 16.5469C16.875 16.5469 16.5 16.2188 16.5 15.7969V9.04688H15.75C15.375 9.04688 15 8.71875 15 8.29688C15 7.875 15.375 7.54688 15.75 7.54688H18.75Z" fill="#353535" />
                <path opacity="0.4" d="M10.3125 0.84375C11.3906 0.234375 12.6562 0.234375 13.6875 0.84375L20.8594 4.96875C21.9375 5.57812 22.5469 6.70312 22.5469 7.92188V16.1719C22.5469 17.3906 21.9375 18.5156 20.8594 19.125L13.6875 23.25C12.6562 23.8594 11.3906 23.8594 10.3125 23.25L3.1875 19.125C2.10938 18.5156 1.5 17.3906 1.5 16.1719V7.92188C1.5 6.70312 2.10938 5.57812 3.1875 4.96875L10.3125 0.84375ZM5.95312 8.01562C5.8125 7.6875 5.48438 7.5 5.10938 7.54688C4.78125 7.64062 4.5 7.92188 4.5 8.29688V15.7969C4.5 16.2188 4.875 16.5469 5.25 16.5469C5.67188 16.5469 6 16.2188 6 15.7969V12.1875L7.59375 16.0781C7.6875 16.4062 8.0625 16.5938 8.39062 16.5469C8.76562 16.4531 9 16.1719 9 15.7969V8.29688C9 7.875 8.67188 7.54688 8.25 7.54688C7.875 7.54688 7.5 7.875 7.5 8.29688V11.9062L5.95312 8.01562ZM10.5 15.7969C10.5 16.2188 10.875 16.5469 11.25 16.5469C11.6719 16.5469 12 16.2188 12 15.7969V12.7969H13.5C13.9219 12.7969 14.25 12.4688 14.25 12.0469C14.25 11.625 13.9219 11.2969 13.5 11.2969H12V9.04688H13.5C13.9219 9.04688 14.25 8.71875 14.25 8.29688C14.25 7.875 13.9219 7.54688 13.5 7.54688H11.25C10.875 7.54688 10.5 7.875 10.5 8.29688V15.7969ZM15.75 7.54688C15.375 7.54688 15 7.875 15 8.29688C15 8.71875 15.375 9.04688 15.75 9.04688H16.5V15.7969C16.5 16.2188 16.875 16.5469 17.25 16.5469C17.6719 16.5469 18 16.2188 18 15.7969V9.04688H18.75C19.1719 9.04688 19.5 8.71875 19.5 8.29688C19.5 7.875 19.1719 7.54688 18.75 7.54688H15.75Z" fill="#EC2A64" />
              </svg>
              <span className={'text-primary font-semibold text-under underline'}>View on Opensea</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
