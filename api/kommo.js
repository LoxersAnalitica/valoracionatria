import crypto from 'crypto';

// Función auxiliar para hashear datos (requerimiento de Meta CAPI)
const hashData = (data) => {
    if (!data) return '';
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

export default async function handler(req, res) {
    // CORS Headers just in case (though Vercel handles same-origin cleanly)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body; // Vercel ya parsea el JSON del body

        // --- 1. Preparar Payload para Kommo CRM ---
        const leadName = `Valo. ${data.operation}: ${data.propertyType} en ${data.address} - ${data.name}`;
        
        // Transformar toda la metadata en un texto estructurado largo por si no hay Custom Fields creados aún
        const propertyMetadataText = `
          📌 DATOS DEL CLIENTE:
          Nombre: ${data.name}
          Teléfono: ${data.phone}
          Email: ${data.email}
          
          🏠 DATOS DEL INMUEBLE:
          Operación: ${data.operation}
          Tipo Inmueble: ${data.propertyType}
          Dirección: ${data.address}
          Superficie: ${data.surface} m2
          Habitaciones: ${data.rooms}
          Baños: ${data.bathrooms}
          Planta: ${data.floor}
          Estado: ${data.condition}
          Año Construcción: ${data.buildYear}
          Certificado Energético: ${data.energyCert}
          Características: ${data.features?.join(', ') || 'Ninguna'}
          Vistas: ${data.views?.join(', ') || 'Ninguna'}
          Exposición Solar: ${data.sunExposure}
        `.trim();

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

        const kommoPromise = fetch('https://pedropablocastro1995.kommo.com/api/v4/leads/complex', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNkY2E0OGQyNDQzNThmMDE0OGRhZGQzM2MxM2NhMzg1YTcxZGVjMDRkZmQzMTVmNzQxOGY1ODAxOTEwYWYwMjI2NzgwMzllOGRhZjVlNzJmIn0.eyJhdWQiOiI3YzljOWU0Yy05ZTFjLTQ0YWEtYjY1Mi0zNWIwZTAwY2RhOWUiLCJqdGkiOiIzZGNhNDhkMjQ0MzU4ZjAxNDhkYWRkMzNjMTNjYTM4NWE3MWRlYzA0ZGZkMzE1Zjc0MThmNTgwMTkxMGFmMDIyNjc4MDM5ZThkYWY1ZTcyZiIsImlhdCI6MTc3NDM2NTA1MSwibmJmIjoxNzc0MzY1MDUxLCJleHAiOjE5MDY0MTYwMDAsInN1YiI6IjE0OTE2Mzk1IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM2MTczNzExLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiYmYwYzM3ZTItZDI0ZS00NzFmLTg3ZjAtNGZlNTQ5MmI5NjU3IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.QDtrQqYG1YJ-8A4Kr1VhlRdF2mgcy0sVEUL8HpSMiAshKue_yf7-nJFtir_3pQRAcIqyuodS116z8bWtKjYT6scvI0xpnhJ-i6GfbM4upiCExuIqUJ7TJCKFRPROGKjVg2ji-6wdrqrwDWifpSL4NmiS49XbH6XDYvKhsta4JguxOhoqgawZhxpdh3y9aANQPknob5l4DygP0yC7_2hhzfQiuyQocY5ai2b01chw6U7FVxelCiW0K_ZXBZf2IxYOTAD-o_CedIGUjJ2nKgynd7ne1N4l-m74XPpO2V2PDlmoFMZUsBBFAAMxqzJ1orGkF-O8afj-naeggbWcBfAEXQ`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(kommoPayload)
        });

        // --- 2. Preparar Payload para Meta CAPI ---
        const eventId = crypto.randomUUID();
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const metaPayload = {
            "data": [
                {
                    "event_name": "Lead",
                    "event_time": currentTimestamp,
                    "action_source": "website",
                    "event_id": eventId,
                    "user_data": {
                        "em": [hashData(data.email)],
                        "ph": [hashData(data.phone.replace(/[^0-9]/g, ''))] // Extraemos solo los números para el hash del teléfono
                    }
                }
            ]
        };

        const metaPromise = fetch('https://graph.facebook.com/v19.0/792635470536398/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer [INTRODUCE_AQUI_EL_TOKEN_VERDADERO_DE_META]`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metaPayload)
        });

        // 3. Ejecutar peticiones en paralelo. 
        const [kommoResponse] = await Promise.all([
            kommoPromise,
            metaPromise.catch(err => { console.error("Meta CAPI Warning (non-fatal):", err); return null; })
        ]);

        if (kommoResponse.ok || kommoResponse.status === 200 || kommoResponse.status === 201) {
            // Retrieve Lead ID to attach the property metadata as a note
            try {
                const responseData = await kommoResponse.json();
                const leadId = responseData[0].id;
                
                await fetch(`https://pedropablocastro1995.kommo.com/api/v4/leads/notes`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNkY2E0OGQyNDQzNThmMDE0OGRhZGQzM2MxM2NhMzg1YTcxZGVjMDRkZmQzMTVmNzQxOGY1ODAxOTEwYWYwMjI2NzgwMzllOGRhZjVlNzJmIn0.eyJhdWQiOiI3YzljOWU0Yy05ZTFjLTQ0YWEtYjY1Mi0zNWIwZTAwY2RhOWUiLCJqdGkiOiIzZGNhNDhkMjQ0MzU4ZjAxNDhkYWRkMzNjMTNjYTM4NWE3MWRlYzA0ZGZkMzE1Zjc0MThmNTgwMTkxMGFmMDIyNjc4MDM5ZThkYWY1ZTcyZiIsImlhdCI6MTc3NDM2NTA1MSwibmJmIjoxNzc0MzY1MDUxLCJleHAiOjE5MDY0MTYwMDAsInN1YiI6IjE0OTE2Mzk1IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM2MTczNzExLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiYmYwYzM3ZTItZDI0ZS00NzFmLTg3ZjAtNGZlNTQ5MmI5NjU3IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.QDtrQqYG1YJ-8A4Kr1VhlRdF2mgcy0sVEUL8HpSMiAshKue_yf7-nJFtir_3pQRAcIqyuodS116z8bWtKjYT6scvI0xpnhJ-i6GfbM4upiCExuIqUJ7TJCKFRPROGKjVg2ji-6wdrqrwDWifpSL4NmiS49XbH6XDYvKhsta4JguxOhoqgawZhxpdh3y9aANQPknob5l4DygP0yC7_2hhzfQiuyQocY5ai2b01chw6U7FVxelCiW0K_ZXBZf2IxYOTAD-o_CedIGUjJ2nKgynd7ne1N4l-m74XPpO2V2PDlmoFMZUsBBFAAMxqzJ1orGkF-O8afj-naeggbWcBfAEXQ`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([{
                        "entity_id": leadId,
                        "note_type": "common",
                        "params": { "text": propertyMetadataText }
                    }])
                });
            } catch (err) {
                console.error("Warning: Failed to attach property metadata note", err);
            }

            return res.status(200).json({ success: true });
        } else {
            const errText = await kommoResponse.text();
            console.error("Kommo API Error:", errText);
            return res.status(kommoResponse.status).json({ error: 'Error del servidor CRM externo', details: errText });
        }
    } catch (err) {
        console.error("Local Server/Vercel Error:", err);
        return res.status(500).json({ error: 'Error interno del servidor dev' });
    }
}
