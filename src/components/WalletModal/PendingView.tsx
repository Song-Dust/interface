import { Connector } from '@web3-react/types';
import Lottie from 'react-lottie';

// @ts-ignore
import animationData from "../../assets/lottiefiles/loading-1.json";
// @ts-ignore
export default function PendingView({

  connector,
  error = false,
  tryActivation,
  openOptions,
}: {
  connector: Connector;
  error?: boolean;
  tryActivation: (connector: Connector) => void;
  openOptions: () => void;
}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return error ? (
    <main>
      <h4>Error connecting</h4>
      <p>The connection attempt failed. Please click try again and follow the steps to connect in your wallet.</p>
      <button
        className={'btn-primary btn-large font-medium mt-4 px-12'}
        onClick={() => {
          tryActivation(connector);
        }}
      >
        Try Again
      </button>
      <button className={'btn-primary btn-large font-medium mt-4 px-12'} onClick={openOptions}>
        Back to wallet selection
      </button>
    </main>
  ) : (
    <main className={'flex flex-col gap-4 items-center'}>
      <div className={'-mt-8'}><Lottie
        options={defaultOptions}
        height={200}
        width={200}
      />
      </div>
      <div className={'flex flex-col gap-2 items-center mb-2 -mt-8'}>
      <h3>Waiting to connect</h3>
      <p className={''}>Confirm this connection in your wallet</p>
      </div>
    </main>
  );
}
