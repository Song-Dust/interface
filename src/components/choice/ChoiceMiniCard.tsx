// import { faCircleInfo } from '@fortawesome/pro-duotone-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import React from 'react';
import { parseIpfsUri } from 'utils/index';

import { ChoiceMetadata } from '../../types';

// const style = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#EF476F',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;

export default function ChoiceMiniCard({
  onClick,
  id,
  choiceMeta,
  className,
}: {
  onClick: () => void;
  id: string | number;
  choiceMeta: ChoiceMetadata | null | undefined;
  className: string;
}) {
  return (
    <div onClick={onClick} className={`rounded-3xl w-60 p-4 ${className}`} data-testid={`topic-list-item-${id}`}>
      {/* todo img below must be an iframe link to youtube video*/}
      <img
        alt="choice"
        src={parseIpfsUri(
          choiceMeta?.image ||
            'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png',
        )}
        className={'rounded-xl'}
      />
      <div className={'px-2 pt-2'}>
        <p className={'font-bold text-xl'}>{choiceMeta?.name}</p>

        <a
          href={`https://opensea.io/assets/${SONGADAY_CONTRACT_ADDRESS}/${choiceMeta?.token_id}`}
          target="_blank"
          className={'flex gap-1.5 mt-2'}
          rel="noreferrer"
        >
          {/*<FontAwesomeIcon fontSize={24} icon={faCircleInfo} style={style} />*/}
          <div className="flex gap-2 items-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 7.5C10.6641 7.5 11.25 6.95312 11.25 6.25C11.25 5.58594 10.6641 5 10 5C9.29688 5 8.75 5.58594 8.75 6.25C8.75 6.95312 9.29688 7.5 10 7.5ZM11.5625 13.125H10.9375V9.6875C10.9375 9.17969 10.5078 8.75 10 8.75H8.75C8.20312 8.75 7.8125 9.17969 7.8125 9.6875C7.8125 10.2344 8.20312 10.625 8.75 10.625H9.0625V13.125H8.4375C7.89062 13.125 7.5 13.5547 7.5 14.0625C7.5 14.6094 7.89062 15 8.4375 15H11.5625C12.0703 15 12.5 14.6094 12.5 14.0625C12.5 13.5547 12.0703 13.125 11.5625 13.125Z"
                fill="#353535"
              />
              <path
                opacity="0.4"
                d="M10 0C4.45312 0 0 4.49219 0 10C0 15.5469 4.45312 20 10 20C15.5078 20 20 15.5469 20 10C20 4.49219 15.5078 0 10 0ZM10 5C10.6641 5 11.25 5.58594 11.25 6.25C11.25 6.95312 10.6641 7.5 10 7.5C9.29688 7.5 8.75 6.95312 8.75 6.25C8.75 5.58594 9.29688 5 10 5ZM11.5625 15H8.4375C7.89062 15 7.5 14.6094 7.5 14.0625C7.5 13.5547 7.89062 13.125 8.4375 13.125H9.0625V10.625H8.75C8.20312 10.625 7.8125 10.2344 7.8125 9.6875C7.8125 9.17969 8.20312 8.75 8.75 8.75H10C10.5078 8.75 10.9375 9.17969 10.9375 9.6875V13.125H11.5625C12.0703 13.125 12.5 13.5547 12.5 14.0625C12.5 14.6094 12.0703 15 11.5625 15Z"
                fill="#EC2A64"
              />
            </svg>
            <span className={'text-primary font-semibold text-under underline'}>More Details</span>
          </div>
        </a>
      </div>
    </div>
  );
}
