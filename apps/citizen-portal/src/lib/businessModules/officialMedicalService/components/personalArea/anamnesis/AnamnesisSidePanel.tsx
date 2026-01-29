/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { Dispatch, SetStateAction } from "react";

import { ANAMNESIS_TOTAL_STEPS } from "@/lib/businessModules/officialMedicalService/components/personalArea/anamnesis/common";
import { BookAppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

interface AnamnesisSidePanelProps {
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
}

export function AnamnesisSidePanel({
  stepIndex,
  setStepIndex,
}: AnamnesisSidePanelProps) {
  const { t } = useTranslation(["officialMedicalService/anamnesis"]);
  const { handleSubmit } = useFormikContext<BookAppointmentFormValues>();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  return (
    <ContentSheet>
      <Stack gap={2}>
        <Button color="primary" variant="solid" onClick={() => handleSubmit()}>
          {stepIndex < ANAMNESIS_TOTAL_STEPS - 1
            ? t("sidePanel.next")
            : t("sidePanel.submit")}
        </Button>
        {stepIndex > 0 && (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setStepIndex((i) => i - 1);
            }}
          >
            {t("sidePanel.back")}
          </Button>
        )}
        <ScopedInternalLinkButton
          variant="soft"
          color="neutral"
          href={citizenRoutes.personalArea.index(accessCode)}
        >
          {t("sidePanel.cancel")}
        </ScopedInternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
