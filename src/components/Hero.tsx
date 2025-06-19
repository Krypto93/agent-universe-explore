
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 opacity-10"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover & Deploy
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your business with intelligent AI agents. Browse our curated marketplace 
            of pre-built solutions or deploy custom agents tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3">
              Explore Agents
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Deployment</h3>
              <p className="text-gray-600">Deploy AI agents in seconds with one-click deployment</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Bank-grade security with AWS infrastructure</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Your agents work around the clock</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
