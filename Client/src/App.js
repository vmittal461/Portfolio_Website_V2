import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState({
    padding: "1.5rem 0",
    background: "rgba(27, 27, 27, 0.8)",
  });
  const [activeFilter, setActiveFilter] = useState("all");

  const textOptions = [
    "VFX ARTIST",
    "VIDEO EDITOR",
    "PHOTO EDITOR",
    "ANIMATION",
  ];
  const animatedTitleRef = useRef(null);
  const cursorRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navLinksRef = useRef(null);
  const loaderRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const yearRef = useRef(null);
  const skillLevelsRef = useRef([]);
  const projectItemsRef = useRef([]);

  // Loading screen animation
  useEffect(() => {
    let interval;
    if (progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (loaderRef.current) {
                loaderRef.current.style.opacity = "0";
                setTimeout(() => {
                  loaderRef.current.style.display = "none";
                }, 800);
              }
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, []);

  // Update progress bar and text
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.floor(progress)}%`;
    }
  }, [progress]);

  // Text animation for hero section
  useEffect(() => {
    if (animatedTitleRef.current) {
      gsap.to(animatedTitleRef.current, { opacity: 1, duration: 0.5 });
    }

    const changeText = () => {
      gsap.to(animatedTitleRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setCurrentTextIndex((prev) => (prev + 1) % textOptions.length);
          gsap.to(animatedTitleRef.current, {
            opacity: 1,
            duration: 0.5,
          });
        },
      });
    };

    const textInterval = setInterval(changeText, 3000);
    return () => clearInterval(textInterval);
  }, []);

  // Initialize skill bars without animation
  useEffect(() => {
    skillLevelsRef.current.forEach((bar) => {
      if (bar) {
        const level = bar.getAttribute("data-level");
        bar.style.width = `${level}%`;
      }
    });
  }, []);

  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, .project-item, input, textarea"
    );
    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorRef.current.style.backgroundColor = "rgba(209, 255, 72, 0.5)";
      }
    };
    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
        cursorRef.current.style.backgroundColor = "var(--secondary-color)";
      }
    };

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderStyle({
          padding: "1rem 0",
          background: "rgba(27, 27, 27, 0.95)",
        });
      } else {
        setHeaderStyle({
          padding: "1.5rem 0",
          background: "rgba(27, 27, 27, 0.8)",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure projects are visible on initial load
  useEffect(() => {
    projectItemsRef.current.forEach((item) => {
      if (item) {
        item.style.opacity = "1";
        item.style.display = "block";
      }
    });
  }, []);

  // Only keep animations for hero section
  useEffect(() => {
    // Year update
    if (yearRef.current) {
      yearRef.current.textContent = new Date().getFullYear();
    }
  }, []);

  // Project filtering
  const handleFilterClick = (filterValue) => {
    setActiveFilter(filterValue);

    projectItemsRef.current.forEach((item) => {
      if (item) {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.opacity = "1";
          item.style.display = "block";
        } else {
          item.style.opacity = "0";
          item.style.display = "none";
        }
      }
    });
  };

  // Mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Loading Screen */}
      <div className="loader" ref={loaderRef}>
        <div className="loader-logo">
          <span className="n-letter">N</span>
          <span className="m-letter">M</span>
        </div>

        <div className="progress-container">
          <div className="progress-bar" ref={progressBarRef}></div>
        </div>
        <div className="progress-text" ref={progressTextRef}>
          0%
        </div>
        <div className="social-links">
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="#">
            <i className="fab fa-behance"></i>
          </a>
          <a href="#">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      {/* Custom Cursor */}
      <div className="custom-cursor" ref={cursorRef}></div>

      {/* Navigation Bar */}
      <header style={headerStyle}>
        <div className="content-fit">
          <div className="logo">NM</div>
          <nav>
            <ul
              className={`nav-links ${isMenuOpen ? "active" : ""}`}
              ref={navLinksRef}
            >
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#skills">Skills</a>
              </li>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <div
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              ref={hamburgerRef}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section" id="home">
        <video autoPlay muted loop className="hero-bg">
          <source src="assets/vfx-showreel.mp4" type="video/mp4" />
        </video>
        <div className="content-fit">
          <div className="hero-content">
            <h1
              className="title"
              ref={animatedTitleRef}
              data-before={textOptions[currentTextIndex]}
            >
              {textOptions[currentTextIndex]}
            </h1>
            <h2>Nippun Mittal</h2>
            <div className="cta-buttons">
              <a href="#contact" className="cta-button">
                Get in Touch
              </a>
              <a href="#projects" className="cta-button">
                Showcase
              </a>
            </div>
          </div>
        </div>
        <img src="" className="decorate" alt="VFX element" />
      </section>

      {/* About Section */}
      <section className="section" id="about">
        <div className="content-fit">
          <div className="number">01</div>
          <div className="about-content">
            <div className="about-text">
              <div className="title">About Me</div>
              <p>
                Creative VFX artist with 5+ years of experience in transforming
                raw footage into visual masterpieces. Specializing in
                compositing and motion graphics, I bring stories to life through
                digital magic.
              </p>
              <p>
                My approach combines technical precision with artistic vision to
                deliver compelling visual narratives that captivate audiences.
              </p>
            </div>
            <div className="about-image">
              <img src="assets/profile.jpg" alt="Nippun Mittal" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section" id="skills">
        <div className="content-fit">
          <div className="number">02</div>
          <div className="skills-content">
            <div className="title">Skills & Expertise</div>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>Creative Design</h3>
                <div className="skill-item">
                  <span>3D Modeling</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="90"
                      ref={(el) => (skillLevelsRef.current[0] = el)}
                    ></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>Motion Graphics</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="85"
                      ref={(el) => (skillLevelsRef.current[1] = el)}
                    ></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>Concept Art</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="80"
                      ref={(el) => (skillLevelsRef.current[2] = el)}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="skill-category">
                <h3>Video Production</h3>
                <div className="skill-item">
                  <span>Video Editing</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="95"
                      ref={(el) => (skillLevelsRef.current[3] = el)}
                    ></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>Color Grading</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="85"
                      ref={(el) => (skillLevelsRef.current[4] = el)}
                    ></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>Sound Design</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="80"
                      ref={(el) => (skillLevelsRef.current[5] = el)}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="skill-category">
                <h3>Web & UX/UI Design</h3>
                <div className="skill-item">
                  <span>Web Design</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="90"
                      ref={(el) => (skillLevelsRef.current[6] = el)}
                    ></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>UI/UX Design</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="85"
                      ref={(el) => (skillLevelsRef.current[7] = el)}
                    ></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>Prototyping</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      data-level="80"
                      ref={(el) => (skillLevelsRef.current[8] = el)}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src="assets/vfx-element-2.png"
          className="decorate"
          alt="VFX element"
        />
      </section>

      {/* Projects Section */}
      <section className="section" id="projects">
        <div className="content-fit">
          <div className="number">03</div>
          <div className="projects-content">
            <div className="title">Selected Works</div>
            <div className="project-filters">
              <button
                className={`filter-btn ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "creative-design" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("creative-design")}
              >
                Creative Design
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "video-production" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("video-production")}
              >
                Video Production
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "web-design" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("web-design")}
              >
                Web & UX/UI Design
              </button>
            </div>
            <div className="project-grid">
              <div
                className="project-item"
                data-category="creative-design"
                ref={(el) => (projectItemsRef.current[0] = el)}
              >
                <div className="project-thumbnail">
                  <img src="assets/project1-thumb.jpg" alt="Project 1" />
                  <div className="project-overlay">
                    <h3>Cosmic Journey</h3>
                    <button className="view-project">View Details</button>
                  </div>
                </div>
              </div>
              <div
                className="project-item"
                data-category="video-production"
                ref={(el) => (projectItemsRef.current[1] = el)}
              >
                <div className="project-thumbnail">
                  <img src="assets/project2-thumb.jpg" alt="Project 2" />
                  <div className="project-overlay">
                    <h3>Time-lapse Dreams</h3>
                    <button className="view-project">View Details</button>
                  </div>
                </div>
              </div>
              <div
                className="project-item"
                data-category="web-design"
                ref={(el) => (projectItemsRef.current[2] = el)}
              >
                <div className="project-thumbnail">
                  <img src="assets/project3-thumb.jpg" alt="Project 3" />
                  <div className="project-overlay">
                    <h3>Modern UX</h3>
                    <button className="view-project">View Details</button>
                  </div>
                </div>
              </div>
              <div
                className="project-item"
                data-category="creative-design"
                ref={(el) => (projectItemsRef.current[3] = el)}
              >
                <div className="project-thumbnail">
                  <img src="assets/project4-thumb.jpg" alt="Project 4" />
                  <div className="project-overlay">
                    <h3>Nature's Palette</h3>
                    <button className="view-project">View Details</button>
                  </div>
                </div>
              </div>
              <div
                className="project-item"
                data-category="video-production"
                ref={(el) => (projectItemsRef.current[4] = el)}
              >
                <div className="project-thumbnail">
                  <img src="assets/project5-thumb.jpg" alt="Project 5" />
                  <div className="project-overlay">
                    <h3>City Lights</h3>
                    <button className="view-project">View Details</button>
                  </div>
                </div>
              </div>
              <div
                className="project-item"
                data-category="web-design"
                ref={(el) => (projectItemsRef.current[5] = el)}
              >
                <div className="project-thumbnail">
                  <img src="assets/project6-thumb.jpg" alt="Project 6" />
                  <div className="project-overlay">
                    <h3>Responsive Design</h3>
                    <button className="view-project">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section" id="contact">
        <div className="content-fit">
          <div className="number">04</div>
          <div className="contact-content">
            <div className="title">Get In Touch</div>
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Contact Information</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>Email</td>
                      <td>contact@nippunmittal.com</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>+1 (555) 123-4567</td>
                    </tr>
                    <tr>
                      <td>Location</td>
                      <td>Mumbai, India</td>
                    </tr>
                  </tbody>
                </table>
                <div className="social-links">
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-behance"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="content-fit">
          <div className="footer-content">
            <div className="footer-logo">NM</div>
            <div className="footer-links">
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#skills">Skills</a>
                </li>
                <li>
                  <a href="#projects">Projects</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-copyright">
              &copy; <span ref={yearRef}>{new Date().getFullYear()}</span>{" "}
              Nippun Mittal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
