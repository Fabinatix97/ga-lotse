/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";

import { Alert } from "@eshg/lib-portal";

import { AppointmentFormData } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";
import { AppointmentSummary } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentSummary";
import { isAtLeastSixteenYearsOld } from "@/lib/businessModules/infectionBriefing/helpers/age";
import { useTranslation } from "@/lib/i18n/client";

export function SummaryStep() {
  const { t } = useTranslation("infectionBriefing/forms");
  const { values } = useFormikContext<AppointmentFormData>();
  const userAge = values.affectedPerson.dateOfBirth;
  const appointmentStart = values.appointment?.start;
  let isAtLeastSixteen = false;
  if (userAge && appointmentStart) {
    isAtLeastSixteen = isAtLeastSixteenYearsOld(userAge, appointmentStart);
  }

  return (
    <div>
      {!isAtLeastSixteen && (
        <Alert
          title={t("summary.importantInformationTitle")}
          color="primary"
          message={t("summary.importantInformationBody")}
          messageComponent="span"
          sx={{ marginBottom: "24px" }}
        />
      )}
      <AppointmentSummary />
    </div>
  );
}
