import React from 'react';
import { MapPin, Users, Clock, Shield, Award, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Partner Gyms', value: '500+', icon: MapPin },
    { label: 'Active Members', value: '50K+', icon: Users },
    { label: 'Cities Covered', value: '25+', icon: Clock },
    { label: 'Workouts Completed', value: '1M+', icon: Award },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Health First',
      description: 'We believe fitness should be accessible to everyone, everywhere.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'All partner gyms are verified and maintain high safety standards.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive fitness community across all locations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">About Cloud GYM</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            We're revolutionizing fitness access by connecting you to premium gyms 
            anywhere, anytime with a single subscription.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To break down barriers in fitness by providing seamless access to quality 
              gym facilities wherever life takes you. We believe everyone deserves the 
              freedom to maintain their fitness routine without being tied to a single location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Solve</h3>
              <p className="text-gray-600 mb-6">
                Traditional gym memberships lock you into single locations, making it 
                difficult to maintain your fitness routine when traveling, moving, or 
                simply wanting variety in your workouts.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
              <p className="text-gray-600">
                Cloud GYM provides a network-based approach where one subscription 
                gives you access to hundreds of partner gyms, complete with smart 
                location discovery, easy booking, and seamless check-in experiences.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
              <img
                src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg"
                alt="Modern gym interior"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Growing Every Day
            </h2>
            <p className="text-xl text-gray-600">
              Join our expanding community of fitness enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Built by Fitness Enthusiasts
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Our team combines deep fitness industry knowledge with cutting-edge 
            technology to create the best possible experience for our members.
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-blue-100 mb-6">
              Whether you're a gym owner looking to expand your reach or a fitness 
              enthusiast seeking flexibility, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all">
                Partner With Us
              </button>
              <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition-all">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};