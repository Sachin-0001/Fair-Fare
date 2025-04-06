import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RocketIcon, ShieldCheckIcon, UsersIcon, ArrowRightIcon, BarChartIcon, CodeIcon, MapPinIcon, GaugeIcon, BoltIcon, StarIcon, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useState, useEffect } from 'react';
import Link from "next/link"
import { MapPin, Clock, DollarSign, Shield, TrendingDown } from "lucide-react"
import type { NextPage } from "next"
import { motion } from "framer-motion";

const translations = [
  { text: "WELCOME", lang: "English" },
  { text: "स्वागत है", lang: "Hindi" },
  { text: "ಸ್ವಾಗತ", lang: "Kannada" },
  { text: "வணக்கம்", lang: "Tamil" },
  { text: "స్వాగతం", lang: "Telugu" },
  {text: "സ്വാഗതം", lang: "Malayalam"}
];
const Home: NextPage = () => {
  const [currentTranslation, setCurrentTranslation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTranslation((prev) => (prev + 1) % translations.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div className="text-center space-y-8" variants={itemVariants}>
            <motion.div 
              className="flex justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8" />
            </motion.div>
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent
                           bg-[length:200%_100%] animate-gradient">
                Fair Fare
              </h1>
              <motion.div
                className="absolute -top-6 -right-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 text-purple-400" />
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-xl text-purple-400 font-medium"
              variants={itemVariants}
            >
              {translations[currentTranslation].text}
            </motion.p>
            <motion.p 
              className="text-2xl text-gray-400 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Experience smarter rides with AI-powered fare predictions and real-time surge detection
            </motion.p>
            <motion.div 
              className="flex justify-center gap-4"
              variants={itemVariants}
            >
              <Link href="/user/login">
                <Button className="group px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                                relative overflow-hidden transform hover:scale-105 transition-all duration-200
                                hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <motion.div 
            className="flex justify-center"
            whileInView={{ scale: [1, 1.2, 1] }}
            viewport={{ once: true }}
          >
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8" />
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Smart Features for Smarter Rides
          </h2>
          <p className="text-xl text-gray-400">
            Discover how Fair Fare makes your ride experience better
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              title: "AI Predictions",
              subtitle: "Smart fare estimates using machine learning",
              description: "Get accurate fare predictions based on real-time data, traffic conditions, and historical patterns.",
              icon: <RocketIcon className="w-6 h-6" />
            },
            {
              title: "Live Surge Detection",
              subtitle: "Real-time surge pricing alerts",
              description: "Monitor live demand and get notifications when surge pricing is about to change.",
              icon: <BoltIcon className="w-6 h-6" />
            },
            {
              title: "Fare Lock",
              subtitle: "Lock your fare for 5 minutes",
              description: "Protect yourself from sudden price increases by locking in your current fare.",
              icon: <ShieldCheckIcon className="w-6 h-6" />
            },
            {
              title: "Trust Score",
              subtitle: "Build your reliability rating",
              description: "Earn rewards and benefits by maintaining a high trust score through consistent ride completion.",
              icon: <StarIcon className="w-6 h-6" />
            },
            {
              title: "Smart Maps",
              subtitle: "Interactive route visualization",
              description: "View your route on our interactive dark-themed map with real-time location tracking.",
              icon: <MapPinIcon className="w-6 h-6" />
            },
            {
              title: "Ride History",
              subtitle: "Track your past journeys",
              description: "Access detailed history of your past rides including routes, fares, and distances.",
              icon: <Clock className="w-6 h-6" />
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:shadow-xl transition-all
                         hover:border-purple-500/50 group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full 
                              group-hover:h-12 transition-all duration-300" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-purple-400"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mt-1">{feature.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-12 border border-gray-600
                     hover:shadow-[0_0_50px_rgba(124,58,237,0.1)] transition-all duration-500"
        >
          <div className="text-center space-y-8">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Ready to Experience Smarter Rides?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Join Fair Fare today and start saving on your rides with AI-powered predictions
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              <Link href="/user/login" className="flex-1 max-w-xs">
                <Button className="w-full px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                                relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Book a Ride
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              <Link href="/driver/login" className="flex-1 max-w-xs">
                <Button className="w-full px-8 py-6 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg font-medium 
                                border border-gray-500 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Become a Driver
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;


