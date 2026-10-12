import "./TrackImage.style.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"

interface TrackImageProps {
    imageURL?: string | null
    onPlayStateChanged: () => void
}

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type SyntheticEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';

const DURATION = 550;
const DELAY_RIPPLE = 80;

interface RippleItem {
  key: number;
  size: number;
  x: number;
  y: number;
  pulsate: boolean;
  leaving: boolean;
}

interface CommitParams {
  pulsate: boolean;
  rippleX: number;
  rippleY: number;
  rippleSize: number;
}

interface StartOptions {
  pulsate?: boolean;
  center?: boolean;
}

type StartEvent = ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement>;

export interface RippleProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  as?: ElementType;
  center?: boolean;
  disabled?: boolean;
  color?: string;
}

export default function Ripple({
  as: Tag = 'div',
  center = false,
  disabled = false,
  color,
  className,
  style,
  children,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onDragLeave,
  onBlur,
  onContextMenu,
  ...other
}: RippleProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const nextKey = useRef(0);
  const activeKeys = useRef<number[]>([]);
  const ignoringMouseDown = useRef(false);
  const startTimer = useRef<number|undefined>(undefined);
  const startTimerCommit = useRef<(() => void) | null>(null);
  const removeTimers = useRef(new Set<number>());

  useEffect(() => {
    const timers = removeTimers.current;
    return () => {
      clearTimeout(startTimer.current);
      timers.forEach(clearTimeout);
    };
  }, []);

  const startCommit = useCallback(
    ({ pulsate, rippleX, rippleY, rippleSize }: CommitParams) => {
      const key = nextKey.current++;
      activeKeys.current.push(key);
      setRipples((old) => [
        ...old,
        { key, pulsate, leaving: false, size: rippleSize, x: rippleX, y: rippleY },
      ]);
    },
    [],
  );

  const start = useCallback(
    (event?: StartEvent, options: StartOptions = {}) => {
      const { pulsate = false, center: centerOpt = center || options.pulsate } = options;

      if (event?.type === 'mousedown' && ignoringMouseDown.current) {
        ignoringMouseDown.current = false;
        return;
      }
      if (event?.type === 'touchstart') {
        ignoringMouseDown.current = true;
      }

      const element = rootRef.current;
      const rect = element
        ? element.getBoundingClientRect()
        : { width: 0, height: 0, left: 0, top: 0 };

      const touches = event && 'touches' in event ? event.touches : undefined;
      const mouse = event && !touches ? (event as ReactMouseEvent<HTMLElement>) : undefined;

      let rippleX: number;
      let rippleY: number;
      let rippleSize: number;

      if (
        centerOpt ||
        !event ||
        (mouse && mouse.clientX === 0 && mouse.clientY === 0) ||
        (!mouse?.clientX && !touches)
      ) {
        rippleX = Math.round(rect.width / 2);
        rippleY = Math.round(rect.height / 2);
      } else {
        const point = touches && touches.length > 0 ? touches[0] : mouse!;
        rippleX = Math.round(point.clientX - rect.left);
        rippleY = Math.round(point.clientY - rect.top);
      }

      if (centerOpt) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
        if (rippleSize % 2 === 0) rippleSize += 1;
      } else {
        const sizeX =
          Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
        const sizeY =
          Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
      }

    //   rippleSize *= 1.2

      if (touches) {
        if (startTimerCommit.current === null) {
          startTimerCommit.current = () =>
            startCommit({ pulsate, rippleX, rippleY, rippleSize });
          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          }, DELAY_RIPPLE);
        }
      } else {
        startCommit({ pulsate, rippleX, rippleY, rippleSize });
      }
    },
    [center, startCommit],
  );

  const stop = useCallback((event?: SyntheticEvent) => {
    clearTimeout(startTimer.current);

    if (event?.type === 'touchend' && startTimerCommit.current) {
      startTimerCommit.current();
      startTimerCommit.current = null;
      startTimer.current = setTimeout(() => stop(), 0);
      return;
    }
    startTimerCommit.current = null;

    const key = activeKeys.current.shift();
    if (key === undefined) return;

    setRipples((old) => old.map((r) => (r.key === key ? { ...r, leaving: true } : r)));

    const timer = setTimeout(() => {
      removeTimers.current.delete(timer);
      setRipples((old) => old.filter((r) => r.key !== key));
    }, DURATION);
    removeTimers.current.add(timer);
  }, []);

  const handler =
    <E extends SyntheticEvent>(user: ((e: E) => void) | undefined, action: (e: E) => void) =>
    (event: E) => {
      user?.(event);
      if (!disabled && !event.defaultPrevented) action(event);
    };

  const rootStyle = color
    ? ({ '--ripple-color': color, ...style } as CSSProperties)
    : style;

  return (
    <Tag
      {...other}
      className={className ? `ripple ${className}` : 'ripple'}
      style={rootStyle}
      onMouseDown={handler<ReactMouseEvent<HTMLElement>>(onMouseDown, (e) => start(e))}
      onMouseUp={handler(onMouseUp, stop)}
      onMouseLeave={handler(onMouseLeave, stop)}
      onTouchStart={handler<ReactTouchEvent<HTMLElement>>(onTouchStart, (e) => start(e))}
      onTouchEnd={handler(onTouchEnd, stop)}
      onTouchMove={handler(onTouchMove, stop)}
      onDragLeave={handler(onDragLeave, stop)}
      onBlur={handler(onBlur, stop)}
      onContextMenu={handler(onContextMenu, stop)}
    >
      {children}
      {!disabled && (
        <span className="ripple__root" ref={rootRef}>
          {ripples.map(({ key, size, x, y, pulsate, leaving }) => (
            <span
              key={key}
              className={`ripple__wave${pulsate ? ' ripple__wave--pulsate' : ''}`}
              style={{
                width: size,
                height: size,
                top: -(size / 2) + y,
                left: -(size / 2) + x,
              }}
            >
              <span
                className={
                  'ripple__child' +
                  (leaving ? ' ripple__child--leaving' : '') +
                  (pulsate ? ' ripple__child--pulsate' : '')
                }
              />
            </span>
          ))}
        </span>
      )}
    </Tag>
  );
}

export function TrackImage(props: TrackImageProps) {
    let className = "track-image-component"
    if (props.imageURL == null) className += " track-image-component__empty"

    const child = props.imageURL
        ? <img src={ENV.APP_URL + props.imageURL} draggable="false" />
        : <HideImageRounded />
    
    return (
        <Ripple style={{ borderRadius: 8 }} color="#fff" onClick={() => {}}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzr_YBABXS82Plgkw-C2hrACcCZlK06EdLaGu8DYJITw&s=10" alt="" style={{ display: 'block', width: 300, borderRadius: 'inherit' }} draggable={false} />
        </Ripple>
    )

    return (
        <div
            className={className}
            children={child}
            onPointerUp={(e) => e.button == 0 && props.onPlayStateChanged()}
        />
    )
}