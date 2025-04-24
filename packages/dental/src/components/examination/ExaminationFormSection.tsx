/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InformationSheet } from "@eshg/lib-employee-portal";

import { ExaminationJawTabs } from "./ExaminationJawTabs";
import { ExaminationLegend } from "./ExaminationLegend";
import { FullDentitionOverview } from "./FullDentitionOverview";
import { LowerJawForm } from "./LowerJawForm";
import { UpperJawForm } from "./UpperJawForm";

export function ExaminationFormSection() {
  return (
    <InformationSheet aria-label="Gebissformular" component="section">
      <ExaminationJawTabs
        upperJaw={<UpperJawForm />}
        lowerJaw={<LowerJawForm />}
        fullDentition={<FullDentitionOverview />}
      />
      <ExaminationLegend />
    </InformationSheet>
  );
}
