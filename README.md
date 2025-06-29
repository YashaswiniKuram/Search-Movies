## ⚙️ Setup Instructions

Follow these steps to get the project running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/YashaswiniKuram/Search-Movies.git
cd YOUR_REPO_NAME
```

### 2. Install Dependencies

> Ensure Node.js and npm are installed on your system.

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and add your OMDb API key:

```env
NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at:  
👉 `http://localhost:3000`

---

## 🛠️ Tech Stack

- **Next.js** – Framework for server-side rendered React apps
- **React** – JavaScript library for building user interfaces
- **TypeScript** – Strongly typed JavaScript
- **TailwindCSS** – Utility-first CSS framework
- **ShadCN UI** – Accessible components built with Tailwind and Radix

---

## 🌐 APIs Used

- **OMDb API** for movie details  
  [http://www.omdbapi.com/](http://www.omdbapi.com/)

- **OMDb Poster API** for fetching movie posters  
  [http://img.omdbapi.com/](http://img.omdbapi.com/)

---

## 🙌 Acknowledgements

- [OMDb API](http://www.omdbapi.com/)
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.dev/)
