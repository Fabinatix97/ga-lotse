/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

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
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MouseEvent, useRef } from "react";

import { useIsMobile } from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { useTranslation } from "@/lib/i18n/client";
import {
  AfghanFlag,
  ArabicFlag,
  CroatianFlag,
  FrenchFlag,
  GermanFlag,
  IranianFlag,
  ItalianFlag,
  PolishFlag,
  RomanianFlag,
  RussianFlag,
  SpanishFlag,
  TurkishFlag,
  UKFlag,
  UkrainianFlag,
} from "@/lib/i18n/flags";
import { useGivenLang, useLang, useSwitchLanguage } from "@/lib/i18n/useLang";
import { byBreakpoint } from "@/lib/shared/breakpoints";

const languages = [
  { name: "Deutsch", shortCode: "de", image: <GermanFlag /> },
  { name: "English", shortCode: "en", image: <UKFlag /> },
  { name: "Français", shortCode: "fr", image: <FrenchFlag /> },
  { name: "Español", shortCode: "es", image: <SpanishFlag /> },
  { name: "Polski", shortCode: "pl", image: <PolishFlag /> },
  { name: "Türkçe", shortCode: "tr", image: <TurkishFlag /> },
  { name: "Русский", shortCode: "ru", image: <RussianFlag /> },
  { name: "Italiano", shortCode: "it", image: <ItalianFlag /> },
  { name: "العربية", shortCode: "ar", image: <ArabicFlag /> },
  { name: "Română", shortCode: "ro", image: <RomanianFlag /> },
  { name: "Українська", shortCode: "uk", image: <UkrainianFlag /> },
  { name: "Hrvatski", shortCode: "hr", image: <CroatianFlag /> },
  { name: "فارسی", shortCode: "fa", image: <IranianFlag /> },
  { name: "دری", shortCode: "prs", image: <AfghanFlag /> },
] as const;

function useCurrentLanguage() {
  const lang = useLang();
  const currentLanguage = languages.find((k) => lang === k.shortCode);
  if (currentLanguage === undefined) {
    throw Error(`No language defined for: "${lang}"`);
  }
  return currentLanguage;
}
export function LanguagePicker() {
  const toggleButton = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("languagePicker");
  const currentLanguage = useCurrentLanguage();
  const enabled = useIsNewFeatureEnabled("MULTIPLE_LANGUAGES");
  return (
    <Dropdown>
      <MenuButton
        ref={toggleButton}
        title={t("select_language_label")}
        {...buttonStyling}
      >
        {currentLanguage.name}
      </MenuButton>
      <Menu
        variant="plain"
        sx={{
          display: byBreakpoint({ mobile: "none", desktop: "flex" }),
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
          multipleLanguages={enabled}
          t={t}
          onClose={() => toggleButton.current?.click()}
        />
      </Menu>
    </Dropdown>
  );
}
interface LanguagePickerReducedProps {
  slotProps?: { menuButton?: MenuButtonProps["slotProps"] };
}

export function LanguagePickerReduced(props: LanguagePickerReducedProps) {
  const toggleButton = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("languagePicker");
  const currentLanguage = useCurrentLanguage();
  const isMobile = useIsMobile();
  const enabled = useIsNewFeatureEnabled("MULTIPLE_LANGUAGES");

  return (
    <Dropdown>
      <MenuButton
        ref={toggleButton}
        title={t("select_language_label")}
        slotProps={{ ...props?.slotProps?.menuButton }}
        {...buttonStylingReduced}
      >
        {isMobile ? (
          <Typography
            fontWeight={(theme) => theme.fontWeight.lg}
            component="span"
            level="body-xs"
            sx={{
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {currentLanguage.shortCode.toUpperCase()}
          </Typography>
        ) : (
          <Typography
            fontWeight={(theme) => theme.fontWeight.lg}
            component="span"
            level="body-sm"
            sx={{
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {currentLanguage.name}
          </Typography>
        )}
      </MenuButton>
      <Menu
        variant="plain"
        sx={{
          display: "flex",
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
          multipleLanguages={enabled}
          t={t}
          onClose={() => toggleButton.current?.click()}
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
  const enabled = useIsNewFeatureEnabled("MULTIPLE_LANGUAGES");

  return (
    <MenuList sx={{ border: "none", backgroundColor: "common.white" }}>
      <LanguagePickerListItems
        multipleLanguages={enabled}
        t={t}
        onClose={onClose}
      />
    </MenuList>
  );
}

function LanguagePickerListItems({
  multipleLanguages,
  onClose,
  t,
}: {
  multipleLanguages: boolean;
  onClose: () => void;
  t: (key: string | string[], tOptions?: TOptions) => string;
}) {
  const currentLanguage = useCurrentLanguage();
  const enabledLanguages = multipleLanguages
    ? languages
    : ([
        { name: "Deutsch", shortCode: "de", image: <GermanFlag /> },
        { name: "English", shortCode: "en", image: <UKFlag /> },
      ] as const);

  return (
    <Stack
      flexDirection="column"
      paddingBlock={3}
      paddingInline={byBreakpoint({ mobile: 2, desktop: 3 })}
      gap={3}
      flex={1}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
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
        {enabledLanguages.map((language) => (
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
  const searchParams = useSearchParams();
  const givenLocale = useGivenLang();

  let newPath = pathname;
  if (givenLocale !== option.shortCode) {
    const parts = pathname.split("/");
    const newParts = parts.slice(givenLocale === undefined ? 1 : 2);
    newPath = ["", option.shortCode, ...newParts].join("/");
  }

  if (searchParams.size > 0) {
    newPath = `${newPath}?${searchParams.toString()}`;
  }

  const switchToNewLang = useSwitchLanguage();

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    void switchToNewLang(option.shortCode, newPath);
  }

  return (
    <MenuItem
      // We are using the restricted "Link" here because it
      // allows us to handle the onClick ourselves
      component={Link}
      href={newPath}
      sx={{ paddingInline: 0 }}
      onClick={handleClick}
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
    width: byBreakpoint({ mobile: "100%", desktop: "auto" }),
    justifyContent: "flex-start",
    height: "40px",
  },
};

const buttonStylingReduced: MenuButtonProps & ButtonProps = {
  color: "primary",
  startDecorator: (
    <LanguageOutlined
      sx={{
        ml: byBreakpoint({ mobile: 0, desktop: -0.5 }),
        width: byBreakpoint({ mobile: "24px", desktop: "20px" }),
        height: byBreakpoint({ mobile: "24px", desktop: "20px" }),
      }}
    />
  ),
  variant: "plain",
  sx: {
    color: (theme) => theme.palette.text.primary,
    width: byBreakpoint({ mobile: "100%", desktop: "auto" }),
    justifyContent: "flex-start",
    height: "40px",
  },
};
