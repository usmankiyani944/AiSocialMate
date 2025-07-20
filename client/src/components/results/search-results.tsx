import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";

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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {result.engagement && (
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{result.engagement}</span>
                      </span>
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
