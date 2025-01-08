/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Box, Button, Divider, Sheet, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

export interface FilterSettingsSheetProps {
  id?: string;
  onApply?: () => void;
  isDirty?: boolean;
  scalingWidth?: boolean;
  filterConditionsMet?: boolean;
  errorMessages?: string[];
}

export function FilterSettingsSheet({
  id,
  children,
  onApply,
  isDirty,
  scalingWidth,
  filterConditionsMet = true,
  errorMessages,
}: FilterSettingsSheetProps & RequiresChildren) {
  return (
    <Sheet
      id={id}
      sx={{
        width: scalingWidth ? "100%" : 250,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
      data-testid="filterSheet"
    >
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        <Stack
          sx={{
            flex: 1,
            overflowY: "auto",
            paddingBlock: 2,
          }}
        >
          <Stack sx={{ paddingInline: 2 }}>
            {children}
            <Box sx={{ mt: 2 }}></Box>
            {isDefined(errorMessages) &&
              errorMessages.map((errorMessage, index) => (
                <Typography key={index} level="body-xs" color="danger">
                  {errorMessage}
                </Typography>
              ))}
          </Stack>{" "}
        </Stack>
        {isDefined(onApply) && isDirty && filterConditionsMet && (
          <>
            <Divider />
            <Stack padding={2} paddingTop={1}>
              <Button onClick={onApply}>Filter anwenden</Button>
            </Stack>
          </>
        )}
      </Stack>
    </Sheet>
  );
}
