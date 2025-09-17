import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout } from '@/components/Layout';
import { scoutService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Send, 
  Search, 
  Filter, 
  Save, 
  MessageCircle, 
  User, 
  Star, 
  TrendingUp, 
  Target,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  role: string;
  strengths: string[];
  lastThirtyDayForm: string;
  summary: string;
  game: string;
  region: string;
  experience: 'Amateur' | 'Semi-Pro' | 'Pro';
  availability: boolean;
  clutchPercentage?: number;
  entryStyle?: string;
  utilityUsage?: string;
}

export default function ScoutSearch() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    region: 'all',
    experience: 'all',
    availability: 'all' as string,
  });

  const suggestions = [
    "Find players with high clutch percentage",
    "Top riflers with aggressive entry style", 
    "I need a support player good at utility usage"
  ];

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await scoutService.searchPlayers(searchTerm, {
        region: filters.region === 'all' ? undefined : filters.region,
        experience: filters.experience === 'all' ? undefined : filters.experience,
        availability: filters.availability === 'all' ? undefined : filters.availability === 'true',
      });
      if (result.success && result.players) {
        setPlayers(result.players);
        if (result.players.length === 0) {
          toast({
            title: "No results found",
            description: "Try adjusting your search terms or filters",
          });
        }
      } else {
        toast({
          title: "Search failed",
          description: result.error || "Unable to search at this time",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlayer = async (playerId: string) => {
    try {
      await scoutService.savePlayer(playerId);
      toast({
        title: "Player saved",
        description: "Added to your saved players list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save player",
        variant: "destructive",
      });
    }
  };

  const handleContactRequest = async () => {
    if (!selectedPlayer || !contactMessage.trim()) return;

    try {
      await scoutService.requestContact(selectedPlayer.id, contactMessage);
      toast({
        title: "Contact request sent",
        description: `Your message has been sent to ${selectedPlayer.name}`,
      });
      setContactMessage('');
      setSelectedPlayer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact request",
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      region: 'all',
      experience: 'all',
      availability: 'all',
    });
  };

  const getFormBadgeVariant = (form: string) => {
    switch (form.toLowerCase()) {
      case 'excellent':
      case 'outstanding':
        return 'default';
      case 'good':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Region</label>
                    <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any region</SelectItem>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="Asia">Asia</SelectItem>
                        <SelectItem value="South America">South America</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience</label>
                    <Select value={filters.experience} onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any level</SelectItem>
                        <SelectItem value="Amateur">Amateur</SelectItem>
                        <SelectItem value="Semi-Pro">Semi-Pro</SelectItem>
                        <SelectItem value="Pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Availability</label>
                    <Select 
                      value={filters.availability} 
                      onValueChange={(value) => setFilters(prev => ({ 
                        ...prev, 
                        availability: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any status</SelectItem>
                        <SelectItem value="true">Open to offers</SelectItem>
                        <SelectItem value="false">Not available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">CS:GO Player Search</h1>
                  <p className="text-muted-foreground">
                    Search for CS:GO players by attributes, stats, or playstyle
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Input
                    placeholder="Describe the CS:GO player you're looking for..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSearch()}
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Suggestions */}
                {!hasSearched && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Try these searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                          className="text-left h-auto py-2 px-3"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-16 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Results */}
                {!isLoading && hasSearched && (
                  <div className="space-y-4">
                    {players.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Found {players.length} player{players.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {players.map((player) => (
                          <Card key={player.id} className="hover:shadow-card transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    {player.name}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-4 mt-1">
                                    <span>{player.role}</span>
                            <Badge variant="outline">{player.game || 'CS:GO'}</Badge>
                            <Badge variant="outline">{player.region}</Badge>
                                    <Badge variant={getFormBadgeVariant(player.lastThirtyDayForm)}>
                                      {player.lastThirtyDayForm} form
                                    </Badge>
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  {player.availability && (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      Available
                                    </Badge>
                                  )}
                                  <Badge variant="secondary">{player.experience}</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">{player.summary}</p>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-electric" />
                                    <span className="text-sm font-medium">Key Strengths:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {player.strengths.map((strength, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {strength}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Stats */}
                                {(player.clutchPercentage || player.entryStyle || player.utilityUsage) && (
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    {player.clutchPercentage && (
                                      <div className="text-center">
                                        <div className="font-semibold text-electric">{player.clutchPercentage}%</div>
                                        <div className="text-muted-foreground">Clutch Rate</div>
                                      </div>
                                    )}
                                    {player.entryStyle && (
                                      <div className="text-center">
                                        <div className="font-semibold">{player.entryStyle}</div>
                                        <div className="text-muted-foreground">Entry Style</div>
                                      </div>
                                    )}
                                    {player.utilityUsage && (
                                      <div className="text-center">
                                        <div className="font-semibold">{player.utilityUsage}</div>
                                        <div className="text-muted-foreground">Utility Usage</div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <Drawer>
                                    <DrawerTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <User className="h-4 w-4 mr-2" />
                                        View Profile
                                      </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                      <DrawerHeader>
                                        <DrawerTitle>{player.name} - Detailed Profile</DrawerTitle>
                        <DrawerDescription>
                          {player.role} • {player.game || 'CS:GO'} • {player.region}
                        </DrawerDescription>
                                      </DrawerHeader>
                                      <div className="p-6 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                          <div>
                                            <h4 className="font-semibold mb-2">Overview</h4>
                                            <p className="text-sm text-muted-foreground">{player.summary}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold mb-2">Experience Level</h4>
                                            <Badge variant="outline">{player.experience}</Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">Key Strengths</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {player.strengths.map((strength, index) => (
                                              <Badge key={index} variant="secondary">
                                                {strength}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </DrawerContent>
                                  </Drawer>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleSavePlayer(player.id)}
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                  </Button>
                                  
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => setSelectedPlayer(player)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Contact
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Contact {player.name}</DialogTitle>
                                        <DialogDescription>
                                          Send a message to request an introduction or more information.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Your message</label>
                                          <textarea
                                            className="w-full p-3 border rounded-xl resize-none"
                                            rows={4}
                                            placeholder="Hi! I'm interested in learning more about your background and potential opportunities..."
                                            value={contactMessage}
                                            onChange={(e) => setContactMessage(e.target.value)}
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            onClick={handleContactRequest}
                                            disabled={!contactMessage.trim()}
                                            className="flex-1"
                                          >
                                            Send Message
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-8">
                          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No CS:GO players found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters to find more results.
                      </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {!hasSearched && !isLoading && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Search CS:GO players by attributes, stats, or style</h3>
                      <p className="text-muted-foreground">
                        Use the search box above or try one of the suggested searches to get started.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}