/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  LOCALE_OPTION,
  formatCurrency,
} from "@eshg/lib-portal/formatters/numbers";
import { List, ListItem, ListItemContent, Stack, Typography } from "@mui/joy";

import { useGetAllDiseasesCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";

export function VaccinationStep() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const diseases = useGetAllDiseasesCitizen().data.diseases;

  return (
    <FormSheet data-testid="vaccination-data-content-form">
      <FormSheetTitle>{t("vaccinationFormContent.title")}</FormSheetTitle>
      <Stack gap={2}>
        <Typography level={"body-md"}>
          {t("vaccinationFormContent.info")}
        </Typography>
        <Stack width={"50%"}>
          <List>
            {diseases.map((el, index) => (
              <ListItem key={`vaccine[${el.name}.${index}]`}>
                <ListItemContent>
                  <Typography level="body-md">{el.name}</Typography>
                </ListItemContent>
                <Typography level="body-sm">
                  {formatCurrency(el.estimatedFee, {
                    localOption: LOCALE_OPTION.auto,
                  })}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </FormSheet>
  );
}
