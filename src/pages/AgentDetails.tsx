
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockAgents } from '@/data/mockAgents';
import { ArrowLeft, Play, Star, Users, Download, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AgentDetails = () => {
  const { id } = useParams();
  const agent = mockAgents.find(a => a.id === id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <span className="text-white text-2xl font-semibold">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {agent.category}
                  </Badge>
                </div>
                <CardTitle className="text-3xl">{agent.name}</CardTitle>
                <CardDescription className="text-lg">
                  {agent.description}
                </CardDescription>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-gray-600">rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold">{agent.users}</span>
                    <span className="text-gray-600">users</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {agent.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{agent.documentation}</p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Documentation
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  ${agent.price}
                  <span className="text-base font-normal text-gray-600">/month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Run Agent
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Deploy to AWS
                </Button>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Runtime:</span>
                    <span className="font-medium">{agent.runtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Author:</span>
                    <span className="font-medium">{agent.author}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security:</span>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
