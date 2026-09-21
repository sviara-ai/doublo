import { useCallback, useMemo, useState } from 'react';

interface InteractiveProps {
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

interface Interactive {
  hovered: boolean;
  interactiveProps: InteractiveProps;
}

export function useInteractive(): Interactive {
  const [hovered, setHovered] = useState(false);
  const onPointerEnter = useCallback(() => setHovered(true), []);
  const onPointerLeave = useCallback(() => setHovered(false), []);

  const interactiveProps = useMemo(
    () => ({ onPointerEnter, onPointerLeave }),
    [onPointerEnter, onPointerLeave],
  );

  return { hovered, interactiveProps };
}
