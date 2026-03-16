/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, styled } from "@mui/joy";

import {
  CheckboxField,
  DateField,
  EmailField,
  InputField,
  PhoneNumberField,
  SelectField,
  useValidatePhoneNumber,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { salutationOptions } from "@/lib/businessModules/infectionBriefing/helpers/translations";
import { StepSubTitle } from "@/lib/businessModules/infectionBriefing/shared/components/StepSubTitle";
import { useTranslation } from "@/lib/i18n/client";

export function PersonalDataStep() {
  const { t } = useTranslation("infectionBriefing/forms");
  const validatePhoneNumber = useValidatePhoneNumber();

  return (
    <Sheet
      sx={{ backgroundColor: (theme) => theme.palette.background.body }}
      data-testid="appointment.personalData"
    >
      <StepSubTitle title={t("personal_data.title")} />
      <PersonalDataGrid>
        <SelectField
          name="affectedPerson.salutation"
          label={t("personal_data.fields.salutation")}
          options={salutationOptions(t)}
        />
        <InputField
          label={t("personal_data.fields.firstName")}
          name="affectedPerson.firstName"
          required={t("personal_data.fields.firstName_required")}
        />
        <InputField
          label={t("personal_data.fields.lastName")}
          name="affectedPerson.lastName"
          required={t("personal_data.fields.lastName_required")}
        />
        <DateField
          label={t("personal_data.fields.dateOfBirth")}
          name="affectedPerson.dateOfBirth"
          required={t("personal_data.fields.dateOfBirth_required")}
          validate={validateDateOfBirth}
        />
        <PhoneNumberField
          label={t("personal_data.fields.phoneNumber")}
          name="affectedPerson.phoneNumber"
          validate={validatePhoneNumber}
        />
        <EmailField
          label={t("personal_data.fields.emailAddress")}
          name="affectedPerson.email"
          required={t("personal_data.fields.emailAddress_required")}
        />
        <CheckboxField
          name="confirmOnlineServices"
          label={t("personal_data.fields.confirmOnlineServices")}
          required={t("personal_data.fields.confirmOnlineServices_required")}
        />
      </PersonalDataGrid>
    </Sheet>
  );
}

const PersonalDataGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));
