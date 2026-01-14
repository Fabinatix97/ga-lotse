/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import {
  InputField,
  NumberField,
  OptionalFieldValue,
  RadioButtonsField,
  SelectField,
  YearField,
  createFieldNameMapper,
  isEmptyString,
} from "@eshg/lib-portal";

import { AnamnesisFormValues } from "../../config/form";
import {
  useFillingPersonOptions,
  useMaritalStatusOptions,
} from "../../hooks/options";

import { SectionSheet } from "./SectionSheet";

export function AffectedPersonSection(props: Readonly<{ citizen?: boolean }>) {
  const affectedPersonInfo = createFieldNameMapper("affectedPersonInfo");
  const { values, setFieldValue } = useFormikContext<AnamnesisFormValues>();

  function handleNumberOfChildrenChange(newValue: OptionalFieldValue<number>) {
    const birthYearsCount =
      values.affectedPersonInfo?.yearsOfBirthOfChildren.length;
    if (newValue !== "" && newValue < birthYearsCount) {
      for (let i = newValue; i < birthYearsCount; i++) {
        void setFieldValue(
          affectedPersonInfo(`yearsOfBirthOfChildren.${i}`),
          undefined,
        );
      }
    }
  }

  return (
    <MemoizedAffectedPersonSection
      numberOfChildren={values.affectedPersonInfo.numberOfChildren}
      onNumberOfChildrenChange={(newValue) =>
        handleNumberOfChildrenChange(newValue)
      }
      {...props}
    />
  );
}

const MemoizedAffectedPersonSection = memo(InnerAffectedPersonSection);

interface InnerAffectedPersonSectionProps {
  citizen?: boolean;
  numberOfChildren: OptionalFieldValue<number>;
  onNumberOfChildrenChange: (newValue: OptionalFieldValue<number>) => void;
}
function InnerAffectedPersonSection(props: InnerAffectedPersonSectionProps) {
  const { t } = useTranslation("officialMedicalService/anamnesis", {
    keyPrefix: "content.affectedPerson",
  });
  const affectedPersonInfo = createFieldNameMapper("affectedPersonInfo");

  const fillingPersonOptions = useFillingPersonOptions(!!props.citizen);
  const maritalStatusOptions = useMaritalStatusOptions();

  return (
    <SectionSheet title={t("title")} citizen={props.citizen}>
      <RadioButtonsField
        options={fillingPersonOptions}
        name={affectedPersonInfo("fillingPerson")}
        label={t("fillingPerson.label")}
        orientation="vertical"
        required={t("fillingPerson.required")}
      />
      <SelectField
        options={maritalStatusOptions}
        name={affectedPersonInfo("maritalStatus")}
        label={t("maritalStatus.label")}
        placeholder={t("maritalStatus.placeholder")}
        required={t("maritalStatus.required")}
      />
      <Stack gap={3} direction="row" useFlexGap sx={{ flexWrap: "wrap" }}>
        <NumberField
          name={affectedPersonInfo("numberOfChildren")}
          label={t("numberOfChildren.label")}
          min={0}
          required={t("numberOfChildren.required")}
          onChange={(newValue) => props.onNumberOfChildrenChange(newValue)}
        />
        {!isEmptyString(props.numberOfChildren) &&
          (props.numberOfChildren > 5 ? (
            <>
              <YearField
                name={affectedPersonInfo(`yearsOfBirthOfChildren.${0}`)}
                label={t("yearsOfBirthOfChildren.firstChildLabel")}
                min={1900}
                max={new Date().getFullYear()}
              />
              <YearField
                name={affectedPersonInfo(`yearsOfBirthOfChildren.${1}`)}
                label={t("yearsOfBirthOfChildren.lastChildLabel")}
                min={1900}
                max={new Date().getFullYear()}
              />
            </>
          ) : (
            Array.from(Array(props.numberOfChildren).keys()).map((index) => (
              <YearField
                key={index}
                name={affectedPersonInfo(`yearsOfBirthOfChildren.${index}`)}
                label={t("yearsOfBirthOfChildren.label", { index: index + 1 })}
                min={1900}
                max={new Date().getFullYear()}
              />
            ))
          ))}
      </Stack>
      <InputField
        name={affectedPersonInfo("occupation")}
        label={t("occupation.label")}
      />
    </SectionSheet>
  );
}
