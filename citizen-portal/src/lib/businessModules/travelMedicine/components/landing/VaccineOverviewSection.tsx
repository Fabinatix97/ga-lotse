/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";

import { useGetAllDiseasesCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function VaccineOverviewSection() {
  const diseases = useGetAllDiseasesCitizen().data.diseases;

  return (
    <ContentSheet>
      <ContentSheetTitle>Verfügbare Impfungen</ContentSheetTitle>
      {diseases && (
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
      )}
    </ContentSheet>
  );
}
