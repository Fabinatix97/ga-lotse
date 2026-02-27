/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CheckboxField,
  FieldSetControl,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { CONSULTATION_PARAGRAPH10_FIELD_NAME } from "../../../shared/constants";

import { Section, SectionColumn, SectionGridContainer } from "./Section";

export function PPA10Section() {
  const fieldName = createFieldNameMapper("paragraph10");

  return (
    <Section
      title="Beratung nach §10 ProstSchG"
      titleId="consultation_clause_10"
    >
      <FieldSetControl aria-labelledby="consultation_clause_10">
        <SectionGridContainer>
          <SectionColumn>
            <CheckboxField
              name={fieldName("diseasePrevention")}
              label={CONSULTATION_PARAGRAPH10_FIELD_NAME.diseasePrevention}
            />
            <CheckboxField
              name={fieldName("birthControl")}
              label={CONSULTATION_PARAGRAPH10_FIELD_NAME.birthControl}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name={fieldName("pregnancy")}
              label={CONSULTATION_PARAGRAPH10_FIELD_NAME.pregnancy}
            />
            <CheckboxField
              name={fieldName("alcoholAndDrugUsage")}
              label={CONSULTATION_PARAGRAPH10_FIELD_NAME.alcoholAndDrugUsage}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name={fieldName("referral")}
              label={CONSULTATION_PARAGRAPH10_FIELD_NAME.referral}
            />
            <CheckboxField
              name={fieldName("clearing")}
              label={CONSULTATION_PARAGRAPH10_FIELD_NAME.clearing}
            />
          </SectionColumn>
        </SectionGridContainer>
      </FieldSetControl>
    </Section>
  );
}
