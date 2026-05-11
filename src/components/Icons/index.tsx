/**
 * アイコンコンポーネント集
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const SettingsIcon = (props: IconProps) => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4m0 14v4M1 12h4m14 0h4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83" />
  </svg>
);

export const PlayIcon = (props: IconProps) => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = (props: IconProps) => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

export const SwapIcon = (props: IconProps) => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

export const ResetIcon = (props: IconProps) => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);
