/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNew } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useId } from "react";

import { ApiEditorElementAudios } from "@eshg/lib-editor-api";
import {
  CustomFileType,
  FileCard,
  FileCardActionProps,
} from "@eshg/lib-employee-portal";

export function ContentElementAudios({
  element,
  basePath,
}: {
  element: ApiEditorElementAudios;
  basePath?: string;
}) {
  const titleId = useId();
  return (
    <Stack spacing={1} role="group" aria-labelledby={element.title}>
      <Typography level="title-md" id={titleId}>
        {element.title}
      </Typography>
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
              key={audio.externalId}
              direction="row"
              flexWrap="wrap"
              gap={1}
              mt={1}
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
