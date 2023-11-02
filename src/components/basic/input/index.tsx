import React, { useCallback, useMemo } from 'react';
import { TokenBalance } from 'types';
import { formatUnits } from 'viem';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tokenBalance?: TokenBalance;
  onUserInput: (value: string) => void;
  testid?: string;
  icon?: any; // IconDefinition;
  className?: string;
  toggle?: boolean;
  toggleLabel?: string;
}

// const style = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#EF476F',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;

const Input = (props: InputProps) => {
  const {
    value,
    tokenBalance,
    placeholder,
    onUserInput,
    icon,
    className,
    toggle,
    // toggleLabel
  } = props;

  const parsedBalance = useMemo(() => {
    if (tokenBalance?.balance === undefined) return undefined;
    if (tokenBalance?.balance === 0n) return '0';
    if (tokenBalance?.decimals === undefined) return undefined;
    return formatUnits(tokenBalance.balance, tokenBalance.decimals);
  }, [tokenBalance]);

  const handleMax = useCallback(() => {
    parsedBalance && onUserInput(parsedBalance);
  }, [onUserInput, parsedBalance]);

  return (
    <div className={`${className ? className : ''}`}>
      <div
        className={`flex items-center gap-3 border-light-gray bg-white border-2 rounded-xl px-4 h-14 ${
          toggle ? 'justify-center' : ''
        }`}
      >
        <div className={'input-icon'}>{icon}</div>
        {/*todo remove focus on input*/}
        <input
          type={props.type}
          placeholder={placeholder}
          className={'focus:outline-0 w-full text-lg'}
          onChange={(e) => onUserInput(e.target.value)}
          value={value || ''}
          data-testid={props.testid && `${props.testid}-input`}
        ></input>
        <div className={'input-token'}></div>
      </div>
      <footer className={'mt-2'}>
        {/* This is for error messages and showing balance */}
        {tokenBalance && (
          <div className={'flex justify-end gap-2 pr-2'}>
            <p className={'text-dark-gray text-sm'}>
              Balance:{' '}
              <span className={'font-semibold'}>
                {parsedBalance ? Number(parsedBalance).toLocaleString() + ' ' + tokenBalance.symbol : '...'}
              </span>
            </p>
            <button
              onClick={handleMax}
              className={'btn-primary-inverted rounded-md px-2 text-xs font-semibold'}
              data-testid={props.testid && `${props.testid}-max`}
            >
              Max
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Input;
