import React from 'react';
import './Home.css';
import client1 from '../assets/client1.png';
import client2 from '../assets/client2.png';
import Projects from "../assets/projects.png";
import MyProjects from "../assets/MyProjects.png";
import audio from "../assets/audio.png";
import AiSuggestions from "../assets/AISuggestions.png"

function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1 className="hero-heading">
          Code<span className="word2">Amigo</span>
        </h1>
        <div className="hero-subtitle">
          <p className="hero-subtitle-text">
            Code collaboratively with friends in real time!
          </p>
        </div>
      </header>

      <div className="feature-section collab-feature">
        <div className="feature-text">
          <h2 className="feature-title">
            Collab with friends in real time to build Projects
          </h2>
        </div>
        <div className="feature-images">
          <img src={client1} alt="Client 1" className="client-image img-left" />
          <img src={client2} alt="Client 2" className="client-image img-right" />
        </div>
      </div>

      <div className="feature-section audio-feature reverse-layout">
        <div className="feature-text">
          <h2 className="feature-title">
            Making communication robust with draggable audio comments
          </h2>
        </div>
        <div className="feature-images">
          <img src={audio} alt="audio" className="audio-image" />
        </div>
      </div>

      <div className="feature-section projects-feature">
        <div className="feature-text">
          <h2 className="feature-title">
            Organizing projects neatly
          </h2>
        </div>
        <div className="feature-images">
          <img src={Projects} alt="project" className="projects-image img-left" />
          <img src={MyProjects} alt="my-project" className="projects-image img-right" />
        </div>
      </div>

      {/* New AI feature section */}
      <div className="feature-section ai-feature">
        <div className="feature-text">
          <h2 className="feature-title">
            AI code suggestions to make your life easier!
          </h2>
        </div>
        
          <img src={AiSuggestions} alt="my-project" className="ai-image" />
      </div>
    </div>
  );
}

export default Home;