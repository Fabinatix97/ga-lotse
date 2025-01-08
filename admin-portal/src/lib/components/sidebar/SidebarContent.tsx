/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@tanstack/react-table";
import { isPlainObject } from "remeda";

import { SidebarDetails } from "@/lib/components/sidebar/SidebarDetails";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";

export function SidebarContent<TData extends UniqueEntity & EditableEntity>({
  row,
}: Readonly<{
  row?: Row<TData>;
}>) {
  if (!row) return false;
  const original = row.original;
  if (isPlainObject(original)) {
    if ("_type" in original) {
      switch (original._type) {
        case "actor":
          return (
            <SidebarDetails
              row={row}
              headerIds={["readableName", "_orgUnit"]}
              rowIds={[
                "active",
                "type",
                "commonName",
                "networkId",
                "metadata",
                "manualCertificate",
                "currentCertificate",
                "previousCertificate",
                "_matchingClientRules",
                "_matchingServerRules",
              ]}
              idOrAuthor
            />
          );
        case "orgUnit":
          return (
            <SidebarDetails
              row={row}
              headerIds={["readableName"]}
              rowIds={["active", "type", "federalState", "actors"]}
              idOrAuthor
            />
          );
        case "rule":
          return (
            <SidebarDetails
              row={row}
              headerIds={["description"]}
              rowIds={["active", "client", "server"]}
            />
          );
      }
    }
  }

  return false;
}
