/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CheckboxField,
  FieldSetControl,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { CONSULTATION_PARAGRAPH7_FIELD_NAME } from "../../../shared/constants";

import { Section, SectionColumn, SectionGridContainer } from "./Section";

export function PPA7Section() {
  const fieldName = createFieldNameMapper("paragraph7");

  return (
    <Section title="Beratung nach §7 ProstSchG" titleId="consultation_clause_7">
      <FieldSetControl aria-labelledby="consultation_clause_7">
        <SectionGridContainer>
          <SectionColumn>
            <CheckboxField
              name={fieldName("legalAdvices")}
              label={`${CONSULTATION_PARAGRAPH7_FIELD_NAME.legalAdvices} *`}
            />
            <CheckboxField
              name={fieldName("healthAndSocialInsurance")}
              label={`${CONSULTATION_PARAGRAPH7_FIELD_NAME.healthAndSocialInsurance} *`}
            />
            <CheckboxField
              name={fieldName("consultingServices")}
              label={`${CONSULTATION_PARAGRAPH7_FIELD_NAME.consultingServices} *`}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name={fieldName("emergencyHelp")}
              label={`${CONSULTATION_PARAGRAPH7_FIELD_NAME.emergencyHelp} *`}
            />
            <CheckboxField
              name={fieldName("taxLiability")}
              label={`${CONSULTATION_PARAGRAPH7_FIELD_NAME.taxLiability} *`}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name={fieldName("informationMaterial")}
              label={CONSULTATION_PARAGRAPH7_FIELD_NAME.informationMaterial}
            />
            <CheckboxField
              name={fieldName("predicament")}
              label={CONSULTATION_PARAGRAPH7_FIELD_NAME.predicament}
            />
          </SectionColumn>
        </SectionGridContainer>
      </FieldSetControl>
    </Section>
  );
}
