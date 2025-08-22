/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication
 *   - name: Clients
 *     description: Client management
 *   - name: Dashboard
 *     description: Dashboard
 *   - name: Services
 *     description: Service management
 *   - name: Projects
 *     description: Project management

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: List clients (role-based)
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of clients
 *   post:
 *     summary: Create client (admin only)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created
 *
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Client updated
 *   delete:
 *     summary: Delete client (admin only)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       204:
 *         description: Client deleted
 *
 * /api/services:
 *   get:
 *     summary: List services (role-based)
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *   post:
 *     summary: Create service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Service created
 *
 * /api/services/{id}:
 *   put:
 *     summary: Update service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     summary: Delete service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     responses:
 *       204:
 *         description: Service deleted
 *
 * /api/projects:
 *   get:
 *     summary: List projects (role-based)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Project created
 *
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Project updated
 *   delete:
 *     summary: Delete project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted
 *
 * /:
 *   get:
 *     summary: Home page
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Home page
 */

/**
 * @swagger
 * /auth/signup:
 *   get:
 *     summary: Sign up form
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns signup form
 *   post:
 *     summary: Create new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *
 * /auth/login:
 *   get:
 *     summary: Login form
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns login form
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authenticated
 *
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out
 *
 * /client/setup:
 *   get:
 *     summary: Client setup form
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Returns client setup form
 *   post:
 *     summary: Create or update client profile
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client profile created/updated
 *
 * /client/profile:
 *   get:
 *     summary: Redirect to client profile
 *     tags: [Clients]
 *     responses:
 *       302:
 *         description: Redirect
 *
 * /client/data:
 *   get:
 *     summary: Get client data (API)
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Client data
 *
 * /client/{id}:
 *   get:
 *     summary: View client details
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details
 *
 * /dashboard:
 *   get:
 *     summary: Main dashboard (role-based access)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard
 *
 * /service:
 *   get:
 *     summary: Services information page
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services info
 *
 * /service/{id}:
 *   get:
 *     summary: View service details
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *
 * /project:
 *   get:
 *     summary: Redirects to dashboard projects tab
 *     tags: [Projects]
 *     responses:
 *       302:
 *         description: Redirect
 *
 * /project/{id}:
 *   get:
 *     summary: View project details
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 */
