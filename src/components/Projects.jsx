import { motion } from 'framer-motion';

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

export const Projects = () => {
    return (
        <motion.section id="projects"  className='projects' initial={{opacity: 0}} whileInView={{opacity: 1}} viewport={{once: true}} transition={{duration: 0.6, delay: 0.2}}>
            <motion.h2 variants={fadeInUp} initial="initial" whileInView="animate" viewport={{once: true}}>
                My Projects
            </motion.h2>
            <motion.div className="project-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{once: true}}>
                
                <motion.div className="project-card" variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.2 }}}>
                    <motion.div className='project-image' style={{backgroundImage: "url('/projects/placeholder.png')"}} whileHover={{scale: 1.05, transition: {duration: 0.2}}}/>
                    <h3>Project One</h3>
                    <p>A brief description of Project One.</p>
                    <div className="project-tech">
                        <span>*temp*</span>
                        <span>*temp*</span>
                        <span>*temp*</span>
                    </div>
                </motion.div>

                <motion.div className="project-card" variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.2 }}}>
                    <motion.div className='project-image' style={{backgroundImage: "url('/projects/placeholder.png')"}} whileHover={{scale: 1.05, transition: {duration: 0.2}}}/>
                    <h3>Project Two</h3>
                    <p>A brief description of Project Two.</p>
                    <div className="project-tech">
                        <span>*temp*</span>
                        <span>*temp*</span>
                        <span>*temp*</span>
                    </div>
                </motion.div>

                <motion.div className="project-card" variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.2 }}}>
                    <motion.div className='project-image' style={{backgroundImage: "url('/projects/placeholder.png')"}} whileHover={{scale: 1.05, transition: {duration: 0.2}}}/>
                    <h3>Project Three</h3>
                    <p>A brief description of Project Three.</p>
                    <div className="project-tech">
                        <span>*temp*</span>
                        <span>*temp*</span>
                        <span>*temp*</span>
                    </div>
                </motion.div>
            
            </motion.div>
        </motion.section>
    );
};