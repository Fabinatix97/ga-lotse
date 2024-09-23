/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Close, Menu } from "@mui/icons-material";

import { NavigationProps } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { VerticalAlignedButton } from "./VerticalAlignedButton";

export function MenuButton(props: NavigationProps) {
  const { t } = useTranslation("base/header");

  return (
    <VerticalAlignedButton
      onClick={() => {
        props.setNavigationState((prev) =>
          prev.type === "closed" || prev.type === "language"
            ? { type: "main-menu" }
            : { type: "closed" },
        );
      }}
    >
      {props.navigationState.type === "closed" ||
      props.navigationState.type === "language" ? (
        <>
          <Menu />
          {t("menu")}
        </>
      ) : (
        <>
          <Close />
          {t("close")}
        </>
      )}
    </VerticalAlignedButton>
  );
}
