#!/usr/bin/env python3
"""Extract captured E1 reference screenshots from REA JSON evidence."""
from __future__ import annotations

import base64
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / "ds-extraction" / "captures" / "pages" / "e1"
OUT = ROOT / "reports" / "fidelity" / "reference"
TARGETS = {
    "home__1440x900__light": "home",
    "responses__1440x900__light": "responses",
    "agents-vault__1440x900__light": "agents",
    "usage__1440x900__light": "usage",
}


def find_screenshots(value: object):
    if isinstance(value, dict):
        screenshot = value.get("screenshot")
        if isinstance(screenshot, dict):
            nested = screenshot.get("value")
            if isinstance(nested, dict) and nested.get("data_base64"):
                yield nested["data_base64"]
        for child in value.values():
            yield from find_screenshots(child)
    elif isinstance(value, list):
        for child in value:
            yield from find_screenshots(child)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for stem, name in TARGETS.items():
        source = CAPTURES / f"{stem}.json"
        data = json.loads(source.read_text())
        encoded = next(find_screenshots(data), None)
        if not encoded:
            raise SystemExit(f"No screenshot artifact in {source}")
        destination = OUT / f"{name}-1440-light.png"
        destination.write_bytes(base64.b64decode(encoded))
        print(destination)


if __name__ == "__main__":
    main()
