#!/usr/bin/env bash
# humanize-korean 스킬(epoko77-ai/im-not-ai)을 이 프로젝트 안에 설치한다. git에는 올라가지 않는다.
# 사용법: bash .agents/setup-humanize-korean.sh [claude|codex]
set -euo pipefail

COMMIT=b37e0206d31fffd9149bf57168d4d62eb2086bee # v2.3.2. 올릴 때는 바뀐 내용을 읽고 이 값을 고친다.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

case "${1:-claude}" in
  claude) export CLAUDE_HOME="$ROOT/.claude"; only=--claude-only; dest="$CLAUDE_HOME" ;;
  codex) export CODEX_HOME="$ROOT/.agents"; only=--codex-only; dest="$CODEX_HOME" ;;
  *) echo "사용법: $0 [claude|codex]" >&2; exit 2 ;;
esac

if [ -f "$dest/skills/humanize-korean/SKILL.md" ]; then
  echo "이미 설치됨: $dest/skills/humanize-korean"
  exit 0
fi

src="$(mktemp -d)"
trap 'rm -rf "$src"' EXIT
git -C "$src" init -q
git -C "$src" fetch -q --depth 1 https://github.com/epoko77-ai/im-not-ai.git "$COMMIT"
git -C "$src" checkout -q FETCH_HEAD
bash "$src/install.sh" "$only" --copy
