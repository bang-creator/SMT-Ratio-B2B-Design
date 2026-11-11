# E9 fonts

Source: E2 `raw/css-index.json` plus E8 `analysis/fonts.json`.

## Platform declarations

- `OpenAI Sans` 400 normal — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2)format("woff2")
- `OpenAI Sans` 400 italic — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-RegularItalic.woff2)format("woff2")
- `OpenAI Sans` 500 normal — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2)format("woff2")
- `OpenAI Sans` 500 italic — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-MediumItalic.woff2)format("woff2")
- `OpenAI Sans` 600 normal — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Semibold.woff2)format("woff2")
- `OpenAI Sans` 600 italic — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-SemiboldItalic.woff2)format("woff2")
- `OpenAI Sans` 700 normal — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2)format("woff2")
- `OpenAI Sans` 700 italic — url(https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-BoldItalic.woff2)format("woff2")

## Runtime families

- `Super Sans VF` 100 900 normal — unloaded
- `Super Sans VF` 100 900 italic — unloaded
- `Inter` 900 normal — unloaded
- `Inter` 900 italic — unloaded
- `Inter` 700 normal — loaded
- `Inter` 700 italic — unloaded
- `Inter` 800 normal — unloaded
- `Inter` 800 italic — unloaded
- `Inter` 200 normal — unloaded
- `Inter` 200 italic — unloaded
- `Inter` 400 italic — unloaded
- `Inter` 300 normal — unloaded
- `Inter` 300 italic — unloaded
- `Inter` 500 normal — unloaded
- `Inter` 500 italic — unloaded
- `Inter` 400 normal — loaded
- `Inter` 600 normal — unloaded
- `Inter` 600 italic — unloaded
- `Inter var` 100 900 italic — unloaded
- `Inter var` 100 900 normal — unloaded
- `OpenAI Sans` 400 normal — loaded
- `OpenAI Sans` 400 italic — unloaded
- `OpenAI Sans` 500 normal — loaded
- `OpenAI Sans` 500 italic — unloaded
- `OpenAI Sans` 600 normal — loaded
- `OpenAI Sans` 600 italic — unloaded
- `OpenAI Sans` 700 normal — unloaded
- `OpenAI Sans` 700 italic — unloaded

D3 recommendation: use **OpenAI Sans** for platform fidelity. Keep fallback `helvetica, sans-serif`. `Inter`/`Super Sans VF` are observed runtime declarations but not selected.
