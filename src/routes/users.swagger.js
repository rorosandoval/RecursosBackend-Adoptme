/**
 * @swagger
 * /api/users/:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados en el sistema
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 *
 * /api/users/{uid}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener un usuario por ID
 *     description: Retorna los datos de un usuario específico identificado por su ID
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualizar un usuario
 *     description: Actualiza los datos de un usuario específico. Solo los campos proporcionados serán actualizados.
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del usuario
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario (debe ser único)
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: Rol del usuario
 *             example:
 *               first_name: Juan
 *               last_name: Pérez
 *               email: juan@example.com
 *               role: user
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     tags:
 *       - Users
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario específico del sistema
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario (MongoDB ObjectId)
 *         first_name:
 *           type: string
 *           description: Nombre del usuario
 *         last_name:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email único del usuario
 *         password:
 *           type: string
 *           description: Contraseña hasheada del usuario
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Rol del usuario en el sistema
 *         pets:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de mascotas adoptadas por el usuario
 *         __v:
 *           type: number
 *           description: Versión del documento
 *       example:
 *         _id: 507f1f77bcf86cd799439001
 *         first_name: Juan
 *         last_name: Pérez
 *         email: juan@example.com
 *         password: $2b$10$hashedpassword
 *         role: user
 *         pets: [507f1f77bcf86cd799439011]
 *         __v: 0
 */
