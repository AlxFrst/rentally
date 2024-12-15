'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, HomeIcon, Car, Shield, Star, Building2, FileText, Users, BarChart } from "lucide-react";
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                {/* <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 mb-6 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm font-medium">Nouveau : Gestion des SCI intégrée</span>
                </div> */}
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white leading-tight mb-6">
                  Gérez votre patrimoine immobilier en toute sérénité
                </h1>
                
                <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-8 max-w-xl">
                  Une plateforme tout-en-un pour les professionnels de l'immobilier. 
                  Simplifiez la gestion de vos biens, SCI et locataires.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                    Démarrer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="group">
                    Voir la démo 
                    <motion.span 
                      className="ml-2 inline-block"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      ▶
                    </motion.span>
                  </Button>
                </div>
                
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { number: "10k+", label: "Documents gérés" },
                      { number: "1k+", label: "Biens suivis" },
                      { number: "99%", label: "Satisfaction" },
                    ].map((stat, i) => (
                      <div key={i} className="text-left">
                        <div className="text-2xl font-bold">{stat.number}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Right Content - Visual Element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative hidden lg:block"
              >
                <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-3xl" />
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-48 h-48 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6"
                  >
                    <HomeIcon className="h-8 w-8 mb-4 text-blue-500" />
                    <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </motion.div>
                  
                  <motion.div
                    animate={{
                      y: [0, 20, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6"
                  >
                    <Building2 className="h-8 w-8 mb-4 text-purple-500" />
                    <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { icon: HomeIcon, title: "Gestion Immobilière", desc: "Gérez vos biens immobiliers en toute simplicité" },
                { icon: Building2, title: "Gestion des SCI", desc: "Administration complète de vos structures juridiques" },
                { icon: FileText, title: "Documents", desc: "Centralisation de tous vos documents importants" },
                { icon: Users, title: "Locataires", desc: "Suivi détaillé de vos locataires" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <feature.icon className="h-8 w-8 mb-4 text-zinc-800 dark:text-zinc-200" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { number: "1000+", label: "Biens gérés" },
                { number: "500+", label: "Utilisateurs actifs" },
                { number: "99%", label: "Satisfaction client" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-zinc-600 dark:text-zinc-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Detail Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold mb-6">Gestion complète de votre patrimoine</h2>
                <ul className="space-y-4">
                  {[
                    "Suivi des loyers et charges en temps réel",
                    "Gestion documentaire centralisée",
                    "Interface intuitive et moderne",
                    "Rapports et analyses détaillés",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-[400px] rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 dark:opacity-40" />
                <div className="absolute inset-0 backdrop-blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à simplifier votre gestion locative ?
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-8">
              Rejoignez des milliers de professionnels qui font confiance à EasyRent
            </p>
            <Button size="lg" className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Créer un compte gratuitement
            </Button>
          </motion.div>
          
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100/50 to-transparent dark:via-zinc-900/50" />
        </section>

        {/* Interactive Features Showcase */}
        <section className="py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Une solution complète</h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Tout ce dont vous avez besoin pour gérer votre patrimoine immobilier
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* SCI Management Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                transition={{ duration: 0.5 }}
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, type: "spring" }}
                  className="relative z-10"
                >
                  <Building2 className="h-10 w-10 mb-4 text-blue-500" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 relative z-10">Gestion des SCI</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 relative z-10">
                  <motion.li 
                    className="flex items-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Création et suivi des SCI</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Gestion des associés</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Documents légaux</span>
                  </motion.li>
                </ul>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-blue-500/30 blur-sm"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 2 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </motion.div>

              {/* Property Management Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <HomeIcon className="h-10 w-10 mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Gestion Immobilière</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>Suivi des biens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>Gestion des loyers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span>Maintenance</span>
                  </li>
                </ul>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.div>

              {/* Document Management Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <FileText className="h-10 w-10 mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Gestion Documentaire</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Stockage sécurisé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Classement intelligent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Historique des versions</span>
                  </li>
                </ul>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-800/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Une expérience utilisateur fluide et intuitive
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-700 transform -translate-y-1/2 hidden lg:block" />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
                {[
                  {
                    icon: Users,
                    title: "Connexion",
                    description: "Connectez-vous simplement avec votre compte Google"
                  },
                  {
                    icon: Building2,
                    title: "Configuration",
                    description: "Créez vos SCI et ajoutez vos biens immobiliers"
                  },
                  {
                    icon: FileText,
                    title: "Gestion",
                    description: "Gérez vos documents et suivez vos loyers"
                  },
                  {
                    icon: BarChart,
                    title: "Analyse",
                    description: "Visualisez vos performances en temps réel"
                  }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="relative z-10 bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center mb-4">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{step.description}</p>
                    </div>
                    {i < 3 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="absolute top-1/2 right-0 w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full transform translate-x-1/2 -translate-y-1/2 hidden lg:block"
                      >
                        <ArrowRight className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </section>

        {/* Testimonial Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Ils nous font confiance</h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Découvrez ce que nos utilisateurs disent de nous
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Marie L.",
                  role: "Gestionnaire de patrimoine",
                  content: "EasyRent a révolutionné ma façon de gérer mes biens immobiliers. L'interface est intuitive et les fonctionnalités sont complètes."
                },
                {
                  name: "Thomas B.",
                  role: "Propriétaire de SCI",
                  content: "La gestion des SCI est devenue un jeu d'enfant. Je peux suivre tous mes documents et mes revenus en un seul endroit."
                },
                {
                  name: "Sophie M.",
                  role: "Agent immobilier",
                  content: "Un outil indispensable pour la gestion quotidienne. Le support client est réactif et les mises à jour sont régulières."
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">{testimonial.content}</p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
