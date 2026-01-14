/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { isDefined, isEmpty } from "remeda";

import { RadioGroupField, isNonEmptyString } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/official-medical-service-api";

import { MarkdownAlert } from "@/lib/baseModule/components/MarkdownAlert";
import {
  useGetAppointmentStandardDurationsQuery,
  useGetConcerns,
} from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { ConcernFilters } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/ConcernFilters";
import { useConcernFilterValues } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/useConcernFilterValues";
import { RadioSheet } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioSheet";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
  useSectionTitleId,
} from "@/lib/shared/components/layout/contentSheet";

export function ConcernStep() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const { setFieldValue, values } = useFormikContext<AppointmentFormValues>();

  const [
    {
      data: { concerns, infobox },
    },
    { data: appointmentTypes },
  ] = useSuspenseQueries({
    queries: [useGetConcerns(), useGetAppointmentStandardDurationsQuery()],
  });

  const numberOfCategories = [
    ...new Set(concerns.map((concern) => concern.categoryNameDe)),
  ].length;

  useEffect(() => {
    if (!isEmpty(values.concern.index)) {
      const tmp = concerns[Number(values.concern.index)];
      if (isDefined(tmp)) {
        void (async () => {
          await setFieldValue("concern", {
            index: values.concern.index,
            appointmentType: tmp.appointmentType,
            standardDurationInMinutes: isDefined(tmp.appointmentType)
              ? appointmentTypes[tmp.appointmentType]
              : undefined,
            categoryNameDe: tmp.categoryNameDe,
            categoryNameEn: tmp.categoryNameEn,
            highPriority: tmp.highPriority,
            nameDe: tmp.nameDe,
            nameEn: tmp.nameEn,
          });
        })();
      }
    }
  }, [concerns, appointmentTypes, setFieldValue, values.concern.index]);

  return (
    <ContentSheet data-testid="concern-form">
      <ContentSheetTitle>{t("concern.title")}</ContentSheetTitle>
      {infobox && <MarkdownAlert color="primary" source={infobox} />}
      <Typography level="body-md" data-testid="description">
        {t("concern.description")}
      </Typography>
      {numberOfCategories > 1 && <ConcernFilters allConcerns={concerns} />}
      <ConcernStepRadioGroup data={concerns} />
    </ContentSheet>
  );
}

function ConcernStepRadioGroup(props: { data: ApiConcern[] }) {
  const titleId = useSectionTitleId();
  const { t, i18n } = useTranslation(["officialMedicalService/appointment"]);
  const filterValues = useConcernFilterValues();
  return (
    <Stack gap={1}>
      <RadioGroupField
        name="concern.index"
        aria-labelledby={titleId}
        required={t("concern.fields.concern_required")}
      >
        <Stack gap={2}>
          {props.data
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
                />
              );
            })}
        </Stack>
      </RadioGroupField>
    </Stack>
  );
}
