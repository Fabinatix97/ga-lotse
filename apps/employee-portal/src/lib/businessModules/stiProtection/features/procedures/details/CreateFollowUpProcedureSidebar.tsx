/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  MultiFormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  useSearchParam,
  useStepper,
} from "@eshg/lib-employee-portal";
import { Alert, useSnackbar } from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiConcern,
  ApiCreateFollowUpProcedureResponse,
  ApiStiProtectionProcedure,
} from "@eshg/sti-protection-api";

import {
  useCreateStiFollowUpProcedureMutation,
  useCreateStiFollowUpProcedureOptions,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { AppointmentForm } from "@/lib/businessModules/stiProtection/shared/procedure/AppointmentForm";
import { SharePinModal } from "@/lib/businessModules/stiProtection/shared/procedure/SharePinModal";
import { CONCERN_OPTIONS } from "@/lib/businessModules/stiProtection/shared/procedure/helpers";
import { mapFollowUpProcedureFormToApi } from "@/lib/businessModules/stiProtection/shared/procedure/mappers";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { SelectableCardsField } from "@/lib/shared/components/formFields/SelectableCardsField";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

const steps = [
  {
    title: "Folgevorgang anlegen",
    subTitle: "Schritt 1 von 2",
    fields: ({
      procedure,
    }: Readonly<{ procedure: ApiStiProtectionProcedure }>) => (
      <CreateFollowUpProcedureTypeAndInfo procedure={procedure} />
    ),
  },
  {
    title: "Folgevorgang anlegen",
    subTitle: "Schritt 2 von 2",
    fields: () => <CreateFollowUpProcedureAppointmentForm />,
  },
];

const initialValues: CreateFollowUpProcedureForm = {
  concern: "",

  appointmentBookingType: "",
  blockAppointment: null,
  customAppointmentDate: "",
  customAppointmentDuration: "",
};

export interface CreateFollowUpProcedureForm {
  concern?: ApiConcern | "";
  appointmentType?: ApiAppointmentType | "" | null;

  appointmentBookingType?: ApiAppointmentBookingType | "";
  blockAppointment?: null | ApiAppointment;
  customAppointmentDate: string;
  customAppointmentDuration: string;
}

export function CreateFollowUpProcedureSidebar({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useSearchParam(
    "create-follow-up-procedure",
    "boolean",
  );
  const [dataToShare, setDataToShare] = useState<
    { pin: string; id: string } | undefined
  >();

  const snackbar = useSnackbar();
  const createFollowUpProcedureOptions = useCreateStiFollowUpProcedureOptions();
  const createFollowUpProcedure = useCreateStiFollowUpProcedureMutation({
    onSuccess: (data: ApiCreateFollowUpProcedureResponse) => {
      setIsOpen(false);
      snackbar.confirmation("Folgevorgang angelegt");
      setDataToShare({ pin: data.pin, id: data.procedureId });
    },
  });

  function onFinalSubmit(newValues: CreateFollowUpProcedureForm) {
    const mappedValues = mapFollowUpProcedureFormToApi(newValues);
    return createFollowUpProcedure.mutateAsync({
      id: procedure.id,
      data: mappedValues,
    });
  }

  const {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    step,
    isOnFirstStep,
    isOnLastStep,
  } = useStepper({ steps, onFinalSubmit });

  function pinIsShared() {
    if (dataToShare === undefined) {
      return;
    }
    router.push(routes.procedures.byId(dataToShare.id).details);
    setDataToShare(undefined);
  }

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      setIsOpen(false);
      changeToStep(0);
    },
  });

  return (
    <>
      <Sidebar open={isOpen} onClose={handleClose}>
        <Formik initialValues={initialValues} onSubmit={handleNext}>
          {({ values }) => (
            <SidebarForm ref={sidebarFormRef}>
              <ConfirmLeaveDirtyFormEffect
                onSaveMutation={{
                  mutationOptions: createFollowUpProcedureOptions,
                  variableSupplier: () => mapFollowUpProcedureFormToApi(values),
                }}
              />
              <SidebarContent title={step.title} subtitle={step.subTitle}>
                <Fields procedure={procedure} />
              </SidebarContent>
              <SidebarActions>
                <MultiFormButtonBar
                  submitting={createFollowUpProcedure.isPending}
                  submitLabel={isOnLastStep ? "Folgevorgang anlegen" : "Weiter"}
                  onCancel={handleClose}
                  onBack={isOnFirstStep ? undefined : handlePrev}
                />
              </SidebarActions>
            </SidebarForm>
          )}
        </Formik>
      </Sidebar>
      <SharePinModal pinToShare={dataToShare?.pin} onShared={pinIsShared} />
    </>
  );
}

function CreateFollowUpProcedureTypeAndInfo({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const openAppointment = procedure.appointmentHistory.find(
    (t) => t.appointmentStatus === "OPEN",
  );

  return (
    <>
      <Typography level="title-md">Art der Beratung</Typography>
      <Stack gap={3}>
        <SelectableCardsField
          name="concern"
          required="Bitte ein Anliegen auswählen"
          options={CONCERN_OPTIONS}
        />
        <Alert
          color="primary"
          message={
            <>
              Ausschließlich folgende Daten werden übernommen:
              <li>Angaben zur Person</li>
              <li>Anamnese</li>
              <li>Konsultation</li>
              <li>Diagnose</li>
              <li>Ergebnisse der Untersuchung</li>
              <br />
              Der aktuelle Vorgang wird abgeschlossen und Termine werden
              storniert.
            </>
          }
        />
        {openAppointment ? (
          <Alert
            color="warning"
            message="Es existieren noch offene Termine, welche bei der Anlage eines Folgevorgangs storniert werden."
          />
        ) : null}
      </Stack>
    </>
  );
}

function CreateFollowUpProcedureAppointmentForm() {
  const { getFieldMeta } = useFormikContext<CreateFollowUpProcedureForm>();
  const concern = getFieldMeta("concern").value as ApiConcern;
  const title = `Termin auswählen für ${CONCERN_VALUES[concern]}`;

  return (
    <Stack gap={1}>
      <Typography level="title-md">{title}</Typography>
      <AppointmentForm />
    </Stack>
  );
}
