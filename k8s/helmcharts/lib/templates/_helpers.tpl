{{- define "module.spatz" }}
{{ $localHostname := printf "%s%s" (include "readableName" (list .k)) .Values.domains.clusterLocalSuffix }}
{{ $hostName := ternary (get .Values.domains.hosts .k) $localHostname (regexMatch "^(citizen|employee)portal$" .k) }}
{{/*{{- if eq .k "citizenportal" }}*/}}
{{/*{{ $hostName := .Values.domains.hosts.citizenportal }}*/}}
{{/*{{- else if eq .k "citizenportalauth" }}*/}}
{{/*{{ $hostName := printf "%s%s" (include "readableName" (list .k)) .Values.domains.clusterLocalSuffix }}*/}}
{{/*{{- end }}*/}}
        - name: spatz
          securityContext: {{- .Values.containerSecurityContext | toYaml | nindent 12 }}
          lifecycle:
            postStart:
              exec:
                command:
                - /wait-for-containerstart.sh
          {{- if and (hasKey . "inbound") (not .inbound) }}
          {{- else }}
          ports:
            - containerPort: 443
              protocol: TCP
              name: spatz-incoming
          {{- end }}
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          image: '{{ .Values.image.registry }}/{{ .Values.image.repository }}/spatz:{{ .Values.image.tag }}'
          {{- if .Values.spatzLivenessProbe.enabled }}
          livenessProbe: {{- omit .Values.spatzLivenessProbe "enabled" | toYaml | nindent 12 }}
          {{- end }}
          {{- if .Values.spatzReadinessProbe.enabled }}
          readinessProbe: {{- omit .Values.spatzReadinessProbe "enabled" | toYaml | nindent 12 }}
          {{- end }}
          resources:
          {{- toYaml (default dict .Values.spatz.resources) | nindent 12 }}
          env:
            - name: spring.profiles.active
              value: "{{ include "removeTestHelper" (.Values.spring.profiles.active) }}"
            - name: ESHG_SPATZ_SELFSIGNED_ENABLED
              value: 'true'
            - name: ESHG_SPATZ_SELFSIGNED_SUBJECTLOCATION
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: ESHG_SPATZ_RELAY_ENABLED
              {{- if and (hasKey . "relay") (not .relay) }}
              value: 'false'
              {{- else }}
              value: 'true'
              {{- end }}
            - name: ESHG_SPATZ_RELAY_URL
              value: "ws://{{ .Values.domains.centralservices.relayserver }}/signalling"
            - name: ESHG_SERVICEDIRECTORY_BASEURL
              value: "http://{{ .Values.domains.centralservices.servicedirectory }}"
            - name: ESHG_LSD_BASEURL
              value: "http://{{ .Values.domains.hosts.lsd }}"
            - name: ESHG_LSDKEYCLOAK_CLIENT_URL
              value: "https://{{ .Values.domains.hosts.keycloakInternal }}"
            - name: spring.security.oauth2.resourceserver.jwt.issuer-uri
              value: "https://{{ .Values.domains.hosts.keycloak }}/realms/eshg-lsd"
            - name: ESHG_LSDKEYCLOAK_CLIENT_CLIENTID
              value: eshg-actor
            - name: ESHG_LSDKEYCLOAK_CLIENT_CLIENTSECRET
              valueFrom:
                secretKeyRef:
                  name: keycloak-client-secrets
                  key: lsd-client-secret
            - name: ESHG_LSDKEYCLOAK_ACTOR_USER
              value: "{{ $hostName }}"
            - name: ESHG_LSDKEYCLOAK_ACTOR_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: keycloak-actor-secrets
                  key: {{ .k }}
            - name: eshg.spatz.actor.host-name
              value: "{{ $hostName }}"
            - name: eshg.spatz.actor.type
              value: {{ include "actorType" (list .k) }}
            - name: eshg.spatz.actor.readable-name
              value: "{{ include "readableName" (list .k) }}"
            - name: eshg.spatz.actor.natural-id
              value: "{{ $hostName }}"
            - name: ESHG_SPATZ_INBOUND_HANDLERPORT
              {{- if and (hasKey . "inbound") (not .inbound) }}
              value: "8443"
              {{- else }}
              value: "443"
              {{- end }}
            - name: ESHG_SPATZ_OUTBOUND_TARGETPORT
              value: "443"
            - name: ESHG_SPATZ_DNS_UPSTREAMHOST
              value: "{{ .Values.dns.upstream }}"
            - name: ESHG_SPATZ_DNS_STATICHOSTS_0
              value: "{{ .Values.domains.centralservices.servicedirectory }}"
            - name: ESHG_SPATZ_DNS_STATICHOSTS_1
              value: "{{ .Values.domains.hosts.lsd }}"
            - name: ESHG_SPATZ_DNS_STATICHOSTS_2
              value: "{{ .Values.domains.centralservices.relayserver }}"
            {{- if .additionalDnsHosts }}
            {{ range $i, $host := .additionalDnsHosts }}
            - name: ESHG_SPATZ_DNS_STATICHOSTS_{{ add $i 3 }}
              value: "{{ $host }}"
            {{- end }}
            {{- end }}
            {{- if .Values.spatz.javaToolOptions }}
            - name: JAVA_TOOL_OPTIONS
              value: "{{ .Values.spatz.javaToolOptions }}"
            {{- end }}
            - name: ESHG_SPATZ_DNS_FORWARDREQUESTALLOWLIST_0
              value: "{{ .Values.domains.hosts.keycloakInternal }}"
            {{- $hostNum := 0 }}
            {{- if (.hasDb) }}
              {{- $hostNum = add1 $hostNum }}
            - name: ESHG_SPATZ_DNS_FORWARDREQUESTALLOWLIST_{{ $hostNum }}
              valueFrom:
                secretKeyRef:
                  name: {{ .k }}-db
                  key: POSTGRESQL_HOST
            {{- end }}
            {{- if .v.cache }}
              {{- $hostNum = add1 $hostNum }}
            - name: ESHG_SPATZ_DNS_FORWARDREQUESTALLOWLIST_{{ $hostNum }}
              valueFrom:
                secretKeyRef:
                  name: {{ .k }}-redis
                  key: REDIS_HOST
            {{- end }}
            {{- if eq .k "base" }}
              {{- $hostNum = add1 $hostNum }}
            - name: ESHG_SPATZ_DNS_FORWARDREQUESTALLOWLIST_{{ $hostNum }}
              valueFrom:
                secretKeyRef:
                  name: smtp-secrets
                  key: smtp-host
            {{- end }}
            {{- if eq .k "synapse" }}
              {{- $hostNum = add1 $hostNum }}
            - name: ESHG_SPATZ_DNS_FORWARDREQUESTALLOWLIST_{{ $hostNum }}
              value: {{ .Values.domains.hosts.keycloak }}
            {{- end }}
            {{- if not (empty (dig "dns" "allowList" "" .v)) }}
              {{- range $i, $allowListEntry := .v.dns.allowList }}
                {{- $hostNum = add1 $hostNum }}
            - name: ESHG_SPATZ_DNS_FORWARDREQUESTALLOWLIST_{{ $hostNum }}
              value: "{{ $allowListEntry }}"
              {{- end }}
            {{- end }}
          volumeMounts:
            {{- if .Values.development.injectSelfSignedCA }}
            - name: ca
              mountPath: /opt/java/openjdk/lib/security/cacerts
              subPath: cacerts
            - name: ca
              mountPath: /etc/ssl/certs/localca.pem
              subPath: ca.crt
            {{- end }}
            {{- if eq "true" .createDebugLogMount }}
            - name: spatzdebuglog
              mountPath: /var/log/eshg-debug
            {{- end }}
{{- end }}

{{/*retrieves the base64 encoded secret value from an existing secret or generates*/}}
{{/*a new random secret value _once_ that is also base64 encoded.*/}}
{{/*This is used for creating/enhancing Secret Objects on demand without altering*/}}
{{/*existing Secret data. Storing the generated secret in a "global" map prevents*/}}
{{/*different secrets to be generated if this template is called mutliple times*/}}
{{- define "getOrCreateSecretValue" }}
    {{- $ := index . 0 }}
    {{- $secretName := index . 1 }}
    {{- $keyName := index . 2 }}
    {{- $secretLength := 32 }}
    {{- if gt (len .) 3 }}
      {{- $secretLength = (index . 3) }}
    {{- end }}
    {{- if not $.Values.global }}
      {{- $_ := set $.Values "global" dict }}
    {{- end }}
    {{- $globalName := (printf "%s:%s:%s" $.Release.Namespace $secretName $keyName) }}
    {{- if not (index $.Values.global $globalName) }}
      {{- $existingSecret := (lookup "v1" "Secret" $.Release.Namespace $secretName) }}
      {{- if and $existingSecret (index $existingSecret.data $keyName) }}
         {{- $_ := set $.Values.global $globalName (index $existingSecret.data $keyName) }}
      {{- else }}
        {{- if $.Values.isSnapshot | default false }}
          {{- $_ := set $.Values.global $globalName ("fixed-secret-for-snapshot" | b64enc) }}
        {{- else }}
          {{- $_ := set $.Values.global $globalName (randAlphaNum $secretLength | b64enc) }}
        {{- end }}
      {{- end }}
    {{- end }}
    {{- index $.Values.global $globalName }}
{{- end }}

{{/*retrieves the base64 encoded secret value from an existing secret or fails silently with value 'secret-not-found:SECRET_NAME:SECRET_KEY'*/}}
{{- define "getSecretValue" }}
    {{- $ := index . 0 }}
    {{- $secretName := index . 1 }}
    {{- $keyName := index . 2 }}
    {{- $existingSecret := (lookup "v1" "Secret" $.Release.Namespace $secretName) }}
    {{- if and $existingSecret (index $existingSecret.data $keyName) }}
       {{- (index $existingSecret.data $keyName) }}
    {{- else }}
      {{- if $.Values.isSnapshot | default false }}
        {{- "fixed-secret-for-snapshot" | b64enc }}
      {{- else }}
        {{- (printf "secret-not-found:%s:%s" $secretName $keyName) | b64enc }}
      {{- end }}
    {{- end }}
{{- end }}

{{- define "getBootstrapEnabled" -}}
    {{- $bootstrapEnabled := not (.Values.isSnapshot) -}}
    {{- $existingConfigMap := (lookup "v1" "ConfigMap" .Release.Namespace "keycloak-bootstrap") -}}
    {{- if and $existingConfigMap (index $existingConfigMap.data "bootstrapEnabled") -}}
        {{- $bootstrapEnabled = (eq $existingConfigMap.data.bootstrapEnabled "true") -}}
    {{- end -}}
    {{- $bootstrapEnabled -}}
{{- end -}}

{{- define "truncateWithHash" -}}
  {{- $name := . -}}
  {{- if gt (len $name) 63 -}}
  {{- $hash := substr 0 6 (sha256sum $name) -}}
  {{- $truncated := printf "%s-%s" (substr 0 56 $name) $hash -}}
  {{- $truncated -}}
  {{- else -}}
  {{- $name -}}
  {{- end -}}
{{- end -}}

{{- define "removeTestHelper" -}}
  {{- $input := . -}}
  {{- replace ", test-helper" "" $input -}}
{{- end -}}

{{- define "createDebugLogMount" }}
  {{- if .development.alwaysCreateDebugLogMount }}
    {{- "true" }}
  {{- else }}
    {{- contains "production" .spring.profiles.active | toString }}
  {{- end }}
{{- end }}

{{- define "getThirdPartyImage" }}
image: "{{ .registry }}/{{ .name }}:{{ .tag }}"
imagePullPolicy: {{ .pullPolicy }}
{{- end }}

{{- define "waitForStatefulset" }}
{{- $Values := index . 0 }}
{{- $deployment := index . 1 }}
{{ $securityContext := merge (deepCopy (default dict $Values.initContainerSecurityContext )) (deepCopy (default dict $Values.containerSecurityContext )) }}
- name: {{ include "truncateWithHash" (printf "waitfor-%s" $deployment) }}
  {{- include "getThirdPartyImage" $Values.thirdPartyImages.kubectl | indent 2 }}
  securityContext: {{- $securityContext | toYaml | nindent 4 }}
  command:
    - "bash"
    - "-c"
    - until ( READY="$(kubectl -n ${POD_NAMESPACE} get statefulsets -o jsonpath='{.items[?(@.metadata.name=="{{ $deployment }}")].status.readyReplicas}')"; [ "$READY" -ge "1" ] ); do echo waiting for {{ $deployment }}; sleep 1; done
  env:
    - name: POD_NAMESPACE
      valueFrom:
        fieldRef:
          fieldPath: metadata.namespace
  resources:
    requests:
      cpu: 10m
      memory: 10Mi
    limits:
      cpu: 50m
      memory: 50Mi
{{- end }}

{{- define "waitForDeployment" }}
{{- $Values := index . 0 }}
{{- $deployment := index . 1 }}
{{ $securityContext := merge (deepCopy (default dict $Values.initContainerSecurityContext )) (deepCopy (default dict $Values.containerSecurityContext )) }}
- name: {{ include "truncateWithHash" (printf "waitfor-%s" $deployment) }}
  {{- include "getThirdPartyImage" $Values.thirdPartyImages.kubectl | indent 2 }}
  securityContext: {{- $securityContext | toYaml | nindent 4 }}
  command:
    - "bash"
    - "-c"
    - until ( AVAILABLE="$(kubectl -n ${POD_NAMESPACE} get deployments -o jsonpath='{.items[?(@.metadata.name=="{{ $deployment }}")].status.conditions[?(@.type=="Available")].status}')"; [ "$AVAILABLE" == "True" ] ); do echo waiting for {{ $deployment }}; sleep 1; done
  env:
    - name: POD_NAMESPACE
      valueFrom:
        fieldRef:
          fieldPath: metadata.namespace
  resources:
    requests:
      cpu: 10m
      memory: 10Mi
    limits:
      cpu: 50m
      memory: 50Mi
{{- end }}


{{- define "includeActor" }}
{{- $orgUnit := index . 0 }}
{{- $actor := index . 1 }}
{{- if and (or (empty $orgUnit.actors) (has $actor $orgUnit.actors)) (not (has $actor $orgUnit.skipActors)) -}}
  true
{{- end }}
{{- end -}}

{{- define "mergeTree" }}
{{ merge (deepCopy (default dict (index . 0))) (deepCopy (default dict (index . 1))) }}
{{- end }}

{{- define "deriveEnvironmentType" -}}
  {{- $input := . -}}
  {{- if hasPrefix "dev" $input -}}
    dev
  {{- else if hasPrefix "production" $input -}}
    production
  {{- else -}}
    {{- fail (printf "Cannot derive environment type from: '%s'" $input) -}}
  {{- end -}}
{{- end -}}


# The readableName attribute of the actor configuration is generated
# from the deployment name (more or less) by default but can be overridden here
{{- define "readableName" }}
{{- $actor := index . 0 }}
{{- $mapping := dict
      "employeeportal" "employee-portal-reverse-proxy"
      "employeeportalauth" "employee-portal-auth"
      "employeeportalnextjs" "employee-portal"
      "citizenportal" "citizen-portal-reverse-proxy"
      "citizenportalauth" "citizen-portal-auth"
      "citizenportalnextjs" "citizen-portal" }}
{{- index $mapping $actor | default $actor }}
{{- end }}

{{- define "actorType" }}
{{- $actor := index . 0 }}
{{- $web := list "employeeportal" "employeeportalauth" "employeeportalnextjs" "citizenportal" "citizenportalnextjs" "citizenportalauth" }}
{{- $misc := list "auditlog" "statistics" "chatmanagement" "synapse" "opendata" }}
{{- $restricted := list "svgsanitizer" }}
{{- if eq $actor "lsd" -}}
LSD
{{- else if eq $actor "base" -}}
GM
{{- else if eq $actor "centralrepository" -}}
ZR
{{- else if has $actor $web -}}
WEB
{{- else if has $actor $misc -}}
MISC
{{- else if has $actor $restricted -}}
RESTRICTED
{{- else -}}
FM
{{- end }}
{{- end }}

{{- define "genLsdImport" }}
[
  {{- range $k, $v := .Values.businessmodules }}
  {{- if $v.enabled }}
  {{- $localHostname := printf "%s%s" $k $.Values.domains.clusterLocalSuffix }}
  {{- $hostName := coalesce $v.host $localHostname }}
  { "username": "{{ $hostName }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" $k 64) | b64dec }}" },
  {{- end }}
  {{- end }}
  { "username": "{{ .Values.domains.hosts.lsd }}", "password": "-" }
{{- if .Values.employeeportal.enabled }},
  { "username": "employee-portal-auth{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "employeeportalauth" 64) | b64dec }}" },
  { "username": "employee-portal{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "employeeportalnextjs" 64) | b64dec }}" },
  { "username": "{{ .Values.domains.hosts.employeeportal }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "employeeportal" 64) | b64dec }}" }
{{- end }}
{{- if .Values.citizenportal.enabled }},
  { "username": "citizen-portal-auth{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "citizenportalauth" 64) | b64dec }}" },
  { "username": "citizen-portal{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "citizenportalnextjs" 64) | b64dec }}" },
  { "username": "{{ .Values.domains.hosts.citizenportal }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "citizenportal" 64) | b64dec }}" }
{{- end }}
{{- if .Values.auditlog.enabled }},
  { "username": "auditlog{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "auditlog" 64) | b64dec }}" }
{{- end }}
{{- if .Values.businessmodules.chatmanagement.enabled }},
  { "username": "synapse{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "synapse" 64) | b64dec }}" }
{{- end }}
{{- if .Values.svgsanitizer.enabled }},
  { "username": "svgsanitizer{{ .Values.domains.clusterLocalSuffix }}", "password": "{{ include "getOrCreateSecretValue" (list $ "keycloak-actor-secrets" "svgsanitizer" 64) | b64dec }}" }
{{- end }}
]
{{- end }}
