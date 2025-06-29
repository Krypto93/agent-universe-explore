import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import backgroundImage from '@/assets/background.png';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden min-h-screen flex items-center">
      {/* Dark overlay with cool tone */}
      <div className="absolute inset-0 bg-gray-900/80 z-0 mix-blend-multiply"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Technology background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Subtle blue-purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-indigo-900/25 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
            Discover & Deploy
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
              AI Agents
            </span>
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your business with intelligent AI agents. Browse our curated marketplace 
            of pre-built solutions or deploy custom agents tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-gray-50 font-medium shadow-lg"
            >
              Explore Agents
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 text-gray-900 border-blue-300/50 hover:bg-blue-900/30 font-medium"
            >
              Learn More
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-400/30 transition-all">
              <div className="bg-blue-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-blue-100">Instant Deployment</h3>
              <p className="text-gray-300">Deploy AI agents in seconds with one-click deployment</p>
            </div>
            <div className="text-center bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-purple-400/30 transition-all">
              <div className="bg-purple-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-purple-100">Enterprise Security</h3>
              <p className="text-gray-300">Bank-grade security with AWS infrastructure</p>
            </div>
            <div className="text-center bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-green-400/30 transition-all">
              <div className="bg-green-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-green-100">24/7 Availability</h3>
              <p className="text-gray-300">Your agents work around the clock</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;