/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";
import { FormControl, FormLabel, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import {
  MedicalHistoryFormData,
  StandardRiskQuestion,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import {
  StandardRiskFactor,
  standardRiskFactorNames,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";

export function Risks() {
  const { values } = useFormikContext<MedicalHistoryFormData>();

  return (
    <>
      <Typography level="h3" mb={3} id="risks-section-title">
        Angaben zum Risiko
      </Typography>
      <SectionGrid aria-labelledby="risks-section-title" defaultColumn={1}>
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
