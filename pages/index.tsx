import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RocketIcon, ShieldCheckIcon, UsersIcon, ArrowRightIcon, BarChartIcon, CodeIcon, MapPinIcon, GaugeIcon, BoltIcon, StarIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useState, useEffect } from 'react';

const translations = [
  { text: "WELCOME", lang: "English" },
  { text: "स्वागत है", lang: "Hindi" },
  { text: "ಸ್ವಾಗತ", lang: "Kannada" },
  { text: "வணக்கம்", lang: "Tamil" },
  { text: "స్వాగతం", lang: "Telugu" },
  {text: "സ്വാഗതം", lang: "Malayalam"}
];
const LandingPage = () => {
  const [currentTranslation, setCurrentTranslation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTranslation((prev) => (prev + 1) % translations.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <CodeIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">FairFare</div>
          </div>
          {/* <div className="hidden md:flex space-x-1">
            <Button variant="ghost" className="rounded-full text-gray-600 hover:text-blue-600">Features</Button>
            <Button variant="ghost" className="rounded-full text-gray-600 hover:text-blue-600">Pricing</Button>
            <Button variant="ghost" className="rounded-full text-gray-600 hover:text-blue-600">About</Button>
            <Button variant="ghost" className="rounded-full text-gray-600 hover:text-blue-600">Contact</Button>
          </div> */}
          <div> 
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-12 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-40 right-0 w-64 h-64 bg-blue-400 rounded-full opacity-10 -z-10 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-green-400 rounded-full opacity-10 -z-10 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              {/* <span className="block">Find Your</span> */}
              <span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">{translations[currentTranslation].text}</span>🙏🏻
            </h1>
            <p className="text-xl text-gray-600 max-w-xl">
              Our FairFare connects you with top companies offering exciting internship opportunities.
            </p>
            <div className="flex space-x-4 pt-4">
             <a href='#portal'> <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                Continue as Driver
              </Button></a>
              <a href='#portal'><Button size="lg" variant="outline" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                Continue as User <ArrowRightIcon className="w-4 h-4" />
              </Button></a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl blur-xl opacity-20"></div>
              <img 
              src="/assets/fairfarefrontimage.png" 
              alt="Hero Section Image" 
              className="rounded-2xl shadow-2xl relative w-full border border-gray-100" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-bold text-blue-600">98%</p>
            <p className="text-gray-600">Placement Rate</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-green-600">10k+</p>
            <p className="text-gray-600">Internships Listed</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-purple-600">24/7</p>
            <p className="text-gray-600">Support Available</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-orange-600">500+</p>
            <p className="text-gray-600">Companies</p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
{/* Feature Highlights */}
<div className="max-w-7xl mx-auto px-4 py-16">
  <div className="text-center mb-16">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FairFare?</h2>
    <p className="text-gray-600 max-w-2xl mx-auto">We ensure fair pricing, faster rides, and a seamless experience for both passengers and drivers.</p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="group">
      <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300 border border-blue-100 h-full">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
          <MapPinIcon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Live Surge Meter</h3>
        <p className="text-gray-600">Passengers see real-time demand vs. driver availability, ensuring transparent pricing.</p>
      </div>
    </div>
    
    <div className="group">
      <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300 border border-green-100 h-full">
        <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
          <GaugeIcon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Priority Subscription</h3>
        <p className="text-gray-600">Subscribers get priority ride matching and fare protection during peak hours.</p>
      </div>
    </div>

    <div className="group">
      <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300 border border-purple-100 h-full">
        <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
          <BoltIcon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">AI-Powered Routing</h3>
        <p className="text-gray-600">Smart predictions help drivers reach high-demand zones before surge pricing kicks in.</p>
      </div>
    </div>

    <div className="group">
      <div className="p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300 border border-yellow-100 h-full">
        <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
          <StarIcon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Gamified Trust Score</h3>
        <p className="text-gray-600">Drivers & passengers earn scores for reliability; high scores unlock perks like 1.5x peak fares.</p>
      </div>
    </div>
  </div>
</div>



      {/* Portal Section with Angled Background */}
      <section id='portal' className="relative py-20 overflow-hidden">
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 skew-y-3 transform -translate-y-16"></div>
        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Portal</h2>
            <p className="text-blue-100 max-w-xl mx-auto">Whether you're a driver looking for opportunities or a passenger seeking seamless rides, we've got you covered.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Card className="bg-white/95 backdrop-blur-sm border-none rounded-xl overflow-hidden shadow-2xl transform hover:translate-y-[-8px] transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">Driver Portal</CardTitle>
                  <BarChartIcon className="w-8 h-8 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <p className="text-gray-600">Manage internships, track applications, and analyze data with ease.</p> */}
                <div className="space-y-3 pt-2">
                  <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2" asChild>
                    <a href="/driver/login">Driver Login <ArrowRightIcon className="w-4 h-4" /></a>
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-blue-50 rounded-lg text-blue-600 border-blue-200" asChild>
                    <a href="/driver/register">Create Driver Account</a>
                  </Button>
                </div>
                <div className="pt-2 text-sm text-gray-500">
                  {/* <p>Features include: Internship Management, Application Tracking, Data Analytics, and more.</p> */}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-none rounded-xl overflow-hidden shadow-2xl transform hover:translate-y-[-8px] transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">User Portal</CardTitle>
                  <UsersIcon className="w-8 h-8 text-green-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <p className="text-gray-600">Find and apply to internships, track your applications, and get hired.</p> */}
                <div className="space-y-3 pt-2">
                  <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2" asChild>
                    <a href="/user/login">User Login <ArrowRightIcon className="w-4 h-4" /></a>
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-green-50 rounded-lg text-green-600 border-green-200" asChild>
                    <a href="/user/register">Create User Account</a>
                  </Button>
                </div>
                <div className="pt-2 text-sm text-gray-500">
                  {/* <p>Features include: Internship Search, Application Tracking, Notifications, and more.</p> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
        </section>

      {/* Testimonial Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            className="testimonial-swiper"
          >
            {/* Testimonial 1 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full overflow-hidden">
                    <img
                      src="/api/placeholder/150/150"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <div className="text-blue-600 flex justify-center md:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                    <p className="text-gray-700 text-lg italic mb-4">
                    "FairFare has transformed my ride-booking experience. The
                    platform's transparency and ease of use are unmatched."
                    </p>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Student, Tech University</p>
                </div>
              </div>
            </SwiperSlide>

            {/* Testimonial 2 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full overflow-hidden">
                    <img
                      src="/api/placeholder/150/150"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <div className="text-green-600 flex justify-center md:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg italic mb-4">
                    "FairFare has been a game-changer for me. The transparency and
                    ease of use are unmatched."
                  </p>
                  <p className="font-semibold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Driver, FairFare</p>
                </div>
              </div>
            </SwiperSlide>

            {/* Testimonial 3 */}
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full overflow-hidden">
                    <img
                      src="/api/placeholder/150/150"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <div className="text-purple-600 flex justify-center md:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg italic mb-4">
                    "The best platform for connecting with opportunities. Highly
                    recommended!"
                  </p>
                  <p className="font-semibold text-gray-900">Emily Davis</p>
                  <p className="text-sm text-gray-600">Passenger, FairFare</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

  

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <CodeIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold text-white">FairFare</div>
            </div>
            <p className="text-gray-400">
              Empowering drivers and passengers with fair pricing, seamless rides, and transparent opportunities.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#help" className="hover:text-blue-400">Help Center</a></li>
              <li><a href="#blog" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#faq" className="hover:text-blue-400">FAQs</a></li>
              <li><a href="#docs" className="hover:text-blue-400">Documentation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: support@fairfare.com</p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
            <p className="text-gray-400">Address: 123 FairFare Lane, Tech City</p>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© 2025 FairFare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


