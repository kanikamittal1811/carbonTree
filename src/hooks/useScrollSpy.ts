import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

/**
 * A reusable scroll-spy hook that tracks which section is currently in view
 * and provides smooth-scroll navigation to sections.
 *
 * @param sectionIds - Ordered array of section identifiers (first is the default).
 * @returns { activeSection, sectionRefs, scrollToSection }
 */
export function useScrollSpy<T extends string>(sectionIds: readonly T[]) {
  const [activeSection, setActiveSection] = useState<T>(sectionIds[0]);

  // Build a stable ref map: { sectionId: RefObject<HTMLDivElement> }
  const sectionRefs = useRef(
    Object.fromEntries(sectionIds.map((id) => [id, { current: null }])) as Record<
      T,
      RefObject<HTMLDivElement>
    >
  ).current;

  const scrollToSection = useCallback(
    (section: T) => {
      setActiveSection(section);
      const ref = sectionRefs[section];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [sectionRefs]
  );

  useEffect(() => {
    const getOffset = (ref: RefObject<HTMLDivElement>) => {
      if (!ref.current) return Infinity;
      return ref.current.offsetTop - 160;
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition < 50) {
        setActiveSection(sectionIds[0]);
        return;
      }

      // Walk sections in reverse to find the deepest one we've scrolled past
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const offset = getOffset(sectionRefs[sectionId]);
        if (scrollPosition >= offset - 50) {
          setActiveSection(sectionId);
          return;
        }
      }

      setActiveSection(sectionIds[0]);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [sectionIds, sectionRefs]);

  return { activeSection, sectionRefs, scrollToSection };
}
