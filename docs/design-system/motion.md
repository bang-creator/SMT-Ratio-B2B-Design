# Motion contract

| Pattern | Duration | Easing | Reduced motion |
|---|---:|---|---|
| Button color/opacity | 150ms | ease | immediate color change |
| Menu/popover enter | 150ms | enter cubic bezier | no transform |
| Content reveal | 800ms | linear | opacity/transform removed |
| Streaming/loading rhythm | 1200ms | linear | static indicator |
| Layout move | 300ms | move cubic bezier | snap to final layout |

Runtime evidence: 206 observations; 150ms (53), 800ms (21), 1200ms (124). Full raw analysis: `ds-extraction/analysis/motion.json`.
