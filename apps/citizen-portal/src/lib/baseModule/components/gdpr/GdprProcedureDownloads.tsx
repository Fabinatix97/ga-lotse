/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DownloadIcon from "@mui/icons-material/DownloadOutlined";
import FileIcon from "@mui/icons-material/FileCopyOutlined";
import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Stack,
  Typography,
  styled,
} from "@mui/joy";

import {
  ApiBusinessModule,
  ApiCitizenUsersGdprProcedure,
} from "@eshg/base-api";
import { useFileDownload } from "@eshg/lib-portal";

import {
  useDownloadBaseModulePackage,
  useDownloadPackageFileByModule,
  useGetGdprDownloadPackagesInfo,
} from "@/lib/baseModule/api/queries/gdpr";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";

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

export function GdprProcedureDownloads({
  procedure,
}: {
  procedure: ApiCitizenUsersGdprProcedure;
}) {
  const response = useGetGdprDownloadPackagesInfo(
    procedure.id,
    procedure.hasDownloads,
  );
  const businessModuleDownload = useFileDownloadForPackage();
  const baseDownload = useFileDownloadForBase(procedure.id);
  const { t } = useTranslation("gdpr");

  if (!procedure.hasDownloads) {
    return (
      <Typography level="title-md">
        {t("gdpr_procedure_downloads.no_results")}
      </Typography>
    );
  }

  const downloadButtonLabel = t("gdpr_procedure_downloads.download");

  return (
    <List size="lg">
      <DownloadPackage
        label={t("gdpr_procedure_downloads.central_file_data")}
        buttonLabel={downloadButtonLabel}
        onDownload={() => baseDownload.download()}
      />
      {response
        .filter((response) => response.data.downloadPackages.length > 0)
        .flatMap((response) =>
          response.data.downloadPackages.map((pkg) => (
            <DownloadPackage
              key={pkg.id}
              buttonLabel={downloadButtonLabel}
              label={t(
                `translation:business_modules.${response.data.businessModule}`,
              )}
              onDownload={() =>
                businessModuleDownload.download({
                  businessModule: response.data.businessModule,
                  packageId: pkg.id,
                })
              }
            />
          )),
        )}
    </List>
  );
}

function DownloadPackage({
  label,
  buttonLabel,
  onDownload,
}: {
  label: string;
  buttonLabel: string;
  onDownload: () => void;
}) {
  return (
    <StyledListItem>
      <ListItemDecorator>
        <FileIcon />
      </ListItemDecorator>
      <Stack
        direction={byBreakpoint({ mobile: "column", desktop: "row" })}
        gap="inherit"
        flexWrap="wrap"
        flex={1}
        alignItems="center"
      >
        <Typography
          level="title-md"
          sx={{ flex: 1, hyphens: "auto", minWidth: "fit-content" }}
        >
          {label}
        </Typography>
        <Button
          variant="outlined"
          startDecorator={<DownloadIcon />}
          sx={{ flex: 1, maxWidth: "15rem", hyphens: "auto" }}
          onClick={onDownload}
        >
          {buttonLabel}
        </Button>
      </Stack>
    </StyledListItem>
  );
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.surface,
  borderRadius: 10,
  margin: theme.spacing(1),
  padding: theme.spacing(3),
  flexWrap: "wrap",
}));
