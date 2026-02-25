import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

const getThemeClasses = (theme) => {
  if (theme === 'light') {
    return 'bg-white/95 text-slate-800 border-slate-300 shadow-[0_24px_60px_rgba(15,23,42,0.18)]';
  }
  return 'bg-slate-900/95 text-slate-100 border-slate-600 shadow-xl';
};

const HelpPopover = ({
  id,
  text,
  activeId,
  setActiveId,
  isRtl = false,
  theme = 'dark',
  ariaLabel,
  width = 280,
  estimatedHeight = 130,
  buttonClassName = 'text-slate-400 hover:text-slate-200',
  iconClassName = 'w-4 h-4',
  label = null,
  stopPropagation = true,
  as = 'button'
}) => {
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const isOpen = activeId === id;
  const [anchorRect, setAnchorRect] = useState(null);

  const updateRect = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setAnchorRect(rect);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    updateRect();

    const onScroll = () => updateRect();
    const onResize = () => updateRect();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    const onMouseDown = (event) => {
      const target = event.target;
      if (buttonRef.current && buttonRef.current.contains(target)) return;
      if (popoverRef.current && popoverRef.current.contains(target)) return;
      setActiveId?.(null);
    };
    document.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isOpen, setActiveId]);

  const tooltip = (() => {
    if (!isOpen || !anchorRect) return null;

    const padding = 12;

    let left = isRtl ? anchorRect.right - width : anchorRect.left;
    left = Math.min(Math.max(padding, left), window.innerWidth - width - padding);

    let top = anchorRect.bottom + 8;
    if (top + estimatedHeight > window.innerHeight - padding) {
      top = anchorRect.top - 8 - estimatedHeight;
    }
    top = Math.min(Math.max(padding, top), window.innerHeight - estimatedHeight - padding);

    return createPortal(
      <div
        ref={popoverRef}
        className={`text-xs rounded-xl border p-3 backdrop-blur-sm ${getThemeClasses(theme)} whitespace-pre-wrap`}
        style={{ position: 'fixed', top, left, width, zIndex: 220 }}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {text}
      </div>,
      document.body
    );
  })();

  const handleToggle = (event) => {
    if (stopPropagation) event.stopPropagation();
    setActiveId?.(isOpen ? null : id);
  };

  const content = (
    <span className={`inline-flex items-center ${label ? 'gap-2' : ''}`}>
      <HelpCircle className={iconClassName} />
      {label}
    </span>
  );

  return (
    <span className="inline-flex">
      {as === 'span' ? (
        <span
          ref={buttonRef}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            handleToggle(e);
          }}
          className={buttonClassName}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label={ariaLabel || 'Help'}
        >
          {content}
        </span>
      ) : (
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={buttonClassName}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label={ariaLabel || 'Help'}
          type="button"
        >
          {content}
        </button>
      )}
      {tooltip}
    </span>
  );
};

export default HelpPopover;
