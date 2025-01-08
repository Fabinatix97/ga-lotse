/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiFacilityForDuplicateReview } from "@eshg/employee-portal-api/inspection";
import { Radio, Sheet, Stack, Typography } from "@mui/joy";

import { DuplicateTileLine } from "@/lib/businessModules/inspection/components/facility/pending/DuplicateTileLine";

export interface FacilityDuplicateTileProps {
  facility: ApiFacilityForDuplicateReview;
  importedFacility: ApiFacilityForDuplicateReview;
  isImportedFacility: boolean;
}

export function FacilityDuplicateTile({
  facility,
  importedFacility,
  isImportedFacility,
}: Readonly<FacilityDuplicateTileProps>) {
  const badgeText = isImportedFacility ? "Import" : "Stammdaten";
  return (
    <Sheet
      aria-label="Einrichtung"
      sx={{
        padding: 2,
        borderRadius: (theme) => theme.radius.lg,
        border: "1px solid",
        borderColor: isImportedFacility ? "warning.300" : "divider",
        backgroundColor: isImportedFacility ? "warning.100" : "transparent",
      }}
    >
      <Radio
        value={facility.referenceId}
        sx={{ alignItems: "center", width: "100%" }}
        label={
          <Stack direction="column" gap={2}>
            <Typography level="h4" component="p">
              {isImportedFacility
                ? "Daten aus Import bestätigen"
                : "Zusammenführen mit"}
            </Typography>
            <Stack direction="column" gap={1}>
              <DuplicateTileLine
                dataset={facility}
                importedDataset={importedFacility}
                textExtractor={(f) => f.name}
              />
              {facility.objectType?.name && (
                <DuplicateTileLine
                  dataset={facility}
                  importedDataset={importedFacility}
                  textExtractor={(f) => f.objectType!.name}
                />
              )}
              <DuplicateTileLine
                dataset={facility}
                importedDataset={importedFacility}
                textExtractor={(f) => f.street + " " + f.houseNo}
              />
              <DuplicateTileLine
                dataset={facility}
                importedDataset={importedFacility}
                textExtractor={(f) => f.postalCode + " " + f.city}
              />
              <DuplicateTileLine
                dataset={facility}
                importedDataset={importedFacility}
                textExtractor={(f) => f.emailAddresses.join(", ")}
              />
              <DuplicateTileLine
                dataset={facility}
                importedDataset={importedFacility}
                textExtractor={(f) => f.phoneNumbers.join(", ")}
                badgeText={badgeText}
              />
            </Stack>
          </Stack>
        }
      />
    </Sheet>
  );
}
