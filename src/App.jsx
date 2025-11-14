import './App.css'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Projects } from './components/Projects.jsx'
import { Contact } from './components/Contact.jsx'

function App() {
  return (
    <div className="app">
      <Navbar />

      <Hero />

      <Projects />

      <Contact />

      <>
        <p> &copy; 2025 JackP. All Rights Reserved.</p>
      </>
    </div>
  );
}

export default App;
