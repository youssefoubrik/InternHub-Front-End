"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const EnhancedCallToAction = () => {

  return (
    <section className="py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your Journey?
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Whether you're a student looking for an internship or a company
            seeking talented interns, InternHub is the perfect platform to
            connect and grow together.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/signup/student">Sign up as a Student</Link>
            </motion.button>

            <motion.button
              className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 font-bold py-3 px-8 rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/signup/company">Sign up as a Company</Link>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedCallToAction;
