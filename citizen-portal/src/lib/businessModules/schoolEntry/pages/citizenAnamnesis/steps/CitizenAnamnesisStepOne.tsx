/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel, Grid, Typography } from "@mui/joy";
import { useMemo } from "react";

import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { CitizenAnamnesisFormValues } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/CitizenAnamnesisForm";
import { ToggleableSection } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/ToggleableSection";
import { COUNTRY_CODE_VALUES } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/translations";
import { SelectionOption } from "@/lib/businessModules/travelMedicine/components/shared/CountryFieldMulti";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

import { CitizenAnamnesisInfoAlert } from "./components/CitizenAnamnesisInfoAlert";
import { CitizenPortalMonthAndYearFields } from "./components/CitizenPortalMonthAndYearFields";

const countryCodeOptions = buildEnumOptions(COUNTRY_CODE_VALUES);

export function CitizenAnamnesisStepOne(props: {
  values: CitizenAnamnesisFormValues;
}) {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  const migrationBackground = createFieldNameMapper("migrationBackground");
  return (
    <ContentSheet>
      <Typography level="h2">{t("contact.title")}</Typography>
      <CitizenAnamnesisInfoAlert />
      <Typography level="h3">{t("contact.schoolchild")}</Typography>
      <ContactForm
        for="child"
        label={t("contact.child")}
        values={props.values}
      />
      <Typography level="h3">{t("contact.parent1Title")}</Typography>
      <ContactForm
        for="firstParent"
        label={t("contact.parent1Label")}
        values={props.values}
      />
      <ToggleableSection
        title={t("contact.additionalParent")}
        name={migrationBackground("secondParent.show")}
      >
        <ContactForm
          for="secondParent"
          label={t("contact.parent2Label")}
          values={props.values}
        />
      </ToggleableSection>
    </ContentSheet>
  );
}

interface ContactFormProps {
  for: "child" | "firstParent" | "secondParent";
  label: string;
  values: CitizenAnamnesisFormValues;
}

function ContactForm(props: ContactFormProps) {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  const migrationBackground = createFieldNameMapper("migrationBackground");
  const options: SelectionOption[] = useMemo(
    () =>
      countryCodeOptions.map((option) => {
        return {
          value: option.value,
          label: t(`countries.${option.value}`),
        };
      }),
    [t],
  );
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        <SelectField
          options={options}
          name={migrationBackground(`${props.for}.countryOfBirth`)}
          label={`${t("migration.countryOfBirth")} ${props.label}`}
        />
      </Grid>
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        <SelectField
          options={options}
          name={migrationBackground(`${props.for}.nationality`)}
          label={`${props.label} ${t("migration.nationality")}`}
        />
      </Grid>
      {props.for === "child" && (
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <FormLabel sx={{ fontSize: "16px", fontWeight: "700" }}>
            {t("migration.inGermanySince")}
          </FormLabel>
          <CitizenPortalMonthAndYearFields
            fieldName={migrationBackground("child.inGermanySince")}
            date={props.values.migrationBackground.child.inGermanySince}
          />
        </Grid>
      )}
    </Grid>
  );
}
