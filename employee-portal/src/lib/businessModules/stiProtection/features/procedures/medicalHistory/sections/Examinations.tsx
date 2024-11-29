/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { FormControl, FormLabel, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { SectionGrid } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/YesOrNoWithFollowUp";
import {
  ExaminableIllnesses,
  examinableIllnessNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

export function Examinations() {
  const { values } = useFormikContext<MedicalHistoryFormData>();
  return (
    <>
      <Typography level="title-md" mt={1} id="examinations-section-title">
        Untersuchungen
      </Typography>
      <SectionGrid aria-labelledby="examinations-section-title">
        {Object.entries(values.examinations).map(
          ([diseaseType, { examinationDate }]) => (
            <YesOrNoWithFollowUp
              sx={{ gridColumn: 1 }}
              key={diseaseType}
              label={examinableIllnessNames[diseaseType as ExaminableIllnesses]}
              name={`examinations.${diseaseType}.hadExamination`}
            >
              <FormControl>
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
