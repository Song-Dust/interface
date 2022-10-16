import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import React, { useCallback } from 'react';
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount';
import { maxAmountSpend } from 'utils/maxAmountSpend';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyBalance?: CurrencyAmount<Currency>;
  onUserInput: (value: string) => void;
  testid?: string;
  icon?: IconDefinition
}

const style = {
  '--fa-primary-color': '#353535',
  '--fa-secondary-color': '#EF476F',
  '--fa-primary-opacity': 1,
  '--fa-secondary-opacity': 0.4,
}as React.CSSProperties;

const Input = (props: InputProps) => {

  const { currencyBalance, placeholder, onUserInput, icon } = props;

  const maxAmountInput = maxAmountSpend(currencyBalance);
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);
  return (
    <>
      <div className={'flex border-light-gray border-2 rounded-xl px-4 h-14'}>
        <div className={'input-icon'}>
          { icon && (<FontAwesomeIcon fontSize={24} icon={icon} style={style} />)}
        </div>
        {/*todo remove focus on input*/}
        <input
          type={props.type}
          placeholder={placeholder}
          className={'focus:outline-0'}
          onChange={(e) => onUserInput(e.target.value)}
          value={props.value || ''}
          data-testid={props.testid && `${props.testid}-input`}
        ></input>
        <div className={'input-token'}></div>
      </div>
      <footer className={'mt-2'}>
        {/* This is for error messages and showing balance */}
        {currencyBalance && (
          <div className={'flex justify-end gap-2 pr-2'}>
            <p className={'text-dark-gray text-sm'}>
              Balance:{' '}
              <span className={'font-semibold'}>
                {currencyBalance
                  ? formatCurrencyAmount(currencyBalance, 4) + ' ' + currencyBalance.currency.symbol
                  : ''}
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
    </>
  );
};

export default Input;
