async function run() {
  try {
    // We know executive with id: 3 exists from the list-execs output.
    const payload = {
      name: "Updated Executive Name",
      title: "Updated Title",
      display_order: 10,
      bio: "Updated bio text.",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
    };
    
    console.log('Sending PATCH to http://localhost:3000/api/admin/executives/3...');
    const res = await fetch('http://localhost:3000/api/admin/executives/3', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
