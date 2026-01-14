/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  ConfigurationParameters,
  HTTPHeaders,
  Middleware,
  ServiceDirectoryAdminApi,
} from "@eshg/service-directory-api";

import { setAdminName } from "@/lib/helpers/adminName";

export class BackendError extends Error {
  readonly name = "BackendError";
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let lastMockClientCert: string | undefined;

function useConfig(): Configuration {
  const basePath = window.location.origin;
  const headers: HTTPHeaders = {};
  if (!basePath.startsWith("https")) {
    setMockClientCert(headers);
  }
  return new Configuration({
    basePath,
    headers,
    middleware: [errorInterceptionMiddleware, adminNameInterceptorMiddleware],
  } satisfies ConfigurationParameters);
}

function setMockClientCert(headers: HTTPHeaders) {
  let mockClientCert =
    "-----BEGIN CERTIFICATE-----MIIFBzCCAu%2BgAwIBAgIUPNKZFZTC06rUrd4mazoV3i0w%2FfcwDQYJKoZIhvcNAQELBQAwEzERMA8GA1UEAwwIZnJvbnRlbmQwHhcNMjQwNzE3MTAyMTA1WhcNMzQwNzE1MTAyMTA1WjATMREwDwYDVQQDDAhmcm9udGVuZDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMLQdv4%2FPLXhWkESHUpOGgEedevS%2FMUHahkygBkRu8b98K01jKtPbGsk66CviLtMj1stay1cEkQhBUiD7aWxG3E9SfyW3i0LkNcvy04OH2fLvVPe5OoXzFD%2BENmiI4MzfiR8xawA80yKc%2FMzlXXqDDB2Ebb%2FI8a9d4HZjeCNdxq1lOq4rxR5aUKi34FQWnRNUPaWgmx7B3DESBo0bRa1InsWsVkDvKpRXyc5Be9cSpN52gdFWVsIbppcJ1gWHuBZlHnNwvrFkgL3UCK2SaZBDhb3inW%2BRhTFWxJaEPBfyzrb8PvW4K487SUUnzw93QUFAuP%2Bi3gjmsJFNKYCffo9SGksLD4PS8cxrDLprZoYuiBiT3jtdEOkRZKGY2pIRvSGNcOqbi0bJrZM8tyWV8BTlw%2FyQFjfDlSMA5CzdVkNYdnT%2BmCO4WPo4jADT%2B0brNrxDYQi%2BPoey%2FP4wbARXXNFn9HZcNHXwVTi%2BpWDTje%2FUdiQlfo7LBU9TQ6pHliJ%2FJgVPp4Z6oMC1vQICizLnQGsz4LR23BkT40SwkOsYqxT6NgQwHGlmIrFEHP4A6H%2Bx2gqQNJRDlGwsMU%2FdsujEWtQqYpSqngInMNaNdudU9CzhJOJ9qzLuBpY8qBZmIuVmA%2FDR9A0BfsndUBxm2e2MM%2FCpoO0qG1jskiZSAym8oRYen1rAgMBAAGjUzBRMB0GA1UdDgQWBBR2Wy73zYs9y54VSNMosErpKBxW9zAfBgNVHSMEGDAWgBR2Wy73zYs9y54VSNMosErpKBxW9zAPBgNVHRMBAf8EBTADAQH%2FMA0GCSqGSIb3DQEBCwUAA4ICAQCZjJUFdDmVPmrrUrDt%2F%2B7ofYOAPwlaOWIY1RXyquPl2Pg9NUwTi03aCwq3fMpgaTv9z52M%2BT0Yq1zniOtfcpV8bdndx7o0PdjlmwRPqUXc0PezKIGPDgWYK8gzKr4R8p%2FhNDQPT%2Bzwkgu%2FyraDlN3yhZfaTTwwijt82mAzz3bG1NfPcb8lemefRF%2BZ1B11pkC4WT3aUoHQY%2BKr21mpU2qFGdv8sSURBOqLzr0JgG1YneEysQ53Hbe7KFPd2AtPZCny1CK9pmt7vaAOcE3b3Z7jX3Pel3d2YwO5cD%2FMeByqCJb7VYUyq4u9tdftdxMpFLv%2FbxtxbkxRCvnFVAKHrl6GrCYkzKi45%2BJdYQpfaSfxWjoj4yKdVpydXznnqiT%2Fscp7ftY3uOHKdPRSDQgKbEK5Gp1cEZTxSNNkdMVnVmuI7hTsIF2WvELPyHLGW51FZishYYN3sob1PfaGDhClVRDhvLgrVjEy8FyhTT5TNcb8JRNAIaNYmlDGWD%2FhkVWhpYnODyaPoX%2FTddQG%2BYdvvfxTP%2FZonxaHmR8XTV2OBSPNG6ioqX%2BCD8u%2BhO2YoHsQwoauTWUQ1SV2prl89%2FH6dF9QOd%2F7YhddLdwHdnqs0S9Zy4fpXGw2jr3Ay5ausoTv6%2B%2FBjhzIqUh1WX1Km0dYvf9yL6zD4oPHYh4DdLq%2FAyEwPg%3D%3D-----END CERTIFICATE-----";
  if (typeof window !== "undefined") {
    const configuredMockClientCert =
      window.localStorage.getItem("mock-client-cert");
    if (configuredMockClientCert) {
      mockClientCert = configuredMockClientCert;
    }
  }
  if (lastMockClientCert !== mockClientCert) {
    lastMockClientCert = mockClientCert;
    // eslint-disable-next-line no-console
    console.warn("Using mock-client-cert:", mockClientCert);
  }
  headers["X-ESHG-CLIENT-CERT"] = mockClientCert;
}

export function useAdminApi(): ServiceDirectoryAdminApi {
  const config = useConfig();
  return new ServiceDirectoryAdminApi(config);
}

const errorInterceptionMiddleware: Middleware = {
  async post(context) {
    if (!context.response.ok) {
      throw await resolveErrorResponse(context.response);
    }
  },
  async onError(context) {
    if (context.response === undefined) {
      const cause = resolveCause(context.error);
      throw new Error(`Failed to fetch ${context.url}${cause}`);
    }
    return Promise.resolve();
  },
};

async function resolveErrorResponse(response: Response): Promise<BackendError> {
  try {
    const message = await response.text();
    return new BackendError(response.status, message);
  } catch {
    return new BackendError(
      response.status,
      `Response returned error code ${response.status} for ${response.url}`,
    );
  }
}

const adminNameInterceptorMiddleware: Middleware = {
  async post(context) {
    const adminName = context.response.headers.get("x-eshg-admin-name");
    setAdminName(adminName);
    return Promise.resolve(context.response);
  },
};

function resolveCause(error: unknown) {
  return error instanceof Error && error.cause instanceof Error
    ? ` (${error.cause.message})`
    : "";
}
