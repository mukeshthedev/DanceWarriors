export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, classChoice, message } = req.body;

  try {
    const response = await fetch(process.env.FORMSPREE_URL, {
      method:  'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phone, email, classChoice, message })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const data = await response.json();
      const errorMsg = data.errors
        ? data.errors.map(e => e.message).join(', ')
        : 'Formspree error';
      return res.status(500).json({ error: errorMsg });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Network error' });
  }
}