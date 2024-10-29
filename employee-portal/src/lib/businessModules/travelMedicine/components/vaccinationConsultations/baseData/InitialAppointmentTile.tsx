/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentSummary,
  ApiAppointmentType,
  PatchAppointmentRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Grid } from "@mui/joy";
import { useState } from "react";

import { usePatchAppointment } from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";
import {
  InitialAppointmentForm,
  InitialAppointmentFormValuesProps,
} from "@/lib/businessModules/travelMedicine/components/personSidebar/appointment/InitialAppointmentForm";
import { determineStartAndDuration } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { mapDateTimeToInput } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { durationBetweenDatesInMinutes } from "@/lib/shared/helpers/dateTime";

interface InitialAppointmentTileProps {
  initialValues: InitialAppointmentTileValues;
  isProcedureClosed: boolean;
}

interface InitialAppointmentTileValues {
  initialAppointment: ApiAppointmentSummary;
}

export function InitialAppointmentTile(
  props: Readonly<InitialAppointmentTileProps>,
) {
  const [open, setOpen] = useState<boolean>(false);
  const resetAlertContext = useResetAlertContext();

  function updateSidebar(sideBarState: boolean) {
    setOpen(sideBarState);
    resetAlertContext();
  }

  return (
    <>
      <DetailsSection
        name="appointmentData"
        title="Haupttermin"
        onEdit={() => updateSidebar(true)}
        canEdit={!props.isProcedureClosed}
      >
        <Grid xs={12} pl={0} py={0}>
          <DetailsCell
            name="appointmentType"
            label={
              props.initialValues.initialAppointment.appointmentType ==
              ApiAppointmentType.Consultation
                ? "Beratungstermin"
                : "Impftermin"
            }
            value={
              formatDateTime(props.initialValues.initialAppointment.start) +
              " Uhr"
            }
          />
        </Grid>
      </DetailsSection>
      {open && (
        <EditInitialAppointmentSidebar
          initialAppointment={props.initialValues.initialAppointment}
          openState={open}
          onClose={() => updateSidebar(false)}
        />
      )}
    </>
  );
}

function EditInitialAppointmentSidebar({
  initialAppointment,
  openState,
  onClose,
}: Readonly<{
  initialAppointment: ApiAppointmentSummary;
  openState: boolean;
  onClose: () => void;
}>) {
  const patchAppointment = usePatchAppointment();

  function createInitialValues(
    initialAppointment: ApiAppointmentSummary,
  ): InitialAppointmentFormValuesProps {
    let appointmentBlockDateOption = undefined;
    if (
      initialAppointment.appointmentBookingType ==
      ApiAppointmentBookingType.AppointmentBlock
    ) {
      appointmentBlockDateOption = {
        label: formatDateTime(initialAppointment.start) + " Uhr",
        value:
          initialAppointment.start!.toISOString() +
          "," +
          durationBetweenDatesInMinutes(
            initialAppointment.start!,
            initialAppointment.end!,
          ),
      };
    }

    return {
      initialStepAppointmentType: initialAppointment.appointmentType,
      bookingType: initialAppointment.appointmentBookingType,
      appointmentTypeStandardDuration: durationBetweenDatesInMinutes(
        initialAppointment.start!,
        initialAppointment.end!,
      ),
      userDefinedAppointmentDate: mapDateTimeToInput(
        initialAppointment.start!,
        false,
      ),
      isEditInitialAppointmentMode: true,
      appointmentBlockDate: appointmentBlockDateOption?.value,
      appointmentBlockDateOption: appointmentBlockDateOption,
    };
  }

  async function handleChangeAppointment(
    values: InitialAppointmentFormValuesProps,
  ) {
    const { appointmentStart, durationInMinutes } = determineStartAndDuration(
      values.bookingType,
      values.userDefinedAppointmentDate!,
      values.appointmentBlockDate!,
      values.appointmentTypeStandardDuration,
    );

    const request: PatchAppointmentRequest = {
      id: initialAppointment.procedureStepId,
      apiPatchAppointmentRequest: {
        appointmentType: values.initialStepAppointmentType,
        appointmentBookingType: values.bookingType!,
        appointmentStart: appointmentStart,
        durationInMinutes: durationInMinutes,
      },
    };
    await patchAppointment.mutateAsync(request, { onSuccess: onClose });
  }

  return (
    <Sidebar open={openState} onClose={onClose}>
      <OverlayBoundary>
        <InitialAppointmentForm
          initialValues={createInitialValues(initialAppointment)}
          onSubmit={handleChangeAppointment}
          onCancel={onClose}
        />
      </OverlayBoundary>
    </Sidebar>
  );
}
