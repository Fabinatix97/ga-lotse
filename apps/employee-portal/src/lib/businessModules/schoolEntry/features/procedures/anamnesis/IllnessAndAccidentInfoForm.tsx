/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormLabel, Stack, Typography } from "@mui/joy";

import {
  BooleanSelectField,
  HorizontalField,
  InputArrayField,
  InputField,
  createFieldNameMapper,
  getIndexLabel,
} from "@eshg/lib-portal";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

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
              <InfoIconTooltipButton
                infoText="z.B. Hirnhautentzündung oder andere schwere Erkrankungen"
                tooltipColor="success"
                title="Hinweis Schwere Infektionskrankheiten"
              />
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
              <InfoIconTooltipButton
                infoText="Präparat und Dosierung"
                tooltipColor="success"
                title="Hinweis Regelmäßige Medikamenteneinnahme"
              />
            </FlexLabel>
          }
          type="text"
          component={HorizontalField}
        />
      </Stack>
      <Stack gap={2} flexWrap="wrap" data-testid="allergies">
        <FormLabel sx={{ fontSize: "sm", fontWeight: "500" }}>
          Allergien
        </FormLabel>
        <InputArrayField
          minCount={1}
          addMoreLabel="Allergie hinzufügen"
          name={illnessAndAccidentInfo("allergies")}
          label={(index) => (
            <Typography level="body-sm">
              {getIndexLabel("Allergie", index)}
            </Typography>
          )}
          sx={{ width: "300px" }}
        />
      </Stack>
    </Stack>
  );
}
