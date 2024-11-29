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
} from "@eshg/employee-portal-api/stiProtection";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { UnfoldMore } from "@mui/icons-material";
import { FormLabel, Typography } from "@mui/joy";
import { differenceInMinutes } from "date-fns";
import { Formik } from "formik";

import { useCreateAppointmentMutation } from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/options";
import { AppointmentForm } from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AppointmentForm";
import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
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
  concern?: ApiConcern | "";
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

export const CREATE_APPOINTMENT_SEARCH_PARAM = "create-appointment";

export function CreateAppointmentSidebar({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const [isOpen, setIsOpen] = useSearchParam(
    CREATE_APPOINTMENT_SEARCH_PARAM,
    "boolean",
  );

  const snackbar = useSnackbar();
  const createAppointment = useCreateAppointmentMutation({
    onSuccess: () => {
      setIsOpen(false);
      snackbar.confirmation("Der Termin wurde erfolgreich gebucht");
    },
  });

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      setIsOpen(false);
    },
  });

  return (
    <Sidebar open={isOpen} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          await createAppointment.mutateAsync({
            id: procedure.id,
            data: mapFormToApi(values),
          });
        }}
      >
        {({ setValues, values }) => (
          <SidebarForm ref={sidebarFormRef}>
            <SidebarContent title="Termin buchen">
              <SingleAutocompleteField
                label={
                  <FormLabel>
                    <Typography level={"title-md"}>Art des Termins</Typography>
                  </FormLabel>
                }
                name="appointmentType"
                required="Bitte eine Terminart auswählen"
                options={APPOINTMENT_TYPE_OPTIONS}
                popupIcon={<UnfoldMore />}
                onInputChange={async (_, value) => {
                  if (
                    value === CONCERN_VALUES.SEX_WORK &&
                    values.concern !== ApiConcern.SexWork
                  ) {
                    await setValues({
                      ...values,
                      concern: ApiConcern.SexWork,
                    });
                  } else if (
                    value === CONCERN_VALUES.HIV_STI_CONSULTATION &&
                    values.concern !== ApiConcern.HivStiConsultation
                  ) {
                    await setValues({
                      ...values,
                      concern: ApiConcern.HivStiConsultation,
                    });
                  }
                }}
              />
              <AppointmentForm />
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitting={createAppointment.isPending}
                onCancel={handleClose}
                submitLabel="Bestätigen"
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function mapFormToApi(
  form: CreateAppointmentForm,
): ApiCreateAppointmentRequest {
  if (!form.appointmentType) {
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
    appointmentType: form.appointmentType,
    appointmentBookingType: form.appointmentBookingType,
    durationInMinutes: isCustomAppointment
      ? optionalInt(form.customAppointmentDuration)
      : differenceInMinutes(blockAppointmentEnd!, appointmentStart),
    appointmentStart,
  });
}
