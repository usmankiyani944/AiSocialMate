import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

const formSchema = z.object({
  searchType: z.string().default("brand-opportunities"),
  brandName: z.string().min(1, "Brand name is required"),
  competitorName: z.string().min(1, "Competitor name is required"),
  keywords: z.string().optional(),
  excludeKeywords: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  timeRange: z.string().default("last-30-days"),
  sentiment: z.string().default("all"),
  minEngagement: z.string().optional(),
  maxResults: z.string().default("10"),
  language: z.string().default("english"),
  includeNegative: z.boolean().default(false),
  serperApiKey: z.string().optional(),
});

interface BrandOpportunityFormProps {
  onSearch: (data: any) => void;
  isLoading: boolean;
  activeTab: string;
}

export default function BrandOpportunityForm({ onSearch, isLoading, activeTab }: BrandOpportunityFormProps) {
  const [formData, setFormData] = useState<any>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchType: "brand-opportunities",
      brandName: "",
      competitorName: "",
      keywords: "",
      excludeKeywords: "",
      platforms: ["Reddit", "Quora"],
      timeRange: "last-30-days",
      sentiment: "all",
      minEngagement: "",
      maxResults: "10",
      language: "english",
      includeNegative: false,
      serperApiKey: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const searchData = { ...formData, ...values };
    setFormData(searchData);
    onSearch(searchData);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const platforms = [
    { id: "Reddit", label: "Reddit" },
    { id: "Quora", label: "Quora" },
    { id: "Facebook", label: "Facebook" },
    { id: "Twitter", label: "Twitter/X" },
    { id: "LinkedIn", label: "LinkedIn" },
    { id: "YouTube", label: "YouTube" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {activeTab === "basic" && (
              <>
                <FormField
                  control={form.control}
                  name="searchType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="brand-opportunities">Brand Opportunities</SelectItem>
                          <SelectItem value="competitor-analysis">Competitor Analysis</SelectItem>
                          <SelectItem value="market-research">Market Research</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Find mentions of competitors without your brand
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Brand Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Main competitor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="software, tools, alternative" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords to include
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excludeKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclude Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="spam, affiliate, promotion" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords to exclude
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}

            {activeTab === "platforms" && (
              <div>
                <FormField
                  control={form.control}
                  name="platforms"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">Select Platforms to Monitor</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {platforms.map((platform) => (
                          <FormField
                            key={platform.id}
                            control={form.control}
                            name="platforms"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={platform.id}
                                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(platform.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        const newValue = checked
                                          ? [...currentValue, platform.id]
                                          : currentValue.filter((value) => value !== platform.id);
                                        field.onChange(newValue);
                                        handleFormChange('platforms', newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer">
                                    {platform.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {activeTab === "filters" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Search Filters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="timeRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
                            <SelectItem value="last-7-days">Last 7 days</SelectItem>
                            <SelectItem value="last-30-days">Last 30 days</SelectItem>
                            <SelectItem value="last-90-days">Last 90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sentiment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sentiment Filter</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All sentiments</SelectItem>
                            <SelectItem value="positive">Positive only</SelectItem>
                            <SelectItem value="neutral">Neutral only</SelectItem>
                            <SelectItem value="negative">Negative only</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="minEngagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Engagement</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormDescription>
                        Minimum likes, votes, or reactions
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Advanced Settings</h3>
                
                <FormField
                  control={form.control}
                  name="serperApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serper API Key (Optional)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your custom Serper.dev API key" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use default API key
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="maxResults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Results</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10 results</SelectItem>
                            <SelectItem value="25">25 results</SelectItem>
                            <SelectItem value="50">50 results</SelectItem>
                            <SelectItem value="100">100 results</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="all">All languages</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="includeNegative"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Include negative sentiment posts
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>{isLoading ? 'Searching...' : 'Find Opportunities'}</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
