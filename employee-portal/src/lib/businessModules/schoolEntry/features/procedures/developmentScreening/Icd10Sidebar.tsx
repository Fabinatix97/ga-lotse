/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiIcd10Code } from "@eshg/employee-portal-api/schoolEntry";
import { Close, SearchOutlined } from "@mui/icons-material";
import {
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
import { ChangeEvent, useState } from "react";
import { useDebounce } from "use-debounce";

import { useSearchIcd10Codes } from "@/lib/businessModules/schoolEntry/api/queries/icd10Codes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useIdc10Sidebar(): UseSidebarResult<Idc10SidebarProps> {
  return useSidebar({
    component: Icd10Sidebar,
  });
}

interface Idc10SidebarProps extends DrawerProps {
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

function Icd10Sidebar(props: Idc10SidebarProps) {
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
                  <td style={{ width: "40px", paddingLeft: 0 }}>
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
                  </td>
                  <td
                    id={`${currentRowCode.code}-code`}
                    style={{
                      width: "72px",
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentRowCode.code}
                  </td>
                  <td
                    id={`${currentRowCode.code}-title`}
                    style={{
                      paddingRight: 0,
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                    }}
                  >
                    {currentRowCode.title}
                  </td>
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
