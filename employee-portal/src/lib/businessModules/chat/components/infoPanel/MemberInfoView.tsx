/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { isStrictEqual } from "remeda";

import { MemberInfo } from "@/lib/businessModules/chat/components/MemberInfo";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { UserFromDirectory } from "@/lib/businessModules/chat/shared/types";
import { getChatUser } from "@/lib/businessModules/chat/shared/utils";

export interface MemberInfoViewProps {
  userId: string;
  onClose: () => void;
}

export function MemberInfoView({ userId, onClose }: MemberInfoViewProps) {
  const { matrixClient, departmentInfo } = useChatClientContext();
  const [user, setUser] = useState<UserFromDirectory>();
  const isMe = isStrictEqual(userId, matrixClient.getUserId());

  useEffect(() => {
    if (isMe) {
      const me = matrixClient.getUser(userId);
      if (me) {
        setUser({
          user_id: userId,
          display_name: me.displayName,
          avatar_url: me.avatarUrl,
        });
      }
    } else {
      void getChatUser(matrixClient, userId).then((res) => {
        if (res.results.length) {
          const member = res.results[0];
          if (member) {
            setUser(member);
          }
        }
      });
    }
  }, [isMe, matrixClient, userId]);

  return (
    <>
      <InfoPanelHeader user={user} close={onClose} type="memberInfo" />
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <MemberInfo userId={userId} departmentName={departmentInfo?.name} />
      </Box>
      <Stack
        spacing={1}
        sx={{
          padding: 3,
          alignItems: "flex-start",
          borderColor: "neutral.outlinedBorder",
          width: "100%",
        }}
      >
        {!isMe && (
          <InternalLink
            level="title-md"
            startDecorator={<ChatOutlinedIcon />}
            href={routes.userRoom(userId)}
          >
            Direktchat
          </InternalLink>
        )}
      </Stack>
    </>
  );
}
