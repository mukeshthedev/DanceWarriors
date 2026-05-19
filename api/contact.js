export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, classChoice, message } = req.body;

  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const payload = {
    username: 'Dance Warriors Studio',
    embeds: [{
      title: '💃 New Enquiry Received!',
      color: 0xC9A84C,
      fields: [
        { name: '👤 Name',          value: name        || '—', inline: true  },
        { name: '📞 Phone',         value: phone       || '—', inline: true  },
        { name: '📧 Email',         value: email       || '—', inline: false },
        { name: '🎭 Interested In', value: classChoice || '—', inline: false },
        { name: '💬 Message',       value: message     || '—', inline: false },
      ],
      footer: { text: 'Dance Warriors Studio • ' + now + ' IST' }
    }]
  };

  try {
    const response = await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 204) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Discord error' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Network error' });
  }
}