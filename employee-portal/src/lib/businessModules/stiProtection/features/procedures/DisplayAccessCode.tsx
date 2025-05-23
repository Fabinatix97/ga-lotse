/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal";

export function DisplayAccessCode({
  code,
  bold,
}: {
  code: string | undefined;
  bold?: boolean;
}) {
  if (!code) {
    return null;
  }
  const partSize = 4;
  const parts = new Array(Math.ceil(code.length / partSize))
    .fill(0)
    .map((_, index) =>
      code.slice(index * partSize, index * partSize + partSize),
    );

  return (
    <Row
      component="span"
      aria-label={parts.join(" ")}
      gap={0.5}
      fontFamily="code"
      fontWeight={bold ? 600 : 400}
    >
      {parts.map((p, i) => (
        <span key={i}>{p}</span>
      ))}
    </Row>
  );
}
