#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${ROOT}/docker-contexts"

rm -rf "${DEST}"
mkdir -p "${DEST}"

copied=0
while IFS= read -r dockerfile; do
  context="$(dirname "${dockerfile}")"
  name="$(basename "$(dirname "$(dirname "${context}")")")"
  target="${DEST}/${name}"
  mkdir -p "${target}"
  cp -a "${context}/." "${target}/"
  echo "Context: ${name}"
  copied=$((copied + 1))
done < <(find "${ROOT}/backend" "${ROOT}/apps" -path '*/build/docker/Dockerfile' | sort)

if [ "${copied}" -eq 0 ]; then
  echo "No Docker contexts found. Run prepareDockerContext first." >&2
  exit 1
fi

echo "Collected ${copied} contexts in ${DEST}"
