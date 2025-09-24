# 🧪 Pokémon Research Lab

A high-performance Next.js (App Router) application for exploring, editing, and exporting Pokémon datasets. This tool lets you fetch the entire Pokédex via the PokéAPI or upload custom CSV datasets, manipulate them in a dynamic, editable table, and export results — all optimized for large-scale client-side performance.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## 🚀 Features

### 1. Dual Data Sources

#### API Aggregation
- Fetches the entire Pokédex dataset with detailed stats, handling PokéAPI pagination
- Displays progress (`Fetched X / Y Pokémon...`)
- Stores results in a global Zustand store and persists them to IndexedDB for offline use

#### CSV Upload
- Uploads large CSV files (up to 100MB) using PapaParse streaming
- Includes a schema mapping UI to align uploaded columns with Pokémon fields
- Data type validation/coercion (string, number, boolean)
- Persists uploaded data to Zustand + IndexedDB

### 2. High-Performance Interactive Table

Built with TanStack Table, featuring:
- ✅ Sorting
- 🔍 Column filtering
- 🔎 Global search
- 📄 Pagination
- ☑️ Row selection
- ✏️ Inline editing — updates are instantly saved to Zustand + IndexedDB

### 3. Dynamic Columns
- Add custom columns at runtime (Text, Number, Boolean)
- Updates dataset in the global store with default values
- Custom columns are persisted in IndexedDB
- Fully editable inline, just like native Pokémon stats

### 4. IndexedDB Persistence
- Automatically loads previous state (Pokémon + custom columns + uploads) on refresh
- All edits, uploads, and customizations survive page reloads

### 5. Data Export
- Export the current table state (including edits + custom columns) as a downloadable CSV file

### 6. UI/UX Enhancements
- Theme toggle (light/dark mode)
- Responsive Tailwind UI with modern design
- Clear loading states and error handling

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 14+](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + ShadCN UI |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Data Table** | TanStack Table |
| **CSV Parsing** | PapaParse |
| **Persistence** | IndexedDB (via idb) |

## 📂 Project Structure

```
public/
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
src/
    ├── app/
        ├── api/
            ├── fetchPokemonQuery.ts - tenstack query to fetch api 
            └── pokemonApi.ts - base api 
        ├── poke-data/
            ├── columns.tsx 
            ├── data-table.tsx
            ├── page.tsx
            └── pagination.tsx
        ├── favicon.ico
        ├── globals.css
        ├── layout.tsx
        └── page.tsx
    ├── components/
        ├── Features/
            ├── AddColumnDialog.tsx - add a new column
            ├── CustomMappingDialog.tsx - column matching 
            ├── PokeDataset.tsx - fetch data 
            ├── Title.tsx
            └── UploadDataset.tsx - uplaod csv
        ├── Header/
            ├── Header.tsx
            └── index.ts
        ├── Layout/
            ├── index.ts
            └── Layout.tsx
        ├── ThemeToggle/
            ├── index.ts
            └── ThemeToggle.tsx - toggle theme
        └── ui/
            ├── button.tsx
            ├── card.tsx
            ├── dialog.tsx
            ├── input.tsx
            ├── pagination.tsx
            ├── query-provider.tsx
            ├── table.tsx
            └── theme-provider.tsx
    ├── lib/
        └── utils.ts
    ├── store/
        ├── pokemonStore.ts 
        └── uploadedStore.ts
    └── Utils/
        └── indexedDb.ts - idb library to use indexed db
.gitignore
components.json
eslint.config.mjs
next.config.ts
package-lock.json
package.json
postcss.config.mjs
README.md
tsconfig.json
yarn.lock
```

## ⚡ Setup & Installation

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/anshul-tatware1712/poke-api.git
   cd poke-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Key Architectural Decisions

- **Zustand over Redux**: Lightweight, performant, easier to persist to IndexedDB
- **IndexedDB persistence**: Ensures large datasets (Pokédex or CSV) don't vanish on reload
- **Streaming CSV parsing**: Prevents crashes with 100MB+ files
- **Editable table**: All changes synced to store + IndexedDB in real time
- **Sticky columns**: Keeps important actions accessible in wide datasets

## ⚠️ Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Handling 1000+ Pokémon rows efficiently** | Implemented TanStack Table with virtualization + pagination |
| **Large CSV parsing** | Used PapaParse with web workers for streaming |
| **State persistence** | IndexedDB integration with async save/get helpers |
| **Editable dynamic columns** | Added runtime schema extension with type-safe Zustand updates |

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [TanStack](https://tanstack.com/) for excellent React libraries
- [Vercel](https://vercel.com/) for hosting and deployment platform


---

<div align="center">
  <sub>Built with ❤️ using Next.js and TypeScript</sub>
</div>
