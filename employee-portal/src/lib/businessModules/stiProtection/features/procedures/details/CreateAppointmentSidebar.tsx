/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/employee-portal-api/measlesProtection";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiConcern,
  ApiCreateAppointmentRequest,
  ApiStiProtectionProcedure,
  ApiUpdateAppointmentRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { UnfoldMore } from "@mui/icons-material";
import { FormLabel, Typography } from "@mui/joy";
import { differenceInMinutes } from "date-fns";
import { Formik, FormikHelpers } from "formik";
import { ReactNode, useMemo, useReducer } from "react";

import {
  useCreateAppointmentMutation,
  useEditAppointmentMutation,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { appointmentOptionsByConcern } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/options";
import { AppointmentForm } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AppointmentForm";
import {
  SummaryForm,
  SummaryFormProps,
} from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/SummaryForm";
import {
  deleteUndefined,
  optionalInt,
} from "@/lib/businessModules/stiProtection/shared/helpers";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export interface CreateAppointmentForm {
  appointmentType?: ApiAppointmentType | "" | null;
  appointmentBookingType?: ApiAppointmentBookingType | "";
  blockAppointment?: null | ApiAppointment;
  concern?: ApiConcern | "RESULTS_REVIEW" | "";
  customAppointmentDate: string;
  customAppointmentDuration: string;
}

const initialValues: CreateAppointmentForm = {
  appointmentType: null,
  appointmentBookingType: "",
  blockAppointment: null,
  concern: "",
  customAppointmentDate: "",
  customAppointmentDuration: "",
};

interface CreateAppointmentSidebarProps {
  procedure: ApiStiProtectionProcedure;
}

export const CREATE_APPOINTMENT_SEARCH_PARAM = "create-appointment";
export const EDIT_APPOINTMENT_SEARCH_PARAM = "edit-appointment";

interface SidebarStep {
  title: string;
  subTitle: string;
  fields: (props: SummaryFormProps) => ReactNode | JSX.Element;
}

function getSteps({
  mode = "createAppointment",
  procedure,
}: {
  mode?: "createAppointment" | "editAppointment";
  procedure: ApiStiProtectionProcedure;
}): SidebarStep[] {
  return [
    {
      title: mode === "editAppointment" ? "Termin ändern" : "Termin buchen",
      subTitle: "Schritt 1 von 2",
      fields: () => (
        <>
          {mode === "createAppointment" && (
            <AppointmentTypeField procedure={procedure} />
          )}
          <AppointmentForm procedure={procedure} />
        </>
      ),
    },
    {
      title: "Zusammenfassung",
      subTitle: "Schritt 2 von 2",
      fields: (props: SummaryFormProps) => (
        <SummaryForm
          {...props}
          appointmentSummary={{ title: "Neuer Termin" }}
          mode={mode}
          procedure={procedure}
          show={{ personalData: false }}
        />
      ),
    },
  ];
}

export function CreateAppointmentSidebar({
  procedure,
}: Readonly<CreateAppointmentSidebarProps>) {
  const [isOpenCreateAppointment, setIsOpenCreateAppointment] = useSearchParam(
    CREATE_APPOINTMENT_SEARCH_PARAM,
    "boolean",
  );
  const [isOpenEditAppointment, setIsOpenEditAppointment] = useSearchParam(
    EDIT_APPOINTMENT_SEARCH_PARAM,
    "boolean",
  );
  const steps = useMemo(
    () =>
      getSteps({
        mode: isOpenEditAppointment ? "editAppointment" : "createAppointment",
        procedure,
      }),
    [isOpenEditAppointment, procedure],
  );
  const lastStepIndex = steps.length - 1;
  const [stepIndex, changeToStep] = useReducer(
    (_index: number, newIndex: number) =>
      Math.max(Math.min(newIndex, lastStepIndex), 0),
    0,
  );
  const step = steps[stepIndex]!;

  const snackbar = useSnackbar();
  const createAppointment = useCreateAppointmentMutation({
    onSuccess: () => {
      setIsOpenCreateAppointment(false);
      snackbar.confirmation("Der Termin wurde erfolgreich gebucht.");
    },
  });
  const editAppointment = useEditAppointmentMutation({
    onSuccess: () => {
      setIsOpenEditAppointment(false);
      snackbar.confirmation("Der Termin wurde geändert.");
    },
  });

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      if (isOpenCreateAppointment) setIsOpenCreateAppointment(false);
      if (isOpenEditAppointment) setIsOpenEditAppointment(false);
      changeToStep(0);
    },
  });

  async function handleSubmit(values: CreateAppointmentForm) {
    if (isOpenEditAppointment) {
      await editAppointment.mutateAsync({
        id: procedure.id,
        data: mapFormToApi(values, "edit") as ApiUpdateAppointmentRequest,
      });
    } else {
      await createAppointment.mutateAsync({
        id: procedure.id,
        data: mapFormToApi(values) as ApiCreateAppointmentRequest,
      });
    }
  }

  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;

  async function handleNext(
    newValues: CreateAppointmentForm,
    helpers: FormikHelpers<CreateAppointmentForm>,
  ) {
    if (isOnLastStep) {
      await handleSubmit(newValues);
      helpers.resetForm();
      changeToStep(0);
    } else {
      changeToStep(stepIndex + 1);
    }
  }
  const Fields = step.fields;

  return (
    <Sidebar
      open={isOpenCreateAppointment || isOpenEditAppointment}
      onClose={handleClose}
    >
      <Formik initialValues={initialValues} onSubmit={handleNext}>
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields
              jumpToAppointmentSelection={() => {
                changeToStep(0);
              }}
            />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={createAppointment.isPending}
              onCancel={handleClose}
              onBack={
                isOnFirstStep ? undefined : () => changeToStep(stepIndex - 1)
              }
              submitLabel={isOnLastStep ? "Bestätigen" : "Weiter"}
            />
          </SidebarActions>
        </SidebarForm>
      </Formik>
    </Sidebar>
  );
}

function AppointmentTypeField({
  procedure,
}: {
  procedure: ApiStiProtectionProcedure;
}) {
  return (
    <SingleAutocompleteField
      label={
        <FormLabel>
          <Typography level="title-md">Terminart</Typography>
        </FormLabel>
      }
      name="appointmentType"
      required="Bitte eine Terminart auswählen"
      options={appointmentOptionsByConcern(procedure.concern)}
      popupIcon={<UnfoldMore />}
    />
  );
}

function mapFormToApi(
  form: CreateAppointmentForm,
  type: "create" | "edit" = "create",
): ApiCreateAppointmentRequest | ApiUpdateAppointmentRequest {
  if (type === "create" && !form.appointmentType) {
    throw new Error("Appointment type must be defined");
  }
  if (!form.appointmentBookingType) {
    throw new Error("Appointment booking type must be defined");
  }
  const isCustomAppointment =
    form.appointmentBookingType === ApiAppointmentBookingType.UserDefined;

  const appointmentStart = isCustomAppointment
    ? new Date(form.customAppointmentDate)
    : form.blockAppointment?.start;

  if (!appointmentStart) {
    throw new Error("Appointment start must be defined");
  }

  const blockAppointmentEnd = form.blockAppointment?.end;
  if (!isCustomAppointment && blockAppointmentEnd == null) {
    throw new Error("Appointment end must be defined");
  }

  return deleteUndefined({
    ...(type === "create" && {
      appointmentType: form.appointmentType,
    }),
    appointmentBookingType: form.appointmentBookingType,
    durationInMinutes: isCustomAppointment
      ? optionalInt(form.customAppointmentDuration)
      : differenceInMinutes(blockAppointmentEnd!, appointmentStart),
    appointmentStart,
  });
}
