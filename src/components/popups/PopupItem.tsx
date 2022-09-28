import { useCallback, useEffect } from 'react';

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
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup]);
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
    popupContent = <TransactionPopup hash={hash} />;
  }

  return (
    <div>
      {/*<button onClick={removeThisPopup} />*/}
      {popupContent}
    </div>
  );
}
