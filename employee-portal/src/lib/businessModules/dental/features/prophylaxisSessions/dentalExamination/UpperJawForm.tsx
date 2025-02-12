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

export function UpperJawForm() {
  return (
    <JawWithHeading
      heading={
        <QuadrantHeadingRow marginBottom="24px">
          <QuadrantHeading name="Oberkiefer rechts" index={1} />
          <QuadrantHeading name="Oberkiefer links" index={2} />
        </QuadrantHeadingRow>
      }
      left={<GeneralJawForm quadrantNumber="Q1" />}
      right={<GeneralJawForm quadrantNumber="Q2" />}
    />
  );
}
