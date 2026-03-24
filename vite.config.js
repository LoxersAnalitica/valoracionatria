import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'

const KOMMO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNkY2E0OGQyNDQzNThmMDE0OGRhZGQzM2MxM2NhMzg1YTcxZGVjMDRkZmQzMTVmNzQxOGY1ODAxOTEwYWYwMjI2NzgwMzllOGRhZjVlNzJmIn0.eyJhdWQiOiI3YzljOWU0Yy05ZTFjLTQ0YWEtYjY1Mi0zNWIwZTAwY2RhOWUiLCJqdGkiOiIzZGNhNDhkMjQ0MzU4ZjAxNDhkYWRkMzNjMTNjYTM4NWE3MWRlYzA0ZGZkMzE1Zjc0MThmNTgwMTkxMGFmMDIyNjc4MDM5ZThkYWY1ZTcyZiIsImlhdCI6MTc3NDM2NTA1MSwibmJmIjoxNzc0MzY1MDUxLCJleHAiOjE5MDY0MTYwMDAsInN1YiI6IjE0OTE2Mzk1IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM2MTczNzExLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiYmYwYzM3ZTItZDI0ZS00NzFmLTg3ZjAtNGZlNTQ5MmI5NjU3IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.QDtrQqYG1YJ-8A4Kr1VhlRdF2mgcy0sVEUL8HpSMiAshKue_yf7-nJFtir_3pQRAcIqyuodS116z8bWtKjYT6scvI0xpnhJ-i6GfbM4upiCExuIqUJ7TJCKFRPROGKjVg2ji-6wdrqrwDWifpSL4NmiS49XbH6XDYvKhsta4JguxOhoqgawZhxpdh3y9aANQPknob5l4DygP0yC7_2hhzfQiuyQocY5ai2b01chw6U7FVxelCiW0K_ZXBZf2IxYOTAD-o_CedIGUjJ2nKgynd7ne1N4l-m74XPpO2V2PDlmoFMZUsBBFAAMxqzJ1orGkF-O8afj-naeggbWcBfAEXQ';
const KOMMO_BASE = 'https://pedropablocastro1995.kommo.com';

// Función auxiliar para hashear datos (requerimiento de Meta CAPI)
const hashData = (data) => {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

// Backend en desarrollo para Atria Captación
const kommoApiPlugin = () => ({
  name: 'kommo-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/kommo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);

            // --- 1. Preparar el Lead para el Pipeline de Atria Captación ---
            const leadName = `Valo. ${data.operation}: ${data.propertyType} en ${data.address} - ${data.name}`;

            const propertyMetadataText = `📌 DATOS DEL CLIENTE:\nNombre: ${data.name}\nTeléfono: ${data.phone}\nEmail: ${data.email}\n\n🏠 DATOS DEL INMUEBLE:\nOperación: ${data.operation}\nTipo Inmueble: ${data.propertyType}\nDirección: ${data.address}\nSuperficie: ${data.surface} m2\nHabitaciones: ${data.rooms}\nBaños: ${data.bathrooms}\nPlanta: ${data.floor}\nEstado: ${data.condition}\nAño Construcción: ${data.buildYear}\nCertificado Energético: ${data.energyCert}\nCaracterísticas: ${data.features?.join(', ') || 'Ninguna'}\nVistas: ${data.views?.join(', ') || 'Ninguna'}\nExposición Solar: ${data.sunExposure}`;

            const kommoPayload = [
              {
                "name": leadName,
                "pipeline_id": 13404455,
                "status_id": 103394623,
                "_embedded": {
                  "tags": [
                    { "name": "Valoración" },
                    { "name": data.operation }
                  ],
                  "contacts": [
                    {
                      "name": data.name
                    }
                  ]
                }
              }
            ];

            // Create the lead
            const kommoResponse = await fetch(`${KOMMO_BASE}/api/v4/leads/complex`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${KOMMO_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(kommoPayload)
            });

            if (kommoResponse.ok) {
              // Attach the property metadata note
              try {
                const responseData = await kommoResponse.json();
                const leadId = responseData[0].id;
                console.log(`[ATRIA] Lead created: ${leadId} in pipeline 13404455`);

                const noteResp = await fetch(`${KOMMO_BASE}/api/v4/leads/notes`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${KOMMO_TOKEN}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify([{
                    "entity_id": leadId,
                    "note_type": "common",
                    "params": { "text": propertyMetadataText }
                  }])
                });
                console.log(`[ATRIA] Note attached: ${noteResp.status}`);
              } catch (noteErr) {
                console.error("[ATRIA] Note attachment failed:", noteErr);
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } else {
              const errText = await kommoResponse.text();
              console.error("[ATRIA] Kommo API Error:", errText);
              res.statusCode = kommoResponse.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Error del servidor CRM externo', details: errText }));
            }
          } catch (err) {
            console.error("[ATRIA] Local Server Error:", err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Error interno del servidor dev' }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), kommoApiPlugin()],
})
