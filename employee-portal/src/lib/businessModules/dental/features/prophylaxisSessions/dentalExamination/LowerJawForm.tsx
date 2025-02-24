/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useId } from "react";

import { JawWithHeading } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/JawWithHeading";
import {
  QuadrantHeading,
  QuadrantHeadingRow,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/QuadrantHeading";

import { Quadrant } from "./Quadrant";

export function LowerJawForm() {
  const lowerJawRightId = useId();
  const lowerJawLeftId = useId();
  return (
    <JawWithHeading
      heading={
        <QuadrantHeadingRow marginBottom="24px">
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
      }
      left={<Quadrant quadrantNumber="Q4" aria-labelledby={lowerJawRightId} />}
      right={<Quadrant quadrantNumber="Q3" aria-labelledby={lowerJawLeftId} />}
    />
  );
}
