import React from 'react';

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader,
  icon,
  isActive = false,
  id,
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader?: React.ReactNode;
  icon: string;
  isActive?: boolean;
  id: string;
}) {
  let onClickOption = onClick || (() => {});
  if (link) {
    onClickOption = () => {
      window.location.href = link;
    };
  }
  return (
    <div
      data-testid="wallet-modal-option"
      className={'btn-primary-inverted rounded-xl mb-3 py-3 cursor-pointer'}
      onClick={onClickOption}
    >
      <div className={'px-5 justify-between items-center w-full flex'}>
        <p>{header}</p>
        <div className={'bg-white rounded-full p-2 shadow-xl flex justify-center items-center'}>
          {' '}
          <img alt={'wallet'} className={'h-6 w-6'} src={icon} />
        </div>
      </div>
    </div>
  );
}
