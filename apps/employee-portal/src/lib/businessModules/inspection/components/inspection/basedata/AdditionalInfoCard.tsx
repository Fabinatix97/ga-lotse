/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";

import { ApiInspection } from "@eshg/inspection-api";
import {
  DetailsItem,
  DetailsSection,
  InformationSheet,
} from "@eshg/lib-employee-portal";
import { Alert, formatPersonName } from "@eshg/lib-portal";

import { useEditAdditionalInfoSidebar } from "@/lib/businessModules/inspection/components/inspection/basedata/EditAdditionalInfoSidebar";
import { translateInspectionType } from "@/lib/businessModules/inspection/shared/enums";

export function AdditionalInfoCard({
  inspection,
  readonly,
}: Readonly<{
  inspection: ApiInspection;
  readonly?: boolean;
}>) {
  const editAdditionalInfoSidebar = useEditAdditionalInfoSidebar();

  function extractClosingRemark(remark: unknown): string | null {
    if (typeof remark !== "string") return null;
    return remark.split(":").slice(1).join(":");
  }
  const value = extractClosingRemark(inspection.closingRemark);

  return (
    <InformationSheet>
      {!inspection.assignee && (
        <Alert
          color="primary"
          message="Die Begehung muss eine:r Bearbeiter:in zugewiesen sein."
        />
      )}
      <DetailsSection
        data-testid="additionalInformation"
        title="Zusatzinfos"
        canEdit={!readonly}
        onEdit={() => editAdditionalInfoSidebar.open({ inspection })}
      >
        <Grid container direction="column" gap={2}>
          <DetailsItem
            label="Aktenzeichen"
            value={inspection.facility.fileNumber}
          />
          <DetailsItem
            label="Begehungsart"
            value={translateInspectionType(inspection.type)}
          />
          <DetailsItem
            label="Besonderheiten"
            value={inspection.challenging ? "Schwierige Gegebenheit" : "keine"}
          />
          <DetailsItem
            label="Zugewiesene:r Bearbeiter:in"
            value={
              inspection.assignee
                ? formatPersonName({
                    firstName: inspection.assignee?.firstName,
                    lastName: inspection.assignee?.lastName,
                  })
                : "-"
            }
          />
          {typeof inspection.closingRemark === "string" &&
          inspection.closingRemark ? (
            <DetailsItem
              label="Vermerk zur Schließung des Vorgangs"
              value={value}
            />
          ) : null}
        </Grid>
      </DetailsSection>
    </InformationSheet>
  );
}
