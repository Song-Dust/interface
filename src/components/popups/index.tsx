import { useActivePopups } from '../../state/application/hooks';
import PopupItem from './PopupItem';

export default function Popups() {
  // get all popups
  const activePopups = useActivePopups();

  return (
    <>
      {activePopups // reverse so new items up front
        .slice(0)
        .reverse()
        .map((item) => (
          <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
        ))}
    </>
  );
}
