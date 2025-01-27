/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";

import { ORAL_HYGIENE_STATUS_OPTIONS } from "@/lib/businessModules/dental/features/children/options";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

interface Props {
  screening: boolean;
  fluoridation: boolean;
}

export function AdditionalInformation(props: Props) {
  return (
    <InformationSheet>
      <DetailsSection title="Zusatzinfos">
        {props.screening && (
          <SelectField
            name="oralHygieneStatus"
            label="Mundhygienestatus"
            options={ORAL_HYGIENE_STATUS_OPTIONS}
          />
        )}
        {props.fluoridation && (
          <BooleanSelectField
            name="fluorideVarnishApplied"
            label="Fluoridierung"
            required="Bitte angeben, ob fluoridiert wurde."
          />
        )}
      </DetailsSection>
    </InformationSheet>
  );
}
