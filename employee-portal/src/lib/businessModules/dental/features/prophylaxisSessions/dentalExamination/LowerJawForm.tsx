/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GeneralJawForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/GeneralJawForm";
import { JawWithHeading } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/JawWithHeading";
import {
  QuadrantHeading,
  QuadrantHeadingRow,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/QuadrantHeading";

export function LowerJawForm() {
  return (
    <JawWithHeading
      heading={
        <QuadrantHeadingRow marginBottom="24px">
          <QuadrantHeading name="Unterkiefer rechts" index={4} />
          <QuadrantHeading name="Unterkiefer links" index={3} />
        </QuadrantHeadingRow>
      }
      left={<GeneralJawForm quadrantNumber="Q4" />}
      right={<GeneralJawForm quadrantNumber="Q3" />}
    />
  );
}
