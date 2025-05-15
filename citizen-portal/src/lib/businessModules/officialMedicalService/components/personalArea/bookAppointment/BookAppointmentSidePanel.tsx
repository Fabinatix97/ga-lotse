/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormikContext } from "formik";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatDateToFullReadableString } from "@eshg/lib-portal/helpers/dateTime";
import { ApiGetCitizenProcedureDetailsResponse } from "@eshg/official-medical-service-api";

import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { BookAppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useManualTranslation } from "@/lib/shared/hooks/useManualTranslation";

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
      <Stack gap={1} data-testid="appointment-summary" role="list">
        <DetailsItem
          slotProps={{
            stack: { role: "listitem" },
          }}
          label={t("sidePanel.concernAndDuration", {
            context: "label",
          })}
          value={`${concernName} ${t("sidePanel.appointmentDuration", { durationInMinutes: appointmentTypeConfig?.standardDurationInMinutes })}`}
          icon={<MedicalServicesOutlined />}
          hiddenLabel
        />
        {values.appointment && (
          <>
            <DetailsItem
              slotProps={{
                stack: { role: "listitem" },
              }}
              label={t("sidePanel.date", {
                context: "label",
              })}
              value={formatDateToFullReadableString(values.appointment?.start)}
              icon={<DateRange />}
              hiddenLabel
            />
            <DetailsItem
              slotProps={{
                stack: { role: "listitem" },
              }}
              label={t("sidePanel.time", {
                context: "label",
              })}
              value={t("sidePanel.time", {
                appointmentStart: formatTime(values.appointment?.start),
              })}
              icon={<AccessTimeOutlined />}
              hiddenLabel
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
