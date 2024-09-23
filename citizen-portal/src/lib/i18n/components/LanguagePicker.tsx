/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Close, LanguageOutlined } from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  Dropdown,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { TOptions } from "i18next";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { useTranslation } from "@/lib/i18n/client";
import { DeutschFlag } from "@/lib/i18n/flags/DeutschFlag";
import { UKFlag } from "@/lib/i18n/flags/UKFlag";
import { useGivenLang, useLang } from "@/lib/i18n/useLang";

const languages = [
  { name: "English", shortCode: "en", image: <UKFlag /> },
  { name: "Deutsch", shortCode: "de", image: <DeutschFlag /> },
] as const;

function useCurrentLanguage() {
  const lang = useLang();
  const currentLanguage = languages.find((k) => lang === k.shortCode);
  if (currentLanguage == null) {
    throw Error(`No language defined for: "${lang}"`);
  }
  return currentLanguage;
}

export function LanguagePicker() {
  const toggleButton = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("languagePicker");
  const currentLanguage = useCurrentLanguage();

  return (
    <Dropdown>
      <MenuButton ref={toggleButton} {...buttonStyling}>
        {currentLanguage.name}
      </MenuButton>
      <Menu
        variant="plain"
        sx={{
          display: { xxs: "none", md: "flex" },
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 3,
          gap: 3,
          borderRadius: (theme) => theme.radius.lg,
          width: "100%",
          maxWidth: "788px",
          backgroundColor: "common.white",
        }}
      >
        <LanguagePickerListItems
          onClose={() => toggleButton.current?.click()}
          t={t}
        />
      </Menu>
    </Dropdown>
  );
}

export function LanguagePickerMobileButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const currentLanguage = useCurrentLanguage();

  return (
    <Button {...buttonStyling} onClick={onClick}>
      {currentLanguage.name}
    </Button>
  );
}

export function LanguagePickerMobile({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation("languagePicker");
  return (
    <MenuList sx={{ border: "none", backgroundColor: "common.white" }}>
      <LanguagePickerListItems onClose={onClose} t={t} />
    </MenuList>
  );
}

function LanguagePickerListItems({
  onClose,
  t,
}: {
  onClose: () => void;
  t: (key: string | string[], tOptions?: TOptions) => string;
}) {
  const currentLanguage = useCurrentLanguage();

  return (
    <Stack
      flexDirection="column"
      paddingBlock={3}
      paddingInline={{ xxs: 2, md: 3 }}
      gap={3}
      flex={1}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography level="h3">{t("languages_title")}</Typography>
        <IconButton aria-label={t("close")} onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>
      <Typography level="body-md" fontWeight="bold">
        {t("current_language_title")}
      </Typography>
      <LanguageOption option={currentLanguage} />
      <Typography level="body-md" fontWeight="bold">
        {t("all_languages_title")}
      </Typography>
      <LanguageOptions>
        {languages.map((language) => (
          <LanguageOption key={language.shortCode} option={language} />
        ))}
      </LanguageOptions>
    </Stack>
  );
}

const LanguageOptions = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    grid-template-columns: 1fr;
  }
`;

type LanguageOptionType =
  // eslint-disable-next-line @typescript-eslint/array-type
  typeof languages extends Readonly<Array<infer K>> ? K : never;

function LanguageOption({ option }: { option: LanguageOptionType }) {
  const pathname = usePathname();
  const givenLocale = useGivenLang();
  let newPath = pathname;
  if (givenLocale !== option.shortCode) {
    const parts = pathname.split("/");
    const newParts = parts.slice(givenLocale === undefined ? 1 : 2);
    newPath = ["", option.shortCode, ...newParts].join("/");
  }
  return (
    <MenuItem
      component={NavigationLink}
      href={newPath}
      sx={{ paddingInline: 0 }}
    >
      <ListItemDecorator>{option.image}</ListItemDecorator>
      <Typography level="body-md">{option.name}</Typography>
    </MenuItem>
  );
}

const buttonStyling: MenuButtonProps & ButtonProps = {
  color: "primary",
  startDecorator: <LanguageOutlined />,
  variant: "plain",
  sx: {
    color: (theme) => theme.palette.text.primary,
    width: { xxs: "100%", md: "auto" },
    justifyContent: "flex-start",
    height: "40px",
  },
};
