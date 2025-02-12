/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";

import {
  Cuspid,
  Incisor,
  Molar,
  Premolar,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Teeth";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function TeethPlaygroundPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={"Teeth"} backHref="/playground" />}
    >
      <MainContentLayout>
        <Grid container spacing={2}>
          <Grid xxs={12}>
            <Typography level="h3">Incisor (Schneidezahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Incisor variant="upperJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor variant="upperJaw" />
          </Grid>
          <Grid xxs={1}>
            <Incisor variant="upperJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={1}>
            <Incisor variant="lowerJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor variant="lowerJaw" />
          </Grid>
          <Grid xxs={1}>
            <Incisor variant="lowerJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Cuspid (Eckzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Cuspid variant="upperJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid variant="upperJaw" />
          </Grid>
          <Grid xxs={1}>
            <Cuspid variant="upperJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={1}>
            <Cuspid variant="lowerJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid variant="lowerJaw" />
          </Grid>
          <Grid xxs={1}>
            <Cuspid variant="lowerJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Premolar (Backenzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Premolar variant="upperJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar variant="upperJaw" />
          </Grid>
          <Grid xxs={1}>
            <Premolar variant="upperJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={1}>
            <Premolar variant="lowerJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar variant="lowerJaw" />
          </Grid>
          <Grid xxs={1}>
            <Premolar variant="lowerJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Molar (Mahlzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Molar variant="upperJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Molar variant="upperJaw" />
          </Grid>
          <Grid xxs={1}>
            <Molar variant="upperJaw" hasPreviousExaminationResult />
          </Grid>

          <Grid xxs={1}>
            <Molar variant="lowerJaw" isPrimaryTooth />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
            />
          </Grid>
          <Grid xxs={1}>
            <Molar variant="lowerJaw" />
          </Grid>
          <Grid xxs={1}>
            <Molar variant="lowerJaw" hasPreviousExaminationResult />
          </Grid>
        </Grid>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
