/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FileDownloadOutlined } from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  DetailsSection,
  IconButton,
  TablePage,
  formatBoolean,
} from "@eshg/lib-employee-portal";
import { Row, formatDateTime, useSnackbar } from "@eshg/lib-portal";
import { ApiEncryptedFile } from "@eshg/prostitute-protection-api";

import { useDownloadCertificateMutation } from "../../../api/mutations/certificate";
import { useCertificatesQueryOptions } from "../../../api/queries/certificate";
import { useDecryptedPersons } from "../../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import { DecryptedPerson } from "../../../contexts/decryptedPersons/decryptedPersonsStore";
import { CERTIFICATE_TYPE_VALUES } from "../../../shared/constants";

const columnHelper = createColumnHelper<ApiEncryptedFile>();

function getCertificatesColumns(
  procedureId: string,
  personData: ReturnType<
    ReturnType<typeof useDecryptedPersons>["getDecryptedPerson"]
  >,
) {
  return [
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: ({ getValue }) => formatDateTime(getValue()),
      enableSorting: true,
      meta: { width: 200 },
    }),
    columnHelper.accessor("certificateType", {
      header: "Typ",
      cell: ({ getValue }) => CERTIFICATE_TYPE_VALUES[getValue()],
      enableSorting: true,
      meta: { width: 200 },
    }),
    columnHelper.accessor("withAlias", {
      header: "Alias",
      cell: ({ getValue }) => formatBoolean(getValue()),
      enableSorting: true,
      meta: { width: 160 },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: certificate } }) => (
        <DownloadCertificateButton
          certificate={certificate}
          procedureId={procedureId}
          personData={personData}
        />
      ),
      meta: {
        cellStyle: "button",
        width: 96,
        textAlign: "right",
      },
    }),
  ];
}

export function CertificatesTable({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const certificatesQueryOptions = useCertificatesQueryOptions(procedureId);
  const { data = [] } = useSuspenseQuery(certificatesQueryOptions);
  const { getDecryptedPerson } = useDecryptedPersons();
  const personData = getDecryptedPerson(procedureId);

  return (
    <Sheet>
      <DetailsSection title="Zertifikate">
        <TablePage aria-label="Zertifikate" data-testid="certificates-table">
          <DataTable
            data={data}
            columns={getCertificatesColumns(procedureId, personData)}
            sorting={{
              initialSorting: [
                {
                  id: "createdAt",
                  desc: true,
                },
              ],
            }}
          />
        </TablePage>
      </DetailsSection>
    </Sheet>
  );
}

function DownloadCertificateButton({
  certificate,
  procedureId,
  personData,
}: Readonly<{
  certificate: ApiEncryptedFile;
  procedureId: string;
  personData?: DecryptedPerson;
}>) {
  const { download } = useDownloadCertificateMutation();
  const snackbar = useSnackbar();

  return (
    <Row justifyContent="flex-end">
      <IconButton
        variant="plain"
        label="Herunterladen"
        onClick={async () => {
          if (!personData) {
            snackbar.error(
              "Die Personendaten sind nicht verfügbar. Bitte suchen Sie die Person erneut.",
            );
            return;
          }

          await download({
            procedureId,
            apiDownloadCertificateRequest: {
              id: certificate.encryptedFileId,
              firstName: personData.firstName,
              lastName: personData.lastName,
              dateOfBirth: personData.dateOfBirth,
            },
          });
        }}
      >
        <FileDownloadOutlined />
      </IconButton>
    </Row>
  );
}
