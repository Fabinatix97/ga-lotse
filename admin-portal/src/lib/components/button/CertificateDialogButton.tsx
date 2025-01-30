/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminCertificate } from "@eshg/service-directory-api";
import {
  Button,
  DialogTitle,
  List,
  ListItem,
  ListItemContent,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { ReactNode, useState } from "react";

import { useTranslation } from "@/lib/i18n/client";

export function CertificateDialogButton({
  value,
}: Readonly<{
  value: ApiAdminCertificate;
}>): ReactNode {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("show")}</Button>
      <Modal
        aria-labelledby="modal-title"
        open={open}
        onClose={() => setOpen(false)}
      >
        <ModalDialog layout="center">
          <ModalClose />
          <DialogTitle id="modal-title">{t("certificate.title")}</DialogTitle>
          <List sx={{ overflowY: "scroll" }}>
            <ListItem>
              <ListItemContent>
                <Typography level="title-md" color="neutral">
                  {t("certificate.value")}
                </Typography>
                <Typography level="body-md" component="pre">
                  {value.value}
                </Typography>
              </ListItemContent>
            </ListItem>
            {value.signature && (
              <ListItem>
                <ListItemContent>
                  <Typography level="title-md" color="neutral">
                    {t("certificate.signature")}
                  </Typography>
                  <Typography level="body-md" sx={{ wordBreak: "break-word" }}>
                    {value.signature}
                  </Typography>
                </ListItemContent>
              </ListItem>
            )}
            {value.signatory && (
              <ListItem>
                <ListItemContent>
                  <Typography level="title-md" color="neutral">
                    {t("certificate.signatory")}
                  </Typography>
                  <Typography level="body-md" component="pre">
                    {value.signatory}
                  </Typography>
                </ListItemContent>
              </ListItem>
            )}
          </List>
        </ModalDialog>
      </Modal>
    </>
  );
}
