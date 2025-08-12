import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About the Developer</h1>

        <div className="developer-info">
          <div
            className="avatar-placeholder"
            data-testid="avatar-placeholder"
          ></div>
          <div className="developer-details">
            <h2>Novogran Vitaly</h2>
            <ul className="developer-stats" aria-label="Developer Stats">
              <li>
                <strong>Age:</strong> 29
              </li>
              <li>
                <strong>Location:</strong> Minsk
              </li>
              <li>
                <strong>Specialty:</strong> Front-End Development
              </li>
            </ul>
          </div>
        </div>

        <div className="developer-story">
          <h3>Development Journey</h3>
          <p>
            My programming journey began with Java where I developed Android
            applications. I later transitioned to Kotlin for more expressive and
            concise code. Seeking to expand my skillset, I ventured into
            front-end development mastering HTML, CSS, and JavaScript.
          </p>

          <p>
            What I enjoy most about coding is the creative problem-solving
            aspect - finding elegant solutions to complex challenges. Each
            project is an opportunity to learn and improve.
          </p>

          <h3>Beyond Coding</h3>
          <p>When I am not coding, you can find me:</p>
          <ul>
            <li>🎮 Exploring new video game worlds</li>
            <li>🔧 Fixing and tinkering with tech gadgets</li>
            <li>🏊 Swimming for relaxation and fitness</li>
          </ul>

          <h3>Future Aspirations</h3>
          <p>
            I am passionate about continuous growth in the tech field and
            sharing knowledge with the developer community. My goal is to
            contribute to meaningful projects that solve real-world problems
            while mentoring aspiring developers.
          </p>
        </div>

        <div className="rs-school">
          <h3>Education</h3>
          <p>I honed my React skills through the excellent curriculum at:</p>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="rs-link"
          >
            RS School React Course
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
