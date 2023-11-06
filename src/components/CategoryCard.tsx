// import { faHexagonVerticalNft } from '@fortawesome/pro-duotone-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';
import { Topic } from 'types';

// const style = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#EF476F',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;

export default function CategoryCard({ topic }: { topic: Topic }) {
  return (
    <Link
      to={RoutePath.CATEGORY.replace(':topicAddress', topic.address)}
      className={'bg-squircle w-[311px] h-[316px] bg-cover p-5 overflow-auto'}
      data-testid={`category-list-item-${topic.id}`}
    >
      {/* todo img below must be an iframe link to youtube video*/}
      <img
        alt="choice"
        src={'https://ipfs.io/ipfs/bafybeigakbkuau4biwmpuusietlcc44wwrqtwrzdoukgwyvdzt52y6w6xi'}
        className={'rounded-xl'}
      />
      <div className={'px-2 pt-1 flex flex-col justify-between h-40'}>
        <div className={'pt-1.5'}>
          <p className={'font-bold text-xl mb-2'}>{topic.meta?.title}</p>
        </div>

        <div>
          <p className={'text-dark-gray text-sm'}>{topic.meta?.description}</p>
        </div>
      </div>
    </Link>
  );
}
