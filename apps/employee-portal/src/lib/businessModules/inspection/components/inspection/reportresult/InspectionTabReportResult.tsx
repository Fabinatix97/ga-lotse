/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Grid } from "@mui/joy";

import { BottomToolbar, ButtonBar } from "@eshg/lib-employee-portal";

import { useConfiguration } from "@/lib/businessModules/inspection/api/clients";
import { useGetInspectionAndLoadEditor } from "@/lib/businessModules/inspection/api/queries/inspectionReport";
import { InspectionResultSidePanel } from "@/lib/businessModules/inspection/components/inspection/reportresult/InspectionResultSidePanel";
import { ReportApprovalButtons } from "@/lib/businessModules/inspection/components/inspection/reportresult/ReportApprovalButtons";
import { ReportDownloadButtons } from "@/lib/businessModules/inspection/components/inspection/reportresult/ReportDownloadButtons";
import { ContentDisplay } from "@/lib/shared/components/contentEditor/ContentDisplay";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

interface InspectionTabReportResultProps {
  inspectionId: string;
}

export function InspectionTabReportResult({
  inspectionId,
}: Readonly<InspectionTabReportResultProps>) {
  const {
    data: { inspection, editorData },
  } = useGetInspectionAndLoadEditor(inspectionId);

  const elements = editorData.editorBody.elements;
  const { basePath } = useConfiguration();

  return (
    <Box display="contents" role="tabpanel">
      <Grid
        container
        m={2}
        spacing={3}
        sx={{
          flexGrow: "1",
          overflow: { xxs: "auto", lg: "hidden" },
          flexDirection: { xxs: undefined, lg: "row" },
        }}
      >
        <Grid
          xs={12}
          lg={9}
          sx={{
            flexGrow: "1 !important",
            maxHeight: { lg: "100%" },
            overflow: "hidden",
            order: { xxs: 1, lg: 0 },
          }}
        >
          <ContentDisplay
            elements={elements}
            readonly
            sx={{ maxHeight: { lg: "100%" }, overflowY: "auto" }}
            imagesBasePath={`${basePath}/checklists/file/`}
          />
        </Grid>
        <Grid xxs={12} lg={3} sx={{ order: { xxs: 0, lg: 1 } }}>
          <InspectionResultSidePanel inspection={inspection} />
        </Grid>
      </Grid>

      <StickyBottomBox>
        <BottomToolbar>
          <ButtonBar
            left={<ReportDownloadButtons reportId={editorData.id} />}
            right={<ReportApprovalButtons inspection={inspection} />}
          />
        </BottomToolbar>
      </StickyBottomBox>
    </Box>
  );
}
