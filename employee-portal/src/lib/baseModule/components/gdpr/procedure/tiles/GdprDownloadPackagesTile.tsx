/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetGdprProcedureResponse } from "@eshg/employee-portal-api/base";
import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
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
  accordionDetailsClasses,
  accordionSummaryClasses,
  styled,
} from "@mui/joy";
import { useId } from "react";

import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import {
  useDownloadPackageFileByModule,
  useGetGdprDownloadPackagesInfo,
} from "@/lib/shared/api/queries/gdpr";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

function useFileDownloadForPackage() {
  const downloadPackage = useDownloadPackageFileByModule();
  return useFileDownload(
    (params: { businessModule: ApiBusinessModule; packageId: string }) =>
      downloadPackage(params.businessModule, params.packageId),
  );
}

export function GdprDownloadPackagesTile({
  gdprProcedure,
}: {
  gdprProcedure: ApiGetGdprProcedureResponse;
}) {
  const responses = useGetGdprDownloadPackagesInfo(gdprProcedure.id);
  const fileDownload = useFileDownloadForPackage();
  const id = useId();

  const isEmpty = responses.every(
    ({ data }) => data.downloadPackages.length < 1,
  );

  return (
    <SectionTile id={id}>
      <SectionTitle id={id}>Datenpakete</SectionTitle>

      {isEmpty ? (
        <NoSearchResults info="Keine Daten gefunden." />
      ) : (
        <AccordionGroup variant="outlined" color="primary">
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
                            fileDownload.download({
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

      <HiddenContainer ref={fileDownload.downloadContainerRef} />
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
