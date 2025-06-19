
import AgentCard from './AgentCard';
import { Agent } from '@/types/agent';

interface AgentGridProps {
  agents: Agent[];
}

const AgentGrid = ({ agents }: AgentGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AgentGrid;
