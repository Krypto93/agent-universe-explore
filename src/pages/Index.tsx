
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AgentGrid from '@/components/AgentGrid';
import SearchAndFilter from '@/components/SearchAndFilter';
import { mockAgents } from '@/data/mockAgents';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <AgentGrid agents={filteredAgents} />
      </div>
    </div>
  );
};

export default Index;
