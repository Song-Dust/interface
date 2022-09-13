import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  balance?: string;
}

const Input = (props: InputProps) => {
  const { balance, placeholder } = props;

  return (
    <>
      <div className={'flex border-light-gray border-2 rounded-xl px-4 h-14'}>
        <div className={'input-icon'}></div>
        {/*todo remove focus on input*/}
        <input placeholder={placeholder} className={'focus:outline-0'} {...props}></input>
        <div className={'input-token'}></div>
      </div>
      <footer className={'mt-2'}>
        {/* This is for error messages and showing balance */}
        {balance && (
          <div className={'flex justify-end gap-2 pr-2'}>
            <p className={'text-dark-gray text-sm'}>
              Balance: <span className={'font-semibold'}>{balance}</span>
            </p>
            <button className={'btn-primary-inverted rounded-md px-2 text-xs font-semibold'}>Max</button>
          </div>
        )}
      </footer>
    </>
  );
};

export default Input;
