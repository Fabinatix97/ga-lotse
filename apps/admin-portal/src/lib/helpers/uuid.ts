/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const uuidV4Re =
  /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/;

function extractUuid(str: string | undefined): string | undefined {
  return str?.match(uuidV4Re)?.[0];
}

export function partitionByUuids(str: string | undefined): string[] {
  let input = str;
  let id;
  const result: string[] = [];
  while ((id = extractUuid(input))) {
    const [pre, post] = input!.split(id, 2);
    result.push(pre ?? "");
    result.push(id);
    input = post;
  }
  result.push(input ?? "");
  return result;
}
