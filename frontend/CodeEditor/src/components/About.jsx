import React from 'react';
import './About.css';

// Only import myPhoto now
import myPhoto from '../assets/my-photo.png';

function About() {
  return (
    <div className="about-container">
      <header className="about-hero">
        <h1>My Story</h1>
        <p className="about-subtitle">Why I built CodeAmigo, for myself and for fellow creators.</p>
      </header>

      <div className="story-section origin-story">
        <div className="story-text">
          <h2>From a simple idea to a passion project.</h2>
          <p>Like many developers, I found myself juggling a mix of different tools—a text editor here, a code runner there, and countless tabs for documentation. The process felt fragmented and inefficient. I wanted a single, seamless environment where I could bring my ideas to life without friction. I built CodeAmigo to be that place, a tool for focused, creative coding.</p>
        </div>
        {/* Removed the whiteboardImage */}
      </div>

      <div className="story-section values-section reverse-layout">
        <div className="story-text">
          <h2>My Core Principles</h2>
          <ul>
            <li>
              <strong>Fluid Workflow:</strong> I believe coding should be a continuous creative flow. CodeAmigo integrates everything you need—from a robust IDE to test cases and file management—into one intuitive space.
            </li>
            <li>
              <strong>Intuitive Communication:</strong> I built draggable audio comments for my own process. Now I can leave myself quick notes or reminders in my own voice, making it easier to pick up where I left off or revisit complex code sections.
            </li>
            <li>
              <strong>Organized & Accessible:</strong> I know the chaos of a dozen small projects. CodeAmigo's clean interface helps me keep all my work neatly organized and easily accessible, so I can focus on building, not searching.
            </li>
          </ul>
        </div>
        {/* Removed the valuesImage */}
      </div>

      <div className="story-section makers-section">
        <div className="story-text">
          <h2>A Project for Passionate Builders</h2>
          <p>I built CodeAmigo for myself, but I’ve made it available for others who share a similar passion for organized and efficient development. It's a living project, and I'm always looking for ways to improve it and help fellow creators build amazing things.</p>
        </div>
        <div className="team-photos">
          <img src={myPhoto} alt="A photo of the creator" className="team-member rotate-right" />
        </div>
      </div>
    </div>
  );
}

export default About;