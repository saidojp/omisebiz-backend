const API_URL = "http://localhost:4000";

async function main() {
  try {
    // 1. Register/Login
    const email = `test_${Date.now()}@example.com`;
    const password = "123456";
    const username = `user_${Date.now()}`;

    console.log("Registering user...");
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    if (!regRes.ok) {
      const text = await regRes.text();
      throw new Error(`Register failed: ${regRes.status} ${text}`);
    }

    console.log("Logging in...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!loginRes.ok) {
      const text = await loginRes.text();
      throw new Error(`Login failed: ${loginRes.status} ${text}`);
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Got token:", token);

    // DELETE USER to trigger FK error
    console.log("Deleting user...");
    const delRes = await fetch(`${API_URL}/user/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!delRes.ok) {
       console.log("Delete failed", await delRes.text());
    } else {
       console.log("User deleted");
    }

    // 2. Create Restaurant
    console.log("Creating restaurant...");
    const res = await fetch(`${API_URL}/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Test Restaurant",
        description: "A test restaurant",
        category: "Test",
      }),
    });

    if (!res.ok) {
      console.error("Error creating restaurant:");
      console.error("Status:", res.status);
      const text = await res.text();
      console.error("Data:", text);
    } else {
      const data = await res.json();
      console.log("Success:", data);
    }
  } catch (err: any) {
    console.error("Setup failed:", err.message);
  }
}

main();
