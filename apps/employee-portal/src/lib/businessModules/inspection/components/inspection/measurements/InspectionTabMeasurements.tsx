/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, useTheme } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useWindowDimensions } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { SamplesTile } from "@/lib/businessModules/inspection/components/inspection/measurements/sample/SamplesTile";

interface InspectionTabMeasurementsProps {
  inspectionId: string;
}

export function InspectionTabMeasurements({
  inspectionId,
}: Readonly<InspectionTabMeasurementsProps>) {
  const inspectionApi = useInspectionApi();
  const userApi = useUserApi();

  const [{ data: inspection }] = useSuspenseQueries({
    queries: [
      getInspectionQuery(inspectionApi, inspectionId),
      getSelfUserQuery(userApi),
    ],
  });

  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isLargeLayout = width && width >= theme.breakpoints.values.lg;

  if (isLargeLayout) {
    return (
      <Box display="contents" role="tabpanel">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "min-content",
          }}
        >
          <SamplesTile procedureId={inspection.externalId} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box display="contents" role="tabpanel">
        <Box
          sx={{
            display: "grid",
            flexDirection: "column",
            gap: 2,
            paddingBottom: 2,
          }}
        >
          <SamplesTile procedureId={inspection.externalId} />
        </Box>
      </Box>
    );
  }
}
