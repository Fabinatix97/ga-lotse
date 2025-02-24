/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MatchValidationFileOptions,
  toMatchValidationFile,
} from "./toMatchValidationFile/toMatchValidationFile";

export { toMatchValidationFile };

export interface CustomMatchers<R = unknown> {
  toMatchValidationFile: (options?: MatchValidationFileOptions) => R;
}
