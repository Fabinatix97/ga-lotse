/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import SearchIcon from "@mui/icons-material/Search";
import {
  AutocompleteOption,
  Box,
  Chip,
  ChipDelete,
  FormHelperText,
  Typography,
} from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { useField } from "formik";
import { HTMLAttributes, useEffect, useRef } from "react";

import { CustomAutocomplete, DetailsList } from "@eshg/lib-portal";

import { ApiUser } from "@/lib/businessModules/chat/shared/types";

import { ChatAvatar } from "./ChatAvatar";

interface UsersAutocompleteProps {
  name: string;
  placeholder: string;
  usersList: (ApiUser & { department?: string })[];
  multiple: boolean;
}

export function UsersAutocomplete({
  name,
  placeholder,
  usersList,
  multiple,
}: Readonly<UsersAutocompleteProps>) {
  const [field, meta, helpers] = useField<string | string[] | null>(name);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Box>
      <CustomAutocomplete
        inputRef={(el) => (ref.current = el)}
        name="invite"
        aria-label={placeholder}
        multiple={multiple}
        value={field.value}
        size="lg"
        placeholder={placeholder}
        options={usersList.map((opt) => opt.user_id)}
        getOptionLabel={(value) =>
          usersList?.find((apiUser) => apiUser.user_id === value)
            ?.display_name ?? value
        }
        startDecorator={<SearchIcon />}
        sx={{
          ".MuiAutocomplete-popupIndicator": {
            display: "none",
          },
          minHeight: "3.25rem",
        }}
        renderOption={(props, option) => {
          const apiUser = usersList?.find((user) => user.user_id === option);
          if (!apiUser) return null;

          // eslint-disable-next-line unused-imports/no-unused-vars
          const { key, ...componentProps } = props as {
            key: string;
          } & Omit<HTMLAttributes<HTMLLIElement>, "color">;
          return (
            <AutocompleteOption
              key={option}
              {...componentProps}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <DetailsList>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <ChatAvatar
                    name={apiUser.display_name}
                    userId={apiUser.user_id}
                    avatarUrl={apiUser.avatar_url ?? null}
                    size="sm"
                  />
                  <Typography sx={visuallyHidden} role="term">
                    Name
                  </Typography>
                  <Typography level="title-md" role="definition">
                    {apiUser.display_name}
                  </Typography>
                </Box>
                {apiUser.department && (
                  <>
                    <Typography sx={visuallyHidden} role="term">
                      Abteilung
                    </Typography>
                    <Typography
                      noWrap
                      level="body-md"
                      sx={{
                        color: "text.secondary",
                      }}
                      role="definition"
                    >
                      {apiUser.department}
                    </Typography>
                  </>
                )}
                {apiUser.user_id && (
                  <>
                    <Typography sx={visuallyHidden} role="term">
                      User-Id
                    </Typography>
                    <Typography
                      noWrap
                      level="body-md"
                      sx={{
                        color: "text.secondary",
                        textAlign: "right",
                        flex: {
                          xl: 1,
                        },
                      }}
                      role="definition"
                    >
                      {apiUser.user_id}
                    </Typography>
                  </>
                )}
              </DetailsList>
            </AutocompleteOption>
          );
        }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            const apiUser = usersList?.find(
              (apiUser) => apiUser.user_id === option,
            );
            return (
              <Chip
                key={key}
                variant="soft"
                endDecorator={<ChipDelete {...tagProps} />}
                color="primary"
              >
                {apiUser?.display_name}
              </Chip>
            );
          })
        }
        onChange={async (_, newValue) => {
          if (multiple) {
            const emptyValue: string[] = [];
            await helpers.setValue(newValue ?? emptyValue);
          } else {
            await helpers.setValue(newValue);
          }
        }}
      />
      <Box sx={{ minHeight: "1.25rem" }}>
        {meta.error && (
          <FormHelperText
            sx={{
              color: (theme) => theme.palette.danger[500],
              marginLeft: 0,
            }}
          >
            {meta.error}
          </FormHelperText>
        )}
      </Box>
    </Box>
  );
}
