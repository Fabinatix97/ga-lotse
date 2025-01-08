/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import ArrowBackIosOutlined from "@mui/icons-material/ArrowBackIosOutlined";
import { Button, Stack, Typography } from "@mui/joy";

export function SearchHeader(props: { search: string; onBack: () => void }) {
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
        <Typography level="body-md" id="search-result">
          Suchergebnis für:
        </Typography>
        <Typography
          level="body-md"
          sx={{ fontWeight: "bold" }}
          aria-labelledby="search-result"
        >
          {props.search}
        </Typography>
      </Stack>
    </>
  );
}
