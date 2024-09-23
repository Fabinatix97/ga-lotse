/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputArrayField } from "@eshg/lib-portal/components/formFields/InputArrayField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { InfoOutlined } from "@mui/icons-material";
import { FormLabel, Stack, Tooltip, Typography } from "@mui/joy";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

export function IllnessAndAccidentInfoForm() {
  const illnessAndAccidentInfo = createFieldNameMapper(
    "illnessAndAccidentInfo",
  );

  return (
    <Stack gap={2}>
      <Typography level="title-sm">Erkrankungen / Unfälle</Typography>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <BooleanSelectField
          name={illnessAndAccidentInfo("severeIllnesses")}
          label={
            <FlexLabel>
              Schwere Infektionskrankheiten
              <Tooltip
                title=" z.B. Hirnhautentzündung oder andere schwere Erkrankungen"
                color="success"
                variant="outlined"
              >
                <InfoOutlined color="primary" />
              </Tooltip>
            </FlexLabel>
          }
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <BooleanSelectField
          name={illnessAndAccidentInfo("hospitalizationsOrOperations")}
          label={<FlexLabel>Krankenhausaufenthalte / Operationen</FlexLabel>}
          sx={BOOLEAN_SELECT_STYLE}
          component={HorizontalField}
          allowDeselection
        />
        <InputField
          name={illnessAndAccidentInfo("underMedicalTreatmentFor")}
          label={<FlexLabel>in Behandlung wegen</FlexLabel>}
          type="text"
          component={HorizontalField}
        />
        <InputField
          name={illnessAndAccidentInfo("regularMedication")}
          label={
            <FlexLabel>
              Regelmäßige Medikamenteneinnahme
              <Tooltip
                title="Präparat und Dosierung"
                color="success"
                variant="outlined"
              >
                <InfoOutlined color="primary" />
              </Tooltip>
            </FlexLabel>
          }
          type="text"
          component={HorizontalField}
        />
      </Stack>
      <Stack gap={2} flexWrap="wrap" data-testid="allergies">
        <FormLabel sx={{ fontSize: "14px", fontWeight: "500" }}>
          Allergien
        </FormLabel>
        <InputArrayField
          minCount={1}
          addMoreLabel="Allergie hinzufügen"
          name={illnessAndAccidentInfo("allergies")}
          label={<Typography level="body-sm">Welche?</Typography>}
          sx={{ width: "300px" }}
        />
      </Stack>
    </Stack>
  );
}
