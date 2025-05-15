import { pool } from '@/lib/db'

// GET: Fetch plan by ID
export async function GET(req, context) {
  const { id } = await context.params
  const client = await pool.connect()

  try {
    const result = await client.query('SELECT * FROM plans WHERE id = $1', [id])
    return new Response(JSON.stringify(result.rows[0]), { status: 200 })
  } catch (error) {
    return new Response('Error fetching plan', { status: 500 })
  } finally {
    client.release()
  }
}

// PUT: Update plan by ID
export async function PUT(req, context) {
  const { id } = await context.params
  const body = await req.json()
  const { name, price, description } = body
  const client = await pool.connect()

  try {
    await client.query(
      'UPDATE plans SET name = $1, price = $2, description = $3 WHERE id = $4',
      [name, price, description, id]
    )
    return new Response('Plan updated successfully', { status: 200 })
  } catch (error) {
    return new Response('Error updating plan', { status: 500 })
  } finally {
    client.release()
  }
}

// DELETE: Delete plan by ID
export async function DELETE(req, context) {
  const { id } = await context.params
  const client = await pool.connect()

  try {
    await client.query('DELETE FROM plans WHERE id = $1', [id])
    return new Response('Plan deleted successfully', { status: 200 })
  } catch (error) {
    return new Response('Error deleting plan', { status: 500 })
  } finally {
    client.release()
  }
}
