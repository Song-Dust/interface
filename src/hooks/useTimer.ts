import useNow from 'hooks/useNow';
import { useEffect, useState } from 'react';

export default function useTimer(deadline: number | undefined) {
  const [timer, setTimer] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const now = useNow();
  useEffect(() => {
    if (deadline) {
      const days = Math.floor((deadline - now) / 86400);
      const hours = Math.floor((deadline - now - days * 86400) / 3600);
      const minutes = Math.floor((deadline - now - days * 86400 - hours * 3600) / 60);
      const seconds = Math.floor(deadline - now - days * 86400 - hours * 3600 - minutes * 60);
      setTimer({
        days: days < 10 ? '0' + days : String(days),
        hours: hours < 10 ? '0' + hours : String(hours),
        minutes: minutes < 10 ? '0' + minutes : String(minutes),
        seconds: seconds < 10 ? '0' + seconds : String(seconds),
      });
    }
  }, [now, deadline]);

  return timer;
}
