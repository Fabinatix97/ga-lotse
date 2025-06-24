{{- define "module.travelmedicine.container" }}
{{- if not .Values.businessmoduleDefaults.database.selfmanaged }}
- name: spring.datasource.url
  value: "jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=verify-full&sslrootcert=/var/run/db-certs/ca.crt"
{{- else }}
- name: spring.datasource.url
  value: "jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
{{- end }}
- name: DB_HOST
  valueFrom:
    secretKeyRef:
      name: travelmedicine-db
      key: POSTGRESQL_HOST
- name: DB_PORT
  valueFrom:
    secretKeyRef:
      name: travelmedicine-db
      key: POSTGRESQL_PORT
- name: DB_NAME
  valueFrom:
    secretKeyRef:
      name: travelmedicine-db
      key: POSTGRESQL_DB
- name: spring.datasource.username
  valueFrom:
    secretKeyRef:
      name: travelmedicine-db
      key: POSTGRESQL_USER
- name: spring.datasource.password
  valueFrom:
    secretKeyRef:
      name: travelmedicine-db
      key: POSTGRESQL_PASSWORD
- name: de.eshg.base.service-url
  value: "http://base{{ .Values.domains.clusterLocalSuffix }}"
- name: eshg.keycloak.url
  value: "https://{{ .Values.domains.hosts.keycloak }}"
- name: eshg.keycloak.internal.url
  value: "https://{{ .Values.domains.hosts.keycloakInternal }}"
- name: eshg.citizen-portal.reverse-proxy.url
  value: "https://{{ .Values.domains.hosts.citizenportal }}"
- name: eshg.servicedirectory.baseUrl
  value: http://{{ .Values.domains.centralservices.servicedirectory }}
- name: spring.security.oauth2.client.registration.module-client.client-id
  value: system-travel-medicine
- name: spring.security.oauth2.client.registration.module-client.client-secret
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: travel-medicine-module-client-secret
- name: eshg.keycloak.test-users-secret-override
  valueFrom:
    secretKeyRef:
      name: keycloak-test-user-secrets
      key: test-users-secret-override
{{- end }}
