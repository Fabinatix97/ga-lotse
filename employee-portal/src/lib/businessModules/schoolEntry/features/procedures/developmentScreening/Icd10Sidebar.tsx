/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiIcd10Code } from "@eshg/base-api";
import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { Close, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Table,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, TdHTMLAttributes, useState } from "react";
import { useDebounce } from "use-debounce";

import { useSearchIcd10Codes } from "@/lib/baseModule/api/queries/icd10Codes";

export function useIcd10Sidebar(): UseSidebarResult<Icd10SidebarProps> {
  return useSidebar({
    component: Icd10Sidebar,
  });
}

interface Icd10SidebarProps extends DrawerProps {
  onSubmit: (selectedCodes: string[]) => void;
  initiallySelectedCodes: string[];
}

const StyledTable = styled(Table)({
  td: {
    verticalAlign: "top",
  },
  tr: {
    cursor: "pointer",
  },
});

function StyledTd({
  children,
  ...props
}: Omit<TdHTMLAttributes<HTMLTableDataCellElement>, "style"> & {
  sx?: SxProps;
}) {
  return (
    <Box component={"td"} {...props}>
      {children}
    </Box>
  );
}

function Icd10Sidebar(props: Icd10SidebarProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(
    props.initiallySelectedCodes,
  );
  const selectionResult = useSearchIcd10Codes({
    codes: selectedCodes,
  });
  const [searchString, setSearchString] = useState<string>("");
  const [debouncedSearchString] = useDebounce(searchString, 250, {
    trailing: true,
  });
  const searchResult = useSearchIcd10Codes({
    searchString: debouncedSearchString,
  });

  const isSearchMode = debouncedSearchString.length >= 1;
  const displayedCodes =
    isSearchMode && searchResult.isSuccess
      ? searchResult.data.codes
      : selectionResult.isSuccess
        ? selectionResult.data.codes
        : [];

  function addToSelection(addCode: ApiIcd10Code) {
    setSelectedCodes([...selectedCodes, addCode.code]);
  }

  function removeFromSelection(removeCode: ApiIcd10Code) {
    setSelectedCodes(selectedCodes.filter((code) => code !== removeCode.code));
  }

  function handleChangeSearchInput(event: ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);
  }

  function handleClearSearchInput() {
    setSearchString("");
  }

  function handleSubmit() {
    props.onSubmit(selectedCodes);
    props.onClose();
  }

  return (
    <>
      <SidebarContent title="ICD-10 Katalog">
        <Stack gap={3}>
          <FormControl size="md">
            <FormLabel>Suche</FormLabel>
            <Input
              value={searchString}
              onChange={handleChangeSearchInput}
              startDecorator={<SearchOutlined />}
              endDecorator={
                searchString.length > 0 && (
                  <IconButton
                    aria-label="Suche zurücksetzen"
                    onClick={handleClearSearchInput}
                  >
                    <Close />
                  </IconButton>
                )
              }
            />
          </FormControl>
          <StyledTable>
            <tbody>
              {displayedCodes.map((currentRowCode) => (
                <tr
                  key={currentRowCode.code}
                  onClick={() => {
                    if (selectedCodes.includes(currentRowCode.code)) {
                      removeFromSelection(currentRowCode);
                    } else {
                      addToSelection(currentRowCode);
                    }
                  }}
                >
                  <StyledTd sx={{ width: "40px", paddingLeft: 0 }}>
                    <Checkbox
                      checked={selectedCodes.includes(currentRowCode.code)}
                      size="sm"
                      variant="outlined"
                      slotProps={{
                        input: {
                          "aria-label": currentRowCode.code,
                          "aria-describedby": `${currentRowCode.code}-title`,
                        },
                      }}
                    />
                  </StyledTd>
                  <StyledTd
                    id={`${currentRowCode.code}-code`}
                    sx={{
                      width: "72px",
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentRowCode.code}
                  </StyledTd>
                  <StyledTd
                    id={`${currentRowCode.code}-title`}
                    sx={{
                      paddingRight: 0,
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                    }}
                  >
                    {currentRowCode.title}
                  </StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              key="cancel"
              onClick={() => props.onClose()}
              color="neutral"
              variant="soft"
            >
              Abbrechen
            </Button>,
            <Button key="submit" onClick={handleSubmit} color="primary">
              Übernehmen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}
