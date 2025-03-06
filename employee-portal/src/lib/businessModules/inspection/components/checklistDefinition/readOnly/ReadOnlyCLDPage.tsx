/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChecklistDefinitionVersion } from "@eshg/inspection-api";
import { useHeaderHeights, useLayoutConfig } from "@eshg/lib-employee-portal";
import { InfoOutlined } from "@mui/icons-material";
import { Alert, Box } from "@mui/joy";
import { ReactNode } from "react";

import { CLDInfoCard } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/CLDInfoCard";
import { ReadOnlyCLDContent } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/ReadOnlyCLDContent";

interface ReadOnlyCLDPageProps {
  cldVersion: ApiChecklistDefinitionVersion;
  infoCard?: ReactNode;
}

export function ReadOnlyCLDPage({
  cldVersion,
  infoCard,
}: Readonly<ReadOnlyCLDPageProps>) {
  const { headerHeightDesktop } = useHeaderHeights();
  const { simpleToolbarHeight } = useLayoutConfig();

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: "3fr 1fr",
        gridTemplateAreas: {
          xxs: '"alert alert" "info info" "content content"',
          lg: '"alert alert" "content info"',
        },
      }}
    >
      <Alert
        color="primary"
        startDecorator={<InfoOutlined />}
        sx={{ gridArea: "alert" }}
      >
        Veröffentlichte Checklisten-Definitionen können nicht bearbeitet werden.
      </Alert>
      <Box
        sx={{
          position: { lg: "sticky" },
          top: (theme) =>
            `calc(${headerHeightDesktop} + ${simpleToolbarHeight} + ${theme.spacing(2)})`,
          alignSelf: "flex-start",
          gridArea: "info",
        }}
      >
        {infoCard ?? <CLDInfoCard cldVersion={cldVersion} />}
      </Box>
      <ReadOnlyCLDContent
        cldVersion={cldVersion}
        sx={{ gridArea: "content" }}
      />
    </Box>
  );
}
