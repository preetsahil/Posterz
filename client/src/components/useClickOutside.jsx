import { useEffect } from 'react';

function useClickOutside(ref, callback) {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
        console.log(e.target);
        console.log(ref.current);
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}

export default useClickOutside;