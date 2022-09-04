import React, { Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'



const Input = (props) => {
  // const { disabled, className, icon } = props

  return (
    <>
    <div className={'flex border-light-gray border-2 rounded-xl px-4 h-14'}>
      <div className={'input-icon'}></div>
      {/* todo #mahdiyar needs two way binding, value binded to the input is prop.  */}
      {/*todo remove focus on input*/}
      <input placeholder={'Enter Amount'} className={'focus:outline-0'} ></input>
      <div className={'input-token'}></div>
    </div>
      <footer className={'mt-2'}>
      {/* This is for error messages and showing balance */}
        <div className={'flex justify-end gap-2 pr-2'}>
          <p className={'text-dark-gray text-sm'}>Balance: <span className={'font-semibold'}>380.23 SONG</span></p>
          <button className={'btn-primary-inverted rounded-md px-2 text-xs font-semibold'}>Max</button>
        </div>
      </footer>
    </>
  )
}

export default Input
