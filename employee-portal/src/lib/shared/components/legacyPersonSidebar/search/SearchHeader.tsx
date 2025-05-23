/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import ArrowBackIosOutlined from "@mui/icons-material/ArrowBackIosOutlined";
import { Button, Stack, Typography } from "@mui/joy";

import { formatDate, formatPersonName } from "@eshg/lib-portal";

import { LegacyMinimalPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";

export function SearchHeader(props: {
  searchArgs: LegacyMinimalPerson;
  onBack: () => void;
}) {
  return (
    <>
      <Button
        variant="plain"
        startDecorator={<ArrowBackIosOutlined />}
        sx={{ alignSelf: "start", paddingInline: 0 }}
        onClick={props.onBack}
      >
        Suche ändern
      </Button>

      <Stack>
        <Typography level="body-md">Suchergebnis für:</Typography>
        <Typography level="body-md" sx={{ fontWeight: "bold" }}>
          {`${formatPersonName(props.searchArgs)}, ${formatDate(new Date(props.searchArgs.dateOfBirth))}`}
        </Typography>
      </Stack>
    </>
  );
}
