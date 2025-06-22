import { useEffect, useState } from 'react';
import AgentCard from './AgentCard';
import { Agent } from '@/types/agent';
import { fetchAgents, runAgent } from '@/utils/api';

const AgentGrid = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAgents();
        setAgents(res.data);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        alert('Error fetching agents');
      }
    };
    load();
  }, []);

  const handleRun = async (id: string) => {
    try {
      await runAgent(id);
      alert(`Agent "${id}" executed successfully.`);
    } catch (err) {
      console.error('Run failed:', err);
      alert('Failed to run agent.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} onRun={() => handleRun(agent.id)} />
      ))}
    </div>
  );
};

export default AgentGrid;
