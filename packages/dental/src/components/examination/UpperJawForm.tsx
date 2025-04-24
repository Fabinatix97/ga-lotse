/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useId } from "react";

import { JawWithHeading } from "./JawWithHeading";
import { Quadrant } from "./Quadrant";
import { QuadrantHeading, QuadrantHeadingRow } from "./QuadrantHeading";

export function UpperJawForm() {
  const upperJawRightId = useId();
  const upperJawLeftId = useId();
  return (
    <JawWithHeading
      heading={
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
      }
      left={<Quadrant quadrantNumber="Q1" aria-labelledby={upperJawRightId} />}
      right={<Quadrant quadrantNumber="Q2" aria-labelledby={upperJawLeftId} />}
    />
  );
}
