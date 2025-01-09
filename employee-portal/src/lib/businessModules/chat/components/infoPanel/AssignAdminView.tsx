/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Box, Button, Stack, Switch, Typography } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { mapToObj } from "remeda";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { useRoomMembers } from "@/lib/businessModules/chat/shared/hooks/useRoomMembers";
import {
  getRoomAdmins,
  reassignAdminRole,
} from "@/lib/businessModules/chat/shared/utils";
import { SwitchField } from "@/lib/shared/components/formFields/SwitchField";

type AdminFormValues = Record<string, boolean>;
export interface AssignAdminProps {
  roomId: string;
  onClose: () => void;
  onCancel: () => void;
}

export function AssignAdminView({
  roomId,
  onClose,
  onCancel,
}: Readonly<AssignAdminProps>) {
  const { matrixClient } = useChatClientContext();
  const roomInfo = useRoomInfo(roomId);
  const snackbar = useSnackbar();
  const { joinedMembers } = useRoomMembers(roomId);

  const { checkIfAdmin, room } = roomInfo;

  const loggedInUserId = matrixClient.getUserId();
  const isAdmin = checkIfAdmin();
  const roomAdmins = getRoomAdmins(room);

  const initialValues = mapToObj(joinedMembers, (i) => [
    i.member.userId,
    roomAdmins.includes(i.member.userId),
  ]);

  async function handleSubmit(
    values: AdminFormValues,
    formikHelpers: FormikHelpers<AdminFormValues>,
  ) {
    try {
      if (
        isAdmin &&
        roomAdmins.length === 1 &&
        loggedInUserId &&
        values[loggedInUserId] === false
      ) {
        throw new Error(
          "You can't change settings, because you are the only admin in the chat room",
        );
      }

      if (!room) {
        throw new Error(
          "Room is not available. Reassigning admin roles failed",
        );
      }

      const users = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value ? 100 : 0]),
      );
      await reassignAdminRole(matrixClient, room, users);
      onCancel();
    } catch (error) {
      logger.error("Die Berechtigungen konnten nicht geändert werden", error);
      formikHelpers.resetForm({ values: initialValues });
      snackbar.error("Etwas ist schief gelaufen");
    }
  }

  return (
    <>
      <InfoPanelHeader close={onClose} roomId={roomId} />
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <Stack
          spacing={2}
          sx={{
            padding: 3,
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Typography level="title-lg">Admins bestimmen</Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ initialValues }) => (
              <FormPlus>
                {Object.keys(initialValues).map((id) => {
                  const memberInfo = joinedMembers.find(
                    (member) => member.member.userId === id,
                  );
                  const member = memberInfo?.member;
                  if (!member) return null;

                  return (
                    <Stack
                      key={`['${member.userId}']`}
                      direction="row"
                      justifyContent="space-between"
                      marginBottom={2}
                    >
                      <Stack direction="row" alignItems="center" gap={1}>
                        <ChatAvatar
                          avatarUrl={null}
                          userId={member.userId}
                          name={member.name}
                          size="sm"
                        />
                        <Typography level="title-sm">{member.name}</Typography>
                      </Stack>
                      {initialValues[member.userId] ? (
                        <Switch checked={true} size="lg" disabled />
                      ) : (
                        <SwitchField name={`['${member.userId}']`} label="" />
                      )}
                    </Stack>
                  );
                })}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  gap={2}
                  marginTop={3}
                >
                  <Button
                    type="buttom"
                    variant="soft"
                    onClick={onCancel}
                    fullWidth
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" fullWidth>
                    Speichern
                  </Button>
                </Stack>
              </FormPlus>
            )}
          </Formik>
        </Stack>
      </Box>
    </>
  );
}
