/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiMedicalOpinionStatus,
} from "@eshg/official-medical-service-api";
import { Formik, FormikHelpers } from "formik";

import { usePatchMedicalOpinionStatus } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { STATUS_NAMES_MEDICAL_OPINION_STATUS } from "@/lib/businessModules/officialMedicalService/shared/translations";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export function MedicalOpinionStatusPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const patchMedicalOpinionStatus = usePatchMedicalOpinionStatus();
  const snackbar = useSnackbar();

  function isMedicalOpinionAccomplished(status: ApiMedicalOpinionStatus) {
    return status === ApiMedicalOpinionStatus.Accomplished;
  }

  function handleSubmit(
    values: ApiEmployeeOmsProcedureDetails,
    helpers: FormikHelpers<ApiEmployeeOmsProcedureDetails>,
  ) {
    if (procedure.medicalOpinionStatus !== values.medicalOpinionStatus) {
      openConfirmationDialog({
        onConfirm: async () => {
          await patchMedicalOpinionStatus.mutateAsync({
            id: procedure.id,
            body: values.medicalOpinionStatus,
          });
        },
        onCancel: () => helpers.resetForm(),
        confirmLabel: "Bestätigen",
        title: "Gutachtenstatus ändern?",
        description:
          "Der/Die Bürger:in wird per Mail über den neuen Status informiert. Die Statusänderung kann nicht rückgängig gemacht werden.",
      });
    } else {
      snackbar.notification("Gutachtenstatus wurde nicht verändert.");
      helpers.resetForm();
    }
  }

  return (
    <InfoTile
      data-testid="medical-opinion-status"
      name="medicalOpinionStatus"
      title="Gutachtenstatus"
    >
      <Formik
        initialValues={procedure}
        onSubmit={(values, helpers) => handleSubmit(values, helpers)}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit, initialValues }) => {
          const opinionUnacomplished = !isMedicalOpinionAccomplished(
            initialValues.medicalOpinionStatus,
          );
          return (
            <FormStack onSubmit={handleSubmit}>
              {opinionUnacomplished ? (
                <SelectField
                  label="Status"
                  name="medicalOpinionStatus"
                  options={buildEnumOptions(
                    STATUS_NAMES_MEDICAL_OPINION_STATUS,
                  )}
                />
              ) : (
                <DetailsItem
                  label="Status"
                  value={
                    STATUS_NAMES_MEDICAL_OPINION_STATUS[
                      initialValues.medicalOpinionStatus
                    ]
                  }
                ></DetailsItem>
              )}
              {opinionUnacomplished && (
                <ButtonBar
                  right={
                    <SubmitButton submitting={isSubmitting}>
                      Speichern
                    </SubmitButton>
                  }
                />
              )}
            </FormStack>
          );
        }}
      </Formik>
    </InfoTile>
  );
}
