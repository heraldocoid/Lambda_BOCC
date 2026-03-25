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

Despliegue: subir `deployment.zip` desde la consola de AWS

1. Abrir AWS Console → Lambda → Create function (o abrir función existente).
2. En la sección "Code" seleccionar "Upload from" → ".zip file" y subir `deployment.zip`.
3. Verificar `Runtime: nodejs18.x` y `Handler: interfaces/http/handler.handler`.
4. Configurar variables de entorno: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (o `DATABASE_URL`).

Permisos IAM recomendados (mínimo): `lambda:CreateFunction`, `lambda:UpdateFunctionCode`, `iam:PassRole`.


