/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatDateToFullReadableString } from "@eshg/lib-portal/helpers/dateTime";
import { ApiGetCitizenProcedureDetailsResponse } from "@eshg/official-medical-service-api";
import {
  AccessTimeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormikContext } from "formik";

import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { BookAppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useManualTranslation } from "@/lib/businessModules/officialMedicalService/shared/useManualTranslation";
import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function BookAppointmentSidePanel({
  procedure,
}: {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}) {
  const { t } = useTranslation(["officialMedicalService/rebookAppointment"]);
  const { handleSubmit, values } =
    useFormikContext<BookAppointmentFormValues>();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  const concernName = useManualTranslation({
    de: procedure.concern.nameDe,
    en: procedure.concern.nameEn,
  });

  const [{ data: appointmentTypes }] = useSuspenseQueries({
    queries: [useGetAllAppointmentTypesQuery()],
  });

  const appointmentTypeConfig = appointmentTypes.find(
    (type) =>
      type.appointmentTypeDto === procedure.appointment?.appointmentType,
  );

  return (
    <ContentSheet data-testid="overview">
      <ContentSheetTitle>{t("sidePanel.title")}</ContentSheetTitle>
      <Stack gap={1} data-testId="appointment-summary">
        <DetailsField
          value={`${concernName} ${t("sidePanel.appointmentDuration", { durationInMinutes: appointmentTypeConfig?.standardDurationInMinutes })}`}
          icon={<MedicalServicesOutlined />}
        />
        {values.appointment?.start && (
          <>
            <DetailsField
              value={formatDateToFullReadableString(values.appointment?.start)}
              icon={<DateRange />}
            />
            <DetailsField
              value={t("sidePanel.dateAndTime", {
                appointmentStart: formatTime(values.appointment?.start),
              })}
              icon={<AccessTimeOutlined />}
            />
          </>
        )}
      </Stack>
      <Stack gap={2}>
        <Button color="primary" variant="solid" onClick={() => handleSubmit()}>
          {t("sidePanel.bookAppointment", {
            context: procedure.appointment?.bookingState
              .toString()
              .toLowerCase(),
          })}
        </Button>
        <InternalLinkButton
          variant="soft"
          color="neutral"
          href={citizenRoutes.personalArea.index(accessCode)}
        >
          {t("sidePanel.cancel")}
        </InternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
