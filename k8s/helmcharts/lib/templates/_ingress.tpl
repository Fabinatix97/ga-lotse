{{- define "ingress" }}

{{ if (eq "traefik" .type) -}}
apiVersion: traefik.io/v1alpha1
kind: IngressRouteTCP
metadata:
  name: {{ .name }}
  namespace: {{ .namespace }}
spec:
  entryPoints:
    - websecure
  routes:
    - match: HostSNI(`{{ .host }}`)
      services:
        - name: {{ .service }}
          port: {{ .port }}
{{- if .proxyProtocol }}
          proxyProtocol:
            version: 2
{{- end }}
  tls:
    passthrough: true
{{- end }}
{{ if (eq "openshift" .type) -}}

apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: {{ .name }}
  namespace: {{ .namespace }}
spec:
  host: {{ .host }}
  port:
    targetPort: {{ .port }}
  tls:
    termination: passthrough
    insecureEdgeTerminationPolicy: Redirect
  to:
    kind: Service
    name: {{ .service }}

{{- end }}
{{- end }}
