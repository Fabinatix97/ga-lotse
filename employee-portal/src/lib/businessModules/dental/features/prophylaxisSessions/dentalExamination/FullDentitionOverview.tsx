/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Grid, GridProps, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useId } from "react";

import { Quadrant } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Quadrant";
import {
  QuadrantHeading,
  QuadrantHeadingRow,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/QuadrantHeading";
import { ToothIcon } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Teeth";
import { ToothNumber } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/ToothNumber";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import {
  QuadrantNumber,
  Tooth,
  isToothWithDiagnosis,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export function FullDentitionOverview() {
  const upperJawRightId = useId();
  const upperJawLeftId = useId();
  const lowerJawRightId = useId();
  const lowerJawLeftId = useId();
  return (
    <Stack>
      <QuadrantHeadingRow marginBottom="24px">
        <QuadrantHeading
          name="Oberkiefer rechts"
          index={1}
          id={upperJawRightId}
        />
        <QuadrantHeading
          name="Oberkiefer links"
          index={2}
          id={upperJawLeftId}
        />
      </QuadrantHeadingRow>
      <Grid container>
        <QuadrantSection
          quadrantNumber="Q1"
          aria-labelledby={upperJawRightId}
        />
        <QuadrantSection quadrantNumber="Q2" aria-labelledby={upperJawLeftId} />
      </Grid>
      <Grid container>
        <QuadrantSection
          quadrantNumber="Q4"
          aria-labelledby={lowerJawRightId}
        />
        <QuadrantSection quadrantNumber="Q3" aria-labelledby={lowerJawLeftId} />
      </Grid>
      <QuadrantHeadingRow>
        <QuadrantHeading
          name="Unterkiefer rechts"
          index={4}
          id={lowerJawRightId}
        />
        <QuadrantHeading
          name="Unterkiefer links"
          index={3}
          id={lowerJawLeftId}
        />
      </QuadrantHeadingRow>
    </Stack>
  );
}

interface QuadrantSectionProps extends GridProps {
  quadrantNumber: QuadrantNumber;
}

function QuadrantSection(props: QuadrantSectionProps) {
  const quadrantNumber = props.quadrantNumber;
  const styles: SxProps = {
    padding:
      quadrantNumber === "Q1" || quadrantNumber === "Q4"
        ? "20px 20px 20px 0"
        : "20px 0 20px 20px",
    borderTop:
      quadrantNumber === "Q3" || quadrantNumber === "Q4"
        ? "0.5px solid black"
        : "none",
    borderRight:
      quadrantNumber === "Q1" || quadrantNumber === "Q4"
        ? "0.5px solid black"
        : "none",
    borderBottom:
      quadrantNumber === "Q1" || quadrantNumber === "Q2"
        ? "0.5px solid black"
        : "none",
    borderLeft:
      quadrantNumber === "Q2" || quadrantNumber === "Q3"
        ? "0.5px solid black"
        : "none",
  };

  const setFocus = useDentalExaminationStore((state) => state.setFocus);
  return (
    <Grid {...props} xxs={6} sx={styles} component="section">
      <Quadrant quadrantNumber={quadrantNumber} gap={0}>
        {(tooth, index) => (
          <Button
            key={tooth.toothNumber}
            variant="plain"
            sx={{
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 2,
              backgroundColor: "none",
            }}
            onClick={() =>
              setFocus({
                toothContext: {
                  quadrantNumber,
                  toothIndex: index,
                },
                field: "main",
              })
            }
          >
            <ToothNumber tooth={tooth} />
            <ToothIcon
              tooth={tooth}
              toothContext={{ quadrantNumber, toothIndex: index }}
            />
            <ExaminationResult tooth={tooth} />
          </Button>
        )}
      </Quadrant>
    </Grid>
  );
}

function ExaminationResult({ tooth }: { tooth: Tooth }) {
  if (!isToothWithDiagnosis(tooth)) {
    return undefined;
  }
  const mainResult = tooth.mainResult;
  const secondaryResult1 = tooth.secondaryResult1;
  const secondaryResult2 = tooth.secondaryResult2;
  return (
    <Stack sx={{ alignItems: "center" }}>
      <Typography>{mainResult?.value ? mainResult.value : "-"}</Typography>
      <Typography>
        {secondaryResult1?.value ? secondaryResult1.value : undefined}
      </Typography>
      <Typography>
        {secondaryResult2?.value ? secondaryResult2.value : undefined}
      </Typography>
    </Stack>
  );
}
