/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { Trans } from "react-i18next";
import { isDefined } from "remeda";

import { Alert } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { TranslatedList } from "@/lib/businessModules/officialMedicalService/shared/components/TranslatedList";
import { useDepartmentContext } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { formatDepartmentAddress } from "@/lib/shared/formatters/address";

export function InformationCard() {
  const { t, i18n } = useTranslation(["officialMedicalService/appointment"]);
  const { department } = useDepartmentContext();

  return (
    <ContentSheet data-testid="information-card">
      <ContentSheetTitle>{t("appointmentInformation.title")}</ContentSheetTitle>
      {isDefined(department) && (
        <Alert
          color="primary"
          message={
            <Trans
              i18nKey="appointmentInformation.alertMessage"
              ns="officialMedicalService/appointment"
              values={{
                department: formatDepartmentAddress(department),
              }}
            />
          }
        />
      )}
      <Typography>
        <Trans
          i18nKey="appointmentInformation.infoText"
          ns="officialMedicalService/appointment"
          i18n={i18n}
          components={{
            t1: <Typography level="body-md" fontWeight="bold" />,
          }}
        />
      </Typography>
      <Typography>
        {t("appointmentInformation.requiredDocuments_header")}
      </Typography>
      <TranslatedList
        ns="officialMedicalService/appointment"
        translationKey="appointmentInformation.requiredDocuments_list"
        sx={{ fontWeight: theme.fontWeight.xl }}
      />
      <Typography>
        <Trans
          i18nKey="appointmentInformation.closingGreeting"
          ns="officialMedicalService/appointment"
          i18n={i18n}
        />
      </Typography>
    </ContentSheet>
  );
}
