/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckboxField, FieldSetControl } from "@eshg/lib-portal";

import { CONSULTATION_FIELD_NAME } from "../../../shared/constants";

import { Section, SectionColumn, SectionGridContainer } from "./Section";

export function PPA7Section() {
  return (
    <Section title="Beratung nach §7 ProstSchG" titleId="consultation_clause_7">
      <FieldSetControl aria-labelledby="consultation_clause_7">
        <SectionGridContainer>
          <SectionColumn>
            <CheckboxField
              name="legalAdvices"
              label={`${CONSULTATION_FIELD_NAME.legalAdvices} *`}
            />
            <CheckboxField
              name="healthAndSocialInsurance"
              label={`${CONSULTATION_FIELD_NAME.healthAndSocialInsurance} *`}
            />
            <CheckboxField
              name="consultingServices"
              label={`${CONSULTATION_FIELD_NAME.consultingServices} *`}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name="emergencyHelp"
              label={`${CONSULTATION_FIELD_NAME.emergencyHelp} *`}
            />
            <CheckboxField
              name="taxLiability"
              label={`${CONSULTATION_FIELD_NAME.taxLiability} *`}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name="informationMaterial"
              label={CONSULTATION_FIELD_NAME.informationMaterial}
            />
            <CheckboxField
              name="predicament"
              label={CONSULTATION_FIELD_NAME.predicament}
            />
          </SectionColumn>
        </SectionGridContainer>
      </FieldSetControl>
    </Section>
  );
}
