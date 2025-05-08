/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

interface SummaryItemProps {
  content: string;
  color: "success" | "primary" | "danger";
}

export function SummaryItem(props: SummaryItemProps) {
  return (
    <Alert
      aria-live="polite"
      variant="soft"
      color={props.color}
      sx={{ padding: 1 }}
      message={props.content}
    />
  );
}
