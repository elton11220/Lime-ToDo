import {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';

type RendererType = 'svg' | 'canvas' | 'html';

interface LottieProps {
  loop?: boolean;
  renderer?: RendererType;
  autoplay?: boolean;
  // Animation rendering data, mutually exclusive with path
  animationData?: any;
  // JSON file path, mutually exclusive with animation data
  path?: string;
  size?: string;
}

export default forwardRef((props: LottieProps, ref: Ref<any>) => {
  const {
    loop = true,
    renderer = 'svg',
    path = '',
    animationData,
    autoplay = true,
    size = '100%',
  } = props;

  const containerEle = useRef<HTMLDivElement>(null);
  const lottieAnimation = useRef<AnimationItem | null>(null);

  useImperativeHandle(ref, () => ({
    getInstance: () => lottieAnimation.current,
    play: () => {
      lottieAnimation.current?.play();
    },
    pause: () => {
      lottieAnimation.current?.pause();
    },
    stop: () => {
      lottieAnimation.current?.stop();
    },
  }));

  const animationOptions = useMemo(() => {
    const options: LottieProps = {
      loop,
      renderer,
      autoplay,
    };

    if (animationData) {
      options.animationData = animationData;
    } else {
      options.path = path;
    }

    return options;
  }, [loop, renderer, path, animationData, autoplay]);

  useEffect(() => {
    if (!containerEle.current) {
      return;
    }

    const lottieAnimationItem: AnimationItem = lottie.loadAnimation({
      container: containerEle.current,
      ...animationOptions,
    });
    lottieAnimation.current = lottieAnimationItem;

    return () => {
      lottieAnimation.current = null;
      lottieAnimationItem.destroy();
    };
  }, [animationOptions]);

  return <div ref={containerEle} style={{ width: size, height: size }} />;
});
