/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {initDropArea} from "@/dropArea";
import {initFileInput} from "@/fileInput";
import {initI18n} from "./i18n";
import {initFooter} from "@/footer";
import {initState} from "@/setState";
import {initFileOutput} from "@/fileOutput";

document.addEventListener('DOMContentLoaded', () => {
  initI18n();

  initDropArea();
  initFileInput();
  initFooter();
  initState();
  initFileOutput();
});
