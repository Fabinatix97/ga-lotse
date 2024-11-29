/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { FormControl, FormLabel, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  MedicalHistoryFormData,
  StandardRiskQuestion,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { SectionGrid } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/YesOrNoWithFollowUp";
import {
  StandardRiskFactor,
  standardRiskFactorNames,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";

export function Risks() {
  const { values } = useFormikContext<MedicalHistoryFormData>();

  return (
    <>
      <Typography level="title-md" mt={1} id="risks-section-title">
        Angaben zum Risiko
      </Typography>
      <SectionGrid aria-labelledby="risks-section-title">
        {Object.entries(values.standardRiskFactors).map(
          ([riskName, { lastIncident }]: [string, StandardRiskQuestion]) => (
            <YesOrNoWithFollowUp
              sx={{ gridColumn: 1 }}
              key={riskName}
              label={standardRiskFactorNames[riskName as StandardRiskFactor]}
              name={`standardRiskFactors.${riskName}.taken`}
            >
              <FormControl>
                <FormLabel>Wenn ja, wann zuletzt?</FormLabel>
                <MonthAndYearFields
                  fieldName={`standardRiskFactors.${riskName}.lastIncident`}
                  date={lastIncident}
                />
              </FormControl>
            </YesOrNoWithFollowUp>
          ),
        )}
        <YesOrNoWithFollowUp
          sx={{ gridColumn: 1 }}
          label="Andere Risikosituation"
          name={`otherRisks.taken`}
        >
          <InputField name="otherRisks.description" label="Wenn ja, welche?" />
        </YesOrNoWithFollowUp>
      </SectionGrid>
    </>
  );
}
