# Lambda POC — Instrucciones mínimas

Pasos mínimos para compilar, ejecutar pruebas, empaquetar el artefacto y desplegar a AWS Lambda.

Requisitos
- Node.js 18+

Instalación

```bash
npm ci
```

Compilar

```bash
npm run build
```

Ejecutar pruebas

```bash
npm test
```

Empaquetar (genera `deployment.zip`)

```bash
npm run package
```

Desplegar con AWS CLI

```bash
aws lambda update-function-code \
  --function-name YOUR_FUNCTION_NAME \
  --zip-file fileb://deployment.zip \
  --region YOUR_AWS_REGION
```

Configuración de la función (si se crea desde la consola)
- Runtime: `nodejs18.x`
- Handler: `interfaces/http/handler.handler`
- Variables de entorno: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (o `DATABASE_URL`)

Notas
- El comando de `update-function-code` requiere que la función ya exista.
- Alternativa: subir `deployment.zip` desde la consola de Lambda o a S3 y usarlo como origen del código.

Fin.

