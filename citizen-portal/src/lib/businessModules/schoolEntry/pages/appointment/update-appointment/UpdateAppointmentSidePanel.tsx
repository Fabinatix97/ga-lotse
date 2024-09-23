/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { CakeOutlined, PersonOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { Appointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

interface UpdateAppointmentSidePanelProps {
  childName: string;
  dateOfBirth: string;
  submitting: boolean;
  appointment: Appointment | undefined;
}

export function UpdateAppointmentSidePanel(
  props: UpdateAppointmentSidePanelProps,
) {
  const { t } = useTranslation(["schoolEntry/updateAppointment"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const disabled = useIsFormDisabled();
  return (
    <ContentSheet>
      <ContentSheetTitle>{t("result.title")}</ContentSheetTitle>
      <InfoSection icon={<PersonOutlined />}>
        <InfoSectionTitle>{t("result.name")}</InfoSectionTitle>
        <Typography>{props.childName}</Typography>
      </InfoSection>
      <InfoSection icon={<CakeOutlined />}>
        <InfoSectionTitle>{t("result.birthday")}</InfoSectionTitle>
        <Typography>{props.dateOfBirth}</Typography>
      </InfoSection>
      <SubmitButton
        submitting={props.submitting}
        disabled={props.appointment === undefined || disabled}
      >
        {t("result.confirm")}
      </SubmitButton>
      <Button
        variant="soft"
        color="neutral"
        onClick={() => {
          router.push(citizenRoutes.appointment.index(undefined));
        }}
      >
        {t("result.back")}
      </Button>
    </ContentSheet>
  );
}
