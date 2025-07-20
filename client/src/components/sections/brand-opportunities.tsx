import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandOpportunityForm from "@/components/forms/brand-opportunity-form";
import SearchResults from "@/components/results/search-results";
import { useSearch } from "../../hooks/use-search";

export default function BrandOpportunities() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const { searchBrandOpportunities, isLoading } = useSearch();

  const handleSearch = async (searchData: any) => {
    const results = await searchBrandOpportunities(searchData);
    if (results) {
      setSearchResults(results);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Opportunities</h1>
        <p className="text-gray-600">Find mentions of competitors without your brand to discover new opportunities.</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <BrandOpportunityForm 
            onSearch={handleSearch}
            isLoading={isLoading}
            activeTab="basic"
          />
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <BrandOpportunityForm 
            onSearch={handleSearch}
            isLoading={isLoading}
            activeTab="platforms"
          />
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <BrandOpportunityForm 
            onSearch={handleSearch}
            isLoading={isLoading}
            activeTab="filters"
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <BrandOpportunityForm 
            onSearch={handleSearch}
            isLoading={isLoading}
            activeTab="advanced"
          />
        </TabsContent>
      </Tabs>

      {searchResults && (
        <SearchResults 
          results={searchResults.results}
          type="brand-opportunities"
          totalResults={searchResults.totalResults}
          query={searchResults.query}
        />
      )}
    </div>
  );
}
