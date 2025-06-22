import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/agent';
import { Link } from 'react-router-dom';
import { Play, Star, Users } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onRun?: () => void; // 👈 optional handler for Run button
}

const AgentCard = ({ agent, onRun }: AgentCardProps) => {
  return (
    <Card className="agent-card-hover h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <span className="text-white text-lg font-semibold">
              {agent.name.charAt(0)}
            </span>
          </div>
          <Badge variant="secondary">{agent.category}</Badge>
        </div>
        <CardTitle className="text-lg">{agent.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {agent.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{agent.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{agent.users} users</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Price: </span>
            <span className="text-green-600 font-semibold">${agent.price}/month</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Runtime: </span>
            <span>{agent.runtime}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/agent/${agent.id}`}>
            View Details
          </Link>
        </Button>
        <Button onClick={onRun} className="flex-1">
          <Play className="h-4 w-4 mr-2" />
          Run Agent
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
