/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CakeOutlined, PersonOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  InternalLinkButton,
  formatDate,
  formatPersonName,
  useMultiStepForm,
} from "@eshg/lib-portal";
import { ApiCitizenChild } from "@eshg/school-entry-api";

import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

interface CitizenAnamnesisSidePanelProps {
  child: ApiCitizenChild;
}

export function CitizenAnamnesisSidePanel({
  child,
}: CitizenAnamnesisSidePanelProps) {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  const name = formatPersonName(child);
  const dateOfBirth = formatDate(child.dateOfBirth);
  const { handleSubmit } = useFormikContext();
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();
  const citizenRoutes = useCitizenRoutes();
  return (
    <ContentSheet>
      <InfoSection icon={<PersonOutlined />}>
        <InfoSectionTitle level={2}>{t("result.name")}</InfoSectionTitle>
        <Typography>{name}</Typography>
      </InfoSection>
      <InfoSection icon={<CakeOutlined />}>
        <InfoSectionTitle level={2}>{t("result.birthday")}</InfoSectionTitle>
        <Typography>{dateOfBirth}</Typography>
      </InfoSection>
      {currentStep < totalSteps && (
        <Button onClick={goForward}>{t("result.continue")}</Button>
      )}
      {currentStep === 1 && (
        <InternalLinkButton
          variant="soft"
          color="neutral"
          href={citizenRoutes.appointment.index(undefined)}
        >
          {t("result.abort")}
        </InternalLinkButton>
      )}
      {currentStep === totalSteps && (
        <Button onClick={() => handleSubmit()}>{t("result.submit")}</Button>
      )}
      {currentStep > 1 && (
        <Button variant="soft" color="neutral" onClick={goBack}>
          {t("result.back")}
        </Button>
      )}
    </ContentSheet>
  );
}
