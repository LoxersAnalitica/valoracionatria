export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body;
        
        // Simulación de retraso de red (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock response simulando la heurística de Datacasa
        const mockValuation = {
            success: true,
            provider: "Datacasa API (Mock)",
            inputs_received: data,
            estimated_value_min: 450000,
            estimated_value_max: 520000,
            confidence_score: 0.89,
            market_trend: "upward",
            comparable_properties_analyzed: 14
        };

        // En el futuro, aquí se reemplazará por:
        // const datacasaResp = await fetch('https://api.datacasa.es/v1/valuation', { ... })
        
        return res.status(200).json(mockValuation);
    } catch (err) {
        console.error("Datacasa Mock Error:", err);
        return res.status(500).json({ error: 'Error processing mock valuation' });
    }
}
