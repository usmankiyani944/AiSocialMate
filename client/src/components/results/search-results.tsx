import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Heart, Eye, Share2, ArrowUp, MessageSquare, ThumbsUp, Repeat2 } from "lucide-react";

interface SearchResultsProps {
  results: any[];
  type: string;
  totalResults: number;
  query: string;
}

export default function SearchResults({ results, type, totalResults, query }: SearchResultsProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <p className="text-sm text-gray-600">
            Found {totalResults} results for "{query}"
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1 pr-4">
                    {result.title}
                  </h4>
                  <Badge variant="secondary">
                    {result.platform}
                  </Badge>
                </div>
                
                {result.snippet && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {result.snippet}
                  </p>
                )}
                
                {/* Enhanced Platform-specific stats - Issue #1 fix */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {/* Show actual statistics from platform data */}
                    {result.platform === 'Reddit' && (
                      <>
                        {(result.votes || result.upvotes) && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded">
                                <ArrowUp className="h-3 w-3 text-orange-600" />
                                <span className="font-medium text-orange-700">{result.votes || result.upvotes}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Reddit Votes</TooltipContent>
                          </Tooltip>
                        )}
                        {result.comments && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded">
                                <MessageSquare className="h-3 w-3 text-blue-600" />
                                <span className="font-medium text-blue-700">{result.comments}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Reddit Comments</TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                    {result.platform === 'Quora' && (
                      <>
                        {result.views && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded">
                                <Eye className="h-3 w-3 text-green-600" />
                                <span className="font-medium text-green-700">{result.views}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Quora Views</TooltipContent>
                          </Tooltip>
                        )}
                        {(result.votes || result.upvotes) && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded">
                                <ThumbsUp className="h-3 w-3 text-purple-600" />
                                <span className="font-medium text-purple-700">{result.votes || result.upvotes}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Quora Votes</TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                    {(result.platform === 'Twitter/X' || result.platform === 'Twitter') && (
                      <>
                        {result.likes && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded">
                                <Heart className="h-3 w-3 text-red-600" />
                                <span className="font-medium text-red-700">{result.likes}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Twitter Likes</TooltipContent>
                          </Tooltip>
                        )}
                        {result.retweets && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-cyan-100 px-2 py-1 rounded">
                                <Repeat2 className="h-3 w-3 text-cyan-600" />
                                <span className="font-medium text-cyan-700">{result.retweets}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Twitter Retweets</TooltipContent>
                          </Tooltip>
                        )}
                        {result.shares && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1 bg-teal-100 px-2 py-1 rounded">
                                <Share2 className="h-3 w-3 text-teal-600" />
                                <span className="font-medium text-teal-700">{result.shares}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Twitter Shares</TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                    {result.platform === 'Facebook' && (
                      <>
                        {result.likes && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{result.likes}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Facebook Likes</TooltipContent>
                          </Tooltip>
                        )}
                        {result.shares && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1">
                                <Share2 className="h-3 w-3" />
                                <span>{result.shares}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Facebook Shares</TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                    {result.platform === 'LinkedIn' && (
                      <>
                        {result.likes && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{result.likes}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>LinkedIn Likes</TooltipContent>
                          </Tooltip>
                        )}
                        {result.shares && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center space-x-1">
                                <Share2 className="h-3 w-3" />
                                <span>{result.shares}</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>LinkedIn Reshares</TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                    
                    {result.sentiment && (
                      <Badge variant="outline" className="text-xs">
                        {result.sentiment}
                      </Badge>
                    )}
                    {result.position && (
                      <span className="text-xs">Position #{result.position}</span>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1"
                    >
                      <span>View Thread</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
