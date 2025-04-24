/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

interface ExaminationFormLayoutProps {
  additionalInformation: ReactNode;
  childInformation: ReactNode;
  dentalExamination?: ReactNode;
  note: ReactNode;
}

export function ExaminationFormLayout(props: ExaminationFormLayoutProps) {
  return (
    <Grid container spacing={3}>
      <Grid xxs={12} md={3} alignContent="flex-start">
        <Grid container spacing={3} columns={12}>
          <Grid xxs={6} md={12}>
            {props.additionalInformation}
          </Grid>
          <Grid xxs={6} md={12}>
            {props.childInformation}
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} md={9} alignContent="flex-start">
        <Grid container spacing={3} columns={12}>
          {isDefined(props.dentalExamination) && (
            <Grid xxs={12}>{props.dentalExamination}</Grid>
          )}
          <Grid xxs={12}>{props.note}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
