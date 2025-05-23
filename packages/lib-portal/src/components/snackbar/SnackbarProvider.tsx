/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Close as CloseIcon } from "@mui/icons-material";
import {
  ColorPaletteProp,
  SnackbarProps as JoySnackbarProps,
  Snackbar,
} from "@mui/joy";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { Optional } from "../../types/utility";
import { ButtonLink } from "../buttons/ButtonLink";

import { addSnackbarToQueue, removeSnackbarFromQueue } from "./snackbarUtils";

type SnackbarVariant = "notification" | "error" | "confirmation";

const snackbarColorMapping = {
  notification: "primary",
  error: "danger",
  confirmation: "success",
} satisfies Record<SnackbarVariant, ColorPaletteProp>;

interface SnackbarAction {
  name: string;
  onClick: () => void;
}

export interface SnackbarValues {
  key: string;
  /** the snackbar message to display. */
  text: ReactNode;
  /** the variant, or type, of snackbar message. Default: "notification". */
  variant?: SnackbarVariant;
  /**
   * whether the snackbar must be closed manually or not. Default: false for
   * variants "confirmation" and "notification", true for variant "error".
   */
  manualClose?: boolean;
  /**
   * if set, displays a button inside the snackbar message with the given
   * `name` and executes the given `onClick` handler when pressed.
   */
  action?: SnackbarAction;
}

type SnackbarPropsKeyOptional = Optional<SnackbarValues, "key">;

type SnackbarProps = Omit<SnackbarPropsKeyOptional, "text" | "variant">;

export interface SnackbarComponentProps
  extends Omit<JoySnackbarProps, "color"> {
  position: number;
  color: "primary" | "success" | "danger";
}

interface BaseSnackbarProps extends Omit<SnackbarValues, "key"> {
  component: (props: SnackbarComponentProps) => ReactNode;
  position: number;
  onUnmount: () => void;
  closeLabel: string;
}

function BaseSnackbar({
  component: SnackbarComponent,
  text,
  variant = "notification",
  manualClose = variant === "error",
  action,
  position,
  onUnmount,
  closeLabel,
}: Readonly<BaseSnackbarProps>) {
  const [open, setOpen] = useState(true);
  return (
    <SnackbarComponent
      open={open}
      position={position}
      color={snackbarColorMapping[variant]}
      autoHideDuration={manualClose ? null : 4000}
      endDecorator={
        <>
          {action && (
            <ButtonLink
              color="primary"
              fontSize="sm"
              sx={{ paddingInline: 0.5 }}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              {action.name}
            </ButtonLink>
          )}
          {manualClose && (
            <ButtonLink
              color="primary"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </ButtonLink>
          )}
          <ButtonLink
            tabIndex={-1}
            aria-hidden
            aria-label="Technical test close button"
            data-testid="snackbar-internal-close-button"
            sx={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        </>
      }
      data-testid="snackbar"
      slotProps={{
        root: {
          role: "alert",
        },
      }}
      onClose={(_event, reason) => {
        // there are three reasons why a snackbar is being closed (besides being
        // closed by the "manualClose" button, see above): "timeout",
        // "clickaway" (i.e. clicking anywhere outside) or "escapeKeyDown".
        // We disallow closing by "clickaway"; this is a design decision: the
        // user could unintentionally click away an important message too early.
        if (reason !== "clickaway") {
          setOpen(false);
        }
      }}
      onUnmount={onUnmount}
    >
      {text}
    </SnackbarComponent>
  );
}

const SnackbarContext = createContext<
  Dispatch<SetStateAction<SnackbarValues[]>>
>(null!);

export function SnackbarProvider({
  children,
  snackbar,
  closeLabel = "Schließen",
}: Readonly<{
  children: ReactNode;
  snackbar: (props: SnackbarComponentProps) => ReactNode;
  closeLabel?: string;
}>) {
  const [queue, setQueue] = useState<SnackbarValues[]>([]);

  return (
    <SnackbarContext value={setQueue}>
      <>
        {queue.map((snackbarValues, index) => (
          <BaseSnackbar
            key={snackbarValues.key}
            component={snackbar}
            text={snackbarValues.text}
            closeLabel={closeLabel}
            variant={snackbarValues.variant}
            manualClose={snackbarValues.manualClose}
            action={snackbarValues.action}
            position={index}
            onUnmount={() =>
              setQueue((prevQueue) =>
                removeSnackbarFromQueue({
                  queue: prevQueue,
                  key: snackbarValues.key,
                }),
              )
            }
          />
        ))}
      </>
      {children}
    </SnackbarContext>
  );
}

export interface Snackbar {
  confirmation(text: ReactNode, options?: SnackbarProps): void;

  error(text: ReactNode, options?: SnackbarProps): void;

  notification(text: ReactNode, options?: SnackbarProps): void;

  close(key: string): void;
}

export function useSnackbar(): Snackbar {
  const setQueue = useContext(SnackbarContext);
  if (setQueue === null) {
    throw new Error("useSnackbar was called outside SnackbarProvider");
  }

  return useMemo(() => {
    function enqueueSnackbar(snackbar: SnackbarPropsKeyOptional) {
      setQueue((prevQueue) =>
        addSnackbarToQueue({
          queue: prevQueue,
          newSnackbar: {
            ...snackbar,
            key: snackbar.key ?? uuidv4(),
          },
        }),
      );
    }

    /**
     * create a confirmation snackbar message.
     */
    function confirmation(text: ReactNode, options?: SnackbarProps) {
      enqueueSnackbar({ ...options, text, variant: "confirmation" });
    }

    /**
     * create an error snackbar message.
     */
    function error(text: ReactNode, options?: SnackbarProps) {
      enqueueSnackbar({ ...options, text, variant: "error" });
    }

    /**
     * create a notification snackbar message.
     */
    function notification(text: ReactNode, options?: SnackbarProps) {
      enqueueSnackbar({ ...options, text, variant: "notification" });
    }

    /**
     * closes a snackbar message.
     */
    function close(key: string) {
      setQueue((prevQueue) =>
        removeSnackbarFromQueue({
          queue: prevQueue,
          key,
        }),
      );
    }

    return {
      confirmation,
      error,
      notification,
      close,
    };
  }, [setQueue]);
}
