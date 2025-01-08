/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFileType } from "@eshg/employee-portal-api/businessProcedures";
import { ApiEditorElementImages } from "@eshg/employee-portal-api/libEditor";
import { OpenInNew } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import {
  FileCard,
  FileCardActionProps,
} from "@/lib/shared/components/FileCard";

export function ContentElementImages({
  element,
  basePath,
}: {
  element: ApiEditorElementImages;
  basePath?: string;
}) {
  return (
    <Stack spacing={1}>
      <Typography level="title-md">{element.title}</Typography>
      {element.images.length === 0 ? (
        <Typography level="body-md">(keine)</Typography>
      ) : (
        element.images.map((image) => {
          const url = `${basePath}/${image.externalId}`;
          function openImage() {
            window.open(url, "_blank");
          }

          const actions: FileCardActionProps[] = basePath
            ? [
                {
                  name: "Anzeigen",
                  onClick: openImage,
                  indicator: <OpenInNew />,
                  color: "primary",
                },
              ]
            : [];

          return (
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              mt={1}
              key={image.externalId}
            >
              <FileCard
                name={image.fileName ?? ""}
                type={ApiFileType.Jpeg}
                creationDate={image.fileDate ?? new Date(0)}
                size={image.fileSize ?? 0}
                actions={actions}
              />
            </Stack>
          );
        })
      )}
    </Stack>
  );
}
