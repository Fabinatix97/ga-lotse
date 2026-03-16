/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import { ApiAppointmentType } from "@eshg/infection-briefing-api";
import { Alert, RadioGroupField } from "@eshg/lib-portal";

import { AppointmentFormData } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";
import {
  ImportantInformationAlertList,
  InfoIconButton,
  InfoModal,
  RadioSheet,
} from "@/lib/businessModules/infectionBriefing/shared/components";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentTypeStep() {
  const { t } = useTranslation("infectionBriefing/forms");
  const { values, setFieldValue } = useFormikContext<AppointmentFormData>();
  return (
    <div>
      <Sheet sx={{ backgroundColor: (theme) => theme.palette.background.body }}>
        <Typography level="h2">
          {t("appointmentTypeFormContent.title")}
        </Typography>
        <Alert
          title={t("appointmentTypeFormContent.infoHeader")}
          color="primary"
          message={<ImportantInformationAlertList />}
          messageComponent="span"
          sx={{ marginTop: "24px", marginBottom: "12px" }}
        />
        <RadioGroupField
          name="appointmentType"
          required={t("appointmentTypeFormContent.fields.error")}
          onChange={(value) => {
            void setFieldValue("appointmentType", value);
          }}
        >
          <Stack gap={2}>
            <RadioSheet
              label={t(
                "appointmentTypeFormContent.fields.newInfectionBriefing.label",
              )}
              value={ApiAppointmentType.InfectionBriefingNew}
              endDecorator={
                <InfoIconButton
                  disabled={false}
                  label={t(
                    "appointmentTypeFormContent.fields.newInfectionBriefing.iconLabel",
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    void setFieldValue("isInfoModalOpen", true);
                    void setFieldValue(
                      "infoModalTitle",
                      t(
                        "appointmentTypeFormContent.fields.newInfectionBriefing.modalTitle",
                      ),
                    );
                  }}
                />
              }
              radioProps={{
                sx: (theme) => ({
                  label: { ...theme.typography["title-md"] },
                  alignItems: "center",
                }),
              }}
            />
            <RadioSheet
              label={t(
                "appointmentTypeFormContent.fields.replacementInfectionBriefing.label",
              )}
              value={ApiAppointmentType.InfectionBriefingReplacement}
              endDecorator={
                <InfoIconButton
                  disabled={false}
                  label={t(
                    "appointmentTypeFormContent.fields.replacementInfectionBriefing.iconLabel",
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    void setFieldValue("isInfoModalOpen", true);
                    void setFieldValue(
                      "infoModalTitle",
                      t(
                        "appointmentTypeFormContent.fields.replacementInfectionBriefing.modalTitle",
                      ),
                    );
                  }}
                />
              }
              radioProps={{
                sx: (theme) => ({
                  label: { ...theme.typography["title-md"] },
                  alignItems: "center",
                }),
              }}
            />
          </Stack>
        </RadioGroupField>
      </Sheet>

      <InfoModal
        modalTitle={values.infoModalTitle}
        open={values.isInfoModalOpen}
        onClose={() => void setFieldValue("isInfoModalOpen", false)}
      >
        {handleModalText(values.infoModalTitle, t)}
      </InfoModal>
    </div>
  );
}

function handleModalText(
  modalTitle: string,
  t: (key: string | string[]) => string,
): ReactNode {
  if (
    modalTitle ===
    t("appointmentTypeFormContent.fields.newInfectionBriefing.modalTitle")
  ) {
    return (
      <div>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.newInfectionBriefing.modalTextParagraph1",
          )}
        </Typography>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.newInfectionBriefing.modalTextParagraph2",
          )}
        </Typography>
      </div>
    );
  } else if (
    modalTitle ===
    t(
      "appointmentTypeFormContent.fields.replacementInfectionBriefing.modalTitle",
    )
  ) {
    return (
      <div>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.replacementInfectionBriefing.modalTextParagraph1",
          )}
        </Typography>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.replacementInfectionBriefing.modalTextParagraph2",
          )}
        </Typography>
      </div>
    );
  }
}
