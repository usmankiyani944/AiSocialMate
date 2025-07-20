import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Settings } from "lucide-react";
import { useSearch } from "../../hooks/use-search";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  competitorName: z.string().min(1, "Competitor name is required"),
  keywords: z.string().optional(),
  excludeKeywords: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  timeRange: z.string().default("any"),
  sentiment: z.string().default("all"),
  minEngagement: z.string().default("0"),
  maxResults: z.number().default(10),
  searchDepth: z.string().default("standard"),
  language: z.string().default("en"),
});

const platformOptions = [
  { id: "Reddit", label: "Reddit", checked: true },
  { id: "Quora", label: "Quora", checked: true },
  { id: "Facebook", label: "Facebook", checked: false },
  { id: "Twitter/X", label: "Twitter/X", checked: false },
  { id: "LinkedIn", label: "LinkedIn", checked: false },
  { id: "YouTube", label: "YouTube", checked: false },
];

interface BrandOpportunityFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function BrandOpportunityForm({ onSubmit, isLoading }: BrandOpportunityFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      competitorName: "",
      keywords: "",
      excludeKeywords: "",
      platforms: ["Reddit", "Quora"],
      timeRange: "any",
      sentiment: "all",
      minEngagement: "0",
      maxResults: 10,
      searchDepth: "standard",
      language: "en",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Opportunity Search</CardTitle>
        <p className="text-sm text-gray-600">
          Find mentions of competitors without your brand to discover new opportunities
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Brand" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your brand name to exclude from search results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Competitor Brand" {...field} />
                      </FormControl>
                      <FormDescription>
                        Competitor name to search for mentions
                      </FormDescription>
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
                        <Input placeholder="marketing tools, automation, CRM" {...field} />
                      </FormControl>
                      <FormDescription>
                        Additional keywords to refine the search
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="platforms" className="space-y-4">
                <FormField
                  control={form.control}
                  name="platforms"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Select Platforms to Monitor</FormLabel>
                        <FormDescription>
                          Choose platforms where you want to discover opportunities
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {platformOptions.map((platform) => (
                          <FormField
                            key={platform.id}
                            control={form.control}
                            name="platforms"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={platform.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(platform.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, platform.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== platform.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {platform.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <FormField
                  control={form.control}
                  name="excludeKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclude Keywords</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="spam, promotional, advertisement"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Keywords to exclude from search results (comma-separated)
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="any">Any Time</SelectItem>
                            <SelectItem value="day">Past Day</SelectItem>
                            <SelectItem value="week">Past Week</SelectItem>
                            <SelectItem value="month">Past Month</SelectItem>
                            <SelectItem value="year">Past Year</SelectItem>
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
                        <FormLabel>Sentiment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Sentiments</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <FormField
                  control={form.control}
                  name="searchDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Depth</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="quick">Quick (basic results)</SelectItem>
                          <SelectItem value="standard">Standard (recommended)</SelectItem>
                          <SelectItem value="deep">Deep (comprehensive)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose search depth for result quality vs speed
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="en">All Languages</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxResults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Results</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="5" 
                            max="100" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Settings className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Opportunities
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}