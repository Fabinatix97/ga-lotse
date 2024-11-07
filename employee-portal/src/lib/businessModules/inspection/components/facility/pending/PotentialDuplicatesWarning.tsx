/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { WarningAmberOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";

export interface PotentialDuplicatesWarningProps {
  numberOfDuplicates: number;
  filterForDuplicates: () => void;
}

export function PotentialDuplicatesWarning({
  numberOfDuplicates,
  filterForDuplicates,
}: Readonly<PotentialDuplicatesWarningProps>) {
  return (
    <Sheet
      sx={{
        padding: 2,
        borderRadius: (theme) => theme.radius.sm,
        border: "1px solid",
        borderColor: "warning.300",
        backgroundColor: "warning.100",
        marginBottom: 2,
      }}
      aria-label={"Einrichtung"}
    >
      <ButtonBar
        left={
          <Stack direction="row" gap={1}>
            <WarningAmberOutlined sx={{ color: "warning.600" }} />{" "}
            <Typography sx={{ color: "warning.600" }}>
              {numberOfDuplicates} potentielle{numberOfDuplicates == 1 && "s"}{" "}
              Duplikat
              {numberOfDuplicates != 1 && "e"}
            </Typography>
          </Stack>
        }
        right={
          <ButtonLink
            underline="none"
            color="neutral"
            textColor={"warning.600"}
            fontWeight="lg"
            onClick={filterForDuplicates}
            sx={{ color: "warning.600" }}
          >
            FILTERN
          </ButtonLink>
        }
      />
    </Sheet>
  );
}
