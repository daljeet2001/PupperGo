
## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/puppergo.git
cd puppergo
----
##2. Start User App
cd user-app
npm install
npm run dev

----
## 3. Start Walker App
cd ../walker-app
npm install
npm run dev

----
## 4. Start Backend
cd ../backend
npm install
node server.js

----

#5 🔐 Set Up Environment Variables
Create .env files in the following directories:

backend/.env
PORT=3016
MONGO_URI=your_mongo_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GOOGLE_MAPS_API=your google_maps_api_key
------
user-app/.env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_key
VITE_BASE_URL=http://localhost:3016
GOOGLE_MAPS_API=your google_maps_api_key
-----
walker-app/.env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_key
VITE_BASE_URL=http://localhost:3016
GOOGLE_MAPS_API=your google_maps_api_key

