# Kira Assistant

**Kira Assistant** è l'assistente virtuale intelligente di **Christian Saccani**, Digital Architect. Progettata per offrire un'interfaccia minimale, professionale e altamente interattiva, Kira funge da punto di contatto e guida per esplorare il portfolio e le competenze tech di Christian.

## 🚀 Caratteristiche

- **AI-Powered**: Integrata con l'engine **Gemini 1.5 Flash** per risposte rapide e precise.
- **Architettura Full-Stack**: Implementata con un backend Node.js/Express per garantire la massima sicurezza delle chiavi API.
- **Design Moderno**: UI curata nei minimi dettagli con **Tailwind CSS**, ottimizzata per desktop e mobile.
- **Animazioni Fluide**: Transizioni ed effetti gestiti con **Framer Motion**.
- **Dark Mode**: Supporto nativo per il tema scuro con switch rapido.
- **Mobile First**: Esperienza utente ottimizzata per dispositivi mobili con gestione intelligente degli spazi.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite.
- **Backend**: Node.js, Express.
- **Styling**: Tailwind CSS.
- **AI**: Google Gemini API (@google/genai).
- **Animations**: Framer Motion.
- **Icons**: Lucide React.

## 📦 Installazione e Setup

1. **Clona la repository**:
   ```bash
   git clone https://github.com/tuo-username/kira-assistant.git
   cd kira-assistant
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**:
   Crea un file `.env` nella root del progetto e aggiungi la tua chiave API di Gemini:
   ```env
   GEMINI_API_KEY=tua_chiave_api_qui
   ```

4. **Avvia in modalità sviluppo**:
   ```bash
   npm run dev
   ```

5. **Build per la produzione**:
   ```bash
   npm run build
   npm start
   ```

## 🔒 Sicurezza

Il progetto utilizza un approccio **Server-Side API Proxy**. La chiave API di Gemini non è mai esposta nel codice frontend, proteggendo la tua quota e i tuoi segreti dall'accesso pubblico.

## 📝 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

---
Creato con ❤️ da [Christian Saccani](https://github.com/christiansaccani)
