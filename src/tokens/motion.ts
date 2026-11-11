export const duration = {
  basic: '150ms',
  reveal: '800ms',
  content: '1200ms',
} as const;

export const easing = {
  enter: [0.19, 1, 0.22, 1],
  exit: [0.8, 0, 0.4, 1],
  move: [0.65, 0, 0.35, 1],
} as const;

export const reducedMotion = { duration: 0, easing: [0, 0, 1, 1] as const };
