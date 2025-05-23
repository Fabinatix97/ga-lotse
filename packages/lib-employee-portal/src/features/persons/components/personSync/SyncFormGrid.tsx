/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowForwardOutlined } from "@mui/icons-material";
import { Chip, Sheet, styled } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

const gridLines = {
  before: "before",
  divider: "divider",
  after: "after",
} as const;

export function SyncFormGrid({ children }: RequiresChildren) {
  return (
    <StyledGrid data-testid="syncFormGrid">
      <ChangeSetLabel type="OLD" />
      <ChangeSetLabel type="NEW" />

      {children}
    </StyledGrid>
  );
}

const StyledGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns:
    `[${gridLines.before}] minmax(auto, 450px) ` +
    `[${gridLines.divider}] min-content ` +
    `[${gridLines.after}] minmax(auto, 450px)`,
  rowGap: theme.spacing(1),
  columnGap: theme.spacing(5),
  flex: "0 1",
}));

function ChangeSetLabel({ type }: { type: "NEW" | "OLD" }) {
  return (
    <Chip
      sx={{
        "--Chip-radius": "6px",
        gridColumn: type === "OLD" ? gridLines.before : gridLines.after,
      }}
      size="sm"
      color={type === "OLD" ? "neutral" : "primary"}
      variant="solid"
    >
      {type === "OLD" ? "Alt" : "Neu"}
    </Chip>
  );
}

export const SyncFormSection = styled("div")({
  display: "contents",
  "& > :first-child": {
    opacity: 0.6,
  },
});

export const SyncFormBlock = styled(Sheet)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  padding: theme.spacing(1),
}));

export function DiffArrow() {
  return (
    <ArrowForwardOutlined
      size="lg"
      sx={{
        userSelect: "all",
        alignSelf: "center",
        maxWidth: "fit-content",
        gridColumn: gridLines.divider,
      }}
      titleAccess="geändert zu"
      aria-label="geändert zu"
      aria-hidden={false}
    />
  );
}
