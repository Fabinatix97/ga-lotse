/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";

import { CuspidIcon, IncisorIcon, MolarIcon, PremolarIcon } from "@eshg/dental";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

export default function TeethPlaygroundPage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Teeth"
          backButton={<ToolbarBackButton href="/playground" />}
        />
      }
    >
      <MainContentLayout>
        <Grid container spacing={2}>
          <Grid xxs={12}>
            <Typography level="h3">Incisor (Schneidezahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <IncisorIcon
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 7 }}
            />
          </Grid>
          <Grid xxs={1}>
            <IncisorIcon
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <IncisorIcon
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <IncisorIcon
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 1 }}
            />
          </Grid>

          <Grid xxs={1}>
            <IncisorIcon
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <IncisorIcon
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 7 }}
            />
          </Grid>
          <Grid xxs={1}>
            <IncisorIcon
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <IncisorIcon
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 1 }}
            />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Cuspid (Eckzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <CuspidIcon
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 5 }}
            />
          </Grid>
          <Grid xxs={1}>
            <CuspidIcon
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <CuspidIcon
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <CuspidIcon
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 3 }}
            />
          </Grid>

          <Grid xxs={1}>
            <CuspidIcon
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 5 }}
            />
          </Grid>
          <Grid xxs={1}>
            <CuspidIcon
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <CuspidIcon
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <CuspidIcon
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 3 }}
            />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Premolar (Backenzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <PremolarIcon
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 3 }}
            />
          </Grid>
          <Grid xxs={1}>
            <PremolarIcon
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <PremolarIcon
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <PremolarIcon
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 5 }}
            />
          </Grid>

          <Grid xxs={1}>
            <PremolarIcon
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 3 }}
            />
          </Grid>
          <Grid xxs={1}>
            <PremolarIcon
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <PremolarIcon
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <PremolarIcon
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 5 }}
            />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Molar (Mahlzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <MolarIcon
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 1 }}
            />
          </Grid>
          <Grid xxs={1}>
            <MolarIcon
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <MolarIcon
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <MolarIcon
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 7 }}
            />
          </Grid>

          <Grid xxs={1}>
            <MolarIcon
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 1 }}
            />
          </Grid>
          <Grid xxs={1}>
            <MolarIcon
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <MolarIcon
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <MolarIcon
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 7 }}
            />
          </Grid>
        </Grid>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
