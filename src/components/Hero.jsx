import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const fadeInUp = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.6},
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const Hero = () => {
    return (
        <motion.section id='home' className='hero' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.8, delay: 0.2}}>

            <div className="hero-container">
                <motion.div className="hero-content" variants={staggerContainer} initial="initial" animate="animate">
                    <motion.div className="hero-badge">
                        <span>Welcome to my portfolio</span>
                    </motion.div>
                    <motion.h1 className="glitch" variants={fadeInUp} whileHover={{ scale: 1.02 }}>Jack Preston</motion.h1>
                    <motion.h2 className="hero-subtitle" variants={fadeInUp}>Aspiring Software Engineering</motion.h2>
                    <motion.p className='hero-description' variants={fadeInUp}>
                        Hi! I'm Jack, a passionate Software Engineering, Finance and Management student at The University of Auckland.
                        I love creating innovative solutions and learning new technologies. Explore my projects and feel free to reach out!
                    </motion.p>

                    <motion.div className="cta-buttons" variants={staggerContainer}>
                        <motion.a href="#projects" className="cta-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            View My Projects
                        </motion.a>
                        <motion.a href="#contact" className="cta-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Contact Me
                        </motion.a>
                    </motion.div>
                    <motion.div className="social-links" variants={staggerContainer}>
                        <motion.a href="https://github.com/jpreston05" target="_blank">
                            <i className="fab fa-github"></i>
                        </motion.a>
                        <motion.a href="https://www.linkedin.com/in/jackdpreston/" target="_blank">
                            <i className="fab fa-linkedin"></i>
                        </motion.a>
                    </motion.div>
                </motion.div>

                <motion.div className="hero-image-container" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} transition={{duration: 0.8, delay: 0.4}}>
                    <div className="code-display">
                        <SyntaxHighlighter language='javascript' customStyle={{margin: 0, padding: "2rem", height: "100%", borderRadius: "20px", background: "rgba(30, 41, 59, 0.8)", backdropFilter: "blur(10px)", marginBottom: 50}} style={vscDarkPlus}>
                            {`const aboutMe: DeveloperProfile = {
  name: "Jack Preston",
  origin: "Waihi Beach, New Zealand",
  currentLocation: "Auckland, New Zealand",
  role: "Student @ The University of Auckland",
  degrees: [
    "BSc in Software Engineering", 
    "BCom in Finance and Management"
  ],
  stack: {
    languages: [
        "Java", 
        "Python", 
        "C++", 
        "C", 
        "JavaScript", 
        "HTML", 
        "CSS", 
        "SQL"
    ],
    frameworks: "React",
  },
  traits: [
    "perfectionist",
    "lifelong learner",
    "problem solver",
    "team player",
    "dark mode advocate",
  ],
  missionStatement:
    "Bringing ideas to life through code, one project at a time.",
};`}
                        </SyntaxHighlighter>
                    </div>

                    <motion.div className='floating-card' animate={{y: [0, -10, 0], rotate: [0, 2, 0]}} transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}>
                        <div className='card-content'>
                            <span className='card-icon'> 💻 </span>
                            <span className='card-text'> Currrently working on this website! </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};