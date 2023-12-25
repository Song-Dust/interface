import { useEffect, useState } from 'react';

export default function useNow() {
  const [now, setNow] = useState(new Date().getTime() / 1000);
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime() / 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return now;
}
