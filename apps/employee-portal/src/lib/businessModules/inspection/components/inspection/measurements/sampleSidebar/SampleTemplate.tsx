/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Grid,
  List,
  ListItem,
  Radio,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";

import { ApiInspectionSampleMeasurementParameterTemplate } from "@eshg/inspection-api";
import { ButtonLink } from "@eshg/lib-portal";

export function SampleTemplate({
  title,
  parameters,
  index,
  selectedIndex,
  action,
}: {
  title: string;
  parameters: ApiInspectionSampleMeasurementParameterTemplate[];
  index: number;
  selectedIndex: number | null;
  action: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      variant="outlined"
      sx={{
        padding: 2,
        borderRadius: "lg",
        display: "flex",
        flexDirection: "column",
        backgroundColor: selectedIndex === index ? "#F0F4F8" : "transparent",
      }}
    >
      <Grid container spacing={2} sx={{ display: "flex" }} alignItems="center">
        <Grid>
          <Radio
            checked={selectedIndex === index}
            value={index}
            onChange={() => action(index)}
          />
        </Grid>
        <Grid>
          <Typography level="title-md">{title}</Typography>

          <ButtonLink
            underline="always"
            level="body-md"
            onClick={() => setOpen(!open)}
          >
            {open ? "Messparameter ausblenden" : "Messparameter anzeigen"}
          </ButtonLink>

          {open && (
            <Stack>
              <List marker="disc">
                {parameters.map((param, index) => (
                  <ListItem key={index}>
                    <Typography level="body-md">
                      {param.parameterName}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Sheet>
  );
}
