import React, { useCallback, useMemo } from 'react';
import { TokenBalance } from 'types';
import { toCompactFormat } from 'utils/number';
import { formatUnits } from 'viem';

type Props = {
  tokenBalance?: TokenBalance;
  onUserInput: (value: string) => void;
  testid?: string;
  textarea?: boolean;
  icon?: any; // IconDefinition;
  className?: string;
  toggle?: boolean;
  toggleLabel?: string;
  label?: string;
};

const Input = (
  props:
    | (React.InputHTMLAttributes<HTMLInputElement> & Props)
    | (React.InputHTMLAttributes<HTMLTextAreaElement> & Props),
) => {
  const {
    label,
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
      {label && <label>{label}</label>}
      <div
        className={`flex items-center gap-3 border-light-gray bg-white border-2 rounded-xl px-4 ${
          props.textarea ? '' : 'h-14'
        } ${toggle ? 'justify-center' : ''}`}
      >
        <div className={'input-icon'}>{icon}</div>
        {/*todo remove focus on input*/}
        {props.textarea ? (
          <textarea
            placeholder={placeholder}
            className={'focus:outline-0 w-full text-lg pt-2'}
            onChange={(e) => onUserInput(e.target.value)}
            value={value || ''}
            data-testid={props.testid && `${props.testid}-input`}
          ></textarea>
        ) : (
          <input
            type={props.type}
            placeholder={placeholder}
            className={'focus:outline-0 w-full text-lg'}
            onChange={(e) => onUserInput(e.target.value)}
            value={value || ''}
            data-testid={props.testid && `${props.testid}-input`}
          ></input>
        )}
        <div className={'input-token'}></div>
      </div>
      <footer className={'mt-2'}>
        {/* This is for error messages and showing balance */}
        {tokenBalance && (
          <div className={'flex justify-end gap-2 pr-2'}>
            <p className={'text-dark-gray text-sm'}>
              Balance:{' '}
              <span className={'font-semibold'}>
                {parsedBalance ? toCompactFormat(Number(parsedBalance)) + ' ' + tokenBalance.symbol : '...'}
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
