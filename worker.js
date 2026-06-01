export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/state" && request.method === "GET") {
      const row = await env.DB.prepare(
        "SELECT data FROM size_data WHERE id = 1"
      ).first();

      if (!row) {
        return Response.json({ state: null, notes: null });
      }

      return Response.json(JSON.parse(row.data));
    }

    if (url.pathname === "/api/state" && request.method === "PUT") {
      const body = await request.json();

      await env.DB.prepare(`
        INSERT INTO size_data (id, data, updated_at)
        VALUES (1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          data = excluded.data,
          updated_at = CURRENT_TIMESTAMP
      `).bind(JSON.stringify(body)).run();

      return Response.json({ success: true });
    }

    return env.ASSETS.fetch(request);
  }
};