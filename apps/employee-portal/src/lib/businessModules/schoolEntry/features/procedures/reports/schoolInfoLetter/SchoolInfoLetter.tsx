/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { ConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal";

import { SchoolInfoLetter as SchoolInfoLetterType } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";
import { useSaveSchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { useGetSchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolInfoLetterContent } from "@/lib/businessModules/schoolEntry/features/procedures/reports/schoolInfoLetter/SchoolInfoLetterContent";
import { SchoolInfoLetterPageBottomBar } from "@/lib/businessModules/schoolEntry/features/procedures/reports/schoolInfoLetter/SchoolInfoLetterPageBottomBar";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

import { LeaveDirtyConfirmationDialogProps } from "./LeaveDirtyConfirmationDialogProps";

export function SchoolInfoLetter({ procedureId }: { procedureId: string }) {
  const { data } = useGetSchoolInfoLetter(procedureId);

  const router = useRouter();
  const saveSchoolInfoLetter = useSaveSchoolInfoLetter(procedureId);

  async function handleSubmit(values: SchoolInfoLetterType) {
    await saveSchoolInfoLetter(values);
  }

  function navigateToEyeExamination() {
    router.push(routes.procedures.byId(procedureId).examinations.index);
  }

  if (data)
    return (
      <Formik
        initialValues={data.savedLetter ?? data.defaultValuesLetter}
        validateOnChange={false}
        validateOnMount={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formikProps) => {
          return (
            <FormPlus data-testid="school-info-letter-form">
              <ConfirmLeaveDirtyFormEffect
                confirmationDialogProps={LeaveDirtyConfirmationDialogProps(
                  formikProps.submitForm,
                  navigateToEyeExamination,
                )}
              />
              <Box marginBottom={3}>
                <SchoolInfoLetterContent
                  formikProps={formikProps}
                  data={data}
                />
              </Box>
              <SchoolInfoLetterPageBottomBar
                procedureId={procedureId}
                navigateToEyeExamination={navigateToEyeExamination}
              />
            </FormPlus>
          );
        }}
      </Formik>
    );
}
