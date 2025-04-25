/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";

import { Cuspid, Incisor, Molar, Premolar } from "@eshg/dental";
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
          title={"Teeth"}
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
            <Incisor
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 7 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 1 }}
            />
          </Grid>

          <Grid xxs={1}>
            <Incisor
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 7 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Incisor
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 1 }}
            />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Cuspid (Eckzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Cuspid
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 5 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 3 }}
            />
          </Grid>

          <Grid xxs={1}>
            <Cuspid
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 5 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Cuspid
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 3 }}
            />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Premolar (Backenzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Premolar
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 3 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 5 }}
            />
          </Grid>

          <Grid xxs={1}>
            <Premolar
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 3 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 2 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 4 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Premolar
              variant="lowerJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q3", toothIndex: 5 }}
            />
          </Grid>

          <Grid xxs={12}>
            <Typography level="h3">Molar (Mahlzahn)</Typography>
          </Grid>

          <Grid xxs={1}>
            <Molar
              variant="upperJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q1", toothIndex: 1 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="upperJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q1", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="upperJaw"
              toothContext={{ quadrantNumber: "Q2", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="upperJaw"
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q2", toothIndex: 7 }}
            />
          </Grid>

          <Grid xxs={1}>
            <Molar
              variant="lowerJaw"
              isPrimaryTooth
              toothContext={{ quadrantNumber: "Q4", toothIndex: 1 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="lowerJaw"
              isPrimaryTooth
              hasPreviousExaminationResult
              toothContext={{ quadrantNumber: "Q4", toothIndex: 0 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Molar
              variant="lowerJaw"
              toothContext={{ quadrantNumber: "Q3", toothIndex: 6 }}
            />
          </Grid>
          <Grid xxs={1}>
            <Molar
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
