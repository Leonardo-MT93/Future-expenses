import { sql, User } from './db';

// Crear o actualizar usuario desde Google OAuth
export async function createOrUpdateUser(googleUser: {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<User> {
  try {
    // Verificar si el usuario ya existe
    const existingUsers = await sql`
      SELECT * FROM users WHERE google_id = ${googleUser.sub}
    `;

    if (existingUsers.length > 0) {
      // Actualizar última sesión
      const updatedUsers = await sql`
        UPDATE users 
        SET ultima_sesion = NOW(),
            name = ${googleUser.name},
            picture = ${googleUser.picture || null}
        WHERE google_id = ${googleUser.sub}
        RETURNING *
      `;
      return updatedUsers[0] as User;
    } else {
      // Crear nuevo usuario
      const newUsers = await sql`
        INSERT INTO users (email, name, google_id, picture)
        VALUES (${googleUser.email}, ${googleUser.name}, ${googleUser.sub}, ${googleUser.picture || null})
        RETURNING *
      `;
      return newUsers[0] as User;
    }
  } catch (error) {
    console.error('Error al crear/actualizar usuario:', error);
    throw error;
  }
}

// Obtener usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;
    return users.length > 0 ? (users[0] as User) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

// Obtener usuario por Google ID
export async function getUserByGoogleId(googleId: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE google_id = ${googleId}
    `;
    return users.length > 0 ? (users[0] as User) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

