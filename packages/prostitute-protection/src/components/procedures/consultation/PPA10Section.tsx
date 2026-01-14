/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckboxField, FieldSetControl } from "@eshg/lib-portal";

import {
  CONSULTATION_FIELD_NAME,
  OPTIONAL_TAG,
} from "../../../shared/constants";

import { Section, SectionColumn, SectionGridContainer } from "./Section";

export function PPA10Section() {
  return (
    <Section
      title="Beratung nach §10 ProstSchG"
      titleId="consultation_clause_10"
    >
      <FieldSetControl aria-labelledby="consultation_clause_10">
        <SectionGridContainer>
          <SectionColumn>
            <CheckboxField
              name="diseasePrevention"
              label={CONSULTATION_FIELD_NAME.diseasePrevention}
            />
            <CheckboxField
              name="birthControl"
              label={CONSULTATION_FIELD_NAME.birthControl}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name="pregnancy"
              label={CONSULTATION_FIELD_NAME.pregnancy}
            />
            <CheckboxField
              name="alcoholAndDrugUsage"
              label={CONSULTATION_FIELD_NAME.alcoholAndDrugUsage}
            />
          </SectionColumn>
          <SectionColumn>
            <CheckboxField
              name="referral"
              label={`${CONSULTATION_FIELD_NAME.referral} ${OPTIONAL_TAG}`}
            />
            <CheckboxField
              name="clearing"
              label={`${CONSULTATION_FIELD_NAME.clearing} ${OPTIONAL_TAG}`}
            />
          </SectionColumn>
        </SectionGridContainer>
      </FieldSetControl>
    </Section>
  );
}
