/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useId } from "react";

import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import {
  ExaminableIllnesses,
  examinableIllnessNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

export function Examinations() {
  const examinationDateId = useId();
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
                <FormLabel id={examinationDateId}>
                  Wenn ja, wann zuletzt?
                </FormLabel>
                <MonthAndYearFields
                  fieldName={`examinations.${diseaseType}.examinationDate`}
                  date={examinationDate}
                  aria-labelledby={examinationDateId}
                />
              </FormControl>
            </YesOrNoWithFollowUp>
          ),
        )}
      </SectionGrid>
    </>
  );
}
