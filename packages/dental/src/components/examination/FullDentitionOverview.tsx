/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, GridProps, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useId } from "react";

import { QuadrantNumber } from "@/stores/examination/types";

import { Quadrant } from "./Quadrant";
import { QuadrantHeading, QuadrantHeadingRow } from "./QuadrantHeading";
import { ReadonlyToothButton } from "./ReadonlyToothButton";

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

  return (
    <Grid {...props} xxs={6} sx={styles} component="section">
      <Quadrant quadrantNumber={quadrantNumber} gap={0}>
        {(tooth, index) => (
          <ReadonlyToothButton
            key={tooth.toothNumber}
            quadrantNumber={quadrantNumber}
            index={index}
            tooth={tooth}
          />
        )}
      </Quadrant>
    </Grid>
  );
}
