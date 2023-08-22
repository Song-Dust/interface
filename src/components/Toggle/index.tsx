import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const ToggleBox = ({ options }: { options: { name: string }[] },) => {
  const [selected, setSelected] = useState(options[0])

  return (
    <div className="w-48">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="relative w-full h-14 flex items-center gap-2 cursor-default border-light-gray bg-white border-2 rounded-xl py-2 pl-4 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-400 sm:text-sm">
            <svg className='inline' width="27" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.2353 16.2647C14.1011 16.2647 15.6471 14.7721 15.6471 12.8529C15.6471 12.2665 15.4338 11.6801 15.1673 11.2004C15.3272 11.2004 15.4871 11.1471 15.6471 11.1471C18.4724 11.1471 20.7647 13.4393 20.7647 16.2647C20.7647 19.0901 18.4724 21.3824 15.6471 21.3824C12.7684 21.3824 10.5294 19.0901 10.5294 16.2647C10.5294 16.1581 10.5294 15.9982 10.5294 15.8382C11.0092 16.1048 11.5956 16.2647 12.2353 16.2647Z" fill="#353535" />
              <path opacity="0.4" d="M5.35846 8.64154C7.86397 6.29596 11.329 4.32353 15.6471 4.32353C19.9118 4.32353 23.3768 6.29596 25.8824 8.64154C28.3879 10.9338 30.0404 13.7059 30.8401 15.625C31 16.0515 31 16.5313 30.8401 16.9577C30.0404 18.8235 28.3879 21.5956 25.8824 23.9412C23.3768 26.2868 19.9118 28.2059 15.6471 28.2059C11.329 28.2059 7.86397 26.2868 5.35846 23.9412C2.85294 21.5956 1.20037 18.8235 0.400736 16.9577C0.240809 16.5313 0.240809 16.0515 0.400736 15.625C1.20037 13.7059 2.85294 10.9338 5.35846 8.64154ZM15.6471 23.9412C19.8585 23.9412 23.3235 20.5294 23.3235 16.2647C23.3235 12.0533 19.8585 8.58824 15.6471 8.58824C11.3824 8.58824 7.97059 12.0533 7.97059 16.2647C7.97059 20.5294 11.3824 23.9412 15.6471 23.9412Z" fill="#EC2A64" />
            </svg>
            <span className="block truncate text-lg text-black">{selected.name}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-light-2 text-black' : 'text-gray-900'}`}
                  value={person}>
                  {({ selected }) => (
                    <>
                      <span className={`block truncate !text-base ${selected ? 'font-medium' : 'font-normal'}`}>
                        {person.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default ToggleBox;
