/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { FormLabel, Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { AutoWidthHorizontalField } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm";
import {
  MedicalHistoryFormData,
  medicalHistoryFormFields as fields,
  medicalHistoryFormSections as sections,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export function MedicalHistoryCommonFields({
  procedure,
}: {
  procedure: ApiStiProtectionProcedure;
}) {
  const { values } = useFormikContext<MedicalHistoryFormData>();

  return (
    <>
      <Typography level="title-md" mt={1} id="general-section-title">
        {sections.common}
      </Typography>
      <FormGroupGrid
        component="section"
        aria-labelledby="general-section-title"
      >
        <Grid container xxs={12}>
          <Grid xxs={12} md={6} xxl={3}>
            <InputField
              name="examinationReason"
              label={
                <FormLabel title={fields.examinationReason}>
                  {fields.examinationReason}
                </FormLabel>
              }
              component={AutoWidthHorizontalField}
            />
          </Grid>
          <Grid xxs={12} md={6} xxl={3}>
            <InputField
              name="currentSymptoms"
              label={
                <FormLabel title={fields.currentSymptoms}>
                  {fields.currentSymptoms}
                </FormLabel>
              }
              component={AutoWidthHorizontalField}
            />
          </Grid>
        </Grid>
        <Grid xxs={12} md={6} xxl={3}>
          <DateField
            name="contactToClarifyDuration"
            label={fields.contactToClarifyDuration}
            component={AutoWidthHorizontalField}
          />
        </Grid>
        {procedure.concern === "SEX_WORK" && (
          <Grid container xxs={12}>
            <Grid xxs={12} md={6} xxl={3} direction="column" container>
              <Grid>
                <DateField
                  name="lastMenstruation"
                  label={fields.lastMenstruation}
                  component={AutoWidthHorizontalField}
                />
              </Grid>
              <Grid>
                <DateField
                  name="lastCancerScreening"
                  label={fields.lastCancerScreening}
                  component={AutoWidthHorizontalField}
                />
              </Grid>
            </Grid>
            <Grid xxs={12} md={6} xxl={3} direction="column" container>
              <Grid>
                <BooleanSelectField
                  name="hasBeenPregnant"
                  label={fields.hasBeenPregnant}
                  component={AutoWidthHorizontalField}
                />
              </Grid>
              {!!values.hasBeenPregnant && (
                <>
                  <Grid ml={3}>
                    <NumberField
                      name="numberOfPregnancies"
                      label={fields.numberOfPregnancies}
                      component={AutoWidthHorizontalField}
                      required={"Bitte eine Zahl angeben"}
                      min={0}
                    />
                  </Grid>
                  <Grid ml={3}>
                    <NumberField
                      name="numberOfBirthsOrAbortions"
                      label={fields.numberOfBirthsOrAbortions}
                      component={AutoWidthHorizontalField}
                      min={0}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid xxs={12} md={6} xxl={3}>
              <TextareaField
                name="knownOperationsOrIllnesses"
                label={fields.knownOperationsOrIllnesses}
                sx={{
                  fontWeight: 500,
                }}
              />
            </Grid>
            <Grid xxs={12} md={6} xxl={3}>
              <TextareaField
                name="medications"
                label="Medikamente"
                sx={{
                  fontWeight: 500,
                }}
              />
            </Grid>
          </Grid>
        )}
      </FormGroupGrid>
    </>
  );
}
