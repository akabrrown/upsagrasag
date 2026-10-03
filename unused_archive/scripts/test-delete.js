async function run() {
  try {
    // Delete the executive with id: 3 we just updated.
    console.log('Sending DELETE to http://localhost:3000/api/api/admin/executives/3...');
    const res = await fetch('http://localhost:3000/api/admin/executives/3', {
      method: 'DELETE'
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
