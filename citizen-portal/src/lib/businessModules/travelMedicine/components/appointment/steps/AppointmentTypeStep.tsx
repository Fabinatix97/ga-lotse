/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
} from "@eshg/citizen-portal-api/travelMedicine";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { List, ListItem, Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { TOptions } from "i18next";
import { ReactNode, useState } from "react";

import { useGetAllAppointmentTypesForCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { InfoIconButton } from "@/lib/businessModules/travelMedicine/components/shared/components/InfoIconButton";
import { InfoModal } from "@/lib/businessModules/travelMedicine/components/shared/components/InfoModal";
import { RadioSheet } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioSheet";
import { RadioGroupField } from "@/lib/businessModules/travelMedicine/components/shared/components/formField/RadioGroupField";
import { useDepartmentContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { useTranslation } from "@/lib/i18n/client";

function handleModalText(
  allAppointmentTypesForCitizen: ApiAppointmentTypeConfig[],
  modalTitle: string,
  t: (key: string | string[], tOptions?: TOptions) => string,
): ReactNode {
  const vaccinationStandardDuration = allAppointmentTypesForCitizen.find(
    (type) => type.appointmentTypeDto == ApiAppointmentType.Vaccination,
  )!.standardDurationInMinutes;

  const consultationStandardDuration = allAppointmentTypesForCitizen.find(
    (type) => type.appointmentTypeDto == ApiAppointmentType.Consultation,
  )!.standardDurationInMinutes;

  if (
    modalTitle === t("appointmentTypeFormContent.fields.vaccination.modalTitle")
  ) {
    return (
      <>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.vaccination.modalTextParagraph1",
            { appointmentDuration: vaccinationStandardDuration },
          )}
        </Typography>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.vaccination.modalTextParagraph2",
          )}
        </Typography>
      </>
    );
  } else if (
    modalTitle ===
    t("appointmentTypeFormContent.fields.consultation.modalTitle")
  ) {
    return (
      <>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.consultation.modalTextParagraph1",
            { appointmentDuration: consultationStandardDuration },
          )}
        </Typography>
        <Typography>
          {t(
            "appointmentTypeFormContent.fields.consultation.modalTextParagraph2",
          )}
        </Typography>
      </>
    );
  } else if (
    modalTitle === t("appointmentTypeFormContent.confirmation.modalTitle")
  ) {
    return (
      <Typography>
        {t("appointmentTypeFormContent.confirmation.modalText")}
      </Typography>
    );
  }
}
export function AppointmentTypeStep() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { department } = useDepartmentContext();
  const phoneNumber = department!.phoneNumber;
  const { values, setFieldValue } =
    useFormikContext<InitialAppointmentFormValues>();

  function isAppointmentResetNeeded() {
    return !!values.initialStepAppointmentType;
  }

  function resetAppointmentBlockDateValue() {
    void setFieldValue("appointmentBlockDate", "");
  }

  const allAppointmentTypesForCitizen =
    useGetAllAppointmentTypesForCitizen().data;

  return (
    <>
      <FormSheet data-testid="appointment-type-content-form">
        <FormSheetTitle>{t("appointmentTypeFormContent.title")}</FormSheetTitle>
        <Alert
          title={t("appointmentTypeFormContent.infoHeader")}
          color={"primary"}
          message={<AlertMessage />}
        />
        <RadioGroupField
          name="initialStepAppointmentType"
          sx={{ gap: 2 }}
          required={t("appointmentTypeFormContent.fields.error")}
          withErrorDecorator={true}
          onChange={() => {
            if (isAppointmentResetNeeded()) {
              resetAppointmentBlockDateValue();
            }
          }}
        >
          <RadioSheet
            label={t("appointmentTypeFormContent.fields.vaccination.label")}
            value={ApiAppointmentType.Vaccination}
            endDecorator={
              <InfoIconButton
                disabled={false}
                label={t(
                  "appointmentTypeFormContent.fields.vaccination.iconLabel",
                )}
                onClick={() => {
                  setIsOpen((isOpen) => !isOpen);
                  setModalTitle(
                    t(
                      "appointmentTypeFormContent.fields.vaccination.modalTitle",
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
          ></RadioSheet>
          <RadioSheet
            label={t("appointmentTypeFormContent.fields.consultation.label")}
            value={ApiAppointmentType.Consultation}
            endDecorator={
              <InfoIconButton
                disabled={false}
                label={t(
                  "appointmentTypeFormContent.fields.consultation.iconLabel",
                )}
                onClick={() => {
                  setIsOpen((isOpen) => !isOpen);
                  setModalTitle(
                    t(
                      "appointmentTypeFormContent.fields.consultation.modalTitle",
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
          ></RadioSheet>
        </RadioGroupField>

        <Typography>
          {t("appointmentTypeFormContent.confirmation.info", { phoneNumber })}
        </Typography>
        <Sheet
          component="label"
          variant="outlined"
          sx={{
            padding: "11px 16px 11px 16px",
            alignItems: "center",
            borderRadius: "md",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography level={"title-md"}>
              {t("appointmentTypeFormContent.confirmation.label")}
              <Typography level={"body-md"}>
                {t("appointmentTypeFormContent.confirmation.subtitle")}
              </Typography>
            </Typography>
            <InfoIconButton
              disabled={false}
              label={t("appointmentTypeFormContent.confirmation.iconLabel")}
              onClick={() => {
                setIsOpen((isOpen) => !isOpen);
                setModalTitle(
                  t("appointmentTypeFormContent.confirmation.modalTitle"),
                );
              }}
            />
          </Stack>
        </Sheet>
      </FormSheet>

      <InfoModal
        modalTitle={modalTitle}
        onClose={() => setIsOpen((isOpen) => !isOpen)}
        open={isOpen}
      >
        {handleModalText(allAppointmentTypesForCitizen, modalTitle, t)}
      </InfoModal>
    </>
  );
}

function AlertMessage() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { department } = useDepartmentContext();
  const phoneNumber = department!.phoneNumber;
  return (
    <List
      marker="disc"
      sx={{
        "--List-gap:": "0.5px",
        "--ListItem-minHeight:": 0,
        "--ListItem-paddingY:": 0,
        "--ListDivider-gap:": 0,
        "--ListItem-paddingLeft:": 0,
        fontWeight: 500,
      }}
    >
      <ListItem>{t("appointmentTypeFormContent.infoTextListItem1")}</ListItem>
      <ListItem>
        {t("appointmentTypeFormContent.infoTextListItem2", {
          phoneNumber,
        })}
      </ListItem>
    </List>
  );
}
