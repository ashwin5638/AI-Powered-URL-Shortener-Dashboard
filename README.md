# 🔗 AI-Powered URL Shortener Dashboard

A full-stack URL shortening platform inspired by Bitly that enables users to create, manage, and track shortened URLs through a modern web dashboard.

## 🚀 Features

### URL Management

* Create short URLs from long URLs
* Generate unique short codes automatically
* Optional custom alias support
* Optional expiration date
* Enable/Disable links
* Soft delete links
* Copy short URLs with one click

### Dashboard

* View all created links
* Total Links
* Total Clicks
* Active Links
* Expired Links
* Search links
* Responsive design

### Analytics

* Track total clicks
* Daily click analytics
* Browser distribution
* Operating system distribution
* Country distribution
* Top referrers
* Click history

### Backend

* RESTful APIs
* MongoDB database
* Automatic short code generation
* Redirect endpoint
* Input validation
* Soft delete support

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* CSS / Tailwind CSS
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* NanoID

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# 📂 Project Structure

```text
ai-url-shortener/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── approach.md
│   ├── architecture.md
│   ├── tradeoffs.md
│   └── prompts.md
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/ai-url-shortener.git
cd ai-url-shortener
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
```

Start the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 📌 REST API Endpoints

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/api/links`            | Create a short URL           |
| GET    | `/api/links`            | Get all links                |
| GET    | `/api/links/:id`        | Get link details             |
| PUT    | `/api/links/:id`        | Update a link                |
| PATCH  | `/api/links/:id/status` | Enable or disable a link     |
| DELETE | `/api/links/:id`        | Soft delete a link           |
| GET    | `/:shortCode`           | Redirect to the original URL |
| GET    | `/api/analytics/:id`    | Get analytics for a link     |

---

# 📊 Dashboard

The dashboard provides:

* Total Links
* Total Clicks
* Active Links
* Expired Links
* Search
* Pagination
* Link Management
* Analytics Access

---

# 📈 Analytics

Track visitor insights including:

* Total Clicks
* Daily Click Trends
* Browser Usage
* Operating System Usage
* Device Distribution
* Country Distribution
* Top Referrers

---

# 🎯 Project Goals

* Build a Bitly-like URL shortening platform.
* Practice full-stack development with React, Node.js, Express, and MongoDB.
* Implement REST APIs and URL redirection.
* Track click analytics for marketing campaigns.
* Create a responsive and user-friendly dashboard.

---

# 🔮 Future Enhancements

* User Authentication (JWT)
* QR Code Generation
* AI-generated smart aliases
* Bulk URL import
* Link expiration reminders
* Export analytics to CSV
* Custom domains
* Role-based access control

---

# 📄 Documentation

Additional project documentation is available in the `docs/` folder:

* `approach.md`
* `architecture.md`
* `tradeoffs.md`
* `prompts.md`


If you found this project helpful, consider giving it a ⭐ on GitHub.
