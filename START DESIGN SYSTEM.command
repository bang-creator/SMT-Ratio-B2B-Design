#!/bin/zsh
set -u

DS_DIR="/Users/bangworkinghub/Documents/OpenAI Design System"
cd "$DS_DIR" || exit 1

npm run storybook &
PID=$!
sleep 4
open "http://127.0.0.1:6006"
wait "$PID"
