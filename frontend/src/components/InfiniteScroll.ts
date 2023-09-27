import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = () => {
  const loaderRef = useRef<Element | false>(false);
  const [converge, setConverge] = useState<boolean>(false);

  useEffect(() => {
    const currentLoaderElement = loaderRef.current;
    const currentObserver = new IntersectionObserver(
      (entries) => {
        const [loader] = entries;
        if (loader.isIntersecting) {
          setConverge(true);
        }
      },
      { threshold: 1 }
    );

    if (currentLoaderElement) {
      currentObserver.observe(currentLoaderElement);
    }
    return () => {
      if (currentLoaderElement) {
        currentObserver.unobserve(currentLoaderElement);
      }
    };
  }, [loaderRef]);

  return [loaderRef, converge, setConverge] as const;
};

export default useInfiniteScroll;
