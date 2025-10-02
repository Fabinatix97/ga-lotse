/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CheckmarkIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/SimCardDownloadOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Typography,
  accordionDetailsClasses,
  accordionSummaryClasses,
  styled,
} from "@mui/joy";
import { useId } from "react";

import { ApiGetGdprProcedureResponse } from "@eshg/base-api";
import { NoSearchResults } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import {
  useDownloadBaseModulePackage,
  useDownloadPackageFileByModule,
  useGetGdprDownloadPackagesInfo,
} from "@/lib/shared/api/queries/gdpr";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

function useFileDownloadForPackage() {
  const downloadPackage = useDownloadPackageFileByModule();
  return useFileDownload(
    (params: { businessModule: ApiBusinessModule; packageId: string }) =>
      downloadPackage(params.businessModule, params.packageId),
  );
}

function useFileDownloadForBase(gdprProcedureId: string) {
  const download = useDownloadBaseModulePackage();
  return useFileDownload(() => download(gdprProcedureId));
}

export function GdprDownloadPackagesTile({
  gdprProcedure,
  hasDownload,
  isExternal,
}: {
  gdprProcedure: ApiGetGdprProcedureResponse;
  hasDownload: boolean;
  isExternal: boolean;
}) {
  const responses = useGetGdprDownloadPackagesInfo(
    gdprProcedure.id,
    hasDownload && !isExternal,
  );
  const businessModuleDownload = useFileDownloadForPackage();
  const baseDownload = useFileDownloadForBase(gdprProcedure.id);
  const id = useId();

  return (
    <SectionTile id={id}>
      <SectionTitle id={id}>Datenpakete</SectionTitle>

      {isExternal ? (
        <Typography
          sx={{ textWrap: "pretty" }}
          startDecorator={<CheckmarkIcon color="success" size="lg" />}
        >
          Verfügbare Daten wurden übermittelt und können nun vom Antragsteller
          abgerufen werden.
        </Typography>
      ) : !hasDownload ? (
        <NoSearchResults info="Keine Daten gefunden." />
      ) : (
        <AccordionGroup variant="outlined" color="primary">
          <StyledAccordion>
            <AccordionSummary>Stammdaten</AccordionSummary>
            <AccordionDetails>
              <List sx={{ padding: 1 }}>
                <ListItem>
                  <ListItemButton
                    variant="soft"
                    onClick={() => baseDownload.download()}
                  >
                    <ListItemDecorator>
                      <DownloadIcon />
                    </ListItemDecorator>
                    Datenpaket 1
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </StyledAccordion>
          {responses
            .filter((response) => response.data.downloadPackages.length > 0)
            .map((response) => (
              <StyledAccordion key={response.data.businessModule}>
                <AccordionSummary>
                  {businessModuleNames[response.data.businessModule]}
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ padding: 1 }}>
                    {response.data.downloadPackages.map((pkg, index) => (
                      <ListItem key={pkg.id}>
                        <ListItemButton
                          variant="soft"
                          onClick={() =>
                            businessModuleDownload.download({
                              businessModule: response.data.businessModule,
                              packageId: pkg.id,
                            })
                          }
                        >
                          <ListItemDecorator>
                            <DownloadIcon />
                          </ListItemDecorator>
                          Datenpaket {index + 1}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </StyledAccordion>
            ))}
        </AccordionGroup>
      )}
    </SectionTile>
  );
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: "lg",
  [`& .${accordionSummaryClasses.button}:hover`]: {
    backgroundColor: theme.palette.primary.outlinedHoverBg,
  },
  [`& .${accordionDetailsClasses.content}`]: {
    boxShadow: `inset 0 1px ${theme.vars.palette.divider}`,
    [`&.${accordionDetailsClasses.expanded}`]: {
      paddingBlock: "0.75rem",
    },
  },
}));
