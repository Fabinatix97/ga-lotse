/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNew } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { ApiEditorElementAudios } from "@eshg/lib-editor-api";

import {
  CustomFileType,
  FileCard,
  FileCardActionProps,
} from "@/lib/shared/components/FileCard";

export function ContentElementAudios({
  element,
  basePath,
}: {
  element: ApiEditorElementAudios;
  basePath?: string;
}) {
  return (
    <Stack spacing={1}>
      <Typography level="title-md">{element.title}</Typography>
      {element.audios.length === 0 ? (
        <Typography level="body-md">(keine)</Typography>
      ) : (
        element.audios.map((audio) => {
          const url = `${basePath}/${audio.externalId}`;

          function openAudio() {
            window.open(url, "_blank");
          }

          const actions: FileCardActionProps[] = basePath
            ? [
                {
                  name: "Anzeigen",
                  onClick: openAudio,
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
              key={audio.externalId}
            >
              <FileCard
                name={audio.fileName ?? ""}
                type={CustomFileType.Audio}
                creationDate={audio.fileDate ?? new Date(0)}
                size={audio.fileSize ?? 0}
                actions={actions}
              />
            </Stack>
          );
        })
      )}
    </Stack>
  );
}
