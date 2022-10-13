import { useCallback, useEffect, useState } from 'react';

import { useRemovePopup } from '../../state/application/hooks';
import { PopupContent } from '../../state/application/reducer';
import TransactionPopup from './TransactionPopup';

export default function PopupItem({
  removeAfterMs,
  content,
  popKey,
}: {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
}) {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(() => {
    setShow(false);
    setTimeout(() => removePopup(popKey), 500);
  }, [popKey, removePopup]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 500);
  }, []);

  useEffect(() => {
    if (removeAfterMs === null) return undefined;

    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeAfterMs, removeThisPopup]);

  let popupContent;
  if ('txn' in content) {
    const {
      txn: { hash },
    } = content;
    popupContent = <TransactionPopup hash={hash} show={show} />;
  }

  return (
    <div>
      {/*<button onClick={removeThisPopup} />*/}
      {popupContent}
    </div>
  );
}
