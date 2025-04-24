/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  DetailsItem,
  FormStack,
  TextareaField,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiMedicalOpinionResult,
  ApiMedicalOpinionStatus,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";
import { Formik, FormikHelpers } from "formik";

import { usePatchMedicalOpinionStatus } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  STATUS_NAMES_MEDICAL_OPINION_RESULT,
  STATUS_NAMES_MEDICAL_OPINION_STATUS,
} from "@/lib/businessModules/officialMedicalService/shared/translations";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface MedicalOpinionStatusFormType {
  medicalOpinionStatus: ApiMedicalOpinionStatus;
  medicalOpinionResult?: ApiMedicalOpinionResult;
  medicalOpinionComment?: string;
}

export function MedicalOpinionStatusPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const patchMedicalOpinionStatus = usePatchMedicalOpinionStatus();
  const snackbar = useSnackbar();

  function isMedicalOpinionAccomplished() {
    return (
      procedure.medicalOpinionStatus === ApiMedicalOpinionStatus.Accomplished
    );
  }

  function isProcedureClosed() {
    return procedure.status === ApiProcedureStatus.Closed;
  }

  function handleSubmit(
    values: MedicalOpinionStatusFormType,
    helpers: FormikHelpers<MedicalOpinionStatusFormType>,
  ) {
    if (procedure.medicalOpinionStatus !== values.medicalOpinionStatus) {
      openConfirmationDialog({
        onConfirm: async () => {
          await patchMedicalOpinionStatus.mutateAsync({
            id: procedure.id,
            apiPatchMedicalOpinionStatusRequest: {
              status: values.medicalOpinionStatus,
              result: values.medicalOpinionResult,
              comment: values.medicalOpinionComment,
            },
          });
        },
        onCancel: () => helpers.resetForm(),
        confirmLabel: "Bestätigen",
        title: "Gutachtenstatus ändern?",
        description: "Die Statusänderung kann nicht rückgängig gemacht werden.",
      });
    } else {
      snackbar.notification("Gutachtenstatus wurde nicht verändert.");
      helpers.resetForm();
    }
  }

  const initialValues: MedicalOpinionStatusFormType = {
    medicalOpinionStatus: procedure.medicalOpinionStatus,
    medicalOpinionResult:
      procedure.medicalOpinionResult !== ApiMedicalOpinionResult.NoValuation
        ? procedure.medicalOpinionResult
        : undefined,
    medicalOpinionComment: undefined,
  };

  return (
    <InfoTile
      data-testid="medical-opinion-status"
      name="medicalOpinionStatus"
      title="Gutachtenstatus"
    >
      {!isProcedureClosed() && !isMedicalOpinionAccomplished() ? (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, helpers) => handleSubmit(values, helpers)}
          enableReinitialize
        >
          {({ isSubmitting, handleSubmit, values }) => {
            return (
              <FormStack onSubmit={handleSubmit}>
                <SelectField
                  label="Status"
                  name="medicalOpinionStatus"
                  options={buildEnumOptions(
                    STATUS_NAMES_MEDICAL_OPINION_STATUS,
                  )}
                />
                {values.medicalOpinionStatus ===
                  ApiMedicalOpinionStatus.Accomplished && (
                  <>
                    <SelectField
                      label="Ergebnis"
                      name="medicalOpinionResult"
                      options={buildEnumOptions(
                        STATUS_NAMES_MEDICAL_OPINION_RESULT,
                      )}
                      required={"Bitte Ergebnis angeben."}
                    />
                    <TextareaField
                      label="Abschließende Bemerkung"
                      name="medicalOpinionComment"
                    />
                  </>
                )}
                <ButtonBar
                  right={
                    <SubmitButton submitting={isSubmitting}>
                      Speichern
                    </SubmitButton>
                  }
                />
              </FormStack>
            );
          }}
        </Formik>
      ) : (
        <>
          <DetailsItem
            label="Status"
            value={
              STATUS_NAMES_MEDICAL_OPINION_STATUS[
                procedure.medicalOpinionStatus
              ]
            }
          ></DetailsItem>
          <DetailsItem
            label="Ergebnis"
            value={
              procedure.medicalOpinionResult
                ? STATUS_NAMES_MEDICAL_OPINION_RESULT[
                    procedure.medicalOpinionResult
                  ]
                : undefined
            }
          ></DetailsItem>
          <DetailsItem
            label="Abschließende Bemerkung"
            value={procedure.medicalOpinionComment ?? "-"}
          ></DetailsItem>
        </>
      )}
    </InfoTile>
  );
}
