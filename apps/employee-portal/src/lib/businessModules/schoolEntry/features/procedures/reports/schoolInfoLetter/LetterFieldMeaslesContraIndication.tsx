/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel, Radio, Stack } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { useFormikContext } from "formik";
import { useId } from "react";
import { isDeepEqual } from "remeda";

import { DateField, RadioGroupField } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

import { schoolInfoLetterForm } from "./FieldComponents";
import { SchoolInfoLetterFormSection } from "./SchoolInfoLetterFormSection";
import { mapMeaslesContraIndication } from "./mappings";

export function LetterFieldMeaslesContraIndication(props: {
  defaultValue: SchoolInfoLetter;
}) {
  const untilId = useId();
  const { values } = useFormikContext<SchoolInfoLetter>();

  return (
    <SchoolInfoLetterFormSection
      isChanged={
        !isDeepEqual(
          props.defaultValue.measlesContraIndication,
          values.measlesContraIndication,
        ) ||
        !isDeepEqual(
          props.defaultValue.measlesContraIndicationUntil,
          values.measlesContraIndicationUntil,
        )
      }
      differentValues={mapMeaslesContraIndication(
        props.defaultValue.measlesContraIndication,
        props.defaultValue.measlesContraIndicationUntil,
      )}
      subtitle="Medizinische Kontraindikation gegen Masernimpfung"
    >
      <Stack>
        <RadioGroupField
          name={schoolInfoLetterForm("measlesContraIndication")}
          sx={{
            ".MuiRadioGroup-root": {
              "--RadioGroup-gap": "1rem",
            },
          }}
          data-testid="letter-section-field-radio"
        >
          <Radio value="NONE" label={mapMeaslesContraIndication("NONE")} />
          <Radio
            value="PERMANENT"
            label={mapMeaslesContraIndication("PERMANENT")}
          />
          <Radio
            value="TEMPORARY"
            label={mapMeaslesContraIndication("TEMPORARY")}
            id={untilId}
          />
        </RadioGroupField>
        <DateField
          data-testid="letter-section-field-date"
          label={<FormLabel sx={visuallyHidden}>bis Zum</FormLabel>}
          name={schoolInfoLetterForm("measlesContraIndicationUntil")}
          sx={{ marginLeft: "1.875rem", maxWidth: "13rem" }}
        />
      </Stack>
    </SchoolInfoLetterFormSection>
  );
}
