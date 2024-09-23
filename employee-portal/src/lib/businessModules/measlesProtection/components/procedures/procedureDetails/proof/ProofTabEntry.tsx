/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import { ValueList } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/LabeledValue";

interface ProofTabEntryProps {
  children: ReactNode;
  rowLayout?: boolean;
}
export function ProofTabEntry({
  children,
  rowLayout,
}: Readonly<ProofTabEntryProps>) {
  return (
    <ValueList
      rowLayout={rowLayout}
      sx={(theme) => ({
        flexBasis: "auto",
        background: theme.palette.background.level1,
        borderRadius: theme.radius.md,
        padding: {
          xxs: theme.spacing(2),
        },
        width: "100%",
      })}
    >
      {children}
    </ValueList>
  );
}
