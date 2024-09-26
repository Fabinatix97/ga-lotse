/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Snackbar, Stack, Typography } from "@mui/joy";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { Presence } from "@/lib/businessModules/chat/shared/types";
import { getStatusColor } from "@/lib/businessModules/chat/shared/utils";

interface SnackbarValues {
  username: string;
  avatar?: string | null;
  text: string;
  link: string;
  userPresence: string;
  key: string;
}

export interface BaseSnackbarProps {
  snackbar: SnackbarValues | undefined;
  onClose: () => void;
}

type SnackbarValuesWithoutKey = Omit<SnackbarValues, "key">;

function BaseSnackbar({ snackbar, onClose }: Readonly<BaseSnackbarProps>) {
  const pathname = usePathname();
  const { tryNavigate } = useNavigation();
  const { chatSidebar } = useChat();

  useEffect(() => {
    if (pathname === routes.index) {
      onClose();
    }
  }, [onClose, pathname]);

  return (
    <Snackbar
      open={!!snackbar}
      variant="soft"
      size="md"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={4000}
      key={snackbar?.key}
      onClose={(_event, reason) => {
        if (reason !== "clickaway") {
          onClose();
        }
      }}
      slotProps={{
        root: {
          sx: {
            backgroundColor: "common.white",
            top: {
              xxs: "4rem",
              sm: "5rem",
            },
          },
        },
      }}
    >
      {snackbar && (
        <Box
          display="flex"
          gap={2}
          sx={{ maxWidth: "21.5rem", maxHeight: "11.375rem" }}
        >
          <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
            <Box display="flex" flexDirection="row">
              <Box
                display="flex"
                flexDirection="row"
                sx={{
                  width: "100%",
                  boxSizing: "content-box",
                  alignItems: "center",
                }}
              >
                {snackbar.userPresence && (
                  <Box
                    sx={{
                      width: "0.625rem",
                      height: "0.625rem",
                      borderRadius: "100%",
                      backgroundColor: getStatusColor(
                        snackbar.userPresence as Presence,
                      ),
                      marginRight: 0.8,
                    }}
                  ></Box>
                )}
                <Typography
                  level="title-md"
                  fontStyle="Poppins"
                  fontWeight={500}
                  sx={{
                    fontWeight: "bold",
                    height: "1.5rem",
                    maxWidth: "15rem",
                    textOverflow: "ellipsis",
                  }}
                >
                  {snackbar.username}
                </Typography>
              </Box>
              <IconButton
                aria-label="Schließen"
                onClick={onClose}
                color="primary"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography
              level="body-md"
              maxWidth="18rem"
              textColor="common.black"
              noWrap={true}
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                whiteSpace: "normal",
              }}
            >
              {snackbar.text}
            </Typography>

            <Stack
              spacing={2}
              display="flex"
              flexDirection="row"
              marginTop="1rem"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Button
                variant="outlined"
                size="sm"
                sx={{
                  width: "9.313rem",
                  height: "2rem",
                  paddingLeft: 1,
                  paddingRight: 1,
                }}
                onClick={() => {
                  tryNavigate(snackbar.link);
                }}
              >
                Zum Chatbereich
              </Button>
              <Button
                variant="soft"
                size="sm"
                color="primary"
                sx={{
                  width: "6.188rem",
                  height: "2rem",
                  paddingLeft: 1,
                  paddingRight: 1,
                  radius: "radius-sm",
                  border: "1px",
                }}
                onClick={() => {
                  chatSidebar.toggle();
                  onClose();
                }}
              >
                Antworten
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Snackbar>
  );
}

const SnackbarContext = createContext<{
  snackbarValues: SnackbarValues | undefined;
  setSnackbar: Dispatch<SetStateAction<SnackbarValues | undefined>>;
}>(null!);

export function MessageTeaserProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [snackbarValues, setSnackbar] = useState<SnackbarValues | undefined>();
  const contextValues = useMemo(
    () => ({ snackbarValues, setSnackbar }),
    [snackbarValues],
  );
  return (
    <SnackbarContext.Provider value={contextValues}>
      <BaseSnackbar
        snackbar={snackbarValues}
        onClose={() => setSnackbar(undefined)}
      />
      {children}
    </SnackbarContext.Provider>
  );
}

export function useMessageTeaser() {
  const context = useContext(SnackbarContext);
  if (context === null) {
    throw new Error("useSnackbar was called outside SnackbarProvider");
  }
  const { setSnackbar } = context;

  return useCallback(
    (values: SnackbarValuesWithoutKey | undefined) => {
      setSnackbar(values ? { ...values, key: uuidv4() } : undefined);
    },
    [setSnackbar],
  );
}
