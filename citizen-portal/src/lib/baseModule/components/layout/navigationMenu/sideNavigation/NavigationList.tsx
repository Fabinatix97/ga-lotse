/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChevronLeftOutlined } from "@mui/icons-material";
import { Button, List, Stack, Typography } from "@mui/joy";

import { PageSwitchButtonsMobile } from "@/lib/baseModule/components/layout/navigationMenu/header/PageSwitchButtons";
import {
  NavigationItem,
  SubNavigationItem,
} from "@/lib/baseModule/components/layout/navigationMenu/sideNavigation/NavigationItem";
import { NavigationProps } from "@/lib/baseModule/components/layout/types";
import {
  LanguagePickerMobile,
  LanguagePickerMobileButton,
} from "@/lib/i18n/components/LanguagePicker";

export function NavigationList(props: NavigationProps) {
  return (
    <Stack
      component="nav"
      aria-label="Navigation"
      flex={1}
      sx={{ overflowY: "auto" }}
    >
      {props.navigationState.type === "language" && (
        <LanguagePickerMobile
          onClose={() => {
            props.setNavigationState({ type: "closed" });
          }}
        />
      )}
      {props.navigationState.type === "sub-menu" && (
        <Stack gap={1} marginTop={1}>
          <Button
            size="lg"
            variant="plain"
            color="neutral"
            startDecorator={<ChevronLeftOutlined />}
            onClick={() => props.setNavigationState({ type: "main-menu" })}
            sx={{ justifyContent: "flex-start", padding: 2 }}
          >
            <Typography
              level="body-md"
              fontWeight="bold"
              sx={{ hyphens: "auto", overflowWrap: "break-word" }}
            >
              {props.navigationState.selectedMainItem.name}
            </Typography>
          </Button>
          <List size="lg">
            {props.navigationState.selectedMainItem.subItems.map((subItem) => (
              <SubNavigationItem key={subItem.name} subItem={subItem} />
            ))}
          </List>
        </Stack>
      )}
      {props.navigationState.type === "main-menu" && (
        <Stack flex={1} justifyContent="space-between" paddingBottom={2}>
          <Stack>
            <Stack padding={2}>
              <PageSwitchButtonsMobile userType={props.userType} />
            </Stack>

            <List size="lg" sx={{ paddingBlock: 0 }}>
              {props.navigationItems.map((item) => (
                <NavigationItem
                  key={item.name}
                  item={item}
                  setSelectedItem={() =>
                    props.setNavigationState({
                      type: "sub-menu",
                      selectedMainItem: item,
                    })
                  }
                />
              ))}
            </List>
          </Stack>
          <LanguagePickerMobileButton
            onClick={() => props.setNavigationState({ type: "language" })}
          />
        </Stack>
      )}
    </Stack>
  );
}
