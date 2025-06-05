/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";

import { useGetAllDiseasesCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function VaccineOverviewSection() {
  const { t } = useTranslation(["travelMedicine/landing"]);
  const diseases = useGetAllDiseasesCitizen().data.diseases;

  return (
    diseases.length > 0 && (
      <ContentSheet>
        <ContentSheetTitle>{t("vaccination.title")}</ContentSheetTitle>
        <List
          marker="disc"
          sx={{
            "--List-gap:": "0.5px",
            "--ListItem-minHeight:": 0,
            "--ListItem-paddingY:": 0,
            "--ListDivider-gap:": 0,
            "--ListItem-paddingLeft:": 0,
          }}
        >
          {diseases.map((el, index) => (
            <ListItem key={`vaccine[${el.name}.${index}]`}>{el.name}</ListItem>
          ))}
        </List>
      </ContentSheet>
    )
  );
}
