

export async function POST() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Fantasy Big Brother <arr213@gmail.com>',
      to: ['arr213@gmail.com'],
      subject: 'Fantasy Big Brother League Update',
      html: '<strong>it works!</strong>',
    }),
  });

  if (res.ok) {
    const data = await res.json();
    return Response.json(data);
  }
}