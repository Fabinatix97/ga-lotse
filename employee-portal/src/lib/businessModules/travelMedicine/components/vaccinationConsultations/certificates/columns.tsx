/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiCertificateType,
  ApiTMCertificate,
} from "@eshg/travel-medicine-api";
import { FeedOutlined } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

const columnHelper: ColumnHelper<ApiTMCertificate> =
  createColumnHelper<ApiTMCertificate>();

function decorateCertificateType(
  row: ApiTMCertificate,
  certificateType: ApiCertificateType | undefined,
) {
  const title = certificateType ? "Vorlage bei der Krankenkasse" : "-";
  return certificateIsSoftDeleted(row) ? title + " (gelöscht)" : title;
}

function certificateIsSoftDeleted(row: ApiTMCertificate): boolean {
  return row.certificateFileId === null;
}

export function columns(
  downloadCertificate: (certificate: ApiTMCertificate) => Promise<void>,
) {
  return [
    columnHelper.accessor("type", {
      header: "Titel",
      cell: (props) =>
        decorateCertificateType(props.row.original, props.getValue()),
    }),
    columnHelper.accessor("appointment", {
      header: "Termin",
      cell: (props) => formatDateTime(props.getValue()),
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDateTime(props.getValue()),
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (props) =>
        certificateIsSoftDeleted(props.row.original) ? null : (
          <ActionsMenu
            actionItems={[
              {
                label: "Anzeigen",
                onClick: () => {
                  void downloadCertificate(props.row.original);
                },
                startDecorator: <FeedOutlined />,
              },
            ]}
          />
        ),
      meta: {
        width: 96,
      },
    }),
  ];
}
