/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { isDefined, isEmpty } from "remeda";

import {
  useGetAllAppointmentTypesQuery,
  useGetConcerns,
} from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { ConcernFilters } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/ConcerFilters";
import { useConcernFilterValues } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/useConcernFilterValues";
import { RadioSheet } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioSheet";
import { RadioGroupField } from "@/lib/businessModules/travelMedicine/components/shared/components/formField/RadioGroupField";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function ConcernStep() {
  const { t, i18n } = useTranslation(["officialMedicalService/appointment"]);
  const { setFieldValue, values } = useFormikContext<AppointmentFormValues>();
  const filterValues = useConcernFilterValues();

  const [{ data }, { data: appointmentTypes }] = useSuspenseQueries({
    queries: [useGetConcerns(), useGetAllAppointmentTypesQuery()],
  });

  const numberOfCategories = [
    ...new Set(data.map((concern) => concern.categoryNameDe)),
  ].length;

  useEffect(() => {
    if (!isEmpty(values.concern.index)) {
      const tmp = data[Number(values.concern.index)];
      if (isDefined(tmp)) {
        void (async () => {
          await setFieldValue("concern", {
            index: values.concern.index,
            appointmentType: tmp.appointmentType,
            standardDurationInMinutes: appointmentTypes
              .filter((item) => item.appointmentTypeDto === tmp.appointmentType)
              .map((i) => i.standardDurationInMinutes)
              .toString(),
            categoryNameDe: tmp.categoryNameDe,
            categoryNameEn: tmp.categoryNameEn,
            highPriority: tmp.highPriority,
            nameDe: tmp.nameDe,
            nameEn: tmp.nameEn,
          });
        })();
      }
    }
  }, [data, appointmentTypes, setFieldValue, values.concern.index]);

  return (
    <ContentSheet data-testid={"concern-form"}>
      <Typography level="h2">{t("concern.title")}</Typography>
      <Alert
        title={t("concern.infoText.title")}
        color="primary"
        message={t("concern.infoText.description")}
      />
      <Typography level="body-md" data-testid={"description"}>
        {t("concern.description")}
      </Typography>
      {numberOfCategories > 1 && <ConcernFilters allConcerns={data} />}
      <Stack gap={1}>
        <RadioGroupField
          name="concern.index"
          required={t("concern.fields.concern_required")}
          sx={{ gap: 2 }}
        >
          {data
            .filter((item) =>
              isNonEmptyString(filterValues.category)
                ? item.categoryNameDe === filterValues.category
                : item,
            )
            .map((concern, index) => {
              return (
                <RadioSheet
                  key={`${concern.nameDe}.${index}`}
                  label={
                    i18n.language === "en" && isDefined(concern.nameEn)
                      ? concern.nameEn
                      : concern.nameDe
                  }
                  value={index}
                  radioProps={{
                    sx: (theme) => ({
                      label: { ...theme.typography["title-md"] },
                      alignItems: "center",
                    }),
                  }}
                ></RadioSheet>
              );
            })}
        </RadioGroupField>
      </Stack>
    </ContentSheet>
  );
}
