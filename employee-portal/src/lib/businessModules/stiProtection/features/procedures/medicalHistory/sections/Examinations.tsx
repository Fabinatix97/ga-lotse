/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { FormControl, FormLabel, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";
import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import {
  ExaminableIllnesses,
  examinableIllnessNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

export function Examinations() {
  const { values } = useFormikContext<MedicalHistoryFormData>();
  return (
    <>
      <Typography level="h3" mb={3} id="examinations-section-title">
        Untersuchungen
      </Typography>
      <SectionGrid
        aria-labelledby="examinations-section-title"
        defaultColumn={1}
      >
        {Object.entries(values.examinations).map(
          ([diseaseType, { examinationDate }]) => (
            <YesOrNoWithFollowUp
              key={diseaseType}
              label={examinableIllnessNames[diseaseType as ExaminableIllnesses]}
              name={`examinations.${diseaseType}.hadExamination`}
            >
              <FormControl sx={{ gridColumn: 2 }}>
                <FormLabel>Wenn ja, wann zuletzt?</FormLabel>
                <MonthAndYearFields
                  fieldName={`examinations.${diseaseType}.examinationDate`}
                  date={examinationDate}
                />
              </FormControl>
            </YesOrNoWithFollowUp>
          ),
        )}
      </SectionGrid>
    </>
  );
}
