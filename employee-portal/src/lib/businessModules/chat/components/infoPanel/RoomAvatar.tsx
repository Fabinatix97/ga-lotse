/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Avatar, Box, Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { EventType } from "matrix-js-sdk";
import { useState } from "react";

import { FileField } from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  FileLike,
  FileType,
} from "@eshg/lib-portal/components/formFields/file/types";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";

interface RoomAvatarProps {
  roomId: string;
  onClose: () => void;
  onCancel: () => void;
}

export function RoomAvatar({
  roomId,
  onClose,
  onCancel,
}: Readonly<RoomAvatarProps>) {
  const { matrixClient } = useChatClientContext();
  const { getAvatarUrl } = useRoomInfo(roomId);
  const snackbar = useSnackbar();

  const [preview, setPreview] = useState(getAvatarUrl());

  async function handleSubmit(values: { avatar: File | undefined }) {
    try {
      if (values.avatar) {
        const data = await matrixClient.uploadContent(values.avatar);
        await matrixClient.sendStateEvent(roomId, EventType.RoomAvatar, {
          url: data.content_uri,
        });
      } else {
        await matrixClient.sendStateEvent(roomId, EventType.RoomAvatar, {});
      }
      onCancel();
    } catch (error) {
      logger.error("Avatar konnte nicht festgelegt werden", error);
      snackbar.error("Avatar konnte nicht festgelegt werden");
    }
  }

  function handleFileChange(file: FileLike | null) {
    if (file instanceof File) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  return (
    <>
      <InfoPanelHeader close={onClose} roomId={roomId} />
      <Stack sx={{ p: 3 }}>
        <Typography level="title-lg">Profilbild ändern</Typography>
        <Formik<{ avatar: File | undefined }>
          initialValues={{ avatar: undefined }}
          onSubmit={handleSubmit}
        >
          {({ isValid, setFieldValue }) => {
            return (
              <FormPlus>
                <Stack
                  direction="column"
                  gap={2}
                  alignItems="center"
                  marginTop={4}
                >
                  <Avatar
                    sx={{ width: 160, height: 160 }}
                    src={typeof preview === "string" ? preview : undefined}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        textDecoration: "underline",
                        cursor: "pointer",
                      },
                      ".MuiButton-root": {
                        border: "none",
                        backgroundColor: "transparent",
                        fontSize: "1rem",
                        fontWeight: 600,
                        padding: 0,
                        overflow: "hidden",
                      },
                      ".MuiButton-startDecorator": {
                        display: "none",
                      },
                      ".MuiFormLabel-root": {
                        display: "none",
                      },
                    }}
                  >
                    <FileUploadOutlinedIcon
                      sx={{ color: "primary.500" }}
                      size="sm"
                    />
                    <FileField
                      label=""
                      placeholder="Bild hochladen"
                      name="avatar"
                      accept={[FileType.Jpeg, FileType.Png]}
                      variant="button"
                      onChange={handleFileChange}
                    />
                  </Box>
                  <ButtonLink
                    level="title-md"
                    startDecorator={<DeleteOutlineOutlinedIcon />}
                    onClick={async () => {
                      setPreview(null);
                      await setFieldValue("avatar", null);
                    }}
                  >
                    Löschen
                  </ButtonLink>
                  <Stack direction="row" spacing={2} marginTop={2}>
                    <Button
                      type="button"
                      fullWidth
                      variant="soft"
                      onClick={onCancel}
                    >
                      Abbrechen
                    </Button>
                    <Button type="submit" disabled={!isValid} fullWidth>
                      Speichern
                    </Button>
                  </Stack>
                </Stack>
              </FormPlus>
            );
          }}
        </Formik>
      </Stack>
    </>
  );
}
